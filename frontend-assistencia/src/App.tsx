import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Main/Home';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

// Clientes
import { ClienteListPage } from './pages/Entities/Cliente/ClienteListPage';
import { ClienteCreatePage } from './pages/Entities/Cliente/ClienteCreatePage';
import { ClienteDetailsPage } from './pages/Entities/Cliente/ClienteDetailsPage';

// Equipamentos
import { EquipamentoListPage } from './pages/Entities/Equipamento/EquipamentoListPage';
import { EquipamentoCreatePage } from './pages/Entities/Equipamento/EquipamentoCreatePage';
import { EquipamentoDetailsPage } from './pages/Entities/Equipamento/EquipamentoDetailsPage';

// Agendamentos
import { AgendamentoListPage } from './pages/Entities/Agendamento/AgendamentoListPage';
import { AgendamentoCreatePage } from './pages/Entities/Agendamento/AgendamentoCreatePage';
import { AgendamentoDetailsPage } from './pages/Entities/Agendamento/AgendamentoDetailsPage';

// Usuários
import { UsuarioListPage } from './pages/Entities/Usuario/UsuarioListPage';
import { UsuarioCreatePage } from './pages/Entities/Usuario/UsuarioCreatePage';
import { UsuarioDetailsPage } from './pages/Entities/Usuario/UsuarioDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas de Clientes */}
        <Route path="/clientes" element={<ProtectedRoute element={<ClienteListPage />} />} />
        <Route path="/clientes/novo" element={<ProtectedRoute element={<ClienteCreatePage />} />} />
        <Route path="/clientes/:id" element={<ProtectedRoute element={<ClienteDetailsPage />} />} />
        <Route path="/clientes/:id/editar" element={<ProtectedRoute element={<ClienteDetailsPage edit />} />} />

        {/* Rotas de Equipamentos */}
        <Route path="/equipamentos" element={<ProtectedRoute element={<EquipamentoListPage />} />} />
        <Route path="/equipamentos/novo" element={<ProtectedRoute element={<EquipamentoCreatePage />} />} />
        <Route path="/equipamentos/:id" element={<ProtectedRoute element={<EquipamentoDetailsPage />} />} />
        <Route path="/equipamentos/:id/editar" element={<ProtectedRoute element={<EquipamentoDetailsPage edit />} />} />

        {/* Rotas de Agendamentos */}
        <Route path="/agendamento" element={<ProtectedRoute element={<AgendamentoListPage />} />} />
        <Route path="/agendamento/novo" element={<ProtectedRoute element={<AgendamentoCreatePage />} />} />
        <Route path="/agendamento/:id" element={<ProtectedRoute element={<AgendamentoDetailsPage />} />} />
        <Route path="/agendamento/:id/editar" element={<ProtectedRoute element={<AgendamentoDetailsPage edit />} />} />

        {/* Rotas de Usuários (Apenas Administrador) */}
        <Route path="/usuarios" element={<AdminProtectedRoute element={<UsuarioListPage />} />} />
        <Route path="/usuarios/novo" element={<AdminProtectedRoute element={<UsuarioCreatePage />} />} />
        <Route path="/usuarios/:id" element={<AdminProtectedRoute element={<UsuarioDetailsPage />} />} />
        <Route path="/usuarios/:id/editar" element={<AdminProtectedRoute element={<UsuarioDetailsPage edit />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
