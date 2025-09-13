// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const RedirectIfAuthenticated = ({ children }) => {
//   const { isAuthenticated, loading } = useContext(AuthContext);

//   if (loading) {
//     return <div>Loading...</div>; // Or your <Loading /> component
//   }

//   if (isAuthenticated) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default RedirectIfAuthenticated;




import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Or your <Loading /> component
  }

  if (isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;