// // src/services/authService.js
// import axios from "axios";

// // ✅ Point to your backend base URL
// const API = axios.create({
//   baseURL: "https://mathe-class-website-backend-1.onrender.com/api/v1",
//   withCredentials: true, // ⬅️ IMPORTANT: allows cookies to be sent
// });

// // =====================
// // 🔹 Auth Services
// // =====================

// // Register
// export const register = async (userData) => {
//   const res = await API.post("/auth/register", userData);
//   return res.data;
// };

// // Login
// export const login = async (credentials) => {
//   const res = await API.post("/auth/login", credentials);
//   return res.data;
// };

// // Get current user (from cookie)
// export const getMe = async () => {
//   const res = await API.get("/auth/me");
//   return res.data;
// };

// // Logout
// export const logout = async () => {
//   const res = await API.post("/auth/logout");
//   return res.data;
// };

// export default {
//   register,
//   login,
//   getMe,
//   logout,
// };





// src/services/authService.js
import axiosInstance from "../utils/axiosInstance";

const authService = {
  login: async ({ email, password }) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    return res.data;
  },

  register: async ({ name, email, password, role, subject }) => {
    const res = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
      role,
      subject,
    });
    return res.data;
  },

  getMe: async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  },

  logout: async () => {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
  },
};

export default authService;
