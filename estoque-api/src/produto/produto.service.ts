/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/produto/produto.service.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { InsumoNecessario } from './entities/insumo-necessario.entity';
import { Insumo } from '../insumo/entities/insumo.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    @InjectRepository(InsumoNecessario)
    private insumoNecessarioRepository: Repository<InsumoNecessario>,
    @InjectRepository(Insumo)
    private insumoRepository: Repository<Insumo>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    // Verifica se já existe produto com o mesmo nome
    const existingProduto = await this.produtoRepository.findOne({ where: { nome: createProdutoDto.nome } });
    if (existingProduto) {
      throw new ConflictException(`Já existe um produto com o nome '${createProdutoDto.nome}'.`);
    }
    const valorUnitario = Number(createProdutoDto.valor);
    const produto = this.produtoRepository.create({ ...createProdutoDto, valorUnitario });
    return this.produtoRepository.save(produto);
  }

  findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({ relations: ['insumosNecessarios', 'insumosNecessarios.insumo'] });
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['insumosNecessarios', 'insumosNecessarios.insumo'],
    });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return produto;
  }

  async addInsumoToProduto(produtoId: number, dto: { insumoId: number, quantidadeNecessaria: number }) {
    const produto = await this.produtoRepository.findOne({ where: { id: produtoId } });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    const insumo = await this.insumoRepository.findOne({ where: { id: dto.insumoId } });
    if (!insumo) {
      throw new NotFoundException('Insumo não encontrado');
    }

    const exists = await this.insumoNecessarioRepository.findOne({
      where: { produtoId, insumoId: dto.insumoId },
    });
    if (exists) {
      throw new ConflictException('Já existe esse insumo para este produto.');
    }

    const insumoNecessario = this.insumoNecessarioRepository.create({
      produtoId,
      insumoId: dto.insumoId,
      quantidadeNecessaria: dto.quantidadeNecessaria,
    });
    await this.insumoNecessarioRepository.save(insumoNecessario);
    return this.findOne(produtoId);
  }

  async remove(id: number) {
    return await this.produtoRepository.delete(id);
  }

  async update(id: number, updateProdutoDto: any): Promise<Produto> {
    await this.produtoRepository.update(id, updateProdutoDto);
    return this.findOne(id);
  }
  // Você pode adicionar métodos para atualizar e remover produtos se necessário
  // update(id: number, updateProdutoDto: UpdateProdutoDto) { ... }
  // remove(id: number) { ... }
}