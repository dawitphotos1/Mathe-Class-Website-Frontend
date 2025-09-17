
// src/utils/axiosInstance.js
import axios from "axios";

// 🌍 Detect backend URL
let API_BASE_URL;

if (process.env.REACT_APP_API_URL) {
  API_BASE_URL = process.env.REACT_APP_API_URL;
} else if (process.env.NODE_ENV === "development") {
  API_BASE_URL = "http://localhost:5000/api/v1";
} else {
  API_BASE_URL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
}

console.log("🔗 Using API_BASE_URL:", API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401 || response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      window.location.href = "/login";
    }
    
    console.error("❌ API error:", response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;