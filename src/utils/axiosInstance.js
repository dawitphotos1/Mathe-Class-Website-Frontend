//utils/axiosInstance.js
import axios from "axios";

// Determine backend base URL
const BACKEND =
  process.env.REACT_APP_BACKEND_URL?.replace(/\/+$/, "") ||
  (process.env.NODE_ENV === "production"
    ? "https://mathe-class-website-backend-1.onrender.com"
    : "http://localhost:5000");

console.log("🔧 Axios baseURL:", `${BACKEND}/api/v1`);

const axiosInstance = axios.create({
  baseURL: `${BACKEND}/api/v1`,
  timeout: 60000, // Increased to 60s for Render cold starts
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Automatically attach auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    console.log(
      `📤 [Axios] ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Response handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `📥 [Axios] Response ${response.status}: ${response.config.url}`
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error(`❌ [Axios] Error ${status}: ${url}`, error.message);

    if (status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 429) {
      console.warn("⚠️ Too many requests");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
