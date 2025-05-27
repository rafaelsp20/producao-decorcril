import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from '../css/Insumos.module.css';
import { XMLParser } from 'fast-xml-parser';

type Insumo = {
  id: number;
  nome: string;
  descricao: string;
  quantidadeEstoque: number;
  unidadeMedida: string;
  valor: number;
  fornecedor: string;
  categoria: string;
};

export function NovoInsumo() {
  // Estado para itens do XML e vínculos
  const [itensXml, setItensXml] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoInsumo, setNovoInsumo] = useState<{
    nome: string;
    quantidadeEstoque: number;
    unidadeMedida: string;
    valor: number;
    dataNota: string;
    fornecedor: string;
    formaPagamento: string;
    categoria: string;
    codigoProduto?: string; // <-- Adicione esta linha
  }>({
    nome: '',
    quantidadeEstoque: 0,
    unidadeMedida: '',
    valor: 0,
    dataNota: '',
    fornecedor: '',
    formaPagamento: '',
    categoria: '',
    codigoProduto: '', // <-- E esta linha
  });
  const [tipoCadastro, setTipoCadastro] = useState<'produto' | 'insumo'>('insumo');

  //Listar todos os produtos disponíveis para fabricação
  useEffect(() => {
    api.get('/insumos').then(res => setInsumos(res.data));
  }, []);

  const criarInsumo = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando:', novoInsumo); // Veja no console do navegador
    const { nome, quantidadeEstoque, unidadeMedida, valor, fornecedor, categoria } = novoInsumo;
    if (tipoCadastro === 'insumo') {
      // Para insumo
      await api.post('/insumos', { nome, quantidadeEstoque, unidadeMedida, valor, fornecedor, categoria });
    } else {
      // Para produto
      await api.post('/produtos', { nome, quantidadeEstoque, unidadeMedida, valor, fornecedor, categoria });
    }
    setNovoInsumo({
      nome: '',
      quantidadeEstoque: 0,
      unidadeMedida: '',
      valor: 0,
      dataNota: '',
      fornecedor: '',
      formaPagamento: '',
      categoria: '',
      codigoProduto: '', // <-- Adicione esta linha
    });
    api.get('/insumos').then(res => setInsumos(res.data));
  };

  // Ao importar XML
  const handleXmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlText = event.target?.result as string;
      const parser = new XMLParser();
      const result = parser.parse(xmlText);

      // Ajuste o caminho conforme seu XML
      let itens = result.nfeProc?.NFe?.infNFe?.det;
      // Se não for array, transforma em array
      if (itens && !Array.isArray(itens)) {
        itens = [itens];
      }
      setItensXml(itens || []);
      setModalAberto(true);
    };
    reader.readAsText(file);
  };


  return (
    <>
      <h1>Inclusão de Insumos</h1>
      <form onSubmit={criarInsumo} className={styles.formContainer}>
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
        <div className={styles.formGroup}>
          <label className={styles.label}>Quantidade:</label>
          <input
            className={styles.input}
            placeholder="Quantidade"
            type="number"
            value={novoInsumo.quantidadeEstoque}
            onChange={e => setNovoInsumo({ ...novoInsumo, quantidadeEstoque: Number(e.target.value) })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Unidades:</label>
          <input
            className={styles.input}
            placeholder="Unidades"
            value={novoInsumo.unidadeMedida}
            onChange={e => setNovoInsumo({ ...novoInsumo, unidadeMedida: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Valor:</label>
          <input
            className={styles.input}
            placeholder="Valor"
            type="number"
            step="0.01"
            value={novoInsumo.valor}
            onChange={e => setNovoInsumo({ ...novoInsumo, valor: Number(e.target.value) })}
          />
        </div>
          <div className={styles.formGroup}>
          <label className={styles.label}>Fornecedor:</label>
          <input
            className={styles.input}
            placeholder="Fornecedor"
            value={novoInsumo.fornecedor}
            onChange={e => setNovoInsumo({ ...novoInsumo, fornecedor: e.target.value })}
          />
          </div>
         <div className={styles.formGroup}>
          <label className={styles.label}>Categoria:</label>
          <input
            className={styles.input}
            placeholder="Categoria"
            value={novoInsumo.categoria}
            onChange={e => setNovoInsumo({ ...novoInsumo, categoria: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tipo de Cadastro:</label>
          <select
            className={styles.select}
            value={tipoCadastro}
            onChange={e => setTipoCadastro(e.target.value as 'produto' | 'insumo')}
          >
            <option value="produto">Produto</option>
            <option value="insumo">Insumo</option>
          </select>
        </div>

        {tipoCadastro === 'insumo' && (
          <>
            {/* Campos específicos de insumo */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Unidade:</label>
              <input
                className={styles.input}
                value={novoInsumo.unidadeMedida}
                onChange={e => setNovoInsumo({ ...novoInsumo, unidadeMedida: e.target.value })}
              />
            </div>
            {/* ...outros campos de insumo */}
          </>
        )}

        {tipoCadastro === 'produto' && (
          <>
            {/* Campos específicos de produto */}
            
            {/* ...outros campos de produto */}
          </>
        )}

        <button type="submit">Adicionar Insumo</button>
      </form>
      <input
        type="file"
        accept=".xml"
        style={{ display: 'none' }}
        id="input-xml"
        onChange={handleXmlUpload}
      />
      <button onClick={() => document.getElementById('input-xml')?.click()}>
        Importar Insumos via XML NF-e
      </button>

      {/* Modal de vinculação 
      {modalAberto && (
        <div className="modal">
          <h2>Vincular Itens do XML a Insumos</h2>
          <table>
            <thead>
              <tr>
                <th>Descrição NF-e</th>
                <th>Vincular a Insumo</th>
              </tr>
            </thead>
            <tbody>
              {itensXml.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.prod.xProd}</td>
                  <td>
                    {/* Apenas exibe o nome do insumo, sem vínculo *
                    {item.prod.uCom} {/* Exemplo: unidade de medida *
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    
          <button onClick={() => setModalAberto(false)}>Cancelar</button>
        </div>
      )}*/}
    </>
  );
}