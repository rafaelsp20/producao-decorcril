// src/produto/produto.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { Produto } from './entities/produto.entity';
import { InsumoNecessario } from './entities/insumo-necessario.entity';
import { Insumo } from '../insumo/entities/insumo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, InsumoNecessario, Insumo])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [ProdutoService], // Exporta o serviço para ser usado em outros módulos
})
export class ProdutoModule {}