
// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1"; // only ONE /api/v1

// 🔐 Login
export const login = (payload) =>
  axios.post(`${API_URL}/auth/login`, payload, { withCredentials: true });

// 📝 Register
export const register = (payload) =>
  axios.post(`${API_URL}/auth/register`, payload, { withCredentials: true });

// 👤 Get current user
export const getCurrentUser = () =>
  axios.get(`${API_URL}/auth/me`, { withCredentials: true });

// 🚪 Logout
export const logout = () =>
  axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });




// // src/services/authService.js
// import axiosInstance from "../utils/axiosInstance";

// // 🔐 Login
// export const login = (payload) =>
//   axiosInstance.post("/auth/login", payload, { withCredentials: true });

// // 📝 Register
// export const register = (payload) =>
//   axiosInstance.post("/auth/register", payload, { withCredentials: true });

// // 👤 Get current user
// export const getCurrentUser = () =>
//   axiosInstance.get("/auth/me", { withCredentials: true });

// // 🚪 Logout
// export const logout = () =>
//   axiosInstance.post("/auth/logout", {}, { withCredentials: true });
