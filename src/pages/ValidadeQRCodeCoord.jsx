import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";



const ValidateQRCodeCoord = () => {
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
  
    const handleScan = async (data) => {
        if (data) {
            console.log("📸 QR Code escaneado:", data);
    
            const enrollmentId = data.text.split(":")[1]; 
    
            if (!enrollmentId) {
                setErrorMessage("QR Code inválido!");
                return;
            }
    
            try {
                const token = localStorage.getItem("token");
    
                const response = await fetch(
                    `http://127.0.0.1:8000/enrollments/validate-attendance/${enrollmentId}/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Token ${token}`,
                        }
                    }
                );
    
                const responseData = await response.json();
    
                if (response.ok) {
                    setResult(responseData);
                    setErrorMessage(null);
                } else {
                    setErrorMessage(responseData.error || "Erro ao validar QR Code.");
                    setResult(null);
                }
            } catch (error) {
                setErrorMessage("Erro ao validar QR Code.");
                setResult(null);
            }
        }
    };
    

    const handleError = (err) => {
        console.error("Erro ao escanear QR Code:", err);
        setErrorMessage("Erro ao acessar a câmera.");
    };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Validar Presença</h2>

      {/* Scanner do QR Code */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          onLoad={() => console.log("Câmera carregada")}
          style={{ width: "100%" }}
        />
      </div>

      {/* Exibir resultado */}
      {result && (
        <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-md w-full max-w-md">
          <h3 className="text-lg font-bold">✅ Presença Confirmada</h3>
          <p><strong>Aluno:</strong> {result.student}</p>
          <p><strong>Evento:</strong> {result.event}</p>
          <p><strong>Data:</strong> {result.date}</p>
          <p><strong>Local:</strong> {result.location}</p>
        </div>
      )}

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
          <h3 className="text-lg font-bold">❌ Erro</h3>
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard-coordinator")}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
      >
        Voltar ao Início
      </button>
    </div>
  );
};

export default ValidateQRCodeCoord;