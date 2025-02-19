import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardProfessor = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem("token");
        const professorId = localStorage.getItem("role_id"); // 🔥 Pegando o ID correto

        if (!professorId) {
          console.error("❌ Erro: Professor não identificado.");
          return;
        }
  
        const response = await fetch(`http://127.0.0.1:8000/events/professor/${professorId}/created/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Erro ao buscar eventos: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("📌 Eventos do professor (dados da API):", JSON.stringify(data, null, 2)); // 🔥 Debug
        setEventos(data);
      } catch (error) {
        console.error("❌ Erro ao buscar eventos:", error);
      }
    };
  
    fetchEventos();
  }, []);
  
  
  
  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
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
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                onClick={() => navigate("/profile-professor")}>Minha Conta</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Eventos</li>
                <li onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="p-6 min-h-[600px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Seus Eventos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-grow">
          
          {/* Botão de Criar Evento - Redireciona para página de criação */}
          <div 
            onClick={() => navigate("/eventos/professor")} 
            className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 border border-gray-300 cursor-pointer hover:bg-gray-50 transition h-[150px]"
          >
            <span className="text-green-500 font-bold leading-none" style={{ fontSize: '5em' }}>+</span> 
            <p className="text-gray-600 mt-2">Criar evento</p>
          </div>

          {/* Lista de Eventos */}
          {eventos && eventos.length > 0 ? (
            eventos.map((evento) => (
              <div key={evento.id} className="bg-white shadow-md rounded-lg p-4 h-[180px]">
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

                <button 
                  onClick={() => navigate(`/eventos/editar/${evento.id}`)}
                  className="mt-4 bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600 flex justify-center items-center"
                >
                  ✏️ Editar
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-gray-500">Nenhum evento cadastrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé */}
      <footer className="bg-green-700 text-white text-center p-4 mt-6">
        <p>Sistema criado para fins acadêmicos</p>
        <p>Governo do Estado do Ceará</p>
        <p>Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
};

export default DashboardProfessor;


