
// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const saved = localStorage.getItem("user");
//       return saved ? JSON.parse(saved) : null;
//     } catch {
//       return null;
//     }
//   });
//   const [loading, setLoading] = useState(true);
//   const [checked, setChecked] = useState(false);

//   /* =====================================================
//      🔹 Verify session on page load / refresh
//   ===================================================== */
//   useEffect(() => {
//     const verifyUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.log("🔸 No token in storage — guest session");
//           setUser(null);
//           setLoading(false);
//           setChecked(true);
//           return;
//         }

//         console.log("🔐 Verifying session with token...");
//         const { data } = await axiosInstance.get("/auth/me");

//         if (data?.success && data.user) {
//           console.log("✅ Session verified for:", data.user.email);
//           setUser(data.user);
//           localStorage.setItem("user", JSON.stringify(data.user));
//         } else {
//           console.warn("⚠️ Invalid session response — logging out");
//           await safeLogout(false);
//         }
//       } catch (err) {
//         console.warn("⚠️ Session check failed:", err.response?.data || err.message);
//         await safeLogout(false);
//       } finally {
//         setLoading(false);
//         setChecked(true);
//       }
//     };

//     verifyUser();
//   }, []);

//   /* =====================================================
//      📝 Register User
//   ===================================================== */
//   const registerUser = async (payload) => {
//     try {
//       console.log("📝 Registering user:", payload.email);
//       const { data } = await axiosInstance.post("/auth/register", payload);

//       console.log("📝 Registration response:", data);

//       if (data?.success) {
//         if (data.token && data.user) {
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("user", JSON.stringify(data.user));
//           setUser(data.user);
//           setChecked(true);
//           setLoading(false);
//           return { user: data.user, token: data.token };
//         } else if (data.message) {
//           return { message: data.message, needsApproval: true };
//         }
//       }

//       throw new Error(data?.error || "Registration failed");
//     } catch (error) {
//       console.error("Registration error:", error);
//       throw error;
//     }
//   };

//   /* =====================================================
//      🔐 Login User (fixed flicker issue)
//   ===================================================== */
//   const loginUser = async ({ email, password }) => {
//     try {
//       console.log("🔐 Attempting login for:", email);
//       const { data } = await axiosInstance.post("/auth/login", { email, password });

//       console.log("🔐 Login response:", data);

//       if (data?.success && data?.token && data?.user) {
//         // ✅ Store and update state immediately
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setUser(data.user);
//         setChecked(true);   // ✅ Ensures ProtectedRoute waits
//         setLoading(false);  // ✅ Prevents "Access Denied" flicker

//         console.log("✅ Login successful:", {
//           email: data.user.email,
//           role: data.user.role,
//         });
//         return data.user;
//       }

//       throw new Error(data?.error || "Login failed");
//     } catch (error) {
//       console.error("❌ Login error:", error);
//       throw error;
//     }
//   };

//   /* =====================================================
//      🚪 Safe Logout
//   ===================================================== */
//   const safeLogout = async (redirect = true) => {
//     try {
//       await axiosInstance.post("/auth/logout");
//     } catch (err) {
//       console.warn("⚠️ Logout request failed:", err.message);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       setUser(null);
//       setChecked(true);
//       setLoading(false);
//       if (redirect && !window.location.pathname.includes("/login")) {
//         window.location.href = "/login";
//       }
//     }
//   };

//   /* =====================================================
//      🚪 Public Logout
//   ===================================================== */
//   const logoutUser = async () => {
//     await safeLogout(true);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading: loading && !checked, // prevents false loading
//         checked,
//         isAuthenticated: !!user,
//         registerUser,
//         loginUser,
//         logoutUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };





// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  const loginUser = async ({ email, password }) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  };

  const logoutUser = () => {
    axiosInstance.post("/auth/logout").finally(() => {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  };

  useEffect(() => {
    // restore session
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setChecked(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, isAuthenticated: !!user, checked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
