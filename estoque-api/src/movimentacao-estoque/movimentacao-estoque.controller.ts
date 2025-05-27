// src/movimentacao-estoque/movimentacao-estoque.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MovimentacaoEstoqueService } from './movimentacao-estoque.service';
import { MovimentacaoEstoque } from './entities/movimentacao-estoque.entity';
import { MovimentacaoTipo } from '../common/enums/movimentacao-tipo.enum';
import { MovimentacaoOrigem } from '../common/enums/movimentacao-origem.enum';

// Nota: Não há um DTO específico para criar movimentação aqui,
// pois a criação é geralmente interna, acionada por outros serviços.
// Este controller é mais para consulta.

@Controller('movimentacoes-estoque')
export class MovimentacaoEstoqueController {
  constructor(private readonly movimentacaoEstoqueService: MovimentacaoEstoqueService) {}

  @Get()
  async findAll(): Promise<MovimentacaoEstoque[]> {
    return this.movimentacaoEstoqueService.findAll();
  }

  @Get('insumo/:insumoId')
  async findByInsumo(@Param('insumoId') insumoId: string): Promise<MovimentacaoEstoque[]> {
    return this.movimentacaoEstoqueService.findByInsumo(+insumoId);
  }
}