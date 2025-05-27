/* eslint-disable prettier/prettier */
// src/insumo/entities/insumo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MovimentacaoEstoque } from '../../movimentacao-estoque/entities/movimentacao-estoque.entity';
import { InsumoNecessario } from '../../produto/entities/insumo-necessario.entity';

@Entity('insumos')
export class Insumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nome: string;

  @Column('real', { default: 0 })
  quantidadeEstoque: number;

  @Column()
  unidadeMedida: string; // Ex: 'kg', 'metros', 'unidades'

  @Column('real', { default: 0 })
  valor: number;

  @Column({ type: 'date', nullable: true })
  dataNota: Date;

  @Column({ nullable: true })
  fornecedor: string;

  @Column({ nullable: true })
  formaPagamento: string; // Ex: 'À vista', 'A prazo'

  @Column({ nullable: true })
  categoria: string;

  // Relação com MovimentacaoEstoque
  @OneToMany(() => MovimentacaoEstoque, movimentacao => movimentacao.insumo)
  movimentacoesEstoque: MovimentacaoEstoque[];

  // Relação com InsumoNecessario (para saber em quais produtos este insumo é usado)
  @OneToMany(() => InsumoNecessario, insumoNecessario => insumoNecessario.insumo)
  insumosNecessarios: InsumoNecessario[];
}