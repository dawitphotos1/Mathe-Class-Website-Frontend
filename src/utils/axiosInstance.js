
// import axios from "axios";

// // Set base URL WITH /api/v1 included
// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   (process.env.NODE_ENV === "development"
//     ? "http://localhost:5000/api/v1" // Include /api/v1 here
//     : "https://mathe-class-website-backend-1.onrender.com/api/v1"); // Include /api/v1 here

// console.log("🚀 API Base URL:", API_BASE_URL);

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   timeout: 30000,
// });

// // Request interceptor - REMOVED the part that adds /api/v1
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token =
//       localStorage.getItem("authToken") || localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Log the full URL being called
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

// Use environment variables correctly
const getAPIBaseURL = () => {
  // If REACT_APP_API_URL is set, use it (for production)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // For development, use localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000/api/v1";
  }

  // Default to production backend
  return "https://mathe-class-website-backend-1.onrender.com/api/v1";
};

const API_BASE_URL = getAPIBaseURL();

console.log("🚀 API Base URL:", API_BASE_URL);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔧 REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`📤 ${config.method?.toUpperCase()} ${fullUrl}`, {
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;
    const status = error.response?.status;
    const url = error.config?.url;

    console.error(
      `❌ ${status || "No Status"} ${url || "No URL"}:`,
      errorMessage
    );

    if (status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.warn("🔐 Authentication failed");
    }

    if (status === 404) {
      console.error("🔍 Endpoint not found:", url);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;