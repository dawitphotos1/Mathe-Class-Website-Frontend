import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import "./index.css";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
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
      error.config?.url?.includes("/health") ||
      error.config?.url?.includes("/users/me");
    const hasValidToken = token && token.startsWith("eyJ");

    if (error.response?.status === 401 && !isAuthRoute && hasValidToken) {
      console.log("Handling 401 error...");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.alert("Session expired. Please log in again.");
        window.location.href = "/login";
      }, 5000);
    } else if (error.code === "ERR_NETWORK") {
      console.log("Network error detected");
      window.alert("Network Error: Cannot connect to the server.");
    }

    return Promise.reject(error);
  }
);

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ToastContainer />
    <App />
  </BrowserRouter>
);

