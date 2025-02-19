import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileCoordenador = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
        const response = await fetch(`http://127.0.0.1:8000/coordinators/${userId}/`, {
          method: "GET",
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Erro ao carregar perfil: ${response.status}`);

        const data = await response.json();
        setUserData({
          email: data.email || "Não informado",
          password: "********",
        });
      } catch (error) {
        console.error("❌ Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ABRIR MODAL DE EDIÇÃO DE EMAIL
  const openEditModal = () => {
    setIsEditing(true);
    setEditValue(userData.email);
    setConfirmPassword("");
  };

  // FECHAR MODAL DE EDIÇÃO DE EMAIL
  const closeEditModal = () => {
    setIsEditing(false);
  };

  // ABRIR MODAL DE ALTERAÇÃO DE SENHA
  const openPasswordModal = () => {
    setIsChangingPassword(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // FECHAR MODAL DE ALTERAÇÃO DE SENHA
  const closePasswordModal = () => {
    setIsChangingPassword(false);
  };

  // SALVAR ALTERAÇÃO DE EMAIL
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
      const requestBody = { email: editValue, password: confirmPassword };

      const response = await fetch(`http://127.0.0.1:8000/coordinators/${userId}/update`, {
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
      setUserData({ ...userData, email: updatedData.email });

      alert("✅ Email atualizado com sucesso!");
      closeEditModal();
    } catch (error) {
      console.error("❌ Erro ao salvar alteração:", error);
      alert("Erro ao salvar alteração.");
    }
  };

  // SALVAR ALTERAÇÃO DE SENHA
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
                <li onClick={() => navigate("/dashboard-coordinator")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Meus Eventos
                </li>
                <li onClick={() => navigate("/lista-professores")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Professores
                </li>
                <li onClick={() => navigate("/lista-alunos")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Alunos
                </li>
                <li onClick={() => navigate("/certificados")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Certificados
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
          <div className="flex items-center space-x-2">
            <label className="w-1/3 text-gray-600 font-medium">E-mail</label>
            <input type="text" value={userData.email} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" readOnly />
            <span className="material-icons text-green-500 cursor-pointer" onClick={openEditModal}>✏️</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-1/3 text-gray-600 font-medium">Senha</label>
            <input type="password" value="********" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" readOnly />
            <span className="material-icons text-green-500 cursor-pointer" onClick={openPasswordModal}>✏️</span>
          </div>
        </div>
      </div>

      {/* MODAL PARA ALTERAR EMAIL */}
{isEditing && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h3 className="text-xl font-semibold mb-4">Editar e-mail</h3>
      <input
        type="text"
        className="w-full mb-2 p-2 border rounded"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
      />
      <input
        type="password"
        className="w-full mb-4 p-2 border rounded"
        placeholder="Digite sua senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="flex justify-between">
        <button onClick={closeEditModal} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Cancelar
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg">
          Salvar
        </button>
      </div>
    </div>
  </div>
)}


{/* MODAL PARA ALTERAR SENHA */}
{isChangingPassword && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h3 className="text-xl font-semibold mb-4">Alterar Senha</h3>

      <input
        type="password"
        className="w-full mb-2 p-2 border rounded"
        placeholder="Senha Atual"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        className="w-full mb-2 p-2 border rounded"
        placeholder="Nova Senha"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        className="w-full mb-4 p-2 border rounded"
        placeholder="Confirmar Nova Senha"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />

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

    </div>
  );
};

export default ProfileCoordenador;


