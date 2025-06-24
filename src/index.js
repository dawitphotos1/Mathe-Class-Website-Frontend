
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




// C:\Users\Dawit\Desktop\math-class-website\Mathe-Class-Website-Frontend\src\index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { API_BASE_URL } from "./config";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Global error interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('token');
    console.log('Interceptor triggered:', {
      status: error.response?.status,
      url: error.config?.url,
      headers: error.config?.headers,
      hasToken: !!token,
      tokenPrefix: token ? token.substring(0, 20) + '...' : null,
      responseData: error.response?.data,
    });

    const isAuthRoute =
      error.config?.url?.includes('/login') ||
      error.config?.url?.includes('/register') ||
      error.config?.url?.includes('/health');

    if (error.response?.status === 401 && !isAuthRoute) {
      console.log('Handling 401 error for URL:', error.config?.url);
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }, 3000);
    } else if (error.code === 'ERR_NETWORK') {
      console.log('Network error detected');
      toast.error('Network Error: Cannot connect to the server.');
    }

    return Promise.reject(error);
  }
);

// Unregister service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log('Service worker unregistered:', registration);
        });
      }
    })
    .catch((err) => {
      console.error('Failed to unregister service workers:', err);
    });
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);