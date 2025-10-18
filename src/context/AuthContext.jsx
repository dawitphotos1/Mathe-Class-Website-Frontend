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
//   const [checked, setChecked] = useState(false); // prevents false 401 redirects

//   /* =====================================================
//      🔹 Auto-verify session on load / refresh
//   ===================================================== */
//   useEffect(() => {
//     const verifyUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.log("🔸 No token in storage — guest session");
//           setUser(null);
//           return;
//         }

//         const { data } = await axiosInstance.get("/auth/me");
//         if (data?.success && data.user) {
//           console.log("✅ Session verified for:", data.user.email);
//           setUser(data.user);
//           localStorage.setItem("user", JSON.stringify(data.user));
//         } else {
//           console.warn("⚠️ Invalid session response — logging out");
//           await safeLogout();
//         }
//       } catch (err) {
//         console.warn(
//           "⚠️ Session check failed:",
//           err.response?.data || err.message
//         );
//         await safeLogout(false); // don’t force redirect while verifying
//       } finally {
//         setLoading(false);
//         setChecked(true);
//       }
//     };

//     verifyUser();
//   }, []);

//   /* =====================================================
//      🔐 Login User
//   ===================================================== */
//   const loginUser = async ({ email, password }) => {
//     const { data } = await axiosInstance.post("/auth/login", {
//       email,
//       password,
//     });

//     if (data?.token && data?.user) {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setUser(data.user);
//       return { ...data.user, token: data.token };
//     }

//     throw new Error(data?.error || "Login failed");
//   };

//   /* =====================================================
//      🚪 Safe Logout (shared)
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
//       if (redirect) window.location.href = "/login";
//     }
//   };

//   /* =====================================================
//      🚪 Public Logout Function
//   ===================================================== */
//   const logoutUser = async () => {
//     await safeLogout(true);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading: loading && !checked, // prevent early redirects
//         loginUser,
//         logoutUser,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  /* =====================================================
     🔹 Auto-verify session on load / refresh
  ===================================================== */
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("🔸 No token in storage — guest session");
          setUser(null);
          setLoading(false);
          setChecked(true);
          return;
        }

        console.log("🔐 Verifying session with token...");
        const { data } = await axiosInstance.get("/auth/me");
        
        if (data?.success && data.user) {
          console.log("✅ Session verified for:", data.user.email);
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          console.warn("⚠️ Invalid session response — logging out");
          await safeLogout(false);
        }
      } catch (err) {
        console.warn("⚠️ Session check failed:", err.response?.data || err.message);
        await safeLogout(false);
      } finally {
        setLoading(false);
        setChecked(true);
      }
    };

    verifyUser();
  }, []);

  /* =====================================================
     📝 Register User
  ===================================================== */
  const registerUser = async (payload) => {
    try {
      console.log("📝 Registering user:", payload.email);
      const { data } = await axiosInstance.post("/auth/register", payload);

      console.log("📝 Registration response:", data);

      if (data?.success) {
        if (data.token && data.user) {
          // Auto-login after registration
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          return { user: data.user, token: data.token };
        } else if (data.message) {
          // Registration successful but needs approval
          return { message: data.message, needsApproval: true };
        }
      }
      throw new Error(data?.error || "Registration failed");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  /* =====================================================
     🔐 Login User
  ===================================================== */
  const loginUser = async ({ email, password }) => {
    try {
      console.log("🔐 Attempting login for:", email);
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      console.log("🔐 Login response:", data);

      if (data?.success && data?.token && data?.user) {
        // Store tokens and update state
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        console.log("✅ Login successful, user state updated:", data.user.email);
        return data.user;
      }

      throw new Error(data?.error || "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /* =====================================================
     🚪 Safe Logout (shared)
  ===================================================== */
  const safeLogout = async (redirect = true) => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.warn("⚠️ Logout request failed:", err.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      if (redirect && !window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
  };

  /* =====================================================
     🚪 Public Logout Function
  ===================================================== */
  const logoutUser = async () => {
    await safeLogout(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading && !checked,
        checked,
        registerUser,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};