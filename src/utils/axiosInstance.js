// // src/utils/axiosInstance.js
// import axios from "axios";

// const getBaseURL = () => {
//   return process.env.NODE_ENV === "production"
//     ? "https://mathe-class-website-backend-1.onrender.com/api/v1"
//     : "http://localhost:5000/api/v1";
// };

// const axiosInstance = axios.create({
//   baseURL: getBaseURL(),
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // send cookies if backend uses them
// });

// let isRefreshingAuth = false;

// // Request interceptor: attach token if present
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     if (process.env.NODE_ENV === "development") {
//       console.log(`🚀 ${config.method?.toUpperCase()} → ${config.url}`);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor: central error handling
// axiosInstance.interceptors.response.use(
//   (response) => {
//     if (process.env.NODE_ENV === "development") {
//       console.log(`✅ ${response.status} → ${response.config.url}`);
//     }
//     return response;
//   },
//   (error) => {
//     const status = error.response?.status;

//     if (process.env.NODE_ENV === "development") {
//       console.error("💥 API Error:", error.response?.data || error.message);
//     }

//     // 401: unauthorized — remove token and redirect to login once
//     if (status === 401) {
//       localStorage.removeItem("token");
//       // Avoid immediate redirect if we're already on login page
//       if (typeof window !== "undefined" && window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }

//     // 429: Too Many Requests — log and propagate without retrying here
//     if (status === 429) {
//       console.warn("API rate-limited (429).", error.response?.data || "");
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;





// src/utils/axiosInstance.js
import axios from "axios";

const getBaseURL = () => {
  // Works with Vite (import.meta.env), fallback to NODE_ENV for non-Vite setups
  const isProd = (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.PROD) || process.env.NODE_ENV === 'production';
  return isProd
    ? "https://mathe-class-website-backend-1.onrender.com/api/v1"
    : "http://localhost:5000/api/v1";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if present
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      // localStorage might not be available during SSR tests
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: central error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (process.env.NODE_ENV !== "production") {
      console.error("💥 API Error:", error.response?.data || error.message);
    }

    if (status === 401) {
      try {
        localStorage.removeItem("token");
      } catch (e) {}
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        // use assign to avoid history issues
        window.location.assign("/login");
      }
    }

    if (status === 429) {
      console.warn("⚠️ API rate-limited (429).", error.response?.data || "");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

