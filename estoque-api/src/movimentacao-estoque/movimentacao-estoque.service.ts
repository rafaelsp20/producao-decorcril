// src/movimentacao-estoque/movimentacao-estoque.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimentacaoEstoque } from './entities/movimentacao-estoque.entity';
import { MovimentacaoTipo } from '../common/enums/movimentacao-tipo.enum';
import { MovimentacaoOrigem } from '../common/enums/movimentacao-origem.enum';
import { Insumo } from '../insumo/entities/insumo.entity';

@Injectable()
export class MovimentacaoEstoqueService {
  constructor(
    @InjectRepository(MovimentacaoEstoque)
    private movimentacaoEstoqueRepository: Repository<MovimentacaoEstoque>,
    @InjectRepository(Insumo)
    private insumoRepository: Repository<Insumo>,
  ) {}

  async create(data: { insumoId: number; quantidade: number; tipo: MovimentacaoTipo; origem: MovimentacaoOrigem }): Promise<MovimentacaoEstoque> {
    const { insumoId, quantidade, tipo, origem } = data;

    const insumo = await this.insumoRepository.findOne({ where: { id: insumoId } });
    if (!insumo) {
      throw new NotFoundException(`Insumo com ID ${insumoId} não encontrado para registrar movimentação.`);
    }

    if (quantidade <= 0) {
      throw new BadRequestException('A quantidade da movimentação deve ser maior que zero.');
    }

    const movimentacao = this.movimentacaoEstoqueRepository.create({
      insumoId,
      quantidade,
      tipo,
      origem,
    });

    return this.movimentacaoEstoqueRepository.save(movimentacao);
  }

  findAll(): Promise<MovimentacaoEstoque[]> {
    return this.movimentacaoEstoqueRepository.find({ relations: ['insumo'] });
  }

  async findByInsumo(insumoId: number): Promise<MovimentacaoEstoque[]> {
    const insumo = await this.insumoRepository.findOne({ where: { id: insumoId } });
    if (!insumo) {
      throw new NotFoundException(`Insumo com ID ${insumoId} não encontrado.`);
    }
    return this.movimentacaoEstoqueRepository.find({ where: { insumoId }, relations: ['insumo'] });
  }
}