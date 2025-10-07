
// import axios from "axios";

// // Use environment variables correctly
// const getAPIBaseURL = () => {
//   // If REACT_APP_API_URL is set, use it (for production)
//   if (process.env.REACT_APP_API_URL) {
//     return process.env.REACT_APP_API_URL;
//   }

//   // For development, use localhost
//   if (process.env.NODE_ENV === "development") {
//     return "http://localhost:5000/api/v1";
//   }

//   // Default to production backend
//   return "https://mathe-class-website-backend-1.onrender.com/api/v1";
// };

// const API_BASE_URL = getAPIBaseURL();

// console.log("🚀 API Base URL:", API_BASE_URL);
// console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
// console.log("🔧 REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   timeout: 30000,
// });

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token =
//       localStorage.getItem("authToken") || localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     const fullUrl = `${config.baseURL}${config.url}`;
//     console.log(`📤 ${config.method?.toUpperCase()} ${fullUrl}`, {
//       data: config.data,
//     });

//     return config;
//   },
//   (error) => {
//     console.error("❌ Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(`✅ ${response.status} ${response.config.url}`, response.data);
//     return response;
//   },
//   (error) => {
//     const errorMessage =
//       error.response?.data?.error ||
//       error.response?.data?.message ||
//       error.message;
//     const status = error.response?.status;
//     const url = error.config?.url;

//     console.error(
//       `❌ ${status || "No Status"} ${url || "No URL"}:`,
//       errorMessage
//     );

//     if (status === 401) {
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       console.warn("🔐 Authentication failed");
//     }

//     if (status === 404) {
//       console.error("🔍 Endpoint not found:", url);
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



import axios from "axios";

// 🧩 Determine correct backend URL safely
const getAPIBaseURL = () => {
  let base = process.env.REACT_APP_API_URL;

  // 🧠 If REACT_APP_API_URL isn't set, use sensible defaults
  if (!base) {
    if (process.env.NODE_ENV === "development") {
      base = "http://localhost:5000";
    } else {
      base = "https://mathe-class-website-backend-1.onrender.com";
    }
  }

  // 🧹 Remove trailing slashes and ensure proper formatting
  base = base.replace(/\/+$/, ""); // trim trailing slashes

  // ✅ Ensure it ends with /api/v1 exactly once
  if (!base.endsWith("/api/v1")) {
    base = `${base}/api/v1`;
  }

  return base;
};

const API_BASE_URL = getAPIBaseURL();

// 🌍 Log environment info for debugging
console.log("🚀 API Base URL:", API_BASE_URL);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔧 REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

// 🧱 Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// 🛰️ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `📤 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`
    );

    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// 🛰️ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;

    console.error(
      `❌ [${status || "No Status"}] ${url || "No URL"} →`,
      message
    );

    if (status === 401) {
      console.warn("🔐 Token expired or unauthorized. Clearing session...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    if (status === 404) {
      console.warn("🔍 Endpoint not found:", url);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;