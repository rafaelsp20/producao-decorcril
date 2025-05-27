import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Produtos } from './pages/Produtos';
//import { Insumos } from './pages/Insumos';
import { VincularInsumos } from './pages/VincularInsumos';
import { EstoqueInsumos } from './pages/EstoqueInsumos';
import { StatusProducao } from './pages/StatusProducao';
import { OrdemProducao } from './pages/OrdemProducao';
import { RelatorioProducao } from './pages/RelatorioProducao';
import { ListaInsumos } from './pages/ListaInsumos';
import { NovoInsumo } from './pages/NovoInsumo';
import { ListaProdutos } from './pages/ListaProdutos';
import { NovoProduto } from './pages/NovoProduto';
//import { NovoInsumo } from './pages/NovoInsumo';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Menu fixo lateral */}
        <nav style={{ width: 200, background: '#f0f0f0', height: '100vh', padding: 20 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link to="/">Produtos</Link>
            </li>
            <li>
              <Link to="/insumos">Insumos</Link>
            </li>
            <li>
              <Link to="/estoque-insumos">Estoque de Insumos</Link>
            </li>
            <li>
              <Link to="/vincular-insumos">Vincular Insumos</Link>
            </li>
            <li>
              <Link to="/ordem-producao">Ordem de Fabricação</Link>
            </li>
            <li>
              <Link to="/status-producao">Status Produção</Link>
            </li>
            <li>
              <Link to="/relatorio-producao">Relatório de Produção</Link>
            </li>
          </ul>
        </nav>
        {/* Conteúdo das páginas */}
        <div style={{ flex: 1, padding: 20 }}>
          <Routes>
            <Route path="/" element={<ListaProdutos />} />
            <Route path="/insumos" element={<ListaInsumos />} />
            <Route path="/insumos/novo" element={<NovoInsumo />} />
            <Route path="/produtos/novo" element={<NovoProduto />} />
            <Route path="/estoque-insumos" element={<EstoqueInsumos />} />
            <Route path="/vincular-insumos" element={<VincularInsumos />} />
            <Route path="/ordem-producao" element={<OrdemProducao />} />
            <Route path="/status-producao" element={<StatusProducao />} />
            <Route path="/relatorio-producao" element={<RelatorioProducao />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
