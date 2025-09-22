
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
