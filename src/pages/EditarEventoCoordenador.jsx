import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarEventoCoord = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    creator: 0,
    dates: [],
    slots: 50,
  });

  const [dateData, setDateData] = useState({
    id: null,
    day: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    const fetchEvento = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://127.0.0.1:8000/events/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar evento: ${response.status}`);
        }

        const data = await response.json();
        console.log("📌 Dados do evento carregados:", data);

        setEventData({
          title: data.title,
          description: data.description,
          location: data.location,
          category: data.category,
          creator: data.creator.id || 0,
          dates: data.dates.map((date) => date.id),
          slots: data.slots,
        });

        if (data.dates.length > 0) {
          const originalDate = data.dates[0].day;
          const [day, month, year] = originalDate.split("/");
          const formattedDate = `${year}-${month}-${day}`;

          console.log("📅 Data formatada para input:", formattedDate);

          setDateData({
            id: data.dates[0].id,
            day: formattedDate,
            start_time: data.dates[0].start_time,
            end_time: data.dates[0].end_time,
          });
        } else {
          console.warn("⚠️ Nenhuma data encontrada para esse evento!");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar evento:", error);
      }
    };

    fetchEvento();
  }, [id]);

  // 🔥 Função para deletar o evento
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/events/${id}/delete/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar evento: ${response.status}`);
      }

      alert("✅ Evento deletado com sucesso!");
      navigate("/dashboard-coordinator"); 
    } catch (error) {
      console.error("❌ Erro ao deletar evento:", error);
      alert("Erro ao deletar evento.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔥 Função para salvar o evento atualizado
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (dateData.id) {
        const dateResponse = await fetch(`http://127.0.0.1:8000/events/dates/${dateData.id}/update/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
          body: JSON.stringify({
            day: dateData.day,
            start_time: dateData.start_time,
            end_time: dateData.end_time,
          }),
        });

        if (!dateResponse.ok) {
          throw new Error(`Erro ao atualizar data: ${dateResponse.status}`);
        }
      }

      const eventResponse = await fetch(`http://127.0.0.1:8000/events/${id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!eventResponse.ok) {
        throw new Error(`Erro ao atualizar evento: ${eventResponse.status}`);
      }

      alert("✅ Evento atualizado com sucesso!");
      navigate("/dashboard-coordinator");
    } catch (error) {
      console.error("❌ Erro ao atualizar evento:", error);
      alert("Erro ao atualizar evento.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">SISGEHC</h1>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
            👤
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                onClick={() => navigate("/profile-coordenador")}>Minha Conta</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Eventos</li>
                <li onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Editar evento</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="flex flex-col space-y-4">
            <input type="text" name="title" value={eventData.title} className="p-3 border rounded" readOnly />
            <textarea name="description" value={eventData.description} className="p-3 border rounded h-24" readOnly />
            <input type="text" name="location" value={eventData.location} className="p-3 border rounded" readOnly />
          </div>

          <div className="flex flex-col space-y-4">
            <input type="number" name="slots" value={eventData.slots} className="p-3 border rounded" readOnly />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" name="day" value={dateData.day} className="p-3 border rounded" readOnly />
              <input type="time" name="start_time" value={dateData.start_time} className="p-3 border rounded" readOnly />
              <input type="time" name="end_time" value={dateData.end_time} className="p-3 border rounded" readOnly />
            </div>
          </div>

          <div className="col-span-2 flex justify-between mt-6">
            <button onClick={() => navigate("/dashboard-coordinator")} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400">
              Voltar
            </button>
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              Salvar
            </button>
            <button 
                type="button"  
                onClick={() => setShowDeleteModal(true)} 
                className="bg-red-300 text-red-600 text-xl font-bold px-6 py-3 border border-red-600 rounded-lg hover:bg-red-400 transition"
                >
                Excluir Evento
                </button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold text-green-700 mb-4">Aviso</h3>
            <p className="text-gray-700 text-center mb-6">Você deseja excluir esse evento?</p>
            <div className="flex justify-between">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 px-4 py-2 rounded-lg">Cancelar</button>
              <button onClick={handleDelete} className="bg-gray-600 text-black px-4 py-2 rounded-lg">Deletar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarEventoCoord;