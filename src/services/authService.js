
// services/authService.js
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ Always send cookies
});

// 🔐 Login
export const login = (payload) => api.post("/auth/login", payload);

// 📝 Register
export const register = (payload) => api.post("/auth/register", payload);

// 👤 Get current user
export const getCurrentUser = () => api.get("/auth/me");

// 🚪 Logout
export const logout = () => api.post("/auth/logout");
