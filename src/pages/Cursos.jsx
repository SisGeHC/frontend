import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/courses/courses/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar cursos");
        }

        const data = await response.json();
        setCursos(data);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    };

    fetchCursos();
  }, []);

  const handleInscricao = async (cursoId) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://127.0.0.1:8000/api/courses/courses/${cursoId}/enroll/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao se inscrever no curso");
      }

      setMensagem("Inscrição realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao se inscrever no curso:", error);
      setMensagem("Erro ao se inscrever. Tente novamente.");
    }
  };

  return (
    <div>
      <h2>Escolha um Curso</h2>

      {mensagem && <p>{mensagem}</p>}

      <ul>
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <li key={curso.id}>
              <strong>{curso.name}</strong>
              <p>{curso.description}</p>
              <button onClick={() => handleInscricao(curso.id)}>Inscrever-se</button>
            </li>
          ))
        ) : (
          <p>Nenhum curso disponível</p>
        )}
      </ul>
      {/* Botão para voltar ao Dashboard */}
      <button onClick={() => navigate("/dashboard-aluno")} style={{ marginTop: "20px" }}>
        Voltar ao Dashboard
      </button>
    </div>
  );
};

export default Cursos;
