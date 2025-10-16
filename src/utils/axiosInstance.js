// // src/utils/axiosInstance.js
// import axios from "axios";

// // Base URL should point to your API root (you used /api/v1 in backend)
// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "https://mathe-class-website-backend.onrender.com/api/v1",
//   timeout: 30000,
//   withCredentials: true, // keep cookies for auth if backend uses cookie tokens
// });

// // Add request interceptor to attach token (if present)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // prefer Bearer header for API
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log("🚀 API request:", config.method?.toUpperCase(), config.baseURL + config.url);
//     return config;
//   },
//   (error) => {
//     console.error("❌ Request error:", error);
//     return Promise.reject(error);
//   }
// );

// // response logging
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("✅ API response:", response.status, response.config?.url);
//     return response;
//   },
//   (error) => {
//     console.error("❌ API response error:", error.response?.status, error.config?.url, error.message);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;




import axios from "axios";

// Determine the correct base URL based on environment
const getBaseURL = () => {
  // If REACT_APP_API_URL is explicitly set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // For production (Netlify deployment)
  if (process.env.NODE_ENV === "production") {
    return "https://mathe-class-website-backend-1.onrender.com/api/v1";
  }

  // For local development
  return "http://localhost:5000/api/v1";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: true, // Important for cookies/auth
});

// Add request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "🚀 API request:",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API response:", response.status, response.config?.url);
    return response;
  },
  (error) => {
    console.error("❌ API response error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;