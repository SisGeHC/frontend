import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardAluno = () => {
  const [aluno, setAluno] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDadosAluno = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do aluno");
        }

        const data = await response.json();
        setAluno(data);
      } catch (error) {
        console.error("Erro ao buscar os dados do aluno:", error);
      }
    };

    fetchDadosAluno();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div>
      <h2>Bem-vindo, {aluno ? aluno.username : "Aluno"}!</h2>

      {/* Dados do aluno */}
      {aluno && (
        <div>
          <p>Email: {aluno.email}</p>
          <p>Nome Completo: {aluno.first_name} {aluno.last_name}</p>
          <p>Curso: {aluno.curso || "Não cadastrado"}</p>
          <p>Horas Complementares: {aluno.horasComplementares || 0}</p>
        </div>
      )}

      {/* Navegação */}
      <h3>Opções</h3>
      <button onClick={() => navigate("/perfil")}>Ver Perfil</button>
      <button onClick={() => navigate("/cursos")}>Adicionar Curso</button>
      <button onClick={() => navigate("/eventos")}>Ver Eventos</button>
      <button onClick={() => navigate("/certificados")}>Enviar Certificado</button>

      {/* Botão de Logout */}
      <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white", marginTop: "20px" }}>
        Sair
      </button>
    </div>
  );
};

export default DashboardAluno;



