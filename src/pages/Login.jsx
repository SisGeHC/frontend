import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let userId = null;
  let userType = "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const userData = {
      email: email,
      password: password,
    };
  
    console.log("📤 Enviando para API:", userData);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/authentication/api-token-auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const responseData = await response.json();
      console.log("🔍 Resposta da API:", responseData);
  
      if (!response.ok) {
        throw new Error("Erro ao fazer login");
      }
  
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user_id", responseData.user_id);
      localStorage.setItem("username", responseData.username);
      localStorage.setItem("user_type", responseData.user_type);
      localStorage.setItem("email", responseData.email);
      localStorage.setItem("role_id", responseData.role_id);
  
      console.log("✅ Login bem-sucedido! Redirecionando...");
  
      switch (responseData.user_type) {
        case "student":
          navigate("/dashboard-student");
          break;
        case "professor":
          navigate("/dashboard-professor");
          break;
        case "coordinator":
          navigate("/dashboard-coordinator");
          break;
        default:
          console.error("❌ Tipo de usuário desconhecido:", responseData.user_type);
      }
  
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-green-700">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <label className="block text-gray-700 font-medium">E-mail:</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <label className="block text-gray-700 font-medium">Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-1 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Não possui uma conta?{" "}
          <button
            type="button"
            className="text-green-600 hover:text-green-800 font-medium"
            onClick={() => navigate("/register")}
          >
            Criar Conta
          </button>
        </p>
      </div>

      <footer className="mt-8 text-center text-white">
        <p>Sistema criado para fins acadêmicos</p>
        <p>Governo do Estado do Ceará</p>
        <p>Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
};

export default Login;
