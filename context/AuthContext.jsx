// // context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance"; // ✅ unified axios
// import { IS_DEV } from "../config"; // optional debug flag

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const userData = localStorage.getItem("user");
//       if (!userData || userData === "undefined") return null;
//       return JSON.parse(userData);
//     } catch (err) {
//       console.error("❌ Failed to parse user from localStorage:", err);
//       return null;
//     }
//   });

//   // ✅ Login helper
//   const loginUser = (token, userData) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   // ✅ Logout helper
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     window.location.href = "/login"; // 🔄 redirect after logout
//   };

//   // ✅ Auto-fetch profile if token exists
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token && token.startsWith("eyJ")) {
//       axiosInstance
//         .get("/users/me") // 👈 axiosInstance auto adds baseURL + token
//         .then((res) => {
//           if (res.data && res.data.user) {
//             setUser(res.data.user);
//             localStorage.setItem("user", JSON.stringify(res.data.user));
//           }
//         })
//         .catch((err) => {
//           if (IS_DEV) console.error("❌ Error fetching profile:", err);
//           logout(); // force logout on invalid token
//         });
//     }
//   }, []); // run once

//   return (
//     <AuthContext.Provider value={{ user, setUser, loginUser, logout }}>
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

  // ✅ Load user/token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  // ✅ Login user and save to localStorage
  const loginUser = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);

    localStorage.setItem("authToken", jwtToken);
    localStorage.setItem("authUser", JSON.stringify(userData));

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
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
    setUser(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
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
