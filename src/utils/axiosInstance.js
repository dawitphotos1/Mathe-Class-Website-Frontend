// //utils/axiosInstance.js
// import axios from "axios";

// // Determine the correct base URL based on environment
// const getBaseURL = () => {
//   // If REACT_APP_API_URL is explicitly set, use it
//   if (process.env.REACT_APP_API_URL) {
//     return process.env.REACT_APP_API_URL;
//   }

//   // For production (Netlify deployment)
//   if (process.env.NODE_ENV === "production") {
//     return "https://mathe-class-website-backend-1.onrender.com/api/v1";
//   }

//   // For local development
//   return "http://localhost:5000/api/v1";
// };

// const axiosInstance = axios.create({
//   baseURL: getBaseURL(),
//   timeout: 30000,
//   withCredentials: true, // Important for cookies/auth
// });

// // Add request interceptor to attach token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log(
//       "🚀 API request:",
//       config.method?.toUpperCase(),
//       config.baseURL + config.url
//     );
//     return config;
//   },
//   (error) => {
//     console.error("❌ Request error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("✅ API response:", response.status, response.config?.url);
//     return response;
//   },
//   (error) => {
//     console.error("❌ API response error:", {
//       status: error.response?.status,
//       url: error.config?.url,
//       message: error.message,
//       data: error.response?.data,
//     });

//     // Handle specific error cases
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;





// src/utils/axiosInstance.js
import axios from "axios";

/**
 * 🌍 Dynamically choose backend base URL
 */
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;

  if (process.env.NODE_ENV === "production") {
    // Render backend deployed URL
    return "https://mathe-class-website-backend-1.onrender.com/api/v1";
  }

  // Local dev
  return "http://localhost:5000/api/v1";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: false, // ✅ usually false if you use JWT in headers
});

/* ============================================================
   🧩 Request Interceptor — attach JWT token
============================================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found — request may be unauthenticated:", config.url);
    }

    console.log(
      `🚀 API request [${config.method?.toUpperCase()}]:`,
      config.baseURL + config.url
    );

    return config;
  },
  (error) => {
    console.error("❌ Request setup error:", error);
    return Promise.reject(error);
  }
);

/* ============================================================
   🧩 Response Interceptor — log & auto-logout on 401
============================================================ */
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API response:", response.status, response.config?.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.error || error.message;

    console.error(`❌ API error [${status}] ${url}:`, message);

    // Handle expired / missing token
    if (status === 401) {
      localStorage.removeItem("token");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
