//components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ While checking authentication, show a loading screen
  if (loading) return <Loading />;

  // 🔐 If user is not logged in, redirect to login
  if (!user) {
    console.warn("🚫 ProtectedRoute: Not logged in, redirecting to /login");
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "Your session has expired. Please log in again.",
        }}
      />
    );
  }

  // 🧭 If route has restricted roles and user doesn’t match
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(
      `🚫 ProtectedRoute: Access denied for role "${user.role}". Allowed: ${allowedRoles}`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authenticated and authorized — render the child route
  return children;
};

export default ProtectedRoute;
