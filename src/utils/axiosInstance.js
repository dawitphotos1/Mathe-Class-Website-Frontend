
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mathe-class-website-backend-1.onrender.com/api/v1",
  withCredentials: true, // 🔥 ensure cookies are sent
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🔗 Sending request:", config.method, config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API error:", error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
