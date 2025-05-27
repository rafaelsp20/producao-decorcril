import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
  valorUnitario: number;
  insumosNecessarios: InsumoNecessario[];
  fotoUrl?: string; // Adicione esta linha
  codigo?: string; // Adicione esta linha
  marca?: string;  // Adicione esta linha
};

export function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState({ nome: '', descricao: '', valorUnitario: 0 });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editProduto, setEditProduto] = useState({
    nome: '',
    descricao: '',
    valorUnitario: 0,
    codigo: '',
    marca: '',
    // adicione outros campos se necessário
  });
  const [mostrarInsumosId, setMostrarInsumosId] = useState<number | null>(null);
  const [ordens, setOrdens] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();

  const criarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/produtos', novoProduto);
    setNovoProduto({ nome: '', descricao: '', valorUnitario: 0 });
    api.get('/produtos').then(res => setProdutos(res.data));
  };

  const iniciarEdicao = (produto: Produto) => {
    setEditandoId(produto.id);
    setEditProduto({
      nome: produto.nome,
      descricao: produto.descricao,
      valorUnitario: produto.valorUnitario,
      codigo: produto.codigo || '',
      marca: produto.marca || '',
      // outros campos se houver
    });
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
    <>
      <h1>Lista de Produtos Cadastrados</h1>
      <button onClick={() => navigate('/produtos/novo')}>Novo Produto</button>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nome</th>
              <th className={styles.th}>Descrição</th>
              <th className={styles.th}>Valor Unitário</th>
              <th className={styles.th}>Excluir</th>
              <th className={styles.th}>Alterar</th>
              <th className={styles.th}>Ver Insumos</th> 
              <th className={styles.th}>Imagem</th> 
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <React.Fragment key={produto.id}>
                <tr className={styles.tr}>
                  {editandoId === produto.id ? (
                    <>
                      <td colSpan={7}>
                        <input
                          className={styles.input}
                          value={editProduto.nome}
                          onChange={e => setEditProduto({ ...editProduto, nome: e.target.value })}
                          placeholder="Nome"
                        />
                        <input
                          className={styles.input}
                          value={editProduto.descricao}
                          onChange={e => setEditProduto({ ...editProduto, descricao: e.target.value })}
                          placeholder="Descrição"
                        />
                        <input
                          className={styles.input}
                          value={editProduto.codigo}
                          onChange={e => setEditProduto({ ...editProduto, codigo: e.target.value })}
                          placeholder="Código"
                        />
                        <input
                          className={styles.input}
                          value={editProduto.marca}
                          onChange={e => setEditProduto({ ...editProduto, marca: e.target.value })}
                          placeholder="Marca"
                        />
                        <input
                          className={styles.input}
                          type="number"
                          value={editProduto.valorUnitario}
                          onChange={e => setEditProduto({ ...editProduto, valorUnitario: Number(e.target.value) })}
                          placeholder="Valor Unitário"
                        />
                        <button onClick={() => salvarEdicao(produto.id)}>Salvar</button>
                        <button onClick={() => setEditandoId(null)}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={styles.td}>{produto.nome}</td>
                      <td className={styles.td}>{produto.descricao}</td>
                      <td className={styles.td}>R$ {produto.valorUnitario?.toFixed(2)}</td>
                      <td>
                        <button onClick={() => excluirProduto(produto.id)}>Excluir</button>
                      </td>
                      <td>
                        <button onClick={() => { iniciarEdicao(produto); setModalAberto(true); }}>Editar</button>
                      </td>
                      <td>
                        <button onClick={() => setMostrarInsumosId(mostrarInsumosId === produto.id ? null : produto.id)}>
                          {mostrarInsumosId === produto.id ? 'Ocultar Insumos' : 'Ver Insumos'}
                        </button>
                      </td>
                      <td>
                        <img src={`http://localhost:3000/${produto.fotoUrl}`} alt={produto.nome} width={100} />
                      </td>
                    </>
                  )}
                </tr>
                {mostrarInsumosId === produto.id && (
                  <tr>
                    <td colSpan={7}>
                      <strong>Insumos:</strong>
                      <ul>
                        {produto.insumosNecessarios.map(insumoNec => (
                          <li key={insumoNec.id}>
                            {insumoNec.insumo.nome} - {insumoNec.quantidadeNecessaria} {insumoNec.insumo.unidadeMedida}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 400
          }}>
            <h2>Editar Produto</h2>
            <input
              className={styles.input}
              value={editProduto.nome}
              onChange={e => setEditProduto({ ...editProduto, nome: e.target.value })}
              placeholder="Nome"
            />
            <input
              className={styles.input}
              value={editProduto.descricao}
              onChange={e => setEditProduto({ ...editProduto, descricao: e.target.value })}
              placeholder="Descrição"
            />
            <input
              className={styles.input}
              value={editProduto.codigo}
              onChange={e => setEditProduto({ ...editProduto, codigo: e.target.value })}
              placeholder="Código"
            />
            <input
              className={styles.input}
              value={editProduto.marca}
              onChange={e => setEditProduto({ ...editProduto, marca: e.target.value })}
              placeholder="Marca"
            />
            <input
              className={styles.input}
              type="number"
              value={editProduto.valorUnitario}
              onChange={e => setEditProduto({ ...editProduto, valorUnitario: Number(e.target.value) })}
              placeholder="Valor Unitário"
            />
            <div style={{ marginTop: 16 }}>
              <button onClick={async () => { await salvarEdicao(editandoId!); setModalAberto(false); }}>Salvar</button>
              <button onClick={() => setModalAberto(false)} style={{ marginLeft: 8 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

}