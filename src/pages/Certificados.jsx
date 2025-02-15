import React from "react";
import { useNavigate } from "react-router-dom";

const Certificados = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Enviar Certificado</h2>
      <p>Aqui o aluno pode enviar seus certificados.</p>
      <button onClick={() => navigate("/dashboard-aluno")} style={{ marginTop: "20px" }}>
        Voltar ao Dashboard
      </button>
    </div>
  );
};

export default Certificados;
