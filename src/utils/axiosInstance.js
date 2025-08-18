// import axios from "axios";
// import { API_BASE_URL } from "../config";

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add auth token automatically if it exists
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;




// utils/axiosInstance.js
import axios from "axios";
import { API_BASE_URL } from "../config";

// ✅ Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`, // 👈 prefix handled here
  withCredentials: true,             // allow cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically (request interceptor)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug
    console.log("Interceptor triggered:", {
      url: config.url,
      hasToken: !!token,
      tokenPrefix: token ? token.substring(0, 20) + "..." : null,
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handler (response interceptor)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("❌ API error:", error.response.status, error.response.data);
      // 🔒 Auto-logout on 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else {
      console.error("❌ Network/Server error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
