// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ allowedRoles = [], children }) => {
//   const { user, isAuthenticated, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // If not authenticated, redirect to login
//   if (!isAuthenticated) {
//     console.log("ProtectedRoute: Not authenticated, redirecting to /login", {
//       path: location.pathname,
//     });
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Normalize role to lowercase
//   const userRole = user?.role?.toLowerCase();

//   // If role not allowed, redirect to unauthorized
//   if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//     console.warn("ProtectedRoute: Unauthorized role", {
//       userRole,
//       allowedRoles,
//       path: location.pathname,
//     });
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Render the child component
//   console.log("ProtectedRoute: Access granted", {
//     userRole,
//     path: location.pathname,
//   });
//   return children;
// };

// export default ProtectedRoute;





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
