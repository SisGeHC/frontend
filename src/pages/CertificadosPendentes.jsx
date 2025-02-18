import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CertificadosPendentes = () => {
  const [certificadosPendentes, setCertificadosPendentes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch("http://127.0.0.1:8000/certificates/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar certificados pendentes.");

        const data = await response.json();
        console.log("📜 Certificados recebidos:", data);

        const certificadosPendentes = data.filter(cert => cert.status === "pending");
        setCertificadosPendentes(certificadosPendentes);
      } catch (error) {
        console.error("Erro ao buscar certificados:", error);
      }
    };

    fetchCertificados();
  }, []);

  const handleApprove = async (id) => {
    await updateCertificateStatus(id, "approved");
  };

  const handleReject = async (id) => {
    await updateCertificateStatus(id, "rejected");
  };

  const updateCertificateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const response = await fetch(`http://127.0.0.1:8000/certificates/${id}/update/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar certificado.");

      setCertificadosPendentes(prev => prev.filter(cert => cert.id !== id));
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar certificado:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">SISGEHC</h1>
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
                  Meus Eventos
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/lista-alunos")}>
                  Alunos
                </li>
                <li onClick={() => navigate("/lista-professores")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
      </header>

      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <div className="text-2xl font-semibold mb-6 bg-zinc-200 p-4 rounded" 
        
      ><h2 className="text-2xl font-semibold mb-6 bg-zinc-200 p-4 rounded">Certificados Pendentes</h2></div>


  <div className="space-y-4">
        {certificadosPendentes.length > 0 ? (
          certificadosPendentes.map(cert => (
            <div key={cert.id} className="bg-gray-200 p-4 rounded-lg flex flex-col sm:flex-row gap-2">
              <span className="font-bold w-full sm:w-auto">Aluno: {cert.student.full_name}</span>
              <span className="text-gray-600 w-full sm:w-auto">📅 Data: {new Date(cert.created_at).toLocaleDateString()}</span>
              <span className="text-gray-600 w-full sm:w-auto">📄 
                <a href={cert.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Ver Certificado</a>
              </span>
              <div className="flex gap-2 mt-2 sm:ml-4 sm:mt-0">
                <button onClick={() => { setSelectedCertificate(cert); setModalOpen(true); }} className="bg-green-500 text-white px-4 py-2 rounded">Validar</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Nenhum certificado pendente.</p>
        )}
      </div>
    </div>

    {modalOpen && selectedCertificate && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center relative w-96">
          <button onClick={() => setModalOpen(false)} className="right-2 text-gray-600 text-xl cursor-pointer">✖</button>
          <h2 className="text-xl font-bold text-green-600 mt-2">Aprovar Certificado?</h2>
          <p className="mt-2">Você deseja aprovar esse certificado? Insira a quantidade de horas que o aluno receberá:</p>
          
          {/* Campo de entrada para horas */}
          <input
            type="number"
            min="0"
            placeholder="Horas concedidas"
            className="mt-4 p-2 border border-gray-300 rounded"
            onChange={(e) => setSelectedCertificate({
              ...selectedCertificate,
              hours: e.target.value, // Atualiza o valor de horas
            })}
            value={selectedCertificate.hours || ""}
          />

          <div className="flex justify-center gap-4 mt-4">
            <button onClick={() => handleReject(selectedCertificate.id)} className="bg-red-500 text-white px-4 py-2 rounded">Rejeitar</button>
            <button 
              onClick={() => handleApprove(selectedCertificate.id)} 
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Aprovar
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
};

export default CertificadosPendentes;

