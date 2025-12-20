// // src/components/RoleRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Loading from "./Loading";

// /**
//  * RoleRoute can be used for both public and protected routes.
//  * - allowedRoles: array of roles that can access the route
//  * - redirectPath: where to redirect unauthorized users
//  * - children: the component to render
//  * - publicRoute: boolean to handle routes for unauthenticated users
//  */
// const RoleRoute = ({
//   allowedRoles = [],
//   redirectPath = "/",
//   publicRoute = false,
//   children,
// }) => {
//   const { isAuthenticated, loading, checked, user } = useAuth();

//   if (loading || !checked) return <Loading />;

//   // PUBLIC ROUTE: redirect logged-in users based on role
//   if (publicRoute && isAuthenticated) {
//     switch (user?.role) {
//       case "admin":
//         return <Navigate to="/admin" replace />;
//       case "teacher":
//         return <Navigate to="/teacher-dashboard" replace />;
//       case "student":
//         return <Navigate to="/my-courses" replace />;
//       default:
//         return <Navigate to="/" replace />;
//     }
//   }

//   // PROTECTED ROUTE: restrict by role
//   if (allowedRoles.length > 0) {
//     if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
//       return <Navigate to={redirectPath} replace />;
//     }
//   }

//   return children;
// };

// export default RoleRoute;





// src/components/RoleRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

/**
 * RoleRoute can be used for both public and protected routes.
 * - allowedRoles: array of roles that can access the route
 * - redirectPath: where to redirect unauthorized users
 * - children: the component to render
 * - publicRoute: boolean to handle routes for unauthenticated users
 */
const RoleRoute = ({ allowedRoles = [], redirectPath = "/", publicRoute = false, children }) => {
  const { isAuthenticated, loading, checked, user } = useAuth();

  if (loading || !checked) return <Loading />;

  // PUBLIC ROUTE: redirect logged-in users based on role
  if (publicRoute && isAuthenticated) {
    switch (user?.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "teacher":
        return <Navigate to="/teacher-dashboard" replace />;
      case "student":
        return <Navigate to="/my-courses" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // PROTECTED ROUTE: restrict by role
  if (allowedRoles.length > 0) {
    if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default RoleRoute;
