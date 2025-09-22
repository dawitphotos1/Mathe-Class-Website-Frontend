
import axiosInstance from "../utils/axiosInstance";

// Individual functions
export const login = async ({ email, password }) => {
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data;
};

export const register = async ({ name, email, password, role, subject }) => {
  const res = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
    role,
    subject,
  });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

// ✅ Bundle into default export for backward compatibility
const authService = {
  login,
  register,
  getCurrentUser,
  logout,
};

export default authService;
