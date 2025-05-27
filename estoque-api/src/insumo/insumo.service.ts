/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
// src/insumo/insumo.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insumo } from './entities/insumo.entity';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { MovimentacaoEstoqueService } from '../movimentacao-estoque/movimentacao-estoque.service';
import { MovimentacaoTipo } from '../common/enums/movimentacao-tipo.enum';
import { MovimentacaoOrigem } from '../common/enums/movimentacao-origem.enum';
import * as fs from 'fs';
import * as xml2js from 'xml2js';

@Injectable()
export class InsumoService {
  constructor(
    @InjectRepository(Insumo)
    private insumoRepository: Repository<Insumo>,
    private movimentacaoEstoqueService: MovimentacaoEstoqueService,
  ) {}

  async create(createInsumoDto: CreateInsumoDto): Promise<Insumo> {
    const existingInsumo = await this.insumoRepository.findOne({ where: { nome: createInsumoDto.nome } });
    if (existingInsumo) {
      throw new ConflictException(`Insumo com o nome '${createInsumoDto.nome}' já existe.`);
    }

    const insumo = this.insumoRepository.create(createInsumoDto);
    const savedInsumo = await this.insumoRepository.save(insumo);

    // Registra a entrada inicial no estoque
    if (createInsumoDto.quantidadeEstoque > 0) {
      await this.movimentacaoEstoqueService.create({
        insumoId: savedInsumo.id,
        quantidade: createInsumoDto.quantidadeEstoque,
        tipo: MovimentacaoTipo.ENTRADA,
        origem: MovimentacaoOrigem.RECEBIMENTO,
      });
    }
    return savedInsumo;
  }

  findAll(): Promise<Insumo[]> {
    return this.insumoRepository.find();
  }

  async findOne(id: number): Promise<Insumo> {
    const insumo = await this.insumoRepository.findOne({ where: { id } });
    if (!insumo) {
      throw new NotFoundException(`Insumo com ID ${id} não encontrado.`);
    }
    return insumo;
  }

  async update(id: number, updateInsumoDto: UpdateInsumoDto): Promise<Insumo> {
    const insumo = await this.findOne(id);

    // Se a quantidadeEstoque for atualizada, registramos uma movimentação
    if (updateInsumoDto.quantidadeEstoque !== undefined && updateInsumoDto.quantidadeEstoque !== insumo.quantidadeEstoque) {
      const diferenca = updateInsumoDto.quantidadeEstoque - insumo.quantidadeEstoque;
      if (diferenca > 0) {
        // Entrada
        await this.movimentacaoEstoqueService.create({
          insumoId: insumo.id,
          quantidade: diferenca,
          tipo: MovimentacaoTipo.ENTRADA,
          origem: MovimentacaoOrigem.AJUSTE,
        });
      } else if (diferenca < 0) {
        // Saída
        await this.movimentacaoEstoqueService.create({
          insumoId: insumo.id,
          quantidade: Math.abs(diferenca),
          tipo: MovimentacaoTipo.SAIDA,
          origem: MovimentacaoOrigem.AJUSTE,
        });
      }
    }

    Object.assign(insumo, updateInsumoDto);
    return this.insumoRepository.save(insumo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.insumoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Insumo com ID ${id} não encontrado.`);
    }
  }

  /**
   * Atualiza a quantidade em estoque de um insumo.
   * Usado internamente por outros serviços (ex: OrdemProducaoService).
   */
  async updateStock(insumoId: number, quantidade: number): Promise<Insumo> {
    const insumo = await this.findOne(insumoId);
    insumo.quantidadeEstoque += quantidade;
    return this.insumoRepository.save(insumo);
  }

  async importarXml(xmlPath: string) {
    const xml = fs.readFileSync(xmlPath, 'utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    // Veja a estrutura do XML parseado no terminal
    console.log('XML PARSEADO:', JSON.stringify(result, null, 2));

    // Exemplo de caminho para produtos (ajuste conforme seu XML)
    const produtos = result?.nfeProc?.NFe?.[0]?.infNFe?.[0]?.det;
    if (!produtos) {
      throw new Error('Produtos não encontrados no XML.');
    }

    for (const prod of produtos) {
      const nome = prod.prod[0].xProd[0];
      const unidade = prod.prod[0].uCom[0];
      const quantidade = Number(prod.prod[0].qCom[0]);
      const valor = Number(prod.prod[0].vUnCom[0]);
      // ...outros campos

      // Salva no estoque
      await this.insumoRepository.save({
        nome,
        unidadeMedida: unidade,
        quantidadeEstoque: quantidade,
        valor,
        // ...outros campos
      });
    }
    return { message: 'Insumos importados com sucesso!' };
  }

}