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
  const [checked, setChecked] = useState(false); // prevents false 401 redirects

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
          return;
        }

        const { data } = await axiosInstance.get("/auth/me");
        if (data?.success && data.user) {
          console.log("✅ Session verified for:", data.user.email);
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          console.warn("⚠️ Invalid session response — logging out");
          await safeLogout();
        }
      } catch (err) {
        console.warn(
          "⚠️ Session check failed:",
          err.response?.data || err.message
        );
        await safeLogout(false); // don’t force redirect while verifying
      } finally {
        setLoading(false);
        setChecked(true);
      }
    };

    verifyUser();
  }, []);

  /* =====================================================
     🔐 Login User
  ===================================================== */
  const loginUser = async ({ email, password }) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    if (data?.token && data?.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { ...data.user, token: data.token };
    }

    throw new Error(data?.error || "Login failed");
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
      if (redirect) window.location.href = "/login";
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
        loading: loading && !checked, // prevent early redirects
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
