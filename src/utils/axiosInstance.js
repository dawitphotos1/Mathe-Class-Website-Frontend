// // src/utils/axiosInstance.js
// import axios from "axios";

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   (process.env.NODE_ENV === "development"
//     ? "http://localhost:5000/api/v1"
//     : "https://math-class-platform-backend.onrender.com/api/v1");

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // send cookies too
// });

// // 📤 Attach token before every request
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   if (process.env.NODE_ENV === "development") {
//     console.log("📤 Request:", config.method?.toUpperCase(), config.url, {
//       headers: config.headers,
//     });
//   }

//   return config;
// });

// // 📥 Handle errors
// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (process.env.NODE_ENV === "development") {
//       console.error("❌ API Error:", err.response?.data || err.message);
//     }
//     return Promise.reject(err);
//   }
// );

// export default axiosInstance;



// src/utils/axiosInstance.js
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1"
    : "https://mathe-class-website-backend-1.onrender.com/api/v1");

console.log("🚀 API Base URL:", API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    
    console.error(`❌ ${error.response?.status || 'No Status'} ${error.config?.url || 'No URL'}:`, errorMessage);

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.warn("🔐 Authentication failed, redirecting to login...");
    }

    if (error.response?.status === 404) {
      console.error("🔍 Endpoint not found. Check the route configuration.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;