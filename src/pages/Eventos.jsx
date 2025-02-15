import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/eventos/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar eventos");
        }

        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  const handleInscricao = async (eventoId) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://127.0.0.1:8000/api/eventos/${eventoId}/inscrever/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao se inscrever no evento");
      }

      setMensagem("Inscrição realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao se inscrever no evento:", error);
      setMensagem("Erro ao se inscrever. Tente novamente.");
    }
  };

  return (
    <div>
      <h2>Eventos Disponíveis</h2>

      {mensagem && <p>{mensagem}</p>}

      <ul>
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <li key={evento.id}>
              <strong>{evento.nome}</strong> - {evento.data}
              <p>{evento.descricao}</p>
              <button onClick={() => navigate(`/eventos/${evento.id}`)}>Visualizar Detalhes</button>
              <button onClick={() => handleInscricao(evento.id)}>Inscrever-se</button>
            </li>
          ))
        ) : (
          <p>Nenhum evento disponível</p>
        )}
      </ul>

      <button onClick={() => navigate("/meus-eventos")}>Ver Meus Eventos</button>
      <button onClick={() => navigate("/dashboard-aluno")} style={{ marginTop: "20px" }}>
        Voltar ao Dashboard
      </button>
    </div>
  );
};

export default Eventos;


