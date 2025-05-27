// src/insumo/insumo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsumoService } from './insumo.service';
import { InsumoController } from './insumo.controller';
import { Insumo } from './entities/insumo.entity';
import { MovimentacaoEstoqueModule } from '../movimentacao-estoque/movimentacao-estoque.module';

@Module({
  imports: [TypeOrmModule.forFeature([Insumo]), MovimentacaoEstoqueModule],
  controllers: [InsumoController],
  providers: [InsumoService],
  exports: [InsumoService], // Exporta o serviço para ser usado em outros módulos
})
export class InsumoModule {}