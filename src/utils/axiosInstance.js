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

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://mathe-class-website-backend-1.onrender.com/api/v1",
  withCredentials: true, // ✅ crucial for cookies
});

// Log outgoing requests
axiosInstance.interceptors.request.use((config) => {
  console.log("🔗 Sending request:", config.method?.toUpperCase(), config.url, {
    withCredentials: config.withCredentials,
  });
  return config;
});

// Log incoming responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosInstance;
