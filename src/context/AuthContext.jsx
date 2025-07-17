
// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../config";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const userData = localStorage.getItem("user");
//     return userData ? JSON.parse(userData) : null;
//   });

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token && token.startsWith("eyJ")) {
//       axios
//         .get(`${API_BASE_URL}/api/v1/users/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setUser(res.data);
//           localStorage.setItem("user", JSON.stringify(res.data));
//         })
//         .catch(() => {
//           logout();
//         });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token && token.startsWith("eyJ")) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, AuthContext };
