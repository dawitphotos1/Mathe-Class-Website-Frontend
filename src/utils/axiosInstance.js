// src/utils/axiosInstance.js
import axios from "axios";

// ✅ Create instance with base URL and credentials
const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://mathe-class-website-backend-1.onrender.com/api/v1",
  withCredentials: true, // needed for cookies/sessions if you use them
});

// ✅ Request Interceptor: attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Interceptor triggered:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: log or handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Network error detected:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
