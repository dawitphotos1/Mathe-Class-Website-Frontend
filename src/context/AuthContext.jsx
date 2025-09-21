
// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { toast } from "react-toastify";

// export const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const logoutUser = useCallback(async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//     setUser(null);
//     localStorage.removeItem("authUser");
//     toast.info("Logged out");
//     navigate("/login");
//   }, [navigate]);

//   // On mount → check session
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axiosInstance.get("/auth/me");
//         setUser(res.data.user);
//         localStorage.setItem("authUser", JSON.stringify(res.data.user));
//       } catch (err) {
//         console.warn("Not authenticated");
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const loginUser = async (email, password) => {
//     try {
//       const res = await axiosInstance.post("/auth/login", { email, password });
//       setUser(res.data.user);
//       localStorage.setItem("authUser", JSON.stringify(res.data.user));
//       toast.success("Logged in successfully");
//       navigate("/courses");
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Login failed");
//       throw err;
//     }
//   };

//   const registerUser = async (name, email, password, role, subject) => {
//     try {
//       const res = await axiosInstance.post("/auth/register", { name, email, password, role, subject });
//       if (res.data.user.approval_status === "approved") {
//         setUser(res.data.user);
//         localStorage.setItem("authUser", JSON.stringify(res.data.user));
//         toast.success("Registered and logged in");
//         navigate("/courses");
//       } else {
//         toast.info("Registration pending approval");
//         navigate("/login");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Registration failed");
//       throw err;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService"; // ✅ Using your new service

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔒 Logout
  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("authUser");
      toast.info("Logged out");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  }, [navigate]);

  // 🔐 Login
  const loginUser = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      toast.success("Logged in successfully");
      navigate("/courses");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
      throw err;
    }
  };

  // 📝 Register
  const registerUser = async (name, email, password, role, subject) => {
    try {
      const data = await authService.register({
        name,
        email,
        password,
        role,
        subject,
      });

      if (data.user.approval_status === "approved") {
        setUser(data.user);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        toast.success("Registered and logged in");
        navigate("/courses");
      } else {
        toast.info("Registration pending approval");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  // 🚀 On mount: check user session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.getMe();
        setUser(data.user);
        localStorage.setItem("authUser", JSON.stringify(data.user));
      } catch (err) {
        console.warn("Not authenticated");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        loginUser,
        logoutUser,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
