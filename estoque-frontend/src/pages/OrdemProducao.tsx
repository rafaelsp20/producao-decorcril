import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Produto = {
  id: number;
  nome: string;
  nomeCliente: string;
  pedidoVenda: string;
 
};

export function OrdemProducao() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [msg, setMsg] = useState('');
  const [novaOrdem, setNovaOrdem] = useState({
    produtoId: 0,
    quantidade: 1,
    nomeCliente: '',
    pedidoVenda: ''
  });

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
  }, []);

  const criarOrdem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/ordens-producao', novaOrdem);
      setMsg('Ordem de produção criada com sucesso!');
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Erro ao criar ordem de produção.');
    }
  };

  return (
    <div>
      <h1>Criar Ordem de Fabricação</h1>
      <form onSubmit={criarOrdem}>
        <div>
          <label>Produto:</label>
          <select
            value={novaOrdem.produtoId}
            onChange={e => setNovaOrdem({ ...novaOrdem, produtoId: Number(e.target.value) })}
            required
          >
            <option value="">Selecione</option>
            {produtos.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantidade:</label>
          <input
            type="number"
            min={1}
            value={novaOrdem.quantidade}
            onChange={e => setNovaOrdem({ ...novaOrdem, quantidade: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label>Nome do Cliente:</label>
          <input
            type="text"
            value={novaOrdem.nomeCliente}
            onChange={e => setNovaOrdem({ ...novaOrdem, nomeCliente: e.target.value })}
          />
        </div>
        <div>
          <label>Pedido de Venda:</label>
          <input
            type="text"
            value={novaOrdem.pedidoVenda}
            onChange={e => setNovaOrdem({ ...novaOrdem, pedidoVenda: e.target.value })}
          />
        </div>
        <button type="submit">Criar Ordem</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}