// src/movimentacao-estoque/entities/movimentacao-estoque.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Insumo } from '../../insumo/entities/insumo.entity';
import { MovimentacaoTipo } from '../../common/enums/movimentacao-tipo.enum';
import { MovimentacaoOrigem } from '../../common/enums/movimentacao-origem.enum';

@Entity('movimentacoes_estoque')
export class MovimentacaoEstoque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('real')
  quantidade: number;

  @Column({ type: 'text' })
  tipo: MovimentacaoTipo; // 'Entrada' ou 'Saída'

  @Column({ type: 'text' })
  origem: MovimentacaoOrigem; // 'Produção', 'Recebimento', 'Ajuste'

  @CreateDateColumn()
  dataHora: Date;

  @ManyToOne(() => Insumo, insumo => insumo.movimentacoesEstoque)
  insumo: Insumo;

  @Column()
  insumoId: number;
}