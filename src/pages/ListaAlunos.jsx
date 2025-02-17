import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ListaAlunos = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://127.0.0.1:8000/students/list", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao carregar alunos.");

        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data); // Inicia a lista filtrada com todos os alunos
      } catch (error) {
        console.error("❌ Erro ao buscar alunos:", error);
      }
    };

    fetchStudents();
  }, []);

  // Filtrar alunos conforme o usuário digita na barra de pesquisa
  useEffect(() => {
    const filtered = students.filter((student) =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-green-600 to-green-400 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">SISGEHC</h1>

        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
            👤
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="py-2">
                <li onClick={() => navigate("/profile-coordenador")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Minha Conta
                </li>
                <li onClick={() => navigate("/dashboard-coordinator")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Meus Eventos
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Alunos</li>
                <li onClick={() => navigate("/lista-professores")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Professores
                </li>
                <li onClick={() => navigate("/certificados")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Certificados
                </li>
                <li onClick={() => navigate("/login")} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md w-3/5">
        <h2 className="text-2xl font-semibold mb-4">Alunos</h2>

        {/* Barra de pesquisa */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Pesquisar alunos"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-3 text-gray-400">🔍</span>
        </div>

        {/* Lista de alunos */}
        <div className="overflow-y-auto max-h-96 border rounded-lg">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="px-4 py-3 border-b bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
                onClick={() => navigate(`/alunos/${student.id}`)}
              >
                {student.full_name}
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">Nenhum aluno encontrado.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center p-4 mt-6 w-full">
        <p>Sistema criado para fins acadêmicos</p>
        <p>Governo do Estado do Ceará</p>
        <p>Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
};

export default ListaAlunos;
