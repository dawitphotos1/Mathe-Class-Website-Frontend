
// // src/context/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [checked, setChecked] = useState(false);

//   const loginUser = async ({ email, password }) => {
//     const res = await axiosInstance.post("/auth/login", { email, password });
//     setUser(res.data.user);
//     localStorage.setItem("user", JSON.stringify(res.data.user));
//     return res.data.user;
//   };

//   const logoutUser = () => {
//     axiosInstance.post("/auth/logout").finally(() => {
//       setUser(null);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     });
//   };

//   useEffect(() => {
//     // restore session
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) setUser(JSON.parse(savedUser));
//     setChecked(true);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loginUser, logoutUser, isAuthenticated: !!user, checked }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  // ✅ ADDED: Register function
  const registerUser = async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      
      // If registration includes token (auto-login), set user
      if (response.data.token) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const loginUser = async ({ email, password }) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    setUser(response.data.user);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  };

  const logoutUser = () => {
    axiosInstance.post("/auth/logout").finally(() => {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    // Restore session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setChecked(true);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginUser, 
      logoutUser, 
      registerUser, // ✅ ADDED
      getCurrentUser, // ✅ ADDED
      isAuthenticated: !!user, 
      checked 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};