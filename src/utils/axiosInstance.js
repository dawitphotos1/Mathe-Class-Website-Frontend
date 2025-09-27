// src/utils/axiosInstance.js
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1"
    : "https://math-class-platform-backend.onrender.com/api/v1");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies too
});

// 📤 Attach token before every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("📤 Request:", config.method?.toUpperCase(), config.url, {
      headers: config.headers,
    });
  }

  return config;
});

// 📥 Handle errors
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ API Error:", err.response?.data || err.message);
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
