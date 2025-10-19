
// // src/components/ProtectedRoute.jsx
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Loading from "./Loading";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { user, loading, checked, isAuthenticated } = useAuth();
//   const location = useLocation();

//   // Show loading spinner while checking authentication
//   if (loading || !checked) {
//     return <Loading />;
//   }

//   console.log("🛡️ ProtectedRoute check:", {
//     isAuthenticated,
//     user: user?.role,
//     allowedRoles,
//     path: location.pathname
//   });

//   if (!isAuthenticated) {
//     console.log("🚫 Redirecting to login - not authenticated");
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Check role-based access
//   if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
//     console.log("🚫 Access denied - insufficient permissions");
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // User is authenticated and has required role
//   return children;
// };

// export default ProtectedRoute;




// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, checked, isAuthenticated } = useAuth();
  const location = useLocation();

  // ⏳ Wait for AuthContext to load user info
  if (loading || !checked) {
    console.log("⏳ AuthContext still loading user...");
    return <Loading />;
  }

  // 🧩 DEBUG LOG — shows exactly what's happening
  console.log("🛡️ ProtectedRoute Debug →", {
    path: location.pathname,
    isAuthenticated,
    user,
    userRole: user?.role,
    allowedRoles,
  });

  // 🚫 If not logged in → redirect to login
  if (!isAuthenticated) {
    console.warn("🚫 Not authenticated — redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Role mismatch (logged in but not allowed for this route)
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    console.warn("🚫 Role mismatch detected:", {
      userRole: user.role,
      allowedRoles,
      path: location.pathname,
    });

    // 🧭 If Admin tries to access student/teacher route → go to admin dashboard
    if (user.role === "admin") {
      console.info("🔄 Redirecting admin → /admin/dashboard");
      return <Navigate to="/admin" replace />;
    }

    // 🧭 Otherwise, go to unauthorized page
    console.info("🔒 Redirecting to /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ Access granted to:", location.pathname);
  return children;
};

export default ProtectedRoute;
