
// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://mathe-class-website-backend-1.onrender.com/api/v1", // ✅ include /api/v1
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add auth interceptor if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
