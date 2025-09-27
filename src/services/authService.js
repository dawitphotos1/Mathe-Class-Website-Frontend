
// // services/authService.js
// import axios from "axios";

// const API_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// // Create axios instance with defaults
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // ✅ Always send cookies
// });

// // 🔐 Login
// export const login = (payload) => api.post("/auth/login", payload);

// // 📝 Register
// export const register = (payload) => api.post("/auth/register", payload);

// // 👤 Get current user
// export const getCurrentUser = () => api.get("/auth/me");

// // 🚪 Logout
// export const logout = () => api.post("/auth/logout");





// src/services/authService.js
import axiosInstance from "../utils/axiosInstance";

// 🔑 Login
export const login = async ({ email, password }) => {
  const res = await axiosInstance.post("/auth/login", { email, password });

  // Save JWT in localStorage so axiosInstance can attach it
  if (res.data?.token) {
    localStorage.setItem("authToken", res.data.token);
  }

  return res;
};

// 📝 Register
export const register = async (payload) => {
  const res = await axiosInstance.post("/auth/register", payload);

  // If auto-login (teacher/admin), save token
  if (res.data?.token) {
    localStorage.setItem("authToken", res.data.token);
  }

  return res;
};

// 👤 Get current user
export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res;
};

// 🚪 Logout
export const logout = async () => {
  await axiosInstance.post("/auth/logout");

  // Clear token on logout
  localStorage.removeItem("authToken");
};
