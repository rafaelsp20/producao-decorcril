// src/ordem-producao/ordem-producao.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdemProducaoService } from './ordem-producao.service';
import { OrdemProducaoController } from './ordem-producao.controller';
import { OrdemProducao } from './entities/ordem-producao.entity';
import { ProdutoModule } from '../produto/produto.module'; // Importa ProdutoModule para usar ProdutoService
import { InsumoModule } from '../insumo/insumo.module'; // Importa InsumoModule para usar InsumoService
import { MovimentacaoEstoqueModule } from '../movimentacao-estoque/movimentacao-estoque.module'; // Importa MovimentacaoEstoqueModule

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdemProducao]),
    ProdutoModule,
    InsumoModule,
    MovimentacaoEstoqueModule,
  ],
  controllers: [OrdemProducaoController],
  providers: [OrdemProducaoService],
})
export class OrdemProducaoModule {}