
// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from "react";

// // Create context
// export const AuthContext = createContext();

// // Provider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   // ✅ Load from localStorage on mount
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (storedToken && storedUser) {
//       try {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       } catch (err) {
//         console.error("❌ Failed to parse stored user:", err);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   // ✅ Login function
//   const loginUser = (newToken, newUser) => {
//     setToken(newToken);
//     setUser(newUser);

//     localStorage.setItem("token", newToken);
//     localStorage.setItem("user", JSON.stringify(newUser));
//   };

//   // ✅ Logout function
//   const logoutUser = () => {
//     setToken(null);
//     setUser(null);

//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loginUser,
//         logoutUser,
//         isAuthenticated: !!user && !!token,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };




import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        logoutUser,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};