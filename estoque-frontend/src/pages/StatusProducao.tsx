import { useEffect, useState } from 'react';
import { api } from '../services/api';

type OrdemProducao = {
  id: number;
  produto: { nome: string };
  quantidade: number;
  status: string;
  createdAt?: string;
};

export function StatusProducao() {
  const [ordens, setOrdens] = useState<OrdemProducao[]>([]);
  const [msg, setMsg] = useState('');

  const fetchOrdens = () => {
    api.get('/ordens-producao').then(res => setOrdens(res.data));
  };

  useEffect(() => {
    fetchOrdens();
  }, []);

  const iniciarOrdem = async (id: number) => {
    try {
      await api.patch(`/ordens-producao/${id}/iniciar`);
      setMsg('Ordem iniciada com sucesso!');
      fetchOrdens();
    } catch (error: any) {
      setMsg(error.response?.data?.message || 'Erro ao iniciar ordem.');
    }
  };

  const finalizarOrdem = async (id: number) => {
    try {
      await api.patch(`/ordens-producao/${id}/finalizar`);
      setMsg('Ordem finalizada com sucesso!');
      fetchOrdens();
    } catch (error: any) {
      setMsg(error.response?.data?.message || 'Erro ao finalizar ordem.');
    }
  };

  const cancelarOrdem = async (id: number) => {
    try {
      await api.patch(`/ordens-producao/${id}/cancelar`);
      setMsg('Ordem cancelada.');
      fetchOrdens();
    } catch {
      setMsg('Erro ao cancelar ordem.');
    }
  };

  return (
    <div>
      <h1>Status das Ordens de Fabricação</h1>
      {msg && <p>{msg}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Status</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {ordens.map(ordem => (
            <tr key={ordem.id}>
              <td>{ordem.id}</td>
              <td>{ordem.produto?.nome}</td>
              <td>{ordem.quantidade}</td>
              <td>{ordem.status}</td>
              <td>{ordem.createdAt ? new Date(ordem.createdAt).toLocaleString() : ''}</td>
              <td>
                {ordem.status.toLowerCase() === 'pendente' && (
                  <>
                    <button onClick={() => iniciarOrdem(ordem.id)}>Iniciar</button>
                    <button onClick={() => cancelarOrdem(ordem.id)} style={{ marginLeft: 8 }}>Cancelar</button>
                  </>
                )}
                {ordem.status.toLowerCase() === 'em produção' && (
                  <>
                    <button onClick={() => finalizarOrdem(ordem.id)}>Finalizar</button>
                    <button onClick={() => cancelarOrdem(ordem.id)} style={{ marginLeft: 8 }}>Cancelar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}