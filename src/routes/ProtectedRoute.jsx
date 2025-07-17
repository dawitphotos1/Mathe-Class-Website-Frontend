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


import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext"; // Import UserContext

const ProtectedRoute = ({ children, allowedRoles }) => {
  const context = useContext(UserContext); // Use UserContext instead of ThemeContext
  const { user } = context || {}; // Destructure user from context

  if (!user) {
    toast.error("Please log in to access this page");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.error("You do not have permission to access this page");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
