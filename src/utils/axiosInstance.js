
// src/utils/axiosInstance.js
import axios from "axios";

/* ============================================================
   🌍 Determine API Base URL
============================================================ */
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_API_URL;
  console.log("🔍 Checking REACT_APP_API_URL:", envURL); // Add this line
  if (envURL) {
    console.log("🌍 Using REACT_APP_API_URL from environment:", envURL);
    return envURL.trim();
  }

  if (process.env.NODE_ENV === "production") {
    const prodURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
    console.log("🌍 Using fallback production URL:", prodURL);
    return prodURL;
  }

  const localURL = "http://localhost:5000/api/v1";
  console.log("🌍 Using local development URL:", localURL);
  return localURL;
};

const baseURL = getBaseURL();
console.log("🎯 Final Axios Base URL:", baseURL);

/* ============================================================
   ⚙️ Axios Instance Configuration
============================================================ */
const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: false,
});

/* ============================================================
   🔑 Request Interceptor — Attach Token
============================================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Token added → ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.warn(`⚠️ Guest request → ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request setup error:", error);
    return Promise.reject(error);
  }
);

/* ============================================================
   ⚡ Response Interceptor — Logging & Error Handling
============================================================ */
let hasShownSessionAlert = false;

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response [${response.status}] → ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.error || error.message;

    console.error(`❌ API Error [${status || "No Status"}] → ${url}`);
    console.error("🧾 Error Details:", { status, url, message });

    // 🧩 Handle session expiration
    if (status === 401) {
      const token = localStorage.getItem("token");

      if (token && !url?.includes("/auth/") && !hasShownSessionAlert) {
        hasShownSessionAlert = true;
        console.warn("🔐 Session expired — redirecting to login...");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?session=expired";
        }

        setTimeout(() => {
          hasShownSessionAlert = false;
        }, 5000);
      }
    }

    // 🧩 Network or CORS issues
    if (!status) {
      console.error("🌐 Network error — backend may be down or CORS misconfigured");
      // Safe error display without external dependencies
      if (typeof window !== 'undefined') {
        console.error("Network connection issue. Please check your connection and try again.");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;