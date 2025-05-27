/* eslint-disable prettier/prettier */
// src/produto/entities/produto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InsumoNecessario } from './insumo-necessario.entity';
import { OrdemProducao } from '../../ordem-producao/entities/ordem-producao.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column('real', { default: 0 })
  valorUnitario: number; // <-- Adicione este campo

  @Column({ nullable: true })
  codigo: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  fotoUrl: string; // Para armazenar o caminho/URL da foto

  // Relação com InsumoNecessario para definir os insumos que compõem o produto
  @OneToMany(() => InsumoNecessario, insumoNecessario => insumoNecessario.produto, { cascade: true })
  insumosNecessarios: InsumoNecessario[];

  // Relação com OrdemProducao
  @OneToMany(() => OrdemProducao, ordemProducao => ordemProducao.produto)
  ordensProducao: OrdemProducao[];
}