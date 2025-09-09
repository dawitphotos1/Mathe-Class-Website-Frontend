
// src/utils/axiosInstance.js
import axios from "axios";

// ✅ Use environment variable for backend API
// Example in your .env file:
// REACT_APP_API_URL=https://mathe-class-website-backend-1.onrender.com/api/v1
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // 👈 ensures "/auth/register" → "http://.../api/v1/auth/register"
  withCredentials: true, // allow cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Optional: Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("📡 Request:", config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
