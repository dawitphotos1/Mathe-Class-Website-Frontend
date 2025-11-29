// // src/utils/axiosInstance.js
// import axios from "axios";

// const getBaseURL = () => {
//   return process.env.NODE_ENV === "production"
//     ? "https://mathe-class-website-backend-1.onrender.com/api/v1"
//     : "http://localhost:5000/api/v1";
// };

// const axiosInstance = axios.create({
//   baseURL: getBaseURL(),
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // REQUEST INTERCEPTOR
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // RESPONSE INTERCEPTOR
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     // Auto-logout on token expiration
//     if (status === 401) {
//       localStorage.removeItem("token");
//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }

//     // Log rate limit errors
//     if (status === 429) {
//       console.warn("⚠️ Too many requests — slow down.");
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;





// src/utils/axiosInstance.js
import axios from "axios";

/* Decide backend */
const BACKEND =
  process.env.REACT_APP_BACKEND_URL?.replace(/\/+$/, "") ||
  (process.env.NODE_ENV === "production"
    ? "https://mathe-class-website-backend-1.onrender.com"
    : "http://localhost:5000");

const axiosInstance = axios.create({
  baseURL: `${BACKEND}/api/v1`,
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* Auto attach token */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* Handle errors */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 429) {
      console.warn("⚠️ Too many requests");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
