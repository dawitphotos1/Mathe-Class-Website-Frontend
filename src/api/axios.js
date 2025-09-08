import axios from "axios";

const BASE_URL = "https://mathe-class-website-backend-1.onrender.com/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Automatically attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
