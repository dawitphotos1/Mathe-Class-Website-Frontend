
// // src/components/auth/RedirectIfAuthenticated.jsx
// import React, { useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// const RedirectIfAuthenticated = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       if (user.role === "student") {
//         navigate("/courses", { replace: true });
//       } else {
//         navigate("/dashboard", { replace: true });
//       }
//     }
//   }, [user, navigate]);

//   return <>{!user && children}</>;
// };

// export default RedirectIfAuthenticated;




import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    // ✅ Role-based redirects
    if (user.role === "admin") {
      return <Navigate to="/admindashboard" replace />;
    }
    if (user.role === "teacher") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/courses" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
