import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate()
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student", // Definir padrão
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(userData);
      alert("Registro realizado com sucesso!");
    } catch (error) {
      alert("Erro ao registrar usuário");
    }
  };

  return (
    <div>
        <h2>Crie sua conta</h2>
        <form onSubmit={handleRegister}>
            <fieldset>
            <legend>Informações Pessoais</legend>

            <label>
                Primeiro Nome:
                <input
                type="text"
                name="first_name"
                placeholder="Digite seu primeiro nome"
                onChange={handleChange}
                required
                />
            </label>

            <label>
                Último Nome:
                <input
                type="text"
                name="last_name"
                placeholder="Digite seu último nome"
                onChange={handleChange}
                required
                />
            </label>
            </fieldset>

            <fieldset>
            <legend>Informações da Conta</legend>

            <label>
                Usuário:
                <input
                type="text"
                name="username"
                placeholder="Escolha um nome de usuário"
                onChange={handleChange}
                required
                />
            </label>

            <label>
                Email:
                <input
                type="email"
                name="email"
                placeholder="Digite seu email"
                onChange={handleChange}
                required
                />
            </label>

            <label>
                Senha:
                <input
                type="password"
                name="password"
                placeholder="Crie uma senha segura"
                onChange={handleChange}
                required
                />
            </label>
            </fieldset>

            <button type="submit">Registrar</button>

            <p>Já tem uma conta? 
            <button type="button" onClick={() => navigate("/login")}>
                Faça login
            </button>
            </p>
        </form>
        </div>

  );
};

export default Register;
