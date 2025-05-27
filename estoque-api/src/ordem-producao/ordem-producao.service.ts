// src/ordem-producao/ordem-producao.service.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // Importa DataSource para transações
import { OrdemProducao } from './entities/ordem-producao.entity';
import { CreateOrdemProducaoDto } from './dto/create-ordem-producao.dto';
import { OrdemProducaoStatus } from '../common/enums/ordem-producao-status.enum';
import { ProdutoService } from '../produto/produto.service';
import { InsumoService } from '../insumo/insumo.service';
import { MovimentacaoEstoqueService } from '../movimentacao-estoque/movimentacao-estoque.service';
import { MovimentacaoTipo } from '../common/enums/movimentacao-tipo.enum';
import { MovimentacaoOrigem } from '../common/enums/movimentacao-origem.enum';
import { Insumo } from '../insumo/entities/insumo.entity';
import { MovimentacaoEstoque } from '../movimentacao-estoque/entities/movimentacao-estoque.entity';

@Injectable()
export class OrdemProducaoService {
  constructor(
    @InjectRepository(OrdemProducao)
    private ordemProducaoRepository: Repository<OrdemProducao>,
    private produtoService: ProdutoService,
    private insumoService: InsumoService,
    private movimentacaoEstoqueService: MovimentacaoEstoqueService,
    private dataSource: DataSource, // Injeta DataSource para gerenciar transações
  ) {}

  async create(createOrdemProducaoDto: CreateOrdemProducaoDto): Promise<OrdemProducao> {
    const { produtoId, quantidade } = createOrdemProducaoDto;

    // Verifica se o produto existe
    const produto = await this.produtoService.findOne(produtoId);
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${produtoId} não encontrado.`);
    }

    const ordemProducao = this.ordemProducaoRepository.create({
      produtoId,
      quantidade,
      status: OrdemProducaoStatus.PENDENTE,
    });

    return this.ordemProducaoRepository.save(ordemProducao);
  }

  findAll(): Promise<OrdemProducao[]> {
    return this.ordemProducaoRepository.find({
      relations: ['produto'],
    });
  }

  async findOne(id: number): Promise<OrdemProducao> {
    const ordem = await this.ordemProducaoRepository.findOne({
      where: { id },
      relations: ['produto', 'produto.insumosNecessarios', 'produto.insumosNecessarios.insumo'],
    });
    if (!ordem) {
      throw new NotFoundException(`Ordem de Produção com ID ${id} não encontrada.`);
    }
    return ordem;
  }

  /**
   * Inicia a produção de uma ordem, verificando e retirando os insumos do estoque.
   * Esta operação é transacional para garantir a consistência dos dados.
   */
  async iniciarProducao(id: number): Promise<OrdemProducao> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ordem = await queryRunner.manager.findOne(OrdemProducao, {
        where: { id },
        relations: ['produto', 'produto.insumosNecessarios', 'produto.insumosNecessarios.insumo'],
      });

      if (!ordem) {
        throw new NotFoundException(`Ordem de Produção com ID ${id} não encontrada.`);
      }
      if (ordem.status !== OrdemProducaoStatus.PENDENTE) {
        throw new BadRequestException(`Ordem de Produção ${id} não está no status 'Pendente'. Status atual: ${ordem.status}.`);
      }

      if (!ordem.produto || !ordem.produto.insumosNecessarios || ordem.produto.insumosNecessarios.length === 0) {
        throw new BadRequestException(`O produto '${ordem.produto.nome}' não tem insumos necessários definidos.`);
      }

      // 1. Verificar estoque de todos os insumos necessários
      for (const insumoNecessario of ordem.produto.insumosNecessarios) {
        const insumo = insumoNecessario.insumo;
        const quantidadeTotalNecessaria = insumoNecessario.quantidadeNecessaria * ordem.quantidade;

        if (insumo.quantidadeEstoque < quantidadeTotalNecessaria) {
          throw new BadRequestException(`Estoque insuficiente para o insumo '${insumo.nome}'. Necessário: ${quantidadeTotalNecessaria} ${insumo.unidadeMedida}, Disponível: ${insumo.quantidadeEstoque} ${insumo.unidadeMedida}.`);
        }
      }

      // 2. Retirar insumos do estoque e registrar movimentações
      for (const insumoNecessario of ordem.produto.insumosNecessarios) {
        const insumo = insumoNecessario.insumo;
        const quantidadeTotalNecessaria = insumoNecessario.quantidadeNecessaria * ordem.quantidade;

        // Atualiza o estoque do insumo
        insumo.quantidadeEstoque -= quantidadeTotalNecessaria;
        await queryRunner.manager.save(Insumo, insumo);

        // Registra a movimentação de saída
        const movimentacao = await this.movimentacaoEstoqueService.create({
          insumoId: insumo.id,
          quantidade: quantidadeTotalNecessaria,
          tipo: MovimentacaoTipo.SAIDA,
          origem: MovimentacaoOrigem.PRODUCAO,
        });
        await queryRunner.manager.save(MovimentacaoEstoque, movimentacao);
      }

      // 3. Atualizar status da Ordem de Produção
      ordem.status = OrdemProducaoStatus.EM_PRODUCAO;
      await queryRunner.manager.save(OrdemProducao, ordem);

      await queryRunner.commitTransaction();
      return ordem;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err; // Re-lança o erro para ser tratado pelo NestJS
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Finaliza uma ordem de produção.
   */
  async finalizarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.ordemProducaoRepository.findOne({ where: { id } });

    if (!ordem) {
      throw new NotFoundException(`Ordem de Produção com ID ${id} não encontrada.`);
    }
    if (ordem.status !== OrdemProducaoStatus.EM_PRODUCAO) {
      throw new BadRequestException(`Ordem de Produção ${id} não está no status 'Em Produção'. Status atual: ${ordem.status}.`);
    }

    ordem.status = OrdemProducaoStatus.CONCLUIDA;
    return this.ordemProducaoRepository.save(ordem);
  }

  /**
   * Cancela uma ordem de produção.
   * Se a ordem já tiver retirado insumos, estes NÃO são automaticamente devolvidos ao estoque.
   * Isso exigiria uma lógica de "devolução de insumos" separada ou um ajuste manual.
   */
  async cancelarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.ordemProducaoRepository.findOne({ where: { id } });

    if (!ordem) {
      throw new NotFoundException(`Ordem de Produção com ID ${id} não encontrada.`);
    }
    if (ordem.status === OrdemProducaoStatus.CONCLUIDA || ordem.status === OrdemProducaoStatus.CANCELADA) {
      throw new BadRequestException(`Não é possível cancelar uma ordem com status '${ordem.status}'.`);
    }

    ordem.status = OrdemProducaoStatus.CANCELADA;
    return this.ordemProducaoRepository.save(ordem);
  }
}