import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Insumo = {
  id: number;
  nome: string;
  unidadeMedida?: string;
  quantidadeEstoque: number;
};

export function EstoqueInsumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);

  useEffect(() => {
    api.get('/insumos').then(res => setInsumos(res.data));
  }, []);

  return (
    <div>
      <h1>Estoque de Insumos</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantidade em Estoque</th>
            <th>Unidade</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map(insumo => (
            <tr key={insumo.id}>
              <td>{insumo.nome}</td>
              <td>{insumo.quantidadeEstoque}</td>
              <td>{insumo.unidadeMedida}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}