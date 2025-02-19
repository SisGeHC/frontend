import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Presenca = () => {
  const { enrollmentId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [evento, setEvento] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!enrollmentId) {
      console.error("❌ ID da matrícula não encontrado.");
      setErrorMessage("ID da matrícula não encontrado.");
      return;
    }

    console.log("🔍 ID da matrícula recebido:", enrollmentId);

    const fetchQrCode = async () => {
      const token = localStorage.getItem("token");

      try {
        console.log(`📡 Buscando QR Code para inscrição ID: ${enrollmentId}...`);
        const response = await fetch(`http://127.0.0.1:8000/enrollments/${enrollmentId}/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Dados da inscrição recebidos:", data);
          
          // Pegando os detalhes do evento
          setEvento(data.event);

          // Pegando a URL completa do QR Code
          if (data.qr_code_url) {
            const fullQrCodeUrl = `http://127.0.0.1:8000${data.qr_code_url}`;
            console.log("📌 URL completa do QR Code:", fullQrCodeUrl);
            setQrCode(fullQrCodeUrl);
          } else {
            console.error("🚨 QR Code não encontrado na resposta.");
            setErrorMessage("QR Code não disponível.");
          }
        } else {
          console.error("❌ Erro ao buscar QR Code.");
          setErrorMessage("Erro ao buscar QR Code.");
        }
      } catch (error) {
        console.error("❌ Erro ao buscar QR Code:", error);
        setErrorMessage("Erro ao buscar o QR Code.");
      }
    };

    fetchQrCode();
  }, [enrollmentId]);

  const handleProfile = () => {
    console.log("👤 Acessando perfil...");
    navigate("/profile");
  };

  const handleLogout = () => {
    console.log("🚪 Saindo da conta...");
    localStorage.clear();
    navigate("/login");
  };

  const handleMeusEventos = () => {
    console.log("📋 Acessando Meus Eventos...");
    navigate("/meus-eventos");
  };

  const handleCertificate = () => {
    console.log("📜 Acessando certificados...");
    navigate("/certificados");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">SISGEHC</h1>
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
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/dashboard-student")}>
                  Eventos
                </li>
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

      {/* Corpo */}
      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row justify-between">
        {/* Informações do evento */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            {evento ? evento.title : "Nome do evento"}
          </h2>
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="text-gray-600">📅 {evento ? evento.dates[0]?.day : "Data"}</p>
            <p className="text-gray-600">📍 {evento ? evento.location : "Local"}</p>
            <p className="text-gray-600">⏰ {evento ? evento.dates[0]?.start_time + " - " + evento.dates[0]?.end_time : "Horário"}</p>
          </div>
          
          <h3 className="text-lg font-bold text-gray-700 mb-2">Descrição</h3>
          <p className="text-gray-600 mb-4">
            {evento ? evento.description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio."}
          </p>
          <p className="text-gray-600">⏳ {evento ? evento.slots + " vagas disponíveis" : "20h"}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center items-center">
          {qrCode ? (
            <img src={qrCode} alt="QR Code" className="border border-gray-300 rounded-md p-2 w-40 h-40"/>
          ) : (
            <p className="text-gray-500">Carregando QR Code...</p>
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

export default Presenca;




