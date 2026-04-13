import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cidadao from './pages/Cidadao';
import Gestor from './pages/Gestor';
import Abrigo from './pages/Abrigo';

// Importação do estilo global
import './styles/global.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cidadao />} />

        <Route path="/gestor" element={<Gestor />} />

        <Route path="/abrigo/:id" element={<Abrigo />} />
      </Routes>
    </Router>
  );
}

export default App;