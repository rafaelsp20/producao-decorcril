import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from '../css/Produtos.module.css';
import { useNavigate } from 'react-router-dom';



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
  codigo: string;
  marca: string;
  fotoUrl?: string; // <--- Adicione esta linha
  // ...outros campos se houver
};

export function NovoProduto() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    valorUnitario: 0,
    codigo: '',
    marca: '',
    foto: null as File | null,
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editProduto, setEditProduto] = useState({ nome: '', descricao: '' });
  const [mostrarInsumosId, setMostrarInsumosId] = useState<number | null>(null);
  const [ordens, setOrdens] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const criarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nome', novoProduto.nome);
    formData.append('descricao', novoProduto.descricao);
    formData.append('valorUnitario', String(novoProduto.valorUnitario));
    formData.append('codigo', novoProduto.codigo);
    formData.append('marca', novoProduto.marca);
    if (novoProduto.foto) {
      formData.append('foto', novoProduto.foto);
    }
    try {
      await api.post('/produtos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Produto cadastrado com sucesso!');
      setTimeout(() => {
        navigate('/'); // Redireciona para a lista após 1 segundo
      }, 1000);
    } catch (err: any) {
      setMsg('Erro ao cadastrar produto.');
    }
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

  const handleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('xml', file);

    await api.post('/insumos/importar-xml', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // Você pode exibir uma mensagem de sucesso ou atualizar a lista de insumos
  };

  useEffect(() => {
    api.get('/produtos').then(res => {
      setProdutos(res.data);
      console.log(res.data); // Veja se fotoUrl aparece aqui
    });
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
        <label className={styles.label}>Código:</label>
        <input
         className={styles.input}
          placeholder="Código"
          value={novoProduto.codigo}
          onChange={e => setNovoProduto({ ...novoProduto, codigo: e.target.value })}
        />
        <label className={styles.label}>Marca:</label>
        <input
         className={styles.input}
          placeholder="Marca"
          value={novoProduto.marca}
          onChange={e => setNovoProduto({ ...novoProduto, marca: e.target.value })}
        />
        <label className={styles.label}>Valor Unitário:</label>
        <input
         className={styles.input}
          placeholder="Valor Unitário"
          type="number"
          value={novoProduto.valorUnitario}
          onChange={e => setNovoProduto({ ...novoProduto, valorUnitario: Number(e.target.value) })}
        />
        <label className={styles.label}>Foto:</label>
        <input
         className={styles.input}
          type="file"
          accept=".xml"
          onChange={e => setNovoProduto({ ...novoProduto, foto: e.target.files?.[0] || null })}
        />
        <button type="submit">Adicionar Produto</button>
        {msg && <div style={{ color: 'green', marginBottom: 16 }}>{msg}</div>}
        </div>
      </form>
    </div>
  );
}