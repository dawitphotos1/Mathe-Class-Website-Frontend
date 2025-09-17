
// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Still verifying token → show spinner instead of redirect
  if (loading) {
    return <Loading />;
  }

  // No user logged in → send to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // User logged in but role not allowed → unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
