// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  const checkingRef = useRef(false);
  const lastCheckRef = useRef(0);

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async ({ force = false } = {}) => {
    try {
      if (checkingRef.current && !force) return;
      const now = Date.now();
      if (!force && now - lastCheckRef.current < 3000) return;

      checkingRef.current = true;
      lastCheckRef.current = now;
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        setChecked(true);
        checkingRef.current = false;
        return;
      }

      const response = await axiosInstance.get("/auth/me");
      if (response.data?.success && response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn("Auth rate-limited. Will not retry automatically.");
      } else {
        console.error("Auth check failed:", error);
      }
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setChecked(true);
      checkingRef.current = false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });

      if (response.data?.success) {
        const { user: loggedUser, token } = response.data;
        if (token) localStorage.setItem("token", token);
        setUser(loggedUser);
        setIsAuthenticated(true);
        return { success: true, user: loggedUser };
      }
      return { success: false, error: response.data?.error || "Login failed" };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || error.message || "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      if (response.data?.success) {
        const { user: newUser, token } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          setUser(newUser);
          setIsAuthenticated(true);
        }
        return { success: true, user: token ? newUser : null };
      }
      return { success: false, error: response.data?.error || "Registration failed" };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || error.message || "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  const logoutUser = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    checked,
    login,
    register,
    logoutUser,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;