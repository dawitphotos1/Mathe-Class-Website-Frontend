// // src/utils/axiosInstance.js
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://mathe-class-website-backend-1.onrender.com/api/v1",
//   withCredentials: true, // ✅ allow cookies
// });

// // Interceptor for debug
// axiosInstance.interceptors.request.use((config) => {
//   console.log("🔗 Sending request:", config.method?.toUpperCase(), config.url);
//   return config;
// });

// export default axiosInstance;




// src/utils/axiosInstance.js
import axios from "axios";

// 🔹 Dynamically pick API base URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ send cookies
});

// 🔍 Debug requests/responses
axiosInstance.interceptors.request.use((config) => {
  console.log("📤 Request:", config.method?.toUpperCase(), config.url, config.data || "");
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API error:", err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

export default axiosInstance;
