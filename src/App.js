import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Profile";
import DashboardAluno from "./pages/DashboardAluno";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardCoordenador from "./pages/DashboardCoordenador";
import CriarEvento from "./pages/CriarEventoProfessor";
import Cursos from "./pages/Cursos";
import Certificados from "./pages/Certificados";
import Eventos from "./pages/Eventos";
import DetalhesEvento from "./pages/DetalhesEvento";
import MeusEventosAluno from "./pages/MeusEventosAluno";
import EditarEvento from "./pages/EditarEventoProfessor";
import ProfileProfessor from "./pages/ProfileProfessor";
import ProfileCoordenador from "./pages/ProfileCoordenador";
import ListaAlunos from "./pages/ListaAlunos";
import ListaProfessores from "./pages/ListaProfessores";
import DetalhesAluno from "./pages/DetalheAluno";
import DetalhesProfessor from "./pages/DetalheProfessor";
import CertificadosPendentes from "./pages/CertificadosPendentes.jsx";
import EventoDetalhes from "./pages/Presenca.jsx";
import EditarEventoCoord from "./pages/EditarEventoCoordenador.jsx";
import CriarEventoCoord from "./pages/CriarEventoCoordenador.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/presenca/:enrollmentId" element={<EventoDetalhes />} />
        <Route path="/profile" element={<Perfil />} />
        <Route path="/profile-professor" element={<ProfileProfessor />} />
        <Route path="/profile-coordenador" element={<ProfileCoordenador />} />
        <Route path="/professores/:id" element={<DetalhesProfessor />} />
        <Route path="/dashboard-student" element={<DashboardAluno />} />
        <Route path="/dashboard-professor" element={<DashboardProfessor />} />
        <Route path="/dashboard-coordinator" element={<DashboardCoordenador />} />
        <Route path="/alunos/:id" element={<DetalhesAluno />} />
        <Route path="/certificados-pendentes" element={<CertificadosPendentes />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/professor" element={<CriarEvento />} />
        <Route path="/eventos/coordenador" element={<CriarEventoCoord />} />
        <Route path="/eventos/editar/:id" element={<EditarEvento />} />
        <Route path="/eventos/coord/editar/:id" element={<EditarEventoCoord />} />
        <Route path="/eventos/:id" element={<DetalhesEvento />} /> {/* Rota de detalhes */}
        <Route path="/lista-alunos" element={<ListaAlunos />} />
        <Route path="/lista-professores" element={<ListaProfessores />} />
        <Route path="/meus-eventos" element={<MeusEventosAluno />} /> {/* Rota de eventosinscritos */}
        <Route path="/certificados" element={<Certificados />} />
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


