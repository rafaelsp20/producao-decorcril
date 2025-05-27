/* eslint-disable prettier/prettier */
// src/ordem-producao/entities/ordem-producao.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';
import { OrdemProducaoStatus } from '../../common/enums/ordem-producao-status.enum';

@Entity('ordens_producao')
export class OrdemProducao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantidade: number;

  @Column({ type: 'text', default: OrdemProducaoStatus.PENDENTE })
  status: OrdemProducaoStatus;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;

  @ManyToOne(() => Produto, produto => produto.ordensProducao)
  produto: Produto;

  @Column()
  produtoId: number;

  @Column({ nullable: true })
  nomeCliente: string;

  @Column({ nullable: true })
  pedidoVenda: string;
}