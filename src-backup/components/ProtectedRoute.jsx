
// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const DEBUG = false; // 🧩 Set to true to log route access details

/**
 * ✅ ProtectedRoute
 * Restricts access to authenticated users whose roles match the allowedRoles.
 * Shows a loading screen until AuthContext finishes checking the session.
 *
 * @param {ReactNode} children - component to render if access is granted
 * @param {string[]} allowedRoles - roles allowed to access this route
 * @param {string} redirectPath - fallback path for unauthorized access
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectPath = "/unauthorized",
}) => {
  const { user, loading: authLoading, checked, isAuthenticated } = useAuth();
  const location = useLocation();

  // 🕐 Wait until authentication state is fully loaded
  if (authLoading || !checked) {
    if (DEBUG) console.log("⏳ Waiting for AuthContext to complete...");
    return <Loading />;
  }

  if (DEBUG) {
    console.log("🛡️ ProtectedRoute →", {
      path: location.pathname,
      isAuthenticated,
      user,
      allowedRoles,
    });
  }

  // 🚫 Not authenticated — redirect to login
  if (!isAuthenticated) {
    if (DEBUG) console.warn("🚫 User not authenticated → redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Authenticated but role not allowed
  if (
    allowedRoles.length > 0 &&
    user?.role &&
    !allowedRoles.includes(user.role)
  ) {
    if (DEBUG) {
      console.warn("🚫 Role not authorized →", {
        userRole: user.role,
        allowedRoles,
        path: location.pathname,
      });
    }

    // 👑 Special rule: admins always go to /admin
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    // 🚷 Everyone else → redirect to fallback page
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Access granted
  if (DEBUG)
    console.log("✅ Access granted:", location.pathname, "for", user.role);
  return children;
};

export default ProtectedRoute;
