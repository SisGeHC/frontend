import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CriarEventoCoord = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Estado do formulário para evento e data
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    creator: parseInt(localStorage.getItem("user_id"), 10) || 0, // ID do criador
    dates: [],
    slots: 50,
  });

  const [dateData, setDateData] = useState({
    day: "",
    start_time: "",
    end_time: "",
  });

  // Atualizar estado conforme o usuário digita (evento)
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: name === "slots" ? parseInt(value, 10) : value,
    });
  };

  // Atualizar estado conforme o usuário digita (data)
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateData({
      ...dateData,
      [name]: value,
    });
  };

  // Criar a data e depois criar o evento
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = parseInt(localStorage.getItem("user_id"), 10);

    if (!token || isNaN(userId)) {
      alert("Usuário não autenticado! Faça login novamente.");
      navigate("/login");
      return;
    }

    if (!eventData.category) {
      alert("Por favor, selecione uma categoria antes de continuar.");
      return;
    }

    try {
      // Criar a data primeiro
      const dateResponse = await fetch("http://127.0.0.1:8000/events/dates/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(dateData),
      });

      if (!dateResponse.ok) {
        const errorData = await dateResponse.json();
        console.error("Erro ao criar data:", errorData);
        alert("Erro ao criar data: " + JSON.stringify(errorData, null, 2));
        return;
      }

      const createdDate = await dateResponse.json();
      const dateId = createdDate.id;

      // Criar o evento com os dados corretos
      const eventResponse = await fetch("http://127.0.0.1:8000/events/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          ...eventData,
          creator: userId,
          dates: [dateId], 
        }),
      });

      if (!eventResponse.ok) {
        const errorData = await eventResponse.json();
        console.error("Erro ao criar evento:", errorData);
        alert("Erro ao criar evento: " + JSON.stringify(errorData, null, 2));
        return;
      }

      alert("Evento criado com sucesso!");
      navigate("/dashboard-coordinator");
    } catch (error) {
      console.error("Erro ao cadastrar evento:", error);
      alert("Erro ao cadastrar evento.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">SISGEHC</h1>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
            👤
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile-coordenador")}>
                  Minha conta
                </li>
                <li onClick={() => navigate("/dashboard-coordinator")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Meus Eventos
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/lista-alunos")}>
                  Alunos
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/lista-professores")}>
                  Professores
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/certificados-pendentes")}>
                  Certificados
                </li>
                <li onClick={() => { localStorage.clear(); navigate("/login"); }} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Formulário */}
      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Cadastro do evento</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="flex flex-col space-y-4">
            <input type="text" name="title" placeholder="Nome do evento" onChange={handleEventChange} className="p-3 border rounded" required />
            
            {/* Campo de seleção de categoria */}
            <select name="category" onChange={handleEventChange} className="p-3 border rounded" required>
              <option value="">Selecione uma categoria</option>
              <option value="Ensino">Ensino</option>
              <option value="Pesquisa">Pesquisa</option>
              <option value="Extensão">Extensão</option>
            </select>

            <textarea name="description" placeholder="Descrição" onChange={handleEventChange} className="p-3 border rounded h-24" required />
          </div>

          {/* Coluna Direita */}
          <div className="flex flex-col space-y-4">
            <input type="text" name="location" placeholder="Local" onChange={handleEventChange} className="p-3 border rounded" required />
            <input type="number" name="slots" placeholder="Vagas" onChange={handleEventChange} className="p-3 border rounded" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" name="day" onChange={handleDateChange} className="p-3 border rounded" required />
              <input type="time" name="start_time" onChange={handleDateChange} className="p-3 border rounded" required />
              <input type="time" name="end_time" onChange={handleDateChange} className="p-3 border rounded" required />
            </div>
          </div>

          {/* Botões */}
          <div className="col-span-2 flex justify-between mt-6">
            <button onClick={() => navigate("/dashboard-coordinator")} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400">
              Cancelar
            </button>
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarEventoCoord;