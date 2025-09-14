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





// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Helper: normalize role to lowercase
  const normalizeUser = (userData) => {
    if (!userData) return null;
    return {
      ...userData,
      role: userData.role ? userData.role.toLowerCase() : null,
    };
  };

  // ✅ Load user/token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken && savedUser) {
      const parsedUser = normalizeUser(JSON.parse(savedUser));
      setToken(savedToken);
      setUser(parsedUser);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  // ✅ Login user and save to localStorage
  const loginUser = (jwtToken, userData) => {
    const normalizedUser = normalizeUser(userData);
    setToken(jwtToken);
    setUser(normalizedUser);

    localStorage.setItem("authToken", jwtToken);
    localStorage.setItem("authUser", JSON.stringify(normalizedUser));

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${jwtToken}`;
  };

  // ✅ Logout user
  const logoutUser = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  // ✅ Update user profile in context/localStorage
  const updateUser = (updatedUser) => {
    const normalizedUser = normalizeUser(updatedUser);
    setUser(normalizedUser);
    localStorage.setItem("authUser", JSON.stringify(normalizedUser));
  };

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
