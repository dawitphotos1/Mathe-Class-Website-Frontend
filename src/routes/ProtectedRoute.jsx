
// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Unauthorized from "../Pages/Unauthorized"; // ✅ make sure this exists
import { FaYenSign } from "react-icons/fa";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, isAuthenticated } = useContext(AuthContext);

  // 🚫 Not logged in → redirect to login
  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role mismatch → Unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Unauthorized />;
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
FaYenSign