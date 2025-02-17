import React, { useState } from "react";

const DetalhesEvento = ({ evento, onClose }) => {
  const [abaAtiva, setAbaAtiva] = useState("geral");

  if (!evento) return null; // Se não houver evento, não renderiza nada

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-2/5">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{evento.title}</h2>
            <p className="text-sm">{evento.creator} - {evento.category}</p>
          </div>
          <button onClick={onClose} className="text-white text-2xl">✖</button>
        </div>

        {/* Navegação entre abas */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-semibold ${abaAtiva === "geral" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            onClick={() => setAbaAtiva("geral")}
          >
            Informações gerais
          </button>
          <button
            className={`px-4 py-2 font-semibold ml-4 ${abaAtiva === "avisos" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            onClick={() => setAbaAtiva("avisos")}
          >
            Avisos
          </button>
        </div>

        {/* Conteúdo da aba ativa */}
        <div className="p-6">
          {abaAtiva === "geral" ? (
            <div>
              <h3 className="text-lg font-semibold">Descrição</h3>
              <p className="text-gray-600 mb-4">{evento.description}</p>

              <div className="text-gray-700 space-y-2">
                <p>📅 <strong>Data:</strong> {evento.dates[0]?.day}</p>
                <p>📍 <strong>Local:</strong> {evento.location}</p>
                <p>⏰ <strong>Horário:</strong> {evento.dates[0]?.start_time} - {evento.dates[0]?.end_time}</p>
                <p>🔖 <strong>Categoria:</strong> {evento.category}</p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold">Avisos</h3>
              <p className="text-gray-600">Nenhum aviso disponível no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesEvento;

