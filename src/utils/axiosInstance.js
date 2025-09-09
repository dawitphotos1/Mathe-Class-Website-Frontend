
// // src/utils/axiosInstance.js
// import axios from "axios";

// // ✅ Use environment variable for backend API
// // Example in your .env file:
// // REACT_APP_API_URL=https://mathe-class-website-backend-1.onrender.com/api/v1
// const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// // ✅ Create axios instance
// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL, // 👈 ensures "/auth/register" → "http://.../api/v1/auth/register"
//   withCredentials: true, // allow cookies if needed
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Optional: Add request interceptor for debugging
// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log("📡 Request:", config.method?.toUpperCase(), config.url, config.data);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Optional: Add response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("❌ API error:", error?.response || error.message);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;




import axios from "axios";

// 🌍 Detect backend URL
let API_BASE_URL;

// 1. Prefer explicit env variable (for flexibility)
if (process.env.REACT_APP_API_URL) {
  API_BASE_URL = process.env.REACT_APP_API_URL;
} else {
  // 2. Auto-detect environment
  if (process.env.NODE_ENV === "development") {
    API_BASE_URL = "http://localhost:5000/api/v1"; // local backend
  } else {
    API_BASE_URL = "https://mathe-class-website-backend-1.onrender.com/api/v1"; // Render backend
  }
}

console.log("🔗 Using API_BASE_URL:", API_BASE_URL);

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Optional: Request interceptor (debugging)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      "📡 Request:",
      config.method?.toUpperCase(),
      config.url,
      config.data
    );
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
