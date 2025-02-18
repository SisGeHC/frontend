import React, { useState } from "react";

const ModalSubmeterHoras = ({ isOpen, onClose }) => {
  const [categoria, setCategoria] = useState("");
  const [arquivo, setArquivo] = useState(null);

  const handleFileChange = (event) => {
    setArquivo(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!categoria || !arquivo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token"); // Pegando o token do usuário logado

    if (!token) {
      alert("Erro: Usuário não autenticado.");
      return;
    }

    const formData = new FormData();
    formData.append("file", arquivo);

    try {
      const response = await fetch("http://127.0.0.1:8000/certificates/post/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro ao enviar certificado:", errorData);
        alert(`Erro ao enviar certificado: ${errorData.detail || "Tente novamente."}`);
        return;
      }

      alert("✅ Certificado enviado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Erro ao submeter certificado.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Submeter Horas</h2>

        {/* Categoria */}
        <label className="block text-gray-700">Categoria</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          <option value="Curso">Curso</option>
          <option value="Palestra">Palestra</option>
          <option value="Oficina">Oficina</option>
        </select>

        {/* Upload de Arquivo */}
        <label className="block text-gray-700">Selecionar Arquivo</label>
        <input
          type="file"
          className="w-full p-2 border rounded mb-4"
          onChange={handleFileChange}
        />

        {/* Botões */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSubmeterHoras;