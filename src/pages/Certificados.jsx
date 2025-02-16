import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Certificados = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accepted");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleProfile = () => {
    console.log("👤 Acessando perfil...");
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Dados simulados dos eventos
  const events = [
    {
      id: 1,
      name: "Evento de Tecnologia",
      date: "12/03/2025",
      location: "Auditório A",
      time: "14:00",
      status: "accepted",
    },
    {
      id: 2,
      name: "Seminário de Engenharia",
      date: "18/03/2025",
      location: "Sala 202",
      time: "10:00",
      status: "pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Barra superior */}
      <div className="w-full bg-gradient-to-r from-green-600 to-green-400 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">SISGEHC</h1>

        <div className="relative">
          {/* Ícone do usuário */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl focus:outline-none">
            <span className="material-icons">account_circle</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="py-2">
                <li onClick={handleProfile} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Minha Conta
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/dashboard-student")}>
                  Eventos
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Eventos</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Certificados</li>
                <li onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-end px-16 mt-2">
        <button
          onClick={() => console.log("Abrir modal para submeter horas")}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center shadow-md"
          style={{ position: "absolute", top: "90px", right: "240px" }} // 🔥 Ajustando para ficar na região cinza
        >
          <span className="material-icons mr-2">Submeter horas</span>
        </button>
      </div>

      <div className="w-full flex flex-col items-start px-16 mt-4 mb-10">
        <h2 className="text-2xl font-semibold">Horas Complementares</h2>
        <div className="flex mt-2 border-b-2 border-gray-300">
          <button
            className={`px-4 py-2 text-lg font-medium transition ${
              activeTab === "accepted"
                ? "border-b-4 border-green-500 text-green-500 font-bold bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("accepted")}
          >
            Aceitos
          </button>
          <button
            className={`px-4 py-2 text-lg font-medium transition ml-6 ${
              activeTab === "pending"
                ? "border-b-4 border-green-500 text-green-500 font-bold bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("pending")}
          >
            Pendentes
          </button>
        </div>
      </div>

      {/* Lista de Eventos - Alinhado à esquerda */}
      <div className="w-full flex justify-start px-16">
        <div className="w-3/4 grid grid-cols-2 gap-6">
          {events.filter((event) => event.status === activeTab).map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <p className="text-gray-600">📅 Data: {event.date}</p>
              <p className="text-gray-600">📍 Local: {event.location}</p>
              <p className="text-gray-600">⏰ Horário: {event.time}</p>
              <div className="mt-4 flex justify-between items-center">
                <a href={`/certificado/${event.id}`} className="text-blue-500 hover:underline">
                  Ver Certificado
                </a>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Ver detalhes</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé */}
      <footer className="w-full bg-green-600 text-white text-center py-4 mt-10">
        <p>Sistema criado para fins acadêmicos</p>
        <p>Governo do Estado do Ceará</p>
        <p>Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
};

export default Certificados;







