
// // src/api/axios.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://mathe-class-website-backend-1.onrender.com/api/v1", // ✅ include /api/v1
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Optional: Add auth interceptor if needed
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;





import axios from "axios";
import { toast } from "react-toastify";

// Base configuration
const api = axios.create({
  baseURL: "https://mathe-class-website-backend-1.onrender.com/api/v1", // ✅ Your Render backend
  withCredentials: true, // ✅ Required for cookies or auth headers
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (attach token if present)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for error handling)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.error ||
      err.message ||
      "❌ An unexpected error occurred";
    console.error("Interceptor triggered:", err);
    toast.error(msg);
    return Promise.reject(err);
  }
);

export default api;
