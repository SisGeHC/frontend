import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/users/auth/login/", { email, password });
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/users/auth/register/", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.response?.data || error.message);
    throw error;
  }
};
