import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from '../css/Produtos.module.css';

type Insumo = {
  id: number;
  nome: string;
  unidadeMedida?: string;
};

type InsumoNecessario = {
  id: number;
  quantidadeNecessaria: number;
  insumo: Insumo;
};

type Produto = {
  id: number;
  nome: string;
  descricao: string;
  insumosNecessarios: InsumoNecessario[];
};

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState({ nome: '', descricao: '', valorUnitario: 0 });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editProduto, setEditProduto] = useState({ nome: '', descricao: '' });
  const [mostrarInsumosId, setMostrarInsumosId] = useState<number | null>(null);
  const [ordens, setOrdens] = useState([]);

  const criarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/produtos', novoProduto);
    setNovoProduto({ nome: '', descricao: '', valorUnitario: 0 });
    api.get('/produtos').then(res => setProdutos(res.data));
  };

  const iniciarEdicao = (produto: Produto) => {
    setEditandoId(produto.id);
    setEditProduto({ nome: produto.nome, descricao: produto.descricao });
  };

  const salvarEdicao = async (id: number) => {
    await api.patch(`/produtos/${id}`, editProduto);
    setEditandoId(null);
    api.get('/produtos').then(res => setProdutos(res.data));
  };

  const excluirProduto = async (id: number) => {
    await api.delete(`/produtos/${id}`);
    api.get('/produtos').then(res => setProdutos(res.data));
  };

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
  }, []);

  useEffect(() => {
    api.get('/ordens-producao').then(res => {
      setOrdens(res.data);
      console.log(res.data); // Veja se produto.valorUnitario está presente
    });
  }, []);

  return (
        <div>
      <h1>Incluir Produtos</h1>
      <form onSubmit={criarProduto} className={styles.formContainer}>
         <div className={styles.formGroup}>
            <label className={styles.label}>Nome do Produto:</label>
        <input
         className={styles.input}
          placeholder="Nome"
          value={novoProduto.nome}
          onChange={e => setNovoProduto({ ...novoProduto, nome: e.target.value })}
          required
        />
        <label className={styles.label}>Descrição:</label>
        <input
         className={styles.input}
          placeholder="Descrição"
          value={novoProduto.descricao}
          onChange={e => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
        />
        <label className={styles.label}>Valor Unitário:</label>
        <input
         className={styles.input}
          placeholder="Valor Unitário"
          type="number"
          value={novoProduto.valorUnitario}
          onChange={e => setNovoProduto({ ...novoProduto, valorUnitario: Number(e.target.value) })}
        />
        <button type="submit">Adicionar Produto</button>
        </div>
      </form>
      <ul>
        {produtos.map(produto => (
          <li key={produto.id} style={{ marginBottom: 20 }}>
            {editandoId === produto.id ? (
              <>
                <input
                  value={editProduto.nome}
                  onChange={e => setEditProduto({ ...editProduto, nome: e.target.value })}
                />
                <input
                  value={editProduto.descricao}
                  onChange={e => setEditProduto({ ...editProduto, descricao: e.target.value })}
                />
                <button onClick={() => salvarEdicao(produto.id)}>Salvar</button>
                <button onClick={() => setEditandoId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <strong>{produto.nome}</strong> - {produto.descricao}
                <button onClick={() => iniciarEdicao(produto)}>Editar</button>
                <button onClick={() => excluirProduto(produto.id)}>Excluir</button>
                <button onClick={() => setMostrarInsumosId(mostrarInsumosId === produto.id ? null : produto.id)}>
                  {mostrarInsumosId === produto.id ? 'Ocultar Insumos' : 'Ver Insumos'}
                </button>
              </>
            )}
            {mostrarInsumosId === produto.id && produto.insumosNecessarios && produto.insumosNecessarios.length > 0 && (
              <ul>
                {produto.insumosNecessarios.map(inN => (
                  <li key={inN.id}>
                    {inN.insumo?.nome} ({inN.quantidadeNecessaria} {inN.insumo?.unidadeMedida || ''})
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}