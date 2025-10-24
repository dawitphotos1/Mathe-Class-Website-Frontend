
// // src/utils/axiosInstance.js
// import axios from "axios";

// /* ============================================================
//    🌍 API Base URL - HARDCODED FOR PRODUCTION
// ============================================================ */
// const baseURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
// console.log("🚀 Using Production API URL:", baseURL);

// /* ============================================================
//    ⚙️ Axios Instance Configuration
// ============================================================ */
// const axiosInstance = axios.create({
//   baseURL,
//   timeout: 30000,
//   withCredentials: true, // ✅ CRITICAL: send and receive cookies!
// });

// /* ============================================================
//    🔑 Request Interceptor — Attach Token (optional backup)
// ============================================================ */
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log(
//         `🔐 Token added → ${config.method?.toUpperCase()} ${config.url}`
//       );
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ============================================================
//    ⚡ Response Interceptor — Handle 401 & Network Errors
// ============================================================ */
// let hasShownSessionAlert = false;

// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(`✅ Response [${response.status}] → ${response.config.url}`);
//     return response;
//   },
//   (error) => {
//     const status = error.response?.status;
//     const url = error.config?.url;

//     // 🧩 Session expired
//     if (status === 401) {
//       const token = localStorage.getItem("token");
//       if (token && !url?.includes("/auth/") && !hasShownSessionAlert) {
//         hasShownSessionAlert = true;
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         if (!window.location.pathname.includes("/login")) {
//           window.location.href = "/login?session=expired";
//         }
//         setTimeout(() => (hasShownSessionAlert = false), 5000);
//       }
//     }

//     // 🧩 Network or CORS issues
//     if (!status) {
//       console.error("🌐 Network error — check backend or CORS configuration");
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;




// src/utils/axiosInstance.js
import axios from "axios";

const baseURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
console.log("🚀 Using Production API URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 ${config.method?.toUpperCase()} → ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

let hasShownSessionAlert = false;

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} → ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();

    console.error(`❌ ${method} ${url} failed:`, {
      status: status || 'No Status',
      message: error.message,
      code: error.code,
    });

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏰ Request timeout - Backend might be sleeping');
    }

    if (!status && error.message) {
      if (error.message.includes('Network Error')) {
        console.error('🌐 Network Error - Check backend URL and CORS');
      }
    }

    if (status === 401) {
      const token = localStorage.getItem("token");
      if (token && !url?.includes("/auth/") && !hasShownSessionAlert) {
        hasShownSessionAlert = true;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?session=expired";
        }
        setTimeout(() => (hasShownSessionAlert = false), 5000);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;