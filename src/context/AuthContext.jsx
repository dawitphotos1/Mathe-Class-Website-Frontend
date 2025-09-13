// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load & validate token on mount
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");

//     if (storedToken) {
//       axios
//         .get("/auth/me", {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         })
//         .then((res) => {
//           setUser(res.data.user);
//           setToken(storedToken);
//           axios.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${storedToken}`;
//         })
//         .catch(() => {
//           // ❌ Token invalid → clear it
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           delete axios.defaults.headers.common["Authorization"];
//           setUser(null);
//           setToken(null);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   // ✅ Login
//   const loginUser = (newToken, newUser) => {
//     setToken(newToken);
//     setUser(newUser);
//     localStorage.setItem("token", newToken);
//     localStorage.setItem("user", JSON.stringify(newUser));
//     axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//   };

//   // ✅ Logout
//   const logoutUser = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
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
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // 🔹 Load user & token from localStorage
  // ===============================
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;

      // Always re-fetch user to confirm token is still valid
      axiosInstance
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch((err) => {
          console.error(
            "❌ AuthContext: /auth/me failed",
            err.response?.data || err.message
          );
          logoutUser(); // clear if token invalid
        });
    } else if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // ===============================
  // 🔹 Login
  // ===============================
  const loginUser = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${jwtToken}`;
  };

  // ===============================
  // 🔹 Logout
  // ===============================
  const logoutUser = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  // ===============================
  // 🔹 Update User
  // ===============================
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // ===============================
  // 🔹 Role Helpers
  // ===============================
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
