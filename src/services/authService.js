// // src/services/authService.js
// import axios from "axios";
// import { API_BASE_URL } from "../config";

// // Create axios instance
// const api = axios.create({
//   baseURL: `${API_BASE_URL}/api/v1/auth`,
//   withCredentials: true, // ✅ send cookies with requests
// });

// // -------------------------
// // 🔐 LOGIN
// // -------------------------
// export const login = async ({ email, password }) => {
//   const res = await api.post("/login", { email, password });
//   return res.data;
// };

// // -------------------------
// // 📝 REGISTER
// // -------------------------
// export const register = async (payload) => {
//   const res = await api.post("/register", payload);
//   return res.data;
// };

// // -------------------------
// // 👤 CURRENT USER
// // -------------------------
// export const getCurrentUser = async () => {
//   const res = await api.get("/me");
//   return res.data;
// };

// // -------------------------
// // 🚪 LOGOUT
// // -------------------------
// export const logout = async () => {
//   const res = await api.post("/logout");
//   return res.data;
// };




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
