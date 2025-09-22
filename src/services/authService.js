
// // src/services/authService.js
// import axiosInstance from "../utils/axiosInstance";

// const authService = {
//   login: async ({ email, password }) => {
//     const res = await axiosInstance.post("/auth/login", { email, password });
//     return res.data;
//   },

//   register: async ({ name, email, password, role, subject }) => {
//     const res = await axiosInstance.post("/auth/register", {
//       name,
//       email,
//       password,
//       role,
//       subject,
//     });
//     return res.data;
//   },

//   getMe: async () => {
//     const res = await axiosInstance.get("/auth/me");
//     return res.data;
//   },

//   logout: async () => {
//     const res = await axiosInstance.post("/auth/logout");
//     return res.data;
//   },
// };

// export default authService;





import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/auth", // adjust to your backend
  withCredentials: true, // sends cookies
});

export const login = async (credentials) => {
  const res = await API.post("/login", credentials);
  return res.data;
};

export const register = async (data) => {
  const res = await API.post("/register", data);
  return res.data;
};

export const logout = async () => {
  const res = await API.post("/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/me");
  return res.data;
};
