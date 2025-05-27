// src/movimentacao-estoque/movimentacao-estoque.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentacaoEstoqueService } from './movimentacao-estoque.service';
import { MovimentacaoEstoqueController } from './movimentacao-estoque.controller';
import { MovimentacaoEstoque } from './entities/movimentacao-estoque.entity';
import { Insumo } from '../insumo/entities/insumo.entity'; // Importa Insumo para validação

@Module({
  imports: [TypeOrmModule.forFeature([MovimentacaoEstoque, Insumo])],
  controllers: [MovimentacaoEstoqueController],
  providers: [MovimentacaoEstoqueService],
  exports: [MovimentacaoEstoqueService], // Exporta para ser usado por outros módulos
})
export class MovimentacaoEstoqueModule {}