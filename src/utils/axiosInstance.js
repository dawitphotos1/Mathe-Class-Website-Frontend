// src/utils/axiosInstance.js
import axios from "axios";

/* ============================================================
   🌍 Determine API Base URL
============================================================ */
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_API_URL;
  if (envURL) return envURL.trim();

  if (process.env.NODE_ENV === "production") {
    return "https://mathe-class-website-backend-1.onrender.com/api/v1";
  }

  return "http://localhost:5000/api/v1";
};

const baseURL = getBaseURL();
console.log("🎯 Axios Base URL:", baseURL);

/* ============================================================
   ⚙️ Axios Instance Configuration
============================================================ */
const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true, // ✅ CRITICAL: send and receive cookies!
});

/* ============================================================
   🔑 Request Interceptor — Attach Token (optional backup)
============================================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   ⚡ Response Interceptor — Handle 401 & Network Errors
============================================================ */
let hasShownSessionAlert = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // 🧩 Session expired
    if (status === 401) {
      const token = localStorage.getItem("token");
      if (token && !url?.includes("/auth/") && !hasShownSessionAlert) {
        hasShownSessionAlert = true;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?session=expired";
        }
        setTimeout(() => (hasShownSessionAlert = false), 5000);
      }
    }

    // 🧩 Network or CORS issues
    if (!status) {
      console.error("🌐 Network error — check backend or CORS configuration");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
