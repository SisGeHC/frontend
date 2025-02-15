import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetalhesEvento = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/eventos/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar detalhes do evento");
        }

        const data = await response.json();
        setEvento(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do evento:", error);
      }
    };

    fetchEvento();
  }, [id]);

  return (
    <div>
      <h2>Detalhes do Evento</h2>
      {evento ? (
        <div>
          <p><strong>Nome:</strong> {evento.nome}</p>
          <p><strong>Data:</strong> {evento.data}</p>
          <p><strong>Descrição:</strong> {evento.descricao}</p>
        </div>
      ) : (
        <p>Carregando detalhes...</p>
      )}
      <button onClick={() => navigate("/eventos")}>Voltar</button>
      <button onClick={() => navigate("/dashboard-aluno")} style={{ marginTop: "20px" }}>
        Voltar ao Dashboard
      </button>
    </div>
  );
};

export default DetalhesEvento;
