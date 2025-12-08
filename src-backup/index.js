
//src/index.js

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import { toast } from "react-toastify"; // ✅ Remove ToastContainer import
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("authToken");
    const isAuthRoute =
      error.config?.url?.includes("/login") ||
      error.config?.url?.includes("/register") ||
      error.config?.url?.includes("/health");

    console.log("Interceptor triggered:", {
      status: error.response?.status,
      url: error.config?.url,
      hasToken: !!token,
      responseData: error.response?.data,
    });

    if (error.response?.status === 401 && !isAuthRoute) {
      console.log("Handling 401 error for URL:", error.config?.url);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error detected");
      toast.error("Network Error: Cannot connect to the server.");
    }

    return Promise.reject(error);
  }
);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* ❌ REMOVE THIS LINE: <ToastContainer /> */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);