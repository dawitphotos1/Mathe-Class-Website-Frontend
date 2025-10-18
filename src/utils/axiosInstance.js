// src/utils/axiosInstance.js
import axios from "axios";

/**
 * 🌍 Dynamically choose backend base URL
 */
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;

  if (process.env.NODE_ENV === "production") {
    // Render backend deployed URL
    return "https://mathe-class-website-backend-1.onrender.com/api/v1";
  }

  // Local dev
  return "http://localhost:5000/api/v1";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: false, // ✅ JWT handled via Authorization header
});

/* ============================================================
   🧩 Request Interceptor — attach JWT token
============================================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found — possible guest request:", config.url);
    }

    console.log(
      `🚀 API request [${config.method?.toUpperCase()}]:`,
      config.baseURL + config.url
    );

    return config;
  },
  (error) => {
    console.error("❌ Request setup error:", error);
    return Promise.reject(error);
  }
);

/* ============================================================
   🧩 Response Interceptor — handle errors & 401 safely
============================================================ */
let hasShownSessionAlert = false; // Prevent spammy multiple alerts

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API response:", response.status, response.config?.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.error || error.message;

    console.error(`❌ API error [${status}] ${url}:`, message);

    // Only handle 401s for authenticated routes
    if (
      status === 401 &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register")
    ) {
      const token = localStorage.getItem("token");

      if (token && !hasShownSessionAlert) {
        hasShownSessionAlert = true;
        alert("Your session has expired. Please log in again.");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avoid redirect loop if already on /login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
