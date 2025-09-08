// // src/utils/axiosInstance.js
// import axios from "axios";

// // ✅ Create instance with base URL and credentials
// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "https://mathe-class-website-backend-1.onrender.com/api/v1",
//   withCredentials: true, // needed for cookies/sessions if you use them
// });

// // ✅ Request Interceptor: attach token if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // or sessionStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log("Interceptor triggered:", config);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ✅ Response Interceptor: log or handle global errors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("Network error detected:", error);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;





// src/utils/axiosInstance.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://mathe-class-website-backend-1.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required if backend uses cookies/sessions
  timeout: 10000, // 10 seconds timeout (adjust as needed)
});

// Request interceptor: attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request intercepted:", config);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: log or handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("Response error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something happened setting up the request
      console.error("Axios error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
