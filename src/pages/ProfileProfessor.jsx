import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileProfessor = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Estado para mudar senha
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("role_id");
      const token = localStorage.getItem("token");

      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/professors/${userId}/`, {
          method: "GET",
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Erro ao carregar perfil: ${response.status}`);

        const data = await response.json();

        setUserData({
          name: data.full_name || "Não informado",
          email: data.email || "Não informado",
          password: "********",
          course: data.course_name || "Não informado",  
        });
      } catch (error) {
        console.error("❌ Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/courses/");
        if (!response.ok) throw new Error("Erro ao carregar cursos.");

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    };

    fetchUserProfile();
    fetchCourses();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const openEditModal = (field) => {
    if (!userData) return;
  
    console.log(`🛠️ Abrindo modal para editar: ${field}`);
  
    let valueToEdit;
    if (field === "course") {
      valueToEdit = userData.course?.id || "";
    } else {
      valueToEdit = userData[field] || "";
    }
  
    console.log(`🔹 Valor atual para edição (${field}):`, valueToEdit);
  
    setEditField(field);
    setEditValue(valueToEdit);
    setConfirmPassword("");
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
  };

  const openPasswordModal = () => {
    setIsChangingPassword(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const closePasswordModal = () => {
    setIsChangingPassword(false);
  };

  
  const handleSave = async () => {
    if (!editValue.trim()) {
      alert("O campo não pode estar vazio.");
      return;
    }
  
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("role_id");
  
    if (!userId) {
      alert("Erro: Usuário não encontrado.");
      return;
    }
  
    try {
      let requestBody = {};
  
      // 🔹 Se for atualização do EMAIL
      if (editField === "email") {
        if (!confirmPassword.trim()) {
          alert("Digite sua senha para confirmar.");
          return;
        }
        requestBody = {
          email: editValue,
          password: confirmPassword,
        };
      }
  
      // 🔹 Se for atualização do CURSO, precisamos do NOME e das HORAS COMPLEMENTARES
      else if (editField === "course") {
        const selectedCourse = courses.find((course) => course.id === parseInt(editValue));
        if (!selectedCourse) {
          alert("Curso inválido.");
          return;
        }
  
        console.log("📤 Tentando atualizar curso para:", selectedCourse.name);
  
        requestBody = {
          course: {
            name: selectedCourse.name,
            complementary_hours_needed: selectedCourse.complementary_hours_needed, // 🔥 Adicionando o campo necessário
          },
        };
      }
  
      const response = await fetch(`http://127.0.0.1:8000/professors/${userId}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro ao atualizar:", errorData);
        alert("Erro ao atualizar os dados: " + JSON.stringify(errorData, null, 2));
        return;
      }
  
      const updatedData = await response.json();
      console.log("✅ Atualização bem-sucedida:", updatedData);
  
      setUserData((prevData) => ({
        ...prevData,
        course: updatedData.course, 
      }));
  
      alert("✅ Dados atualizados com sucesso!");
      closeEditModal();
    } catch (error) {
      console.error("❌ Erro ao salvar alteração:", error);
      alert("Erro ao salvar alteração.");
    }
  };
  
  

  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert("Todos os campos são obrigatórios.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("As senhas novas não coincidem.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/authentication/change-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      if (!response.ok) throw new Error("Erro ao alterar senha. Verifique se a senha atual está correta.");

      alert("Senha alterada com sucesso!");
      closePasswordModal();
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">Carregando...</h2>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-red-600">Erro ao carregar dados.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full bg-gradient-to-r from-green-600 to-green-400 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">SISGEHC</h1>

        <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
            👤
        </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Minha Conta</li>
                <li 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                  onClick={() => navigate("/dashboard-professor")}
                >
                  Meus Eventos
                </li>
                <li onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">Sair</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 bg-white p-8 rounded-lg shadow-md w-3/5">
        <h2 className="text-center text-2xl font-semibold mb-6">Minha Conta</h2>

        <div className="space-y-4">
            {["email", "password", "course"].map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <label className="w-1/3 text-gray-600 font-medium">
                  {field === "email" ? "E-mail" : field === "password" ? "Senha" : "Curso"}
                </label>
                
                <input
                  type="text"
                  value={userData[field]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
                
                {/* Corrigindo a referência da função no onClick */}
                <span
                  className="material-icons text-green-500 cursor-pointer"
                  onClick={() => (field === "password" ? openPasswordModal() : openEditModal(field))}
                >
                  ✏️
              </span>
            </div>
          ))}
        </div>
      </div>

      {isChangingPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Alterar Senha</h3>
            
            {/* Campos para Senha Atual, Nova Senha e Confirmação */}
            <input
              type="password"
              placeholder="Senha Atual"
              className="w-full mb-2 p-2 border rounded"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nova Senha"
              className="w-full mb-2 p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar Nova Senha"
              className="w-full mb-4 p-2 border rounded"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            {/* Botões de Cancelar e Salvar */}
            <div className="flex justify-between">
              <button onClick={closePasswordModal} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                Cancelar
              </button>
              <button onClick={handleSavePassword} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditing && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                  <h3 className="text-xl font-semibold mb-4">
                    {editField === "email"
                      ? "Editar e-mail"
                      : editField === "course"
                      ? "Editar curso"
                      : "Editar campo"}
                  </h3>

                  {editField === "email" ? (
                    <>
                      <label className="block text-gray-700">E-mail atual</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 mb-2"
                        value={userData.email}
                        readOnly
                      />

                      <label className="block text-gray-700">Novo e-mail</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />

                      <label className="block text-gray-700">Senha</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                        placeholder="Digite sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </>
                  ) : editField === "course" ? (
                    <>
                      <label className="block text-gray-700">Selecionar Curso</label>
                      <select
                        className="w-full p-2 border rounded mb-4"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      >
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    </>
                  )}

                  <div className="flex justify-between">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                      Cancelar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default ProfileProfessor;