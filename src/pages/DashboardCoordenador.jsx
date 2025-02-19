import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardCoordenador = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem("token");
        const roleId = parseInt(localStorage.getItem("role_id"), 10); // ID do Coordenador logado
        let localemail = localStorage.getItem("email") || ""; 
  
        console.log("🔍 Verificando dados do usuário logado...");
  
        if (!token || isNaN(roleId)) {
          console.error("Token, role_id ou user_type não encontrado.");
          return;
        }
  
        console.log("📡 Buscando todos os eventos...");
        const response = await fetch("http://127.0.0.1:8000/events/list/", {
          headers: {
            "Authorization": `Token ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Erro ao buscar eventos.");
        }
  
        const data = await response.json();
        console.log("📌 Todos os eventos recebidos:", data);
  
        // Exibir detalhes no console para depuração
        data.forEach(evento => {
          console.log(`🎯 Evento ID: ${evento.id} - Criado por: ${evento.creator.id} - Tipo real do creator: ${evento.creator.email}`);
        });
  
        // 🔹 Filtrar eventos criados apenas pelo coordenador logado
        const eventosFiltrados = data.filter(evento =>
          evento.creator &&
          (evento.creator.id === roleId) && // Garante que o ID é do coordenador logado
          (evento.creator.email === localemail) // Confirma que o criador é um coordenador
        );
  
        console.log("🟢 Eventos filtrados para o coordenador logado:", eventosFiltrados);
        setEventos(eventosFiltrados);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      }
    };
  
    fetchEventos();
  }, []);  

  const handleSendEmail = async () => {
    const token = localStorage.getItem("token");
    setIsSending(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/enrollments/send-event-notification/${selectedEvent.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        alert("E-mail enviado com sucesso!");
      } else {
        alert("Erro ao enviar o e-mail.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar o e-mail.");
    }
    setIsSending(false);
  };

  const handleLogout = () => {
    console.log("🚪 Usuário saindo...");
    localStorage.clear();
    navigate("/login");
  };

  const openModal = (evento) => {
    setSelectedEvent(evento);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔥 Cabeçalho */}
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
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile-coordenador")}>
                  Minha conta
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/dashboard-coordinator")}>
                  Meus eventos
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/lista-alunos")}>
                  Alunos
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/lista-professores")}>
                  Professores
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/certificados-pendentes")}>
                  Certificados
                </li>
                <li className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* 🔥 Seção de Eventos */}
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Seus Eventos</h2>

        {/* 🔥 Grid dos eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card para criar evento */}
          <div 
            onClick={() => navigate("/eventos/coordenador")} 
            className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 border border-gray-300 cursor-pointer hover:bg-gray-50 transition h-[150px]"
          >
            <span className="text-green-500 font-bold leading-none" style={{ fontSize: '5em' }}>+</span> 
            <p className="text-gray-600 mt-2">Criar evento</p>
          </div>

          {/* Renderizar eventos */}
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <div key={evento.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-bold">{evento.title}</h3>
                <p className="text-sm text-gray-600">📅 {evento.dates[0]?.day}</p>
                <p className="text-sm text-gray-600">📍 {evento.location}</p>
                <p className="text-sm text-gray-600">⏰ {evento.dates[0]?.start_time} - {evento.dates[0]?.end_time}</p>

                {/* Verifica se 'creator' é um objeto e exibe o nome do coordenador corretamente */}
                <p className="text-sm text-gray-600">
                  Realização: {evento.creator?.full_name || "Desconhecido"}
                </p>
                <button onClick={() => openModal(evento)} className="mt-4 bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600 flex justify-center items-center">Ações</button>
                <button
                  onClick={() => navigate(`/eventos/coord/editar/${evento.id}`)}
                  className="mt-4 bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600 flex justify-center items-center"
                >
                  ✏️ Editar
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhum evento criado.</p>
          )}

        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[70%] max-w-lg">
            <h3 className="text-lg font-bold">Enviar E-mail para os Alunos</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem..."
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex justify-between">
              <button onClick={handleSendEmail} disabled={isSending} className="bg-green-500 text-white p-2 rounded disabled:opacity-50">
                {isSending ? "Enviando..." : "Enviar E-mail"}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white p-2 rounded">
                Cancelar
              </button>
            </div>
            <a href="http://127.0.0.1:3000/validar-presenca" className="mt-4 block bg-blue-500 text-lg font-bold text-center p-2 rounded">
              Validar Presença
            </a>
          </div>
        </div>
      )}

      {/* 🔥 Rodapé */}
      <footer className="bg-green-700 text-white text-center p-4 mt-6">
        <p>Sistema criado para fins acadêmicos</p>
        <p>Governo do Estado do Ceará</p>
        <p>Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
};

export default DashboardCoordenador;
