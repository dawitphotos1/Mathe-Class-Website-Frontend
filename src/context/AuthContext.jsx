// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Load user/token from localStorage on mount
//   useEffect(() => {
//     const savedToken = localStorage.getItem("authToken");
//     const savedUser = localStorage.getItem("authUser");

//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${savedToken}`;
//     }

//     setLoading(false);
//   }, []);

//   // ✅ Login user and save to localStorage
//   const loginUser = (jwtToken, userData) => {
//     setToken(jwtToken);
//     setUser(userData);

//     localStorage.setItem("authToken", jwtToken);
//     localStorage.setItem("authUser", JSON.stringify(userData));

//     axiosInstance.defaults.headers.common[
//       "Authorization"
//     ] = `Bearer ${jwtToken}`;
//   };

//   // ✅ Logout user
//   const logoutUser = () => {
//     setToken(null);
//     setUser(null);

//     localStorage.removeItem("authToken");
//     localStorage.removeItem("authUser");

//     delete axiosInstance.defaults.headers.common["Authorization"];
//   };

//   // ✅ Update user profile in context/localStorage
//   const updateUser = (updatedUser) => {
//     setUser(updatedUser);
//     localStorage.setItem("authUser", JSON.stringify(updatedUser));
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         loginUser,
//         logoutUser,
//         updateUser,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };




import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  // ✅ Login
  const loginUser = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${jwtToken}`;
  };

  // ✅ Logout
  const logoutUser = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  // ✅ Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // ✅ Role helpers
  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        logoutUser,
        updateUser,
        isAuthenticated: !!user,
        isAdmin,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
