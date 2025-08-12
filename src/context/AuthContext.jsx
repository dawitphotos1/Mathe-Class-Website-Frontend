// // context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../config";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const userData = localStorage.getItem("user");
//       if (!userData || userData === "undefined") return null;
//       return JSON.parse(userData);
//     } catch (err) {
//       console.error("❌ Failed to parse user data from localStorage:", err);
//       return null;
//     }
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




// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData || userData === "undefined") return null;
      return JSON.parse(userData);
    } catch (err) {
      console.error("❌ Failed to parse user data from localStorage:", err);
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.startsWith("eyJ")) {
      axios
        .get(`${API_BASE_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.user) {
            // ✅ store only the user object
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  // helper to handle login success from your Login.jsx
  const loginUser = (token, userObj) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
