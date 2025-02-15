import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MeusEventos = () => {
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeusEventos = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch("http://127.0.0.1:8000/api/eventos/inscritos/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar seus eventos");
        }

        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error("Erro ao buscar seus eventos:", error);
      }
    };

    fetchMeusEventos();
  }, []);

  return (
    <div>
      <h2>Meus Eventos</h2>
      <ul>
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <li key={evento.id}>
              <strong>{evento.nome}</strong> - {evento.data}
            </li>
          ))
        ) : (
          <p>Você não está inscrito em nenhum evento</p>
        )}
      </ul>

      <button onClick={() => navigate("/dashboard-aluno")} style={{ marginTop: "20px" }}>
        Voltar ao Dashboard
      </button>
    </div>
  );
};

export default MeusEventos;
