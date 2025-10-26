// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import axiosInstance, { ensureBackendWarm } from "../utils/axiosInstance";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [checked, setChecked] = useState(false);

//   /* ============================================================
//      🧊 Warm up backend when app starts (Render cold-start fix)
//   ============================================================ */
//   useEffect(() => {
//     ensureBackendWarm();
//   }, []);

//   /* ============================================================
//      📝 Register User
//   ============================================================ */
//   const registerUser = async (userData) => {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 15000);

//     try {
//       console.log("📝 Registering user:", userData);
//       const response = await axiosInstance.post("/auth/register", userData, {
//         signal: controller.signal,
//       });
//       clearTimeout(timeout);

//       console.log("✅ Registration response:", response.data);

//       if (response.data.token) {
//         const { user, token } = response.data;
//         setUser(user);
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("token", token);
//       }

//       return response.data;
//     } catch (error) {
//       clearTimeout(timeout);
//       console.error("❌ Registration error:", error);
//       throw error;
//     }
//   };

//   /* ============================================================
//      🔐 Login User
//   ============================================================ */
//   const loginUser = async ({ email, password }) => {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 15000);

//     try {
//       const response = await axiosInstance.post(
//         "/auth/login",
//         { email, password },
//         { signal: controller.signal }
//       );
//       clearTimeout(timeout);

//       const { user, token } = response.data;
//       setUser(user);
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("token", token);

//       return user;
//     } catch (error) {
//       clearTimeout(timeout);
//       console.error("❌ Login error:", error);
//       throw error;
//     }
//   };

//   /* ============================================================
//      🚪 Logout User
//   ============================================================ */
//   const logoutUser = async () => {
//     try {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);

//       await axiosInstance.post("/auth/logout");
//     } catch (err) {
//       console.error("Logout API error:", err);
//     } finally {
//       window.location.href = "/login";
//     }
//   };

//   /* ============================================================
//      👤 Get Current User
//   ============================================================ */
//   const getCurrentUser = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         setChecked(true);
//         return null;
//       }

//       const response = await axiosInstance.get("/auth/me");
//       setUser(response.data.user);
//       return response.data.user;
//     } catch (error) {
//       console.error("❌ Get current user error:", error);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);
//       return null;
//     } finally {
//       setLoading(false);
//       setChecked(true);
//     }
//   };

//   /* ============================================================
//      🔍 Check Auth on App Load
//   ============================================================ */
//   useEffect(() => {
//     const checkAuth = async () => {
//       const savedUser = localStorage.getItem("user");
//       const token = localStorage.getItem("token");

//       if (savedUser && token) {
//         try {
//           await getCurrentUser();
//         } catch (error) {
//           console.error("Auth check failed:", error);
//         }
//       } else {
//         setLoading(false);
//         setChecked(true);
//       }
//     };

//     checkAuth();
//   }, []);

//   /* ============================================================
//      📦 Context Value
//   ============================================================ */
//   const value = {
//     user,
//     loading,
//     checked,
//     registerUser,
//     loginUser,
//     logoutUser,
//     getCurrentUser,
//     isAuthenticated: !!user,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// /* ============================================================
//    🔗 Hook
// ============================================================ */
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };





// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance, { ensureBackendWarm } from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  /* ============================================================
     🧊 ONE-TIME backend warmup
  ============================================================ */
  useEffect(() => {
    // Delay warmup to avoid interfering with initial page load
    const timer = setTimeout(() => {
      ensureBackendWarm();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  /* ============================================================
     📝 Register User - SIMPLIFIED (no manual timeouts)
  ============================================================ */
  const registerUser = async (userData) => {
    try {
      console.log("📝 Registering user:", userData);

      // ⬅️ NO AbortController, NO manual timeout - let axios handle it
      const response = await axiosInstance.post("/auth/register", userData);

      console.log("✅ Registration successful:", response.data);

      if (response.data.token) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }

      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);

      // Provide specific error messages
      if (error.response?.status === 400) {
        if (error.response.data?.error?.includes("already exists")) {
          throw new Error(
            "This email is already registered. Please try logging in."
          );
        }
        throw new Error(
          error.response.data?.error || "Invalid registration data."
        );
      } else if (error.code === "ECONNABORTED") {
        throw new Error(
          "Registration is taking longer than expected. Please wait a moment and try again."
        );
      } else {
        throw new Error(
          "Registration failed. Please check your connection and try again."
        );
      }
    }
  };

  /* ============================================================
     🔐 Login User - SIMPLIFIED
  ============================================================ */
  const loginUser = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { user, token } = response.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return user;
    } catch (error) {
      console.error("❌ Login error:", error);

      if (error.response?.status === 401) {
        throw new Error("Invalid email or password.");
      } else if (error.code === "ECONNABORTED") {
        throw new Error("Login timeout. Please try again.");
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  };

  /* ============================================================
     🚪 Logout User
  ============================================================ */
  const logoutUser = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      window.location.href = "/login";
    }
  };

  /* ============================================================
     👤 Get Current User
  ============================================================ */
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setChecked(true);
        return null;
      }

      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("❌ Get current user error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  /* ============================================================
     🔍 Check Auth on App Load
  ============================================================ */
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && token) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error("Auth check failed:", error);
        }
      } else {
        setLoading(false);
        setChecked(true);
      }
    };

    checkAuth();
  }, []);

  /* ============================================================
     📦 Context Value
  ============================================================ */
  const value = {
    user,
    loading,
    checked,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};