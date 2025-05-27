import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Produto = { id: number; nome: string; };
type Insumo = { id: number; nome: string; };
type Form = { produtoId: number; insumoId: number; quantidadeNecessaria: number; };

export function VincularInsumos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [form, setForm] = useState<Form>({ produtoId: 0, insumoId: 0, quantidadeNecessaria: 1 });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
    api.get('/insumos').then(res => setInsumos(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/produtos/${form.produtoId}/insumos`, {
        insumoId: form.insumoId,
        quantidadeNecessaria: form.quantidadeNecessaria,
      });
      setMsg('Insumo vinculado com sucesso!');
    } catch (err) {
      setMsg('Erro ao vincular insumo.');
    }
  };

  return (
    <div>
      <h1>Vincular Insumo ao Produto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Produto: </label>
          <select
            value={form.produtoId}
            onChange={e => setForm(f => ({ ...f, produtoId: Number(e.target.value) }))}
            required
          >
            <option value="">Selecione</option>
            {produtos.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Insumo: </label>
          <select
            value={form.insumoId}
            onChange={e => setForm(f => ({ ...f, insumoId: Number(e.target.value) }))}
            required
          >
            <option value="">Selecione</option>
            {insumos.map(i => (
              <option key={i.id} value={i.id}>{i.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantidade Necessária: </label>
          <input
            type="number"
            min={0.001}
            step={0.001}
            value={form.quantidadeNecessaria}
            onChange={e => setForm(f => ({ ...f, quantidadeNecessaria: Number(e.target.value) }))}
            required
          />
        </div>
        <button type="submit">Vincular</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}