
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
