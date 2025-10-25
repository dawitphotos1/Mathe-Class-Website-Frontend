//utils/axiosInstance.js

import axios from "axios";

const baseURL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
console.log("🚀 Using Production API URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 60000, // Increased to 60 seconds for Render cold starts
  withCredentials: true,
});

// Ultra aggressive retry configuration for Render free tier
const MAX_RETRIES = 8;
const RETRY_DELAY = 8000; // 8 seconds between retries

// Track backend warmup state
let isBackendWarming = false;
let warmupPromise = null;
let lastWarmupTime = 0;
const WARMUP_COOLDOWN = 30000; // 30 seconds cooldown

const warmUpBackend = async (force = false) => {
  const now = Date.now();

  // Don't warm up too frequently
  if (!force && now - lastWarmupTime < WARMUP_COOLDOWN && isBackendWarming) {
    return warmupPromise;
  }

  isBackendWarming = true;
  lastWarmupTime = now;

  warmupPromise = new Promise(async (resolve) => {
    console.log("🔥 Starting aggressive backend warmup process...");

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        console.log(`🔥 Warmup attempt ${attempt}/5...`);
        // Use a longer timeout for warmup
        await axios.get(`${baseURL}/health`, { timeout: 15000 });
        console.log("✅ Backend is warm and ready!");
        isBackendWarming = false;
        resolve(true);
        return;
      } catch (error) {
        console.log(`🔥 Warmup attempt ${attempt} failed, waiting 8s...`);
        if (attempt < 5) {
          await new Promise((resolve) => setTimeout(resolve, 8000));
        }
      }
    }

    console.log("⚠️ Backend warmup failed after 5 attempts");
    isBackendWarming = false;
    resolve(false);
  });

  return warmupPromise;
};

// Special aggressive warmup for critical operations
const aggressiveWarmup = async () => {
  console.log("⚡ Starting aggressive warmup for critical operation...");

  // Fire multiple warmup requests in parallel
  const warmupPromises = [];
  for (let i = 0; i < 3; i++) {
    warmupPromises.push(
      axios.get(`${baseURL}/health`, { timeout: 20000 }).catch(() => {})
    );
  }

  await Promise.all(warmupPromises);
  console.log("✅ Aggressive warmup completed");
  return true;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Initialize retry count
    config._retryCount = config._retryCount || 0;
    config._startTime = config._startTime || Date.now();

    console.log(
      `🚀 ${config.method?.toUpperCase()} → ${config.url} (Attempt: ${
        config._retryCount + 1
      })`
    );

    // For critical operations, ensure backend is VERY warm
    if (
      config.method?.toUpperCase() === "PATCH" &&
      config.url?.includes("/approve")
    ) {
      console.log("⚡ CRITICAL OPERATION - Aggressive backend warming...");
      await aggressiveWarmup();
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
    const duration = Date.now() - response.config._startTime;
    console.log(
      `✅ ${response.status} → ${response.config.url} (${duration}ms)`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    const duration = Date.now() - originalRequest._startTime;

    // Ultra aggressive retry logic for Render free tier
    if (
      (error.code === "ECONNABORTED" ||
        error.message.includes("timeout") ||
        error.message.includes("Network Error")) &&
      originalRequest._retryCount < MAX_RETRIES
    ) {
      originalRequest._retryCount += 1;
      const delay = RETRY_DELAY * originalRequest._retryCount; // Progressive delay

      console.log(
        `⏰ Backend sleeping, retry ${originalRequest._retryCount}/${MAX_RETRIES} in ${delay}ms... (Total: ${duration}ms)`
      );

      // Wait with progressive backoff
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Force warmup before retry for critical operations
      if (method === "PATCH" && url?.includes("/approve")) {
        console.log("🔥 Forcing warmup before retry...");
        await warmUpBackend(true);
      }

      return axiosInstance(originalRequest);
    }

    console.error(
      `💥 ${method} ${url} FAILED after ${originalRequest._retryCount} retries:`,
      {
        status: status || "No Status",
        message: error.message,
        code: error.code,
        retries: originalRequest._retryCount,
        totalTime: duration + "ms",
      }
    );

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      console.error(
        "🚨 ULTIMATE TIMEOUT - Backend is taking too long to wake up"
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
export const forceBackendWarmup = () => warmUpBackend(true); // ✅ ADDED THIS EXPORT
export default axiosInstance;