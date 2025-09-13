
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { API_BASE_URL } from "./config";
// import App from "./App";
// import { AuthProvider } from "./context/AuthContext";
// import "./index.css";

// axios.defaults.baseURL = API_BASE_URL;
// axios.defaults.withCredentials = true;

// // Global error interceptor
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const isAuthRoute = error.config?.url?.includes("/auth/");
//     const url = error.config?.url || "unknown";
//     const token = localStorage.getItem("token");

//     console.log("Interceptor triggered:", {
//       status: error.response?.status,
//       url,
//       headers: error.config?.headers,
//       hasToken: !!token,
//       responseData: error.response?.data,
//     });

//     if (error.response?.status === 401 && !isAuthRoute) {
//       console.log("Handling 401 error for URL:", url);
//       setTimeout(() => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         toast.error("Session expired. Please log in again.", {
//           autoClose: 2000,
//         });
//         window.location.href = "/login";
//       }, 2500);
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
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import axiosInstance from "./utils/axiosInstance"; // Correct import

// Global error interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");
    const url = error.config?.url || "unknown";
    const token = localStorage.getItem("token");

    console.log("Interceptor triggered:", {
      status: error.response?.status,
      url,
      headers: error.config?.headers,
      hasToken: !!token,
      responseData: error.response?.data,
    });

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Session expired. Please log in again.", { autoClose: 2000 });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else if (error.code === "ERR_NETWORK") {
      toast.error("Network Error: Cannot connect to the server.", {
        autoClose: 2000,
      });
    }

    return Promise.reject(error);
  }
);

// Unregister service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log("Service worker unregistered:", registration);
        });
      }
    })
    .catch((err) => {
      console.error("Failed to unregister service workers:", err);
    });
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);