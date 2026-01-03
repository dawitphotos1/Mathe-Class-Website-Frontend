// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const res = await axiosInstance.get("/auth/me");
      if (res.data?.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    setLoading(true);
    const res = await axiosInstance.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    setLoading(false);
    setChecked(true);
  };

  const logoutUser = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setChecked(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      checked,
      login,
      logoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
