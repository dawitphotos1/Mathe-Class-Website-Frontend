
// // src/utils/axiosInstance.js
// import axios from "axios";

// const baseURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
// console.log("🚀 Using Production API URL:", baseURL);

// const axiosInstance = axios.create({
//   baseURL,
//   timeout: 15000,
//   withCredentials: true,
// });

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

// let hasShownSessionAlert = false;

// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(`✅ ${response.status} → ${response.config.url}`);
//     return response;
//   },
//   (error) => {
//     const status = error.response?.status;
//     const url = error.config?.url;
//     const method = error.config?.method?.toUpperCase();

//     console.error(`❌ ${method} ${url} failed:`, {
//       status: status || 'No Status',
//       message: error.message,
//       code: error.code,
//     });

//     if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
//       console.error('⏰ Request timeout - Backend might be sleeping');
//     }

//     if (!status && error.message) {
//       if (error.message.includes('Network Error')) {
//         console.error('🌐 Network Error - Check backend URL and CORS');
//       }
//     }

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

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from "axios";

const baseURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
console.log("🚀 Using Production API URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 45000, // Increased to 45 seconds for Render cold starts
  withCredentials: true,
});

// Enhanced retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds between retries

// Track backend warmup state
let isBackendWarming = false;
let warmupPromise = null;

const warmUpBackend = async () => {
  if (isBackendWarming) {
    return warmupPromise;
  }

  isBackendWarming = true;
  warmupPromise = new Promise(async (resolve) => {
    console.log("🔥 Starting backend warmup process...");

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔥 Warmup attempt ${attempt}/3...`);
        await axios.get(`${baseURL}/health`, { timeout: 10000 });
        console.log("✅ Backend is warm and ready!");
        resolve(true);
        return;
      } catch (error) {
        console.log(`🔥 Warmup attempt ${attempt} failed, waiting 5s...`);
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }

    console.log("⚠️ Backend warmup failed after 3 attempts");
    resolve(false);
    isBackendWarming = false;
  });

  return warmupPromise;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Initialize retry count
    config._retryCount = config._retryCount || 0;

    console.log(`🚀 ${config.method?.toUpperCase()} → ${config.url}`);

    // For critical operations, ensure backend is warm
    if (
      config.method?.toUpperCase() === "PATCH" &&
      config.url?.includes("/approve")
    ) {
      console.log(
        "⚡ Critical operation detected - ensuring backend is warm..."
      );
      await warmUpBackend();
    }

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
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();

    // Enhanced retry logic for timeout and network errors
    if (
      (error.code === "ECONNABORTED" ||
        error.message.includes("timeout") ||
        error.message.includes("Network Error")) &&
      originalRequest._retryCount < MAX_RETRIES
    ) {
      originalRequest._retryCount += 1;
      const delay = RETRY_DELAY * originalRequest._retryCount; // Progressive delay

      console.log(
        `⏰ Backend sleeping, retry ${originalRequest._retryCount}/${MAX_RETRIES} in ${delay}ms...`
      );

      // Wait with progressive backoff
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Warm up backend before retry for critical operations
      if (method === "PATCH" && url?.includes("/approve")) {
        await warmUpBackend();
      }

      return axiosInstance(originalRequest);
    }

    console.error(`❌ ${method} ${url} failed:`, {
      status: status || "No Status",
      message: error.message,
      code: error.code,
      retries: originalRequest._retryCount,
    });

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      console.error(
        "⏰ Request timeout - Backend might be sleeping or overloaded"
      );
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

// Export warmup function for manual use
export const ensureBackendWarm = warmUpBackend;
export default axiosInstance;