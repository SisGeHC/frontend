import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MeusEventos = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventosAtivos, setEventosAtivos] = useState([]);
  const [eventosEncerrados, setEventosEncerrados] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("ativos");

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const studentId = Number(localStorage.getItem("role_id")); // 🔥 Converte ID para número
        const token = localStorage.getItem("token");
  
        if (!studentId) {
          console.error("ID do aluno não encontrado.");
          return;
        }
  
        console.log("📡 Buscando matrículas do aluno...");
        const response = await fetch("http://127.0.0.1:8000/enrollments/", {
          headers: {
            "Authorization": `Token ${token}`,
          },
        });
  
        console.log("📩 Resposta do GET /enrollments/:", response.status);
  
        if (!response.ok) {
          throw new Error("Erro ao buscar eventos do aluno.");
        }
  
        const data = await response.json();
        console.log("📌 Matrículas recebidas (Estrutura real da resposta):", data);
  
        console.log("🔍 Exemplo de 'student' retornado pela API:", data[0]?.student);
  
        // 🔍 Filtra as matrículas apenas do estudante logado
        const matriculasAluno = data.filter(matricula => Number(matricula.student) === studentId);
        console.log("📌 Matrículas filtradas do aluno:", matriculasAluno);
  
        const agora = new Date();
  
        const ativos = [];
        const encerrados = [];
  
        matriculasAluno.forEach(matricula => {
          const evento = matricula.event;
  
          if (!evento.dates || evento.dates.length === 0) {
            console.warn(`⚠️ Evento '${evento.title}' sem datas registradas.`);
            ativos.push(evento);
            return;
          }
  
          const { day, end_time } = evento.dates[0];
  
          if (!day || typeof day !== "string" || day.length < 10) {
            console.warn(`⚠️ Evento '${evento.title}' com data inválida: ${day}`);
            ativos.push(evento);
            return;
          }
  
          if (!end_time || typeof end_time !== "string" || end_time.length < 5) {
            console.warn(`⚠️ Evento '${evento.title}' com horário de fim inválido: ${end_time}`);
            ativos.push(evento);
            return;
          }
  
          // 🔥 Formatar `end_time` para garantir que tenha segundos
          const horaFimFormatada = end_time.length === 5 ? `${end_time}:00` : end_time;
  
          // 🔥 Criar objeto `Date()` corretamente formatado
          const dataFim = new Date(`${day}T${horaFimFormatada}`);
  
          console.log(`⏳ Verificando evento: ${evento.title} - Fim: ${dataFim} | Agora: ${agora}`);
  
          if (isNaN(dataFim.getTime())) {
            console.error(`❌ Data inválida para o evento '${evento.title}': ${day} ${horaFimFormatada}`);
            ativos.push(evento);
          } else {
            if (dataFim >= agora) {
              ativos.push(evento);
            } else {
              encerrados.push(evento);
            }
          }
        });
  
        console.log("🟢 Eventos Ativos:", ativos);
        console.log("🔴 Eventos Encerrados:", encerrados);
  
        setEventosAtivos(ativos);
        setEventosEncerrados(encerrados);
      } catch (error) {
        console.error("❌ Erro ao carregar eventos:", error);
      }
    };
  
    fetchEventos();
  }, []);
  
  
  
  
  const handleCertificate = () => {
    console.log("Acessando certificados...");
    navigate("/certificados");
  }

  const handleLogout = () => {
    console.log("🚪 Usuário saindo...");
    localStorage.clear();
    navigate("/login");
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
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Minha Conta</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/dashboard-student")}>
                  Eventos
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Eventos</li>
                <li onClick={handleCertificate} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Meus Certificados
                </li>
                <li className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Meus eventos</h2>

        {/* 🔥 Aba de seleção */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-semibold ${abaAtiva === "ativos" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            onClick={() => setAbaAtiva("ativos")}
          >
            Ativos
          </button>
          <button
            className={`px-4 py-2 font-semibold ml-4 ${abaAtiva === "encerrados" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            onClick={() => setAbaAtiva("encerrados")}
          >
            Encerrados
          </button>
        </div>

        {/* 🔥 Lista de eventos (Ativos ou Encerrados) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(abaAtiva === "ativos" ? eventosAtivos : eventosEncerrados).length > 0 ? (
            (abaAtiva === "ativos" ? eventosAtivos : eventosEncerrados).map((evento) => (
              <div key={evento.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-bold">{evento.title}</h3>
                <p className="text-sm text-gray-600">📅 {evento.dates[0]?.day}</p>
                <p className="text-sm text-gray-600">📍 {evento.location}</p>
                <p className="text-sm text-gray-600">⏰ {evento.dates[0]?.start_time} - {evento.dates[0]?.end_time}</p>

                <a href="#" className="text-blue-500 text-sm mt-2 block">Ver ingresso</a>

                <button
                  onClick={() => navigate(`/eventos/detalhes/${evento.id}`)}
                  className="mt-4 bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600"
                >
                  Ver detalhes
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">Nenhum evento encontrado.</p>
          )}
        </div>
      </div>

      <footer className="bg-green-700 text-white text-center p-4 mt-6">
        <p>Sistema criado para fins acadêmicos</p>
        <p>Governo do Estado do Ceará</p>
        <p>Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
};

export default MeusEventos;



