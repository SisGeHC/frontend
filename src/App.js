import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Profile";
import DashboardAluno from "./pages/DashboardAluno";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardCoordenador from "./pages/DashboardCoordenador";
import Cursos from "./pages/Cursos";
import Eventos from "./pages/Eventos";
import DetalhesEvento from "./pages/DetalhesEvento";
import MeusEventos from "./pages/MeusEventos";
import Certificados from "./pages/Certificados";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/dashboard-aluno" element={<DashboardAluno />} />
        <Route path="/dashboard-professor" element={<DashboardProfessor />} />
        <Route path="/dashboard-coordenador" element={<DashboardCoordenador />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<DetalhesEvento />} /> {/* Rota de detalhes */}
        <Route path="/meus-eventos" element={<MeusEventos />} /> {/* Rota de eventos participados */}
        <Route path="/certificados" element={<Certificados />} />
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


