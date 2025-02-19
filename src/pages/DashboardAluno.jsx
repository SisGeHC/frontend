import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InscricaoEvento from "./InscricaoEvento";

const DashboardAluno = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("🔍 Buscando eventos...");
        console.log("🔑 Token armazenado:", token);

        const response = await fetch("http://127.0.0.1:8000/events/list/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("❌ Erro ao buscar eventos");
        }

        const data = await response.json();
        console.log("📌 Eventos recebidos do backend:", data);
        setEventos(data);
      } catch (error) {
        console.error("🚨 Erro ao buscar eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  const handleOpenModal = async (eventoId) => {
    try {
      const token = localStorage.getItem("token");

      console.log(`🔍 Buscando detalhes do evento ID: ${eventoId}`);
      console.log("🔑 Token armazenado:", token);

      const response = await fetch(`http://127.0.0.1:8000/events/${eventoId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("❌ Erro ao buscar detalhes do evento");
      }

      const data = await response.json();
      console.log("📌 Detalhes do evento recebido:", data);
      setSelectedEvento(data);
    } catch (error) {
      console.error("🚨 Erro ao buscar detalhes do evento:", error);
    }
  };

  const handleCloseModal = () => {
    console.log("❌ Fechando modal...");
    setSelectedEvento(null);
  };

  const handleLogout = () => {
    console.log("🚪 Usuário saindo...");
    localStorage.clear();
    navigate("/login");
  };

  const handleMeusEventos = () => {
    console.log("📋 Acessando Meus Eventos...");
    navigate("/meus-eventos");
  };

  const handleProfile = () => {
    console.log("👤 Acessando perfil...");
    navigate("/profile");
  };

  const handleCertificate = () => {
    console.log("📜 Acessando certificados...");
    navigate("/certificados");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">SISGEHC</h1>
        <input
          type="text"
          placeholder="Pesquisar"
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
            👤
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="py-2">
                <li onClick={handleProfile} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Minha Conta
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Eventos</li>
                <li onClick={handleMeusEventos} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Eventos</li>
                <li onClick={handleCertificate} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Meus Certificados
                </li>
                <li onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Lista de eventos */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Eventos Disponíveis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <div key={evento.id} className="bg-white shadow-md rounded-lg p-4">
                <div className="bg-gray-300 h-24 mb-4 rounded-md"></div>
                <h3 className="text-lg font-bold">{evento.title}</h3>

                {evento.dates && evento.dates.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600">📅 {evento.dates[0]?.day}</p>
                    <p className="text-sm text-gray-600">⏰ {evento.dates[0]?.start_time} - {evento.dates[0]?.end_time}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">📅 Data não definida</p>
                )}

                <p className="text-sm text-gray-600">📍 {evento.location}</p>
                <p className="text-sm text-gray-600">Realização: {evento.creator?.full_name || "Desconhecido"}</p>

                <button 
                  onClick={() => handleOpenModal(evento.id)}
                  className="mt-4 bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600 flex justify-center items-center"
                >
                  🔍 Ver detalhes
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhum evento disponível no momento.</p>
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Evento */}
      {selectedEvento && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[70%] h-[70%] flex flex-col">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-xl font-bold text-green-700">{selectedEvento.title}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="flex-grow overflow-auto p-4">
              <p className="text-sm text-gray-500">
                {selectedEvento.creator?.full_name || "Desconhecido"} - {selectedEvento.creator?.course_name || "Coordenador"}
              </p>

              <div className="mt-4">
                <h4 className="text-lg font-semibold">Descrição</h4>
                <p className="text-gray-700">{selectedEvento.description}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <InscricaoEvento selectedEvento={selectedEvento} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAluno;
