// // src/utils/axiosInstance.js
// import axios from "axios";

// // ✅ Backend API base URL
// const baseURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
// console.log("🚀 Using Production API URL:", baseURL);

// // ✅ Create Axios instance
// const axiosInstance = axios.create({
//   baseURL,
//   timeout: 15000, // 15 seconds cap
//   withCredentials: true,
// });

// // ✅ Optional backend warmup (for Render cold starts)
// export const ensureBackendWarm = async () => {
//   try {
//     console.log("🔥 Warming up backend...");
//     await axios.get(`${baseURL}/health`, { timeout: 10000 });
//     console.log("✅ Backend is awake!");
//   } catch (err) {
//     console.warn("⚠️ Backend warmup failed:", err.message);
//   }
// };

// // ✅ Attach token to all requests
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log(`🚀 ${config.method?.toUpperCase()} → ${config.url}`);
//     return config;
//   },
//   (error) => {
//     console.error("❌ Request Interceptor Error:", error);
//     return Promise.reject(error);
//   }
// );

// // ✅ Clean response/error handling
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(`✅ ${response.status} → ${response.config.url}`);
//     return response;
//   },
//   (error) => {
//     const status = error.response?.status;
//     const message = error.message || "Network Error";

//     console.error("💥 API Error:", { status, message });

//     if (message.includes("timeout") || message.includes("Network Error")) {
//       error.message =
//         "Server is waking up or slow to respond. Please try again shortly.";
//     }

//     if (status === 401) {
//       console.warn("⚠️ Session expired. Redirecting to login...");
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       if (!window.location.pathname.includes("/login")) {
//         window.location.href = "/login?session=expired";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;





import axios from "axios";

// ✅ Backend API base URL
const baseURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
console.log("🚀 Using Production API URL:", baseURL);

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // ⬅️ INCREASED to 30 seconds for slow Render starts
  withCredentials: true,
});

// ✅ Backend warmup using THE SAME axios instance
export const ensureBackendWarm = async () => {
  try {
    console.log("🔥 Warming up backend...");
    await axiosInstance.get("/health", { timeout: 25000 }); // ⬅️ Use axiosInstance, not global axios
    console.log("✅ Backend is awake!");
  } catch (err) {
    console.warn("⚠️ Backend warmup failed:", err.message);
  }
};

// ✅ Attach token to all requests
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

// ✅ Clean response/error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} → ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.message || "Network Error";

    console.error("💥 API Error:", { status, message });

    if (message.includes("timeout") || message.includes("Network Error")) {
      error.message =
        "Server is waking up or slow to respond. Please try again shortly.";
    }

    if (status === 401) {
      console.warn("⚠️ Session expired. Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?session=expired";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;