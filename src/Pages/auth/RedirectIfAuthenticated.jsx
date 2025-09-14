
// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// const RedirectIfAuthenticated = ({ children }) => {
//   const { isAuthenticated, loading } = useContext(AuthContext);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (isAuthenticated) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default RedirectIfAuthenticated;




import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    const redirectTo =
      user?.role === "admin"
        ? "/admindashboard"
        : user?.role === "teacher"
        ? "/dashboard"
        : "/courses";
    console.log("RedirectIfAuthenticated: User is authenticated, redirecting", {
      role: user?.role,
      redirectTo,
      currentPath: location.pathname,
    });
    return <Navigate to={redirectTo} replace />;
  }

  console.log("RedirectIfAuthenticated: Rendering children", {
    path: location.pathname,
  });
  return children;
};

export default RedirectIfAuthenticated;