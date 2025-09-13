
import axios from "axios";

// 🌍 Detect backend URL
let API_BASE_URL;

if (process.env.REACT_APP_API_URL) {
  API_BASE_URL = process.env.REACT_APP_API_URL;
} else {
  API_BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api/v1"
      : "https://mathe-class-website-backend-1.onrender.com/api/v1";
}

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token only if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    // Do NOT attach token for public auth endpoints
    if (!config.url.includes("/auth/")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: Response error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Uncomment if you want to debug:
    // console.error("❌ API error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
