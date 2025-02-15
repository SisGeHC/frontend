import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Altere se necessário

export const login = async (credentials) => {
    return api.post("/users/auth/login/", credentials);
};

export const register = async (userData) => {
    return api.post("/users/auth/register/", userData);
};

export const getUser = async () => {
    const token = localStorage.getItem("token"); // Obtém o token armazenado
  
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
  
    return api.get("/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

