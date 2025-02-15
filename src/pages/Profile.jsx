import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const [aluno, setAluno] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
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
          throw new Error("Erro ao buscar perfil");
        }

        const data = await response.json();
        setAluno(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/api/users/update/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      setMensagem("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMensagem("Erro ao atualizar. Tente novamente.");
    }
  };

  const handleDelete = async () => {
    if (!aluno) return;
    const confirmacao = window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.");
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/api/users/users/${aluno.id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir conta");
      }

      alert("Conta excluída com sucesso!");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      setMensagem("Erro ao excluir conta. Tente novamente.");
    }
  };

  return (
    <div>
      <h2>Meu Perfil</h2>

      {mensagem && <p>{mensagem}</p>}

      {aluno ? (
        <form onSubmit={handleUpdate}>
          <label>Nome:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <label>Sobrenome:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />

          <label>Usuário:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <button type="submit">Atualizar Perfil</button>
        </form>
      ) : (
        <p>Carregando perfil...</p>
      )}

      <button onClick={() => navigate("/dashboard-aluno")} style={{ marginTop: "20px" }}>
        Voltar ao Dashboard
      </button>

      <button onClick={handleDelete} style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}>
        Excluir Conta
      </button>
    </div>
  );
};

export default Perfil;
