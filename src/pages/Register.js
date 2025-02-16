import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); // Estado para cursos disponíveis
  const [loading, setLoading] = useState(true); // Estado de carregamento dos cursos
  const [error, setError] = useState(null); // Estado de erro ao buscar cursos

  // Estado do formulário
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    course: "", // Inicialmente vazio, será preenchido com o ID do curso
  });

  // 🔥 Buscar cursos disponíveis na API ao carregar a página
  useEffect(() => {
    fetch("http://127.0.0.1:8000/courses/")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar cursos:", error);
        setError("Erro ao carregar cursos. Tente novamente.");
        setLoading(false);
      });
  }, []);

  // Atualizar estado conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Se for o campo de curso, garantir que seja um número inteiro
    setUserData({
      ...userData,
      [name]: name === "course" ? parseInt(value, 10) : value,
    });
  };

  // Enviar os dados de registro
  const handleRegister = async (e) => {
    e.preventDefault();

    const formattedUserData = {
      username: userData.username.trim(),
      password: userData.password.trim(),
      email: userData.email.trim(),
      first_name: userData.first_name.trim(),
      last_name: userData.last_name.trim(),
      course: userData.course, // ✅ Agora garantimos que será um número
    };

    console.log("🔍 Enviando para API:", formattedUserData); // Verifique no console!

    if (!formattedUserData.username || !formattedUserData.password || !formattedUserData.email || 
        !formattedUserData.first_name || !formattedUserData.last_name || !formattedUserData.course) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/students/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro no cadastro:", errorData);
        alert("Erro ao cadastrar: " + JSON.stringify(errorData, null, 2));
        return;
      }

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("❌ Erro ao cadastrar:", error);
      alert("Falha ao cadastrar: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" name="username" placeholder="Usuário" onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="password" name="password" placeholder="Senha" onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="text" name="first_name" placeholder="Primeiro Nome" onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="text" name="last_name" placeholder="Último Nome" onChange={handleChange} className="w-full p-3 border rounded" required />

          {loading ? (
            <p className="text-center text-gray-500">Carregando cursos...</p>
          ) : (
            <select name="course" onChange={handleChange} className="w-full p-3 border rounded" required>
              <option value="">Selecione um curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          )}

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300">
            Criar Conta
          </button>
        </form>

        <p className="text-center mt-4">
          Já possui uma conta? <button className="text-green-600 hover:underline" onClick={() => navigate("/login")}>Entre</button>
        </p>
      </div>
    </div>
  );
};

export default Register;

