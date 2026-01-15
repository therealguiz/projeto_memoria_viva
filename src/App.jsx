import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.jsx';

import Inicio from './pages/Inicio';
import Home from './pages/Home';
import Pessoas from './pages/Pessoas';
import Timeline from './pages/Timeline';
import DetalheMemoria from './pages/Memoria';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/memorias" element={<Home />} />
        <Route path="/pessoas" element={<Pessoas />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/memoria/:id" element={<DetalheMemoria />} />
        <Route path="/perfil/:email" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;