// utils/axiosInstance.js
import axios from "axios";

// Determine the base URL dynamically
const getBaseURL = () => {
  return process.env.NODE_ENV === "production"
    ? "https://mathe-class-website-backend-1.onrender.com/api/v1"
    : "http://localhost:5000/api/v1";
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Send cookies for auth
});

// ------------------------------
// Request Interceptor
// ------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} → ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------
// Response Interceptor
// ------------------------------
axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ ${response.status} → ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`💥 API Error:`, error.response?.data || error.message);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
