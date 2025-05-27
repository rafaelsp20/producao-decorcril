import { useEffect, useState } from 'react';
import { api } from '../services/api';

type OrdemProducao = {
  id: number;
  produto: { nome: string; valorUnitario: number };
  quantidade: number;
  status: string;
  createdAt?: string;
};

export function RelatorioProducao() {
  const [ordens, setOrdens] = useState<OrdemProducao[]>([]);

  useEffect(() => {
    api.get('/ordens-producao').then(res => setOrdens(res.data));
  }, []);

  const ordensFinalizadas = ordens.filter(o => o.status.toLowerCase() === 'concluída');

  return (
    <div>
      <h1>Relatório de Produtos Fabricados</h1>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Valor Total</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {ordensFinalizadas.map(ordem => (
            <tr key={ordem.id}>
              <td>{ordem.produto?.nome}</td>
              <td>{ordem.quantidade}</td>
              <td>R$ {ordem.produto?.valorUnitario?.toFixed(2)}</td>
              <td>R$ {(ordem.quantidade * (ordem.produto?.valorUnitario || 0)).toFixed(2)}</td>
              <td>{ordem.createdAt ? new Date(ordem.createdAt).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>
        Valor Total Geral: R$ {ordensFinalizadas.reduce((acc, ordem) => acc + ordem.quantidade * (ordem.produto?.valorUnitario || 0), 0).toFixed(2)}
      </h3>
    </div>
  );
}