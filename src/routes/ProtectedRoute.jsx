// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ allowedRoles, children }) => {
//   const { user } = useContext(AuthContext);

//   console.log("ProtectedRoute: user=", user, "allowedRoles=", allowedRoles);

//   if (!user) {
//     console.warn("🔒 Redirecting to login: No user");
//     return <Navigate to="/login" />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     console.warn("🚫 Unauthorized role:", user.role);
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// export default ProtectedRoute;



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