import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MeusEventos = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventosAtivos, setEventosAtivos] = useState([]);
  const [eventosEncerrados, setEventosEncerrados] = useState([]);
  const [matriculasAluno, setMatriculasAluno] = useState([])
  const [abaAtiva, setAbaAtiva] = useState("ativos");
  

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const studentId = Number(localStorage.getItem("role_id"));
        const token = localStorage.getItem("token");

        console.log("🔍 ID do aluno encontrado no localStorage:", studentId);
        console.log("🔑 Token armazenado:", token);

        if (!studentId) {
          console.error("❌ ID do aluno não encontrado.");
          return;
        }

        console.log("📡 Buscando eventos do aluno...");
        const response = await fetch("http://127.0.0.1:8000/enrollments/", {
          headers: {
            "Authorization": `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("❌ Erro ao buscar eventos do aluno.");
        }

        const data = await response.json();
        console.log("📌 Todas as inscrições recebidas:", data);

        // Filtrar apenas as inscrições do aluno logado
        const matriculasAlunoFiltradas = data.filter(matricula => Number(matricula.student) === studentId);
        console.log("🎯 Inscrições do aluno logado:", matriculasAlunoFiltradas);

        // Armazena as matrículas no estado para uso posterior
        setMatriculasAluno(matriculasAlunoFiltradas); // 🔹 Agora está acessível em toda a renderização

        const agora = new Date();
        const ativos = [];
        const encerrados = [];

        matriculasAlunoFiltradas.forEach(matricula => {
          const evento = matricula.event;
          const { day, end_time } = evento.dates[0];

          console.log(`📅 Processando evento: ${evento.title} - Data: ${day}, Fim: ${end_time}`);

          const horaFimFormatada = end_time.length === 5 ? `${end_time}:00` : end_time;
          const dataFim = new Date(`${day}T${horaFimFormatada}`);
          const dataFimSomenteDia = new Date(dataFim.setHours(0, 0, 0, 0));

          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          if (dataFimSomenteDia < hoje) {
            console.log(`🔴 Evento encerrado: ${evento.title}`);
            encerrados.push({ ...evento, status: "encerrado" });
          } else {
            console.log(`🟢 Evento ativo: ${evento.title}`);
            ativos.push({ ...evento, status: "ativo" });
          }
        });

        console.log("✅ Eventos ativos:", ativos);
        console.log("✅ Eventos encerrados:", encerrados);

        setEventosAtivos(ativos);
        setEventosEncerrados(encerrados);
      } catch (error) {
        console.error("🚨 Erro ao carregar eventos:", error);
      }
    };

    fetchEventos();
  }, []);


  // Função para redirecionar para a página de detalhes
  const verDetalhes = (enrollmentId) => {
    if (!enrollmentId) {
      console.error("❌ ERRO: Tentando acessar a presença sem um ID de matrícula válido!");
      return;
    }
    console.log(`🔍 Redirecionando para detalhes da matrícula ID: ${enrollmentId}`);
    navigate(`/presenca/${enrollmentId}`); // Passando o ID correto na URL
  };
  

  const handleProfile = () => {
    console.log("👤 Acessando perfil...");
    navigate("/profile");
  };

  const handleLogout = () => {
    console.log("🚪 Saindo da conta...");
    localStorage.clear();
    navigate("/login");
  };

  const handleMeusEventos = () => {
    console.log("📋 Acessando Meus Eventos...");
    navigate("/meus-eventos");
  };

  const handleCertificate = () => {
    console.log("📜 Acessando certificados...");
    navigate("/certificados");
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
                <li onClick={handleProfile} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Minha Conta</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/dashboard-student")}>
                  Eventos
                </li>
                <li onClick={handleMeusEventos} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Meus Eventos</li>
                <li onClick={handleCertificate} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Meus Certificados
                </li>
                <li onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">Sair</li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Meus eventos</h2>

        {/* Aba de seleção */}
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

        {/* Lista de eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(abaAtiva === "ativos" ? eventosAtivos : eventosEncerrados).length > 0 ? (
            (abaAtiva === "ativos" ? eventosAtivos : eventosEncerrados).map((evento) => {
              // 🔹 Busca a matrícula correspondente ao evento
              const matricula = matriculasAluno.find(m => m.event.id === evento.id);

              return (
                <div key={evento.id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-lg font-bold">{evento.title}</h3>
                  <p className="text-sm text-gray-600">📅 {evento.dates[0]?.day}</p>
                  <p className="text-sm text-gray-600">📍 {evento.location}</p>
                  <p className="text-sm text-gray-600">⏰ {evento.dates[0]?.start_time} - {evento.dates[0]?.end_time}</p>
                  <p className="text-sm text-gray-600">Status: {evento.status === "ativo" ? "Ativo" : "Encerrado"}</p>

                  {/* Verificação antes de chamar verDetalhes */}
                  <button
                    onClick={() => {
                      if (matricula && matricula.id) {
                        console.log(`🔍 Navegando para /presenca/${matricula.id}`);
                        verDetalhes(matricula.id);
                      } else {
                        console.warn(`⚠️ Matrícula não encontrada para evento ID: ${evento.id}`);
                      }
                    }}
                    className={`mt-4 w-full py-2 rounded-lg ${matricula ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    disabled={!matricula}
                  >
                    {matricula ? "Ver detalhes" : "Matrícula não encontrada"}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center w-full">Nenhum evento encontrado.</p>
          )}
        </div>


      </div>
    </div>
  );
};

export default MeusEventos;









