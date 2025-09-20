
// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mathe-class-website-backend-1.onrender.com/api/v1",
  withCredentials: true, // ✅ allow cookies
});

axiosInstance.interceptors.request.use((config) => {
  console.log("🔗 Sending request:", config.method, config.url);
  return config;
});

export default axiosInstance;
