import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetalhesAluno = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do aluno pela URL
  const [menuOpen, setMenuOpen] = useState(false);
  const [aluno, setAluno] = useState(null);
  const [eventosAtivos, setEventosAtivos] = useState([]);
  const [eventosEncerrados, setEventosEncerrados] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("ativos");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvento, setSelectedEvento] = useState(null);

  useEffect(() => {
    const fetchAluno = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://127.0.0.1:8000/students/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao carregar informações do aluno.");

        const data = await response.json();
        setAluno(data);
      } catch (error) {
        console.error("❌ Erro ao buscar aluno:", error);
      }
    };

    const fetchEventosAluno = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://127.0.0.1:8000/enrollments/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao carregar eventos do aluno.");

        const data = await response.json();

        // Filtra apenas os eventos do aluno atual
        const eventosAluno = data.filter((enrollment) => enrollment.student === parseInt(id));

        // Separa eventos ativos e encerrados
        setEventosAtivos(eventosAluno.filter((evento) => !evento.attended));
        setEventosEncerrados(eventosAluno.filter((evento) => evento.attended));
      } catch (error) {
        console.error("❌ Erro ao buscar eventos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAluno();
    fetchEventosAluno();
  }, [id]);

  const handleOpenModal = (evento) => {
    console.log("🔍 Abrindo modal para evento:", evento);
    setSelectedEvento(evento);
  };

  const handleCloseModal = () => {
    setSelectedEvento(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">Carregando...</h2>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-red-600">Erro ao carregar dados do aluno.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-green-600 to-green-400 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">SISGEHC</h1>

        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
            👤
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="py-2">
                <li onClick={() => navigate("/profile-coordenador")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Minha Conta
                </li>
                <li onClick={() => navigate("/dashboard-coordinator")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Dashboard
                </li>
                <li onClick={() => navigate("/alunos")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Alunos
                </li>
                <li onClick={() => navigate("/professores")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Professores
                </li>
                <li onClick={() => navigate("/certificados")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Certificados
                </li>
                <li onClick={() => navigate("/login")} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Informações do aluno */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md w-3/5">
        <h2 className="text-2xl font-semibold mb-2">{aluno.full_name}</h2>
        <p className="text-gray-600">Estudante</p>
        <p className="text-gray-600">📧 {aluno.email}</p>
        <p className="text-gray-600">⏳ {aluno.complementary_hours}h</p>
      </div>

      {/* Navegação entre eventos ativos, encerrados e certificados */}
      <div className="w-3/5 mt-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-semibold ${abaAtiva === "ativos" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            onClick={() => setAbaAtiva("ativos")}
          >
            Eventos Ativos
          </button>
          <button
            className={`px-4 py-2 font-semibold ml-4 ${abaAtiva === "encerrados" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            onClick={() => setAbaAtiva("encerrados")}
          >
            Eventos Encerrados
          </button>
          <button
            className={`px-4 py-2 font-semibold ml-4 ${abaAtiva === "certificados" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            onClick={() => setAbaAtiva("certificados")}
          >
            Certificados
          </button>
        </div>
      </div>

      {/* Lista de eventos ativos ou encerrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-3/5 mt-6">
        {(abaAtiva === "ativos" ? eventosAtivos : eventosEncerrados).length > 0 ? (
          (abaAtiva === "ativos" ? eventosAtivos : eventosEncerrados).map((evento) => (
            <div key={evento.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-bold">{evento.event.title}</h3>
              <p className="text-sm text-gray-600">📅 {evento.event.dates[0]?.day}</p>
              <p className="text-sm text-gray-600">📍 {evento.event.location}</p>
              <p className="text-sm text-gray-600">
                ⏰ {evento.event.dates[0]?.start_time} - {evento.event.dates[0]?.end_time}
              </p>
              <button
                onClick={() => handleOpenModal(evento)}
                className="mt-4 bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600"
              >
                Ver detalhes
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">Nenhum evento encontrado.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center p-4 mt-6 w-full">
        <p>Sistema criado para fins acadêmicos</p>
        <p>Governo do Estado do Ceará</p>
        <p>Todos os Direitos Reservados</p>
      </footer>
      {/* 🔥 Modal de Detalhes do Evento */}
      {selectedEvento && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[70%] h-[70%] flex flex-col">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-xl font-bold text-green-700">{selectedEvento.title}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
  
            <div className="flex-grow overflow-auto p-4">
              <p className="text-sm text-gray-500">
                {selectedEvento.creator?.full_name || "Desconhecido"} - {selectedEvento.course || "Curso não informado"}
              </p>
              <p className="text-gray-700">{selectedEvento.description}</p>
              <p className="text-sm text-gray-600">📅 {selectedEvento.dates?.[0]?.day || "Data não informada"}</p>
              <p className="text-sm text-gray-600">📍 {selectedEvento.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalhesAluno;
