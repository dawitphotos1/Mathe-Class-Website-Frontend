
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { API_BASE_URL } from "./config";
// import App from "./App";
// import { AuthProvider } from "./context/AuthContext"; // ✅ Added
// import "./index.css";

// axios.defaults.baseURL = API_BASE_URL;
// axios.defaults.withCredentials = true;

// // Global error interceptor
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const token = localStorage.getItem("token");
//     console.log("Interceptor triggered:", {
//       status: error.response?.status,
//       url: error.config?.url,
//       headers: error.config?.headers,
//       hasToken: !!token,
//       tokenPrefix: token ? token.substring(0, 20) + "..." : null,
//       responseData: error.response?.data,
//     });

//     const isAuthRoute =
//       error.config?.url?.includes("/login") ||
//       error.config?.url?.includes("/register") ||
//       error.config?.url?.includes("/health");

//     if (error.response?.status === 401 && !isAuthRoute) {
//       console.log("Handling 401 error for URL:", error.config?.url);
//       setTimeout(() => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         toast.error("Session expired. Please log in again.");
//         window.location.href = "/login";
//       }, 3000);
//     } else if (error.code === "ERR_NETWORK") {
//       console.log("Network error detected");
//       toast.error("Network Error: Cannot connect to the server.");
//     }

//     return Promise.reject(error);
//   }
// );

// // Unregister service workers
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .getRegistrations()
//     .then((registrations) => {
//       for (let registration of registrations) {
//         registration.unregister().then(() => {
//           console.log("Service worker unregistered:", registration);
//         });
//       }
//     })
//     .catch((err) => {
//       console.error("Failed to unregister service workers:", err);
//     });
// }

// const root = createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <AuthProvider>
//       <BrowserRouter>
//         <ToastContainer />
//         <App />
//       </BrowserRouter>
//     </AuthProvider>
//   </React.StrictMode>
// );





import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import axios from "axios";
import { API_BASE_URL } from "./config";

axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    console.log("Interceptor triggered:", config);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Interceptor request error:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("Interceptor response error:", error);
    const originalRequest = error.config;
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      const delay = Math.pow(2, originalRequest._retryCount || 1) * 2000;
      console.log(`Retrying after ${delay}ms due to 429 error...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= 3) {
        return axios(originalRequest);
      }
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(
      new Error(
        error.response?.data?.error || error.message || "Network error detected"
      )
    );
  }
);

ReactDOM.render(<App />, document.getElementById("root"));
