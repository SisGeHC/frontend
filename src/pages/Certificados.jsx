import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalSubmeterHoras from "./ModalSubmeterHoras";

const Certificados = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("accepted");
  const [menuOpen, setMenuOpen] = useState(false);
  const [certificados, setCertificados] = useState([]);
  const studentId = parseInt(localStorage.getItem("role_id")); // ID do estudante logado

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("📡 Buscando certificados...");
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

        console.log("🔍 ID do aluno logado:", studentId);

        // Filtrando corretamente pelo ID dentro do objeto student
        const certificadosAluno = data.filter(cert => cert.student.id === studentId);

        console.log("📄 Certificados filtrados do aluno:", certificadosAluno);

        setCertificados(certificadosAluno);
      } catch (error) {
        console.error("Erro ao carregar certificados:", error);
      }
    };

    fetchCertificates();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const previewCertificate = async (certificateId) => {
    const token = localStorage.getItem("token"); // Pegando o token salvo
  
    if (!token) {
      alert("Você precisa estar logado para visualizar o certificado.");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/certificates/${certificateId}/preview/`, {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,  // 🔥 Adiciona o token no cabeçalho
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao carregar o certificado: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("📄 Certificado carregado:", data);
  
      // 🔹 Abrindo a URL do certificado (Se for um PDF/Imagem)
      window.open(data.file, "_blank");
    } catch (error) {
      console.error("❌ Erro ao visualizar certificado:", error);
      alert("Erro ao visualizar o certificado. Verifique seu login e tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Barra superior */}
      <div className="w-full bg-gradient-to-r from-green-600 to-green-400 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">SISGEHC</h1>
      </div>

      {/* Tabs */}
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

      {/* Lista de Certificados */}
      <div className="w-full flex justify-start px-16">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {certificados.length > 0 ? (
            certificados
              .filter(cert => cert.status === activeTab) // Filtra pelo status atual
              .map(cert => (
                <div key={cert.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold">Certificado #{cert.id}</h3>
                  <p className="text-gray-600">📅 Data: {new Date(cert.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-600">⏳ Carga horária: {cert.hours_taken}h</p>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => previewCertificate(cert.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Ver Certificado
                    </button>
                    <span className={`px-3 py-1 text-sm rounded-lg ${
                      cert.status === "accepted" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                    }`}>
                      {cert.status === "accepted" ? "Aprovado" : "Pendente"}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center w-full">Nenhum certificado encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificados;










