import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = ({ onSuccess }) => {
  const [error, setError] = useState(null);

  // Função chamada quando o QR Code é lido com sucesso
  const handleScan = (data) => {
    if (data) {
      console.log("QR Code lido com sucesso:", data);
      onSuccess(data); // Passa o QR Code lido para a função onSuccess
    }
  };

  // Função chamada quando ocorre algum erro
  const handleError = (err) => {
    setError(err);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-semibold mb-4">Escanear QR Code</h2>
      {error && <p className="text-red-500">Erro ao ler QR Code: {error}</p>}
      
      {/* Componente de leitura do QR Code */}
      <QrReader
        delay={300}
        style={{ width: '100%', maxWidth: 400 }}
        onScan={handleScan}
        onError={handleError}
      />
    </div>
  );
};

export default QRCodeScanner;