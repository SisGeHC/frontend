import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    console.log("Tentativa de login com:", email, password);  // 🛠 Log para depuração
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      console.log("Resposta da API:", response);  // 🛠 Verifica se há resposta da API
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao fazer login");
      }
  
      const data = await response.json();
      console.log("Login bem-sucedido:", data);  // 🛠 Log para depuração
  
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("role", data.user.role);
  
      switch (data.user.role) {
        case "student":
          navigate("/dashboard-aluno");
          break;
        case "teacher":
          navigate("/dashboard-professor");
          break;
        case "coordinator":
          navigate("/dashboard-coordenador");
          break;
        default:
          navigate("/");
          break;
      }
  
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Senha:
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;