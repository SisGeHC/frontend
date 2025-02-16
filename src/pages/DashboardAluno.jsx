import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardAluno = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("🚪 Usuário saindo...");
  
    // 🔥 Removendo todos os dados do usuário do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("user_type");
    localStorage.removeItem("email");
    localStorage.removeItem("role_id");
  
    // 🚀 Redirecionando para a página de login
    navigate("/login");
  };

  const handleProfile = () => {
    console.log("👤 Acessando perfil...");
    navigate("/profile");
  };

  const handleCertificate = () => {
    console.log("Acessando certificados...");
    navigate("/certificados");
  }
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
          <button onClick={toggleMenu} className="text-white text-xl focus:outline-none">
            <span className="material-icons">account_circle</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="py-2">
              <li onClick={handleProfile} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Minha Conta
              </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Eventos</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Eventos</li>
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
          {[1, 2, 3, 4].map((event) => (
            <div key={event} className="bg-white shadow-md rounded-lg p-4">
              <div className="bg-gray-300 h-24 mb-4 rounded-md"></div>
              <h3 className="text-lg font-bold">Nome do Evento</h3>
              <p className="text-sm text-gray-600">📅 Data</p>
              <p className="text-sm text-gray-600">📍 Local</p>
              <p className="text-sm text-gray-600">⏰ Horário</p>
              <p className="text-sm text-gray-600">Realização: Realizador</p>
              <button className="mt-4 bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600">
                Ver detalhes
              </button>
            </div>
          ))}
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

export default DashboardAluno;
