import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado do formulário
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    course: "",
    userType: "student", // Valor padrão
  });

  // Buscar cursos disponíveis
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

  // Atualizar estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: name === "course" ? parseInt(value, 10) : value,
    });
  };

  // Atualizar o tipo de usuário
  const handleUserTypeChange = (e) => {
    setUserData({
      ...userData,
      userType: e.target.value,
    });
  };

  // Enviar dados do cadastro
  const handleRegister = async (e) => {
    e.preventDefault();

    // Definir a URL correta de acordo com o tipo de usuário
    let apiUrl;
    if (userData.userType === "student") {
      apiUrl = "http://127.0.0.1:8000/students/create";
    } else if (userData.userType === "teacher") {
      apiUrl = "http://127.0.0.1:8000/professors/create";
    } else {
      apiUrl = "http://127.0.0.1:8000/coordinators/create";
    }

    // Criar o objeto de requisição correto
    const requestData = {
      username: userData.username.trim(),
      password: userData.password.trim(),
      email: userData.email.trim(),
      first_name: userData.first_name.trim(),
      last_name: userData.last_name.trim(),
    };

    // Se for aluno ou professor, adiciona o curso
    if (userData.userType !== "coordinator") {
      requestData.course = userData.course;
    }

    console.log("🔍 Enviando para API:", requestData);

    if (!requestData.username || !requestData.password || !requestData.email || 
        !requestData.first_name || !requestData.last_name || 
        (userData.userType !== "coordinator" && !requestData.course)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
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
          {/* Campos de entrada */}
          <input type="text" name="username" placeholder="Usuário" onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="password" name="password" placeholder="Senha" onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="text" name="first_name" placeholder="Primeiro Nome" onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="text" name="last_name" placeholder="Último Nome" onChange={handleChange} className="w-full p-3 border rounded" required />

          {/* Seleção do tipo de usuário */}
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="userType" value="student" checked={userData.userType === "student"} onChange={handleUserTypeChange} className="hidden" />
              <span className={`w-5 h-5 inline-block border-2 rounded-full ${userData.userType === "student" ? "bg-green-500 border-green-500" : "border-gray-400"}`}></span>
              <span>Estudante</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="userType" value="teacher" checked={userData.userType === "teacher"} onChange={handleUserTypeChange} className="hidden" />
              <span className={`w-5 h-5 inline-block border-2 rounded-full ${userData.userType === "teacher" ? "bg-blue-500 border-blue-500" : "border-gray-400"}`}></span>
              <span>Professor</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="userType" value="coordinator" checked={userData.userType === "coordinator"} onChange={handleUserTypeChange} className="hidden" />
              <span className={`w-5 h-5 inline-block border-2 rounded-full ${userData.userType === "coordinator" ? "bg-red-500 border-red-500" : "border-gray-400"}`}></span>
              <span>Coordenador</span>
            </label>
          </div>

          {/* Campo de curso apenas para aluno e professor */}
          {userData.userType !== "coordinator" && (
            loading ? (
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
            )
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

