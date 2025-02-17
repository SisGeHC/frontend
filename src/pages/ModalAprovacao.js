import React from "react";

const ModalAprovacao = ({ certificado, onClose }) => {
  if (!certificado) return null;

  const handleAprovar = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/certificates/${certificado.id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!response.ok) throw new Error("Erro ao aprovar certificado.");
      alert("Certificado aprovado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao aprovar certificado:", error);
    }
  };

  const handleRejeitar = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/certificates/${certificado.id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (!response.ok) throw new Error("Erro ao rejeitar certificado.");
      alert("Certificado rejeitado.");
      onClose();
    } catch (error) {
      console.error("Erro ao rejeitar certificado:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold">Aprovar Certificado?</h3>
        <p className="text-gray-700 mt-2">Você deseja aprovar este certificado?</p>
        <div className="flex justify-between mt-4">
          <button onClick={handleRejeitar} className="px-4 py-2 bg-red-500 text-white rounded-lg">Rejeitar</button>
          <button onClick={handleAprovar} className="px-4 py-2 bg-green-500 text-white rounded-lg">Aprovar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAprovacao;