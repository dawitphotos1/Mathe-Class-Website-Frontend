
// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// const RedirectIfAuthenticated = ({ children }) => {
//   const { user } = useContext(AuthContext);

//   if (user) {
//     // ✅ Role-based redirects
//     if (user.role === "admin") {
//       return <Navigate to="/admindashboard" replace />;
//     }
//     if (user.role === "teacher") {
//       return <Navigate to="/dashboard" replace />;
//     }
//     return <Navigate to="/courses" replace />;
//   }

//   return children;
// };

// export default RedirectIfAuthenticated;




import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;