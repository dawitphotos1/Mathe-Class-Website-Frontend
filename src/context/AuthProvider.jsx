// // src/context/AuthProvider.js
// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   // Load user/token from localStorage on app start
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
//     if (token && storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error("Failed to parse user from localStorage:", error);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//     setIsAuthenticated(true);

//     // Redirect based on role
//     if (userData.role === "admin") {
//       navigate("/admin/dashboard");
//     } else if (userData.role === "teacher") {
//       navigate("/teacher/courses");
//     } else if (userData.role === "student") {
//       navigate("/student/courses");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setIsAuthenticated(false);
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
