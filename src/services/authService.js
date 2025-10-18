
// // src/services/authService.js
// import axiosInstance from "../utils/axiosInstance";

// // 🔑 Login
// export const login = async ({ email, password }) => {
//   const res = await axiosInstance.post("/auth/login", { email, password });

//   // Save JWT in localStorage so axiosInstance can attach it
//   if (res.data?.token) {
//     localStorage.setItem("authToken", res.data.token);
//   }

//   return res;
// };

// // 📝 Register
// export const register = async (payload) => {
//   const res = await axiosInstance.post("/auth/register", payload);

//   // If auto-login (teacher/admin), save token
//   if (res.data?.token) {
//     localStorage.setItem("authToken", res.data.token);
//   }

//   return res;
// };

// // 👤 Get current user
// export const getCurrentUser = async () => {
//   const res = await axiosInstance.get("/auth/me");
//   return res;
// };

// // 🚪 Logout
// export const logout = async () => {
//   await axiosInstance.post("/auth/logout");

//   // Clear token on logout
//   localStorage.removeItem("authToken");
// };




// src/services/authService.js
import axiosInstance from "../utils/axiosInstance";

// 🔑 Login
export const login = async ({ email, password }) => {
  const res = await axiosInstance.post("/auth/login", { email, password });

  // ✅ Use the same key name as AuthContext & axiosInstance
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res;
};

// 📝 Register
export const registerUser = async (payload) => {
  const res = await axiosInstance.post("/auth/register", payload);

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
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
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
