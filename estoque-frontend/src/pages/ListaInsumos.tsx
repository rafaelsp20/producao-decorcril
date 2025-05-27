import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import styles from '../css/Insumos.module.css';

type Insumo = {
  id: number;
  nome: string;
  quantidadeEstoque: number;
  unidadeMedida: string;
  valor: number;
  fornecedor: string;
  categoria: string;
};

export function ListaInsumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/insumos').then(res => setInsumos(res.data));
  }, []);

  return (
    <>
      <h1>Insumos Cadastrados</h1>
      <button onClick={() => navigate('/insumos/novo')}>Novo Insumo</button>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nome</th>
              <th className={styles.th}>Quantidade</th>
              <th className={styles.th}>Unidade</th>
              <th className={styles.th}>Valor</th>
              <th className={styles.th}>Fornecedor</th>
              <th className={styles.th}>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map(insumo => (
              <tr key={insumo.id} className={styles.tr}>
                <td className={styles.td}>{insumo.nome}</td>
                <td className={styles.td}>{insumo.quantidadeEstoque}</td>
                <td className={styles.td}>{insumo.unidadeMedida}</td>
                <td className={styles.td}>R$ {insumo.valor?.toFixed(2)}</td>
                <td className={styles.td}>{insumo.fornecedor}</td>
                <td className={styles.td}>{insumo.categoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}