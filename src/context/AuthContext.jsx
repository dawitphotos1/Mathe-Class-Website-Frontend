// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔑 Helper: normalize role to lowercase
//   const normalizeUser = (userData) => {
//     if (!userData) return null;
//     return {
//       ...userData,
//       role: userData.role ? userData.role.toLowerCase() : null,
//     };
//   };

//   // ✅ Load user/token from localStorage on mount
//   useEffect(() => {
//     const savedToken = localStorage.getItem("authToken");
//     const savedUser = localStorage.getItem("authUser");

//     if (savedToken && savedUser) {
//       const parsedUser = normalizeUser(JSON.parse(savedUser));
//       setToken(savedToken);
//       setUser(parsedUser);

//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${savedToken}`;
//     }

//     setLoading(false);
//   }, []);

//   // ✅ Login user and save to localStorage
//   const loginUser = (jwtToken, userData) => {
//     const normalizedUser = normalizeUser(userData);
//     setToken(jwtToken);
//     setUser(normalizedUser);

//     localStorage.setItem("authToken", jwtToken);
//     localStorage.setItem("authUser", JSON.stringify(normalizedUser));

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
//     const normalizedUser = normalizeUser(updatedUser);
//     setUser(normalizedUser);
//     localStorage.setItem("authUser", JSON.stringify(normalizedUser));
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



import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Normalize role and approval_status to lowercase
  const normalizeUser = (userData) => {
    if (!userData) return null;
    return {
      ...userData,
      role: userData.role ? userData.role.toLowerCase() : null,
      approvalStatus: userData.approval_status
        ? userData.approval_status.toLowerCase()
        : null,
    };
  };

  // Check auth on mount, skip for public routes
  useEffect(() => {
    const publicRoutes = [
      "/register",
      "/login",
      "/courses",
      "/",
      "/unauthorized",
    ];
    if (publicRoutes.includes(location.pathname)) {
      setLoading(false);
      return;
    }

    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken && savedUser) {
      const parsedUser = normalizeUser(JSON.parse(savedUser));
      setToken(savedToken);
      setUser(parsedUser);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;

      // Verify token with backend
      axiosInstance
        .get("/auth/me")
        .then((res) => {
          setUser(normalizeUser(res.data));
          localStorage.setItem(
            "authUser",
            JSON.stringify(normalizeUser(res.data))
          );
        })
        .catch((err) => {
          console.error("Auth verification failed:", err);
          logoutUser();
          if (!publicRoutes.includes(location.pathname)) {
            navigate("/unauthorized");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      if (!publicRoutes.includes(location.pathname)) {
        navigate("/unauthorized");
      }
    }
  }, [location.pathname, navigate]);

  // Login user
  const loginUser = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token: jwtToken, user: userData } = res.data;
      const normalizedUser = normalizeUser(userData);
      setToken(jwtToken);
      setUser(normalizedUser);
      localStorage.setItem("authToken", jwtToken);
      localStorage.setItem("authUser", JSON.stringify(normalizedUser));
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${jwtToken}`;
      toast.success("Logged in successfully");
      navigate(userData.role === "admin" ? "/admindashboard" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  // Register user
  const register = async (name, email, password, role, subject) => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        role,
        subject,
      });
      if (res.data.token) {
        const normalizedUser = normalizeUser(res.data.user);
        setToken(res.data.token);
        setUser(normalizedUser);
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("authUser", JSON.stringify(normalizedUser));
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        toast.success("Registered successfully");
        navigate("/dashboard");
      } else {
        toast.info(res.data.message || "Registration pending approval");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  // Logout user
  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  // Update user profile
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
        register,
        logoutUser,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};