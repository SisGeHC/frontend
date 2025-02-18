import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalSubmeterHoras from "./ModalSubmeterHoras";

const Certificados = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("approved"); // Inicializando com "approved"
  const [menuOpen, setMenuOpen] = useState(false);
  const [certificados, setCertificados] = useState([]);
  const studentId = localStorage.getItem("role_id"); // ID do estudante logado

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/certificates/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar certificados.");
        }

        const data = await response.json();
        console.log("📜 Certificados recebidos:", data);

        // Filtrar certificados do aluno logado
        const certificadosAluno = data.filter(cert => cert.student.id === parseInt(studentId));
        console.log("🔍 Certificados filtrados para o aluno logado:", certificadosAluno);

        setCertificados(certificadosAluno);
      } catch (error) {
        console.error("❌ Erro ao carregar certificados:", error);
      }
    };

    fetchCertificates();
  }, [studentId]);

  const handleTabChange = (tab) => {
    console.log("📂 Mudando para a aba:", tab); // Log para ver se o valor de tab está correto
    setActiveTab(tab);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleMeusEventos = () => {
    console.log("🚪 Meu Eventos...");
    navigate("/meus-eventos");
  };

  const previewCertificate = (certificateId) => {
    const url = `http://127.0.0.1:8000/certificates/${certificateId}/preview/`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Barra superior */}
      <div className="w-full bg-gradient-to-r from-green-600 to-green-400 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">SISGEHC</h1>

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
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Certificados</li>
                <li onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Botão de Submeter Horas */}
      <div>
        <button
          onClick={() => setModalOpen(true)}
          style={{ position: "absolute", top: "90px", right: "240px" }}
        >
          <span className="text-4xl text-gray-300">📄</span><br />
          <span className="mt-1 text-sm text-black font-semibold">Submeter Horas</span>
        </button>
        <ModalSubmeterHoras isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>

      {/* Tabs */}
      <div className="w-full flex flex-col items-start px-16 mt-4 mb-10">
        <h2 className="text-2xl font-semibold">Horas Complementares</h2>
        <div className="flex mt-2 border-b-2 border-gray-300">
          <button
            className={`px-4 py-2 text-lg font-medium transition ${
              activeTab === "approved"
                ? "border-b-4 border-green-500 text-green-500 font-bold bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("approved")}
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

      {/* Lista de Certificados */}
      <div className="w-full flex justify-start px-16">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {certificados
            .filter(cert => cert.status === activeTab) // Filtra pelo status ativo
            .map(cert => {
              console.log("🎓 Exibindo certificado:", cert); // Log para ver o conteúdo de cada certificado

              return (
                <div key={cert.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold">Certificado #{cert.id}</h3>
                  <p className="text-gray-600">📅 Data: {new Date(cert.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-600">⏳ Carga horária: {cert.hours_taken}h</p>
                  <p className="text-gray-600">📚 Horas Complementares: {cert.student.complementary_hours}</p>
                  <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-600 w-full sm:w-auto">📄 
                  <a href={cert.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                     Ver Certificado
                   </a>
                  </span>
                    <span
                      className={`px-3 py-1 text-sm rounded-lg ${
                        cert.status === "approved"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {cert.status === "approved" ? "Aprovado" : "Pendente"}
                    </span>
                  </div>
                </div>
              );
            })}
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











