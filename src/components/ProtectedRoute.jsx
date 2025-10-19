
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

  // Show loading spinner while checking authentication
  if (loading || !checked) {
    return <Loading />;
  }

  console.log("🛡️ ProtectedRoute check:", {
    isAuthenticated,
    userRole: user?.role,
    allowedRoles,
    path: location.pathname
  });

  if (!isAuthenticated) {
    console.log("🚫 Redirecting to login - not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    console.log("🚫 Access denied - role mismatch:", {
      userRole: user.role,
      allowedRoles,
      path: location.pathname
    });
    
    // Show more specific error message
    if (user.role === "admin") {
      console.log("🔄 Admin trying to access restricted route, redirecting to admin dashboard");
      return <Navigate to="/admin" replace />;
    }
    
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ ProtectedRoute - access granted");
  return children;
};

export default ProtectedRoute;