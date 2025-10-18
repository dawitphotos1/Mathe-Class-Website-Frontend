
// // src/utils/axiosInstance.js
// import axios from "axios";

// /**
//  * 🌍 Dynamically choose backend base URL
//  */
// const getBaseURL = () => {
//   // Use environment variable if set (for Netlify)
//   if (process.env.REACT_APP_API_URL) {
//     console.log("🌍 Using REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
//     return process.env.REACT_APP_API_URL;
//   }

//   // Production - your Render backend
//   if (process.env.NODE_ENV === "production") {
//     const prodURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
//     console.log("🌍 Using production URL:", prodURL);
//     return prodURL;
//   }

//   // Local development
//   const localURL = "http://localhost:5000/api/v1";
//   console.log("🌍 Using local development URL:", localURL);
//   return localURL;
// };

// const baseURL = getBaseURL();
// console.log("🎯 Final API Base URL:", baseURL);

// const axiosInstance = axios.create({
//   baseURL: baseURL,
//   timeout: 30000,
//   withCredentials: false,
// });

// // Track if we've already shown session expired message
// let hasShownSessionAlert = false;

// /* ============================================================
//    🧩 Request Interceptor — attach JWT token
// ============================================================ */
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log(`🔐 Adding token to request: ${config.url}`);
//     } else {
//       console.warn("⚠️ No token found — guest request:", config.url);
//     }

//     console.log(`🚀 API request [${config.method?.toUpperCase()}]: ${config.baseURL}${config.url}`);
    
//     // Log request details for debugging
//     if (config.data) {
//       console.log("📦 Request data:", config.data);
//     }

//     return config;
//   },
//   (error) => {
//     console.error("❌ Request setup error:", error);
//     return Promise.reject(error);
//   }
// );

// /* ============================================================
//    🧩 Response Interceptor — handle errors & 401 safely
// ============================================================ */
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(`✅ API response [${response.status}]: ${response.config.url}`);
    
//     // Log response data for debugging (especially for course data)
//     if (response.config.url.includes('/courses') || response.config.url.includes('/payments')) {
//       console.log("💰 Course/Payment response data:", response.data);
//     }
    
//     return response;
//   },
//   (error) => {
//     const status = error.response?.status;
//     const url = error.config?.url;
//     const message = error.response?.data?.error || error.message;

//     console.error(`❌ API error [${status}] ${url}:`, message);
//     console.error("🔧 Error details:", {
//       status: status,
//       url: url,
//       message: message,
//       response: error.response?.data
//     });

//     // Handle session expiration (401 Unauthorized)
//     if (status === 401) {
//       const token = localStorage.getItem("token");
      
//       if (token && !url?.includes("/auth/") && !hasShownSessionAlert) {
//         hasShownSessionAlert = true;
//         console.log("🔐 Session expired, redirecting to login...");
        
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
        
//         if (!window.location.pathname.includes("/login")) {
//           window.location.href = "/login?session=expired";
//         }
        
//         setTimeout(() => {
//           hasShownSessionAlert = false;
//         }, 5000);
//       }
//     }

//     // Handle network errors
//     if (!status) {
//       console.error("🌐 Network error - backend might be down");
//       console.error("💡 Check if backend is running and CORS is configured properly");
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



// src/utils/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Added import

/* ============================================================
   🌍 Determine API Base URL
============================================================ */
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_API_URL;
  if (envURL) {
    console.log("🌍 Using REACT_APP_API_URL from environment:", envURL);
    return envURL.trim();
  }

  if (process.env.NODE_ENV === "production") {
    const prodURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
    console.log("🌍 Using fallback production URL:", prodURL);
    return prodURL;
  }

  const localURL = "http://localhost:5000/api/v1";
  console.log("🌍 Using local development URL:", localURL);
  return localURL;
};

const baseURL = getBaseURL();
console.log("🎯 Final Axios Base URL:", baseURL);

/* ============================================================
   ⚙️ Axios Instance Configuration
============================================================ */
const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: false,
});

/* ============================================================
   🔑 Request Interceptor — Attach Token
============================================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Token added → ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.warn(`⚠️ Guest request → ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request setup error:", error);
    return Promise.reject(error);
  }
);

/* ============================================================
   ⚡ Response Interceptor — Logging & Error Handling
============================================================ */
let hasShownSessionAlert = false;

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response [${response.status}] → ${response.config.url}`);

    if (response.config.url.includes("/courses") || response.config.url.includes("/payments")) {
      console.log("💰 API Response Data:", response.data);
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.error || error.message;

    console.error(`❌ API Error [${status || "No Status"}] → ${url}`);
    console.error("🧾 Error Details:", { status, url, message });

    // 🧩 Handle session expiration
    if (status === 401) {
      const token = localStorage.getItem("token");

      if (token && !url?.includes("/auth/") && !hasShownSessionAlert) {
        hasShownSessionAlert = true;
        console.warn("🔐 Session expired — redirecting to login...");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?session=expired";
        }

        setTimeout(() => {
          hasShownSessionAlert = false;
        }, 5000);
      }
    }

    // 🧩 Network or CORS issues
    if (!status) {
      console.error("🌐 Network error — backend may be down or CORS misconfigured");
      toast.error("Network connection issue. Please check your connection."); // ✅ Safe now
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
