
// src/utils/axiosInstance.js
import axios from "axios";

// Always point to your backend Render URL in production
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://mathe-class-website-backend-1.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ send cookies (important for auth)
});

// 🔍 Debug requests/responses
axiosInstance.interceptors.request.use((config) => {
  console.log(
    "📤 Request:",
    config.method?.toUpperCase(),
    config.baseURL + config.url,
    config.data || ""
  );
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(
      "❌ API error:",
      err.response?.status,
      err.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

export default axiosInstance;
