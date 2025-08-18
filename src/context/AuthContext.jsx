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



// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch current user from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/me`,
        { withCredentials: true }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error("❌ Auth check failed:", err.response?.data || err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const login = async (credentials) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
        credentials,
        { withCredentials: true }
      );

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      toast.success("Login successful");
      return user;
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
