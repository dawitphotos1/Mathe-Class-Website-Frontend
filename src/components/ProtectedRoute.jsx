// // src/components/ProtectedRoute.jsx
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Loading from "./Loading";

// const DEBUG = false; // 🐞 Toggle this to true if you want to see console logs

// /**
//  * ProtectedRoute — restricts access to authenticated users with allowed roles
//  * @param {ReactNode} children - Component to render if access is granted
//  * @param {string[]} allowedRoles - Array of roles allowed to access this route
//  * @param {string} redirectPath - Optional path to redirect unauthorized users (default: /unauthorized)
//  */
// const ProtectedRoute = ({ children, allowedRoles = [], redirectPath = "/unauthorized" }) => {
//   const { user, loading: authLoading, checked, isAuthenticated } = useAuth();
//   const location = useLocation();

//   // Wait for AuthContext to load user info
//   if (authLoading || !checked) {
//     if (DEBUG) console.log("⏳ AuthContext still loading user...");
//     return <Loading />;
//   }

//   if (DEBUG) {
//     console.log("🛡️ ProtectedRoute Debug →", {
//       path: location.pathname,
//       isAuthenticated,
//       user,
//       userRole: user?.role,
//       allowedRoles,
//     });
//   }

//   // 🚫 Not authenticated → send to login
//   if (!isAuthenticated) {
//     if (DEBUG) console.warn("🚫 Not authenticated — redirecting to /login");
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 🚫 Logged in but role not allowed
//   if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
//     if (DEBUG) {
//       console.warn("🚫 Role mismatch detected:", {
//         userRole: user.role,
//         allowedRoles,
//         path: location.pathname,
//       });
//     }

//     // Admin trying to access student/teacher area
//     if (user.role === "admin") {
//       if (DEBUG) console.info("🔄 Redirecting admin → /admin");
//       return <Navigate to="/admin" replace />;
//     }

//     // Non-admin users trying to access restricted area
//     if (DEBUG) console.info(`🔒 Redirecting unauthorized user → ${redirectPath}`);
//     return <Navigate to={redirectPath} replace />;
//   }

//   // ✅ Access granted
//   if (DEBUG) console.log("✅ Access granted to:", location.pathname);
//   return children;
// };

// export default ProtectedRoute;




// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const DEBUG = false; // 🧩 Set to true to log route access details

/**
 * ✅ ProtectedRoute
 * Restricts access to authenticated users whose roles match the allowedRoles.
 * Shows a loading screen until AuthContext finishes checking the session.
 *
 * @param {ReactNode} children - component to render if access is granted
 * @param {string[]} allowedRoles - roles allowed to access this route
 * @param {string} redirectPath - fallback path for unauthorized access
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectPath = "/unauthorized",
}) => {
  const { user, loading: authLoading, checked, isAuthenticated } = useAuth();
  const location = useLocation();

  // 🕐 Wait until authentication state is fully loaded
  if (authLoading || !checked) {
    if (DEBUG) console.log("⏳ Waiting for AuthContext to complete...");
    return <Loading />;
  }

  if (DEBUG) {
    console.log("🛡️ ProtectedRoute →", {
      path: location.pathname,
      isAuthenticated,
      user,
      allowedRoles,
    });
  }

  // 🚫 Not authenticated — redirect to login
  if (!isAuthenticated) {
    if (DEBUG) console.warn("🚫 User not authenticated → redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Authenticated but role not allowed
  if (
    allowedRoles.length > 0 &&
    user?.role &&
    !allowedRoles.includes(user.role)
  ) {
    if (DEBUG) {
      console.warn("🚫 Role not authorized →", {
        userRole: user.role,
        allowedRoles,
        path: location.pathname,
      });
    }

    // 👑 Special rule: admins always go to /admin
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    // 🚷 Everyone else → redirect to fallback page
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Access granted
  if (DEBUG)
    console.log("✅ Access granted:", location.pathname, "for", user.role);
  return children;
};

export default ProtectedRoute;
