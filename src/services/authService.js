export const register = async (userData) => {
  const response = await fetch("http://localhost:8000/students/create", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
  });

  if (!response.ok) {
      throw new Error("Erro ao registrar");
  }

  return response.json();
};

