/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from './produto/produto.module';
import { InsumoModule } from './insumo/insumo.module';
import { OrdemProducaoModule } from './ordem-producao/ordem-producao.module';
import { MovimentacaoEstoqueModule } from './movimentacao-estoque/movimentacao-estoque.module';
import { Produto } from './produto/entities/produto.entity';
import { Insumo } from './insumo/entities/insumo.entity';
import { OrdemProducao } from './ordem-producao/entities/ordem-producao.entity';
import { MovimentacaoEstoque } from './movimentacao-estoque/entities/movimentacao-estoque.entity';
import { InsumoNecessario } from './produto/entities/insumo-necessario.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // Usando SQLite para simplicidade. Você pode mudar para 'postgres', 'mysql', etc.
      database: 'db.sqlite', // Nome do arquivo do banco de dados SQLite
      entities: [Produto, Insumo, OrdemProducao, MovimentacaoEstoque, InsumoNecessario], // Entidades a serem carregadas
      synchronize: true, // ATENÇÃO: Use 'true' apenas em desenvolvimento. Em produção, use migrações.
    }),
    ProdutoModule,
    InsumoModule,
    OrdemProducaoModule,
    MovimentacaoEstoqueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
