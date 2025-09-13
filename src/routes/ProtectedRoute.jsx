import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);

  console.log("ProtectedRoute: user=", user, "allowedRoles=", allowedRoles);

  if (!user) {
    console.warn("🔒 Redirecting to login: No user");
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.warn("🚫 Unauthorized role:", user.role);
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
