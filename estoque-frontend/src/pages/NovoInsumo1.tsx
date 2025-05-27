import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import styles from '../css/Insumos.module.css';

export function NovoInsumo() {
  const [novoInsumo, setNovoInsumo] = useState({
    nome: '',
    quantidadeEstoque: 0,
    unidadeMedida: '',
    valor: 0,
    dataNota: '',
    fornecedor: '',
    formaPagamento: '',
    categoria: ''
  });
  const navigate = useNavigate();

  const criarInsumo = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/insumos', novoInsumo);
    navigate('/insumos');
  };

  return (
    <>
      <h1>Novo Insumo</h1>
      <form onSubmit={criarInsumo} className={styles.formContainer}>
        {/* Repita os campos do seu formulário aqui, igual ao exemplo anterior */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome do Insumo:</label>
          <input
            className={styles.input}
            placeholder="Nome do Insumo"
            value={novoInsumo.nome}
            onChange={e => setNovoInsumo({ ...novoInsumo, nome: e.target.value })}
            required
          />
        </div>
        {/* ...demais campos... */}
        <button type="submit">Salvar</button>
        <button type="button" onClick={() => navigate('/insumos')} style={{marginLeft: 8}}>Cancelar</button>
      </form>
    </>
  );
}