
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  console.log("ProtectedRoute: user=", user, "allowedRoles=", allowedRoles);
  if (!user) {
    console.log("ProtectedRoute: Redirecting to /login: No user");
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("ProtectedRoute: Redirecting to /: Invalid role", user.role);
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;