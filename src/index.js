
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "./config";
import App from "./App";
import "./index.css";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");
    console.log("Interceptor triggered:", {
      status: error.response?.status,
      url: error.config?.url,
      headers: error.config?.headers,
      hasToken: !!token,
      tokenPrefix: token ? token.substring(0, 20) + "..." : null,
      responseData: error.response?.data,
    });

    const isAuthRoute =
      error.config?.url?.includes("/login") ||
      error.config?.url?.includes("/register") ||
      error.config?.url?.includes("/health");

    if (error.response?.status === 401 && !isAuthRoute) {
      console.log("Handling 401 error for URL:", error.config?.url);
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }, 3000);
    } else if (error.code === "ERR_NETWORK") {
      console.log("Network error detected");
      toast.error("Network Error: Cannot connect to the server.");
    }

    return Promise.reject(error);
  }
);

// Register Firebase service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Firebase Service Worker registered:", registration);
    })
    .catch((err) => {
      console.error("Firebase Service Worker registration failed:", err);
    });
}

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ToastContainer />
    <App />
  </BrowserRouter>
);