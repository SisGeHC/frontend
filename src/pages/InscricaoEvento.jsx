import React, { useState } from "react";

const InscricaoEvento = ({ selectedEvento }) => {
  const [confirmationCode, setConfirmationCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!selectedEvento) {
    return <p>Selecione um evento para se inscrever.</p>;
  }

  const handleInscricao = async () => {
    const studentId = localStorage.getItem("role_id");
    const token = localStorage.getItem("token");
  
    if (!studentId) {
      alert("Erro: Aluno não identificado.");
      return;
    }
  
    try {
      console.log("📡 Buscando dados do estudante...");
  
      const studentResponse = await fetch(`http://127.0.0.1:8000/students/${studentId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      });
  
      if (!studentResponse.ok) {
        const errorData = await studentResponse.json();
        console.error("❌ Erro no GET /students/{id}/:", errorData);
        throw new Error("Erro ao buscar dados do estudante.");
      }
  
      const studentData = await studentResponse.json();
      const studentIdReal = studentData.id;
      console.log("✅ ID do estudante obtido:", studentIdReal);
  
      const checkResponse = await fetch(
        `http://127.0.0.1:8000/events/student/${studentIdReal}/enrolled/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        }
      );
  
      if (!checkResponse.ok) {
        throw new Error("Erro ao verificar inscrições.");
      }
  
      const inscritos = await checkResponse.json();
      const eventosInscritos = inscritos.map(evento => evento.id);
  
      if (eventosInscritos.includes(selectedEvento.id)) {
        alert("⚠️ Você já está inscrito neste evento!");
        return;
      }
  
      console.log("✅ Não está inscrito, realizando inscrição...");
  
      const response = await fetch("http://127.0.0.1:8000/enrollments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          student: studentIdReal,
          event: selectedEvento.id,
          attended: false,
        }),
      });
  
      if (!response.ok) {
        console.error("❌ Erro ao se inscrever:", await response.text());
        alert("❌ Erro ao se inscrever no evento.");
        return;
      }
  
      const contentType = response.headers.get("Content-Type");
  
      if (contentType && contentType.includes("application/json")) {
        const enrollmentData = await response.json();
        console.log("✅ Inscrição realizada com sucesso!", enrollmentData);
  
        setConfirmationCode(enrollmentData.confirmation_code);
      } else if (contentType && contentType.includes("image/png")) {
        const blob = await response.blob();
        const qrCodeUrl = URL.createObjectURL(blob);
        console.log("✅ QR Code recebido:", qrCodeUrl);
  
        setConfirmationCode(qrCodeUrl);
        alert("✅ Inscrição realizada com sucesso!");
      } else {
        console.error("❌ Tipo de resposta inesperado:", contentType);
        alert("Erro ao processar resposta do servidor.");
      }
    } catch (error) {
      console.error("❌ Erro ao se inscrever:", error);
      setErrorMessage("Erro ao se inscrever no evento.");
    }
  };
  

  return (
    <div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleInscricao}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Inscrever-se
        </button>
      </div>

      {confirmationCode && (
        <div>
        </div>
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default InscricaoEvento;