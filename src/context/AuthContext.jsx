// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [checked, setChecked] = useState(false);

//   // ✅ ADDED: Register function
//   const registerUser = async (userData) => {
//     try {
//       console.log("📝 Registering user:", userData);
//       const response = await axiosInstance.post("/auth/register", userData);
      
//       console.log("✅ Registration response:", response.data);
      
//       // If registration includes token (auto-login), set user
//       if (response.data.token) {
//         setUser(response.data.user);
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         localStorage.setItem("token", response.data.token);
//       }
      
//       return response.data;
//     } catch (error) {
//       console.error("❌ Registration error:", error);
//       throw error;
//     }
//   };

//   const loginUser = async ({ email, password }) => {
//     try {
//       const response = await axiosInstance.post("/auth/login", { email, password });
//       setUser(response.data.user);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//       localStorage.setItem("token", response.data.token);
//       return response.data.user;
//     } catch (error) {
//       console.error("❌ Login error:", error);
//       throw error;
//     }
//   };

//   const logoutUser = () => {
//     // Clear local storage first
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);
    
//     // Then call backend logout
//     axiosInstance.post("/auth/logout").catch(err => {
//       console.error("Logout API error:", err);
//     }).finally(() => {
//       window.location.href = "/login";
//     });
//   };

//   // Get current user
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
//       return response.data;
//     } catch (error) {
//       console.error("Get current user error:", error);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);
//       return null;
//     } finally {
//       setLoading(false);
//       setChecked(true);
//     }
//   };

//   // Check authentication status on app load
//   useEffect(() => {
//     const checkAuth = async () => {
//       const savedUser = localStorage.getItem("user");
//       const token = localStorage.getItem("token");
      
//       if (savedUser && token) {
//         try {
//           // Verify token is still valid
//           await getCurrentUser();
//         } catch (error) {
//           console.error("Auth check failed:", error);
//           setLoading(false);
//           setChecked(true);
//         }
//       } else {
//         setLoading(false);
//         setChecked(true);
//       }
//     };

//     checkAuth();
//   }, []);

//   const value = {
//     user,
//     loading,
//     checked,
//     registerUser, // ✅ ADDED - This was missing!
//     loginUser,
//     logoutUser,
//     getCurrentUser,
//     isAuthenticated: !!user,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };





// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  /* ============================================================
     📝 Register New User (with timeout + token handling)
  ============================================================ */
  const registerUser = async (userData) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s cap

    try {
      console.log("📝 Registering user:", userData);
      const response = await axiosInstance.post("/auth/register", userData, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      console.log("✅ Registration response:", response.data);

      // If backend returns a token → auto login
      if (response.data.token) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }

      return response.data;
    } catch (error) {
      clearTimeout(timeout);
      console.error("❌ Registration error:", error);
      throw error;
    }
  };

  /* ============================================================
     🔐 Login Existing User (with timeout)
  ============================================================ */
  const loginUser = async ({ email, password }) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s cap

    try {
      const response = await axiosInstance.post(
        "/auth/login",
        { email, password },
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      const { user, token } = response.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return user;
    } catch (error) {
      clearTimeout(timeout);
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  /* ============================================================
     🚪 Logout User
  ============================================================ */
  const logoutUser = async () => {
    try {
      // Clear local session first
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
     👤 Get Current Authenticated User
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
     🔍 Check Auth Status on App Load
  ============================================================ */
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && token) {
        try {
          await getCurrentUser(); // verify still valid
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ============================================================
   🔗 Hook for Components
============================================================ */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
