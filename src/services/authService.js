
// import axiosInstance from "../utils/axiosInstance";

// // Individual functions
// export const login = async ({ email, password }) => {
//   const res = await axiosInstance.post("/auth/login", { email, password });
//   return res.data;
// };

// export const register = async ({ name, email, password, role, subject }) => {
//   const res = await axiosInstance.post("/auth/register", {
//     name,
//     email,
//     password,
//     role,
//     subject,
//   });
//   return res.data;
// };

// export const getCurrentUser = async () => {
//   const res = await axiosInstance.get("/auth/me");
//   return res.data;
// };

// export const logout = async () => {
//   const res = await axiosInstance.post("/auth/logout");
//   return res.data;
// };

// // ✅ Bundle into default export for backward compatibility
// const authService = {
//   login,
//   register,
//   getCurrentUser,
//   logout,
// };

// export default authService;




// src/services/authService.js
import axios from "axios";
import { API_BASE_URL } from "../config";

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/auth`,
  withCredentials: true, // ✅ send cookies with requests
});

// -------------------------
// 🔐 LOGIN
// -------------------------
export const login = async ({ email, password }) => {
  const res = await api.post("/login", { email, password });
  return res.data;
};

// -------------------------
// 📝 REGISTER
// -------------------------
export const register = async (payload) => {
  const res = await api.post("/register", payload);
  return res.data;
};

// -------------------------
// 👤 CURRENT USER
// -------------------------
export const getCurrentUser = async () => {
  const res = await api.get("/me");
  return res.data;
};

// -------------------------
// 🚪 LOGOUT
// -------------------------
export const logout = async () => {
  const res = await api.post("/logout");
  return res.data;
};
