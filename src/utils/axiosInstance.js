// src/utils/axiosInstance.js
import axios from "axios";

// Base URL should point to your API root (you used /api/v1 in backend)
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://mathe-class-website-backend.onrender.com/api/v1",
  timeout: 30000,
  withCredentials: true, // keep cookies for auth if backend uses cookie tokens
});

// Add request interceptor to attach token (if present)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // prefer Bearer header for API
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("🚀 API request:", config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// response logging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API response:", response.status, response.config?.url);
    return response;
  },
  (error) => {
    console.error("❌ API response error:", error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
