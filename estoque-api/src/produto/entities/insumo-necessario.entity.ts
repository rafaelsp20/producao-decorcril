/* eslint-disable prettier/prettier */
// src/produto/entities/insumo-necessario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm'; // Importe Unique
import { Produto } from './produto.entity';
import { Insumo } from '../../insumo/entities/insumo.entity';

@Entity('insumos_necessarios')
@Unique(['produtoId', 'insumoId']) // Adicione esta linha para a restrição de unicidade
export class InsumoNecessario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('real') // Consistência com outros campos de quantidade
  quantidadeNecessaria: number;

  @ManyToOne(() => Produto, produto => produto.insumosNecessarios, { onDelete: 'CASCADE' })
  produto: Produto;

  @Column()
  produtoId: number;

  @ManyToOne(() => Insumo, insumo => insumo.insumosNecessarios)
  insumo: Insumo;

  @Column()
  insumoId: number;
}