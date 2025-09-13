
// import React, { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ allowedRoles = [], children }) => {
//   const { user } = useContext(AuthContext);
//   const location = useLocation();

//   // 🔒 If not logged in → redirect to login (and preserve where they tried to go)
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 🚫 If logged in but role is not allowed → redirect to unauthorized
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // ✅ Otherwise render the child component
//   return children;
// };

// export default ProtectedRoute;




import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated || !user) {
    console.log("🚫 ProtectedRoute: Redirecting to /login (unauthenticated)");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(
      `🚫 ProtectedRoute: Redirecting to /unauthorized (role ${user.role} not allowed)`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;