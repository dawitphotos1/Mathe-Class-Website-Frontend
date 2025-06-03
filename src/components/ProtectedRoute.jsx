
// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ allowedRoles = [], children }) => {
//   const { user } = useContext(AuthContext);

//   console.log(
//     "🔐 ProtectedRoute: user =",
//     user,
//     "allowedRoles =",
//     allowedRoles
//   );

//   if (!user) {
//     console.warn("🔐 No user found, redirecting to /login");
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     console.warn(`🚫 Access denied for role "${user.role}"`);
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// export default ProtectedRoute;



import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
