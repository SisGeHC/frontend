import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalAprovacao from "./ModalAprovacao";

const CertificadosAluno = () => {
  const { id } = useParams();
  const [certificados, setCertificados] = useState([]);
  const [aluno, setAluno] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [certificadoSelecionado, setCertificadoSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/certificates/`);
        if (!response.ok) throw new Error("Erro ao buscar certificados.");

        const data = await response.json();
        const certificadosAluno = data.filter(cert => cert.student.id === parseInt(id));
        
        setCertificados(certificadosAluno);
        if (certificadosAluno.length > 0) setAluno(certificadosAluno[0].student);
      } catch (error) {
        console.error("Erro ao buscar certificados:", error);
      }
    };

    fetchCertificados();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">SISGEHC</h1>
        <button className="text-white text-lg" onClick={() => navigate("/certificados")}>Voltar</button>
      </header>

      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        {aluno ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">Certificados de {aluno.full_name}</h2>
            <p className="text-gray-600">📧 {aluno.email}</p>

            <div className="mt-6 space-y-4">
              {certificados.map(cert => (
                <div key={cert.id} className="bg-gray-200 p-4 rounded-lg flex justify-between items-center">
                  <span className="font-bold">Certificado {cert.id}</span>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      setCertificadoSelecionado(cert);
                      setModalAberto(true);
                    }}
                  >
                    Visualizar
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">Nenhum certificado encontrado.</p>
        )}
      </div>

      {modalAberto && (
        <ModalAprovacao
          certificado={certificadoSelecionado}
          onClose={() => setModalAberto(false)}
        />
      )}
    </div>
  );
};

export default CertificadosAluno;