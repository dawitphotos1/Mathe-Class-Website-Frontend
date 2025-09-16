
// // src/context/AuthContext.js
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { toast } from "react-toastify";

// export const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const normalizeUser = (userData) => {
//     if (!userData) return null;
//     return {
//       ...userData,
//       role: userData.role ? userData.role.toLowerCase() : null,
//       approval_status: userData.approval_status
//         ? userData.approval_status.toLowerCase()
//         : null,
//     };
//   };

//   const logoutUser = useCallback(() => {
//     console.log("AuthContext: Logging out");
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("authUser");
//     delete axiosInstance.defaults.headers.common["Authorization"];
//     navigate("/login");
//   }, [navigate]);

//   useEffect(() => {
//     const publicRoutes = [
//       "/register",
//       "/login",
//       "/courses",
//       "/",
//       "/unauthorized",
//     ];
//     if (publicRoutes.includes(location.pathname)) {
//       console.log("AuthContext: Skipping auth check for public route", {
//         path: location.pathname,
//       });
//       setLoading(false);
//       return;
//     }

//     const savedToken = localStorage.getItem("authToken");
//     const savedUser = localStorage.getItem("authUser");

//     if (savedToken && savedUser) {
//       const parsedUser = normalizeUser(JSON.parse(savedUser));
//       setToken(savedToken);
//       setUser(parsedUser);
//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${savedToken}`;

//       const verifyToken = async (retries = 3, delay = 1000) => {
//         for (let i = 0; i < retries; i++) {
//           try {
//             console.log("AuthContext: Verifying token, attempt", {
//               attempt: i + 1,
//             });
//             const res = await axiosInstance.get("/auth/me");

//             // ✅ Backend sends user object directly, not wrapped in { success }
//             if (res.data && (res.data.user || res.data.id)) {
//               const userData = res.data.user || res.data;
//               setUser(normalizeUser(userData));
//               localStorage.setItem(
//                 "authUser",
//                 JSON.stringify(normalizeUser(userData))
//               );
//               console.log("AuthContext: Token verified, user set", {
//                 user: userData,
//               });
//               return;
//             }
//           } catch (err) {
//             console.error("AuthContext: Token verification failed", {
//               status: err.response?.status,
//               error: err.response?.data?.error || err.message,
//               details: err.response?.data?.details || null,
//               url: err.config?.url,
//               attempt: i + 1,
//             });
//             if (i < retries - 1) {
//               await new Promise((resolve) => setTimeout(resolve, delay));
//               continue;
//             }
//             if (!publicRoutes.includes(location.pathname)) {
//               logoutUser();
//               navigate("/unauthorized");
//             }
//           }
//         }
//       };

//       verifyToken().finally(() => setLoading(false));
//     } else {
//       console.log("AuthContext: No token/user found, setting unauthenticated", {
//         path: location.pathname,
//       });
//       setLoading(false);
//       if (!publicRoutes.includes(location.pathname)) {
//         navigate("/unauthorized");
//       }
//     }
//   }, [location.pathname, navigate, logoutUser]);

//   const loginUser = async (email, password) => {
//     try {
//       console.log("AuthContext: Attempting login", { email });
//       const res = await axiosInstance.post("/auth/login", {
//         email: email.toLowerCase(),
//         password,
//       });

//       // ❌ Removed res.data.success check
//       const { token: jwtToken, user: userData } = res.data;
//       if (!jwtToken || !userData) {
//         throw new Error("Invalid login response");
//       }

//       const normalizedUser = normalizeUser(userData);
//       setToken(jwtToken);
//       setUser(normalizedUser);
//       localStorage.setItem("authToken", jwtToken);
//       localStorage.setItem("authUser", JSON.stringify(normalizedUser));
//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${jwtToken}`;
//       toast.success("Logged in successfully", {
//         toastId: `login-success-${email}`,
//       });
//       console.log("AuthContext: Login successful", {
//         role: userData.role,
//         email: userData.email,
//       });
//       navigate(
//         userData.role === "admin"
//           ? "/admindashboard"
//           : userData.role === "teacher"
//           ? "/dashboard"
//           : "/courses"
//       );
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "Login failed";
//       const errorDetails = err.response?.data?.details || err.message;
//       console.error("AuthContext: Login failed", {
//         status: err.response?.status,
//         error: errorMsg,
//         details: errorDetails,
//         response: err.response?.data,
//       });
//       if (errorMsg.toLowerCase().includes("pending approval")) {
//         toast.error("Your account is pending admin approval.", {
//           toastId: `login-error-${email}`,
//         });
//       } else if (errorMsg.toLowerCase().includes("rejected")) {
//         toast.error("Your account has been rejected.", {
//           toastId: `login-error-${email}`,
//         });
//       } else if (errorMsg.toLowerCase().includes("invalid credentials")) {
//         toast.error("Invalid email or password. Please try again.", {
//           toastId: `login-error-${email}`,
//         });
//       } else {
//         toast.error(`Login failed: ${errorMsg}`, {
//           toastId: `login-error-${email}`,
//         });
//       }
//       throw err;
//     }
//   };

//   const register = async (name, email, password, role, subject) => {
//     try {
//       console.log("AuthContext: Attempting registration", { email, role });
//       const res = await axiosInstance.post("/auth/register", {
//         name,
//         email: email.toLowerCase(),
//         password,
//         role,
//         subject,
//       });

//       // ❌ Removed res.data.success check
//       if (res.data.user && res.data.user.approval_status === "approved") {
//         const normalizedUser = normalizeUser(res.data.user);
//         setToken(res.data.token);
//         setUser(normalizedUser);
//         localStorage.setItem("authToken", res.data.token);
//         localStorage.setItem("authUser", JSON.stringify(normalizedUser));
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${res.data.token}`;
//         toast.success("Registered and logged in successfully", {
//           toastId: `register-success-${email}`,
//         });
//         console.log("AuthContext: Registration successful, auto-logged in", {
//           role,
//         });
//         navigate(
//           role === "admin"
//             ? "/admindashboard"
//             : role === "teacher"
//             ? "/dashboard"
//             : "/courses"
//         );
//       } else {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("authUser");
//         setToken(null);
//         setUser(null);
//         toast.info(res.data.message || "Registration pending approval", {
//           toastId: `register-info-${email}`,
//         });
//         console.log("AuthContext: Registration pending approval", { email });
//         navigate("/login");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "Registration failed";
//       const errorDetails = err.response?.data?.details || err.message;
//       console.error("AuthContext: Registration failed", {
//         status: err.response?.status,
//         error: errorMsg,
//         details: errorDetails,
//       });
//       toast.error(`Registration failed: ${errorMsg}`, {
//         toastId: `register-error-${email}`,
//       });
//       throw err;
//     }
//   };

//   const updateUser = (updatedUser) => {
//     const normalizedUser = normalizeUser(updatedUser);
//     setUser(normalizedUser);
//     localStorage.setItem("authUser", JSON.stringify(normalizedUser));
//     console.log("AuthContext: User updated", { user: normalizedUser });
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         loginUser,
//         register,
//         logoutUser,
//         updateUser,
//         isAuthenticated: !!user,
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };




import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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

  const normalizeUser = (userData) => {
    if (!userData) return null;
    return {
      ...userData,
      role: userData.role ? userData.role.toLowerCase() : null,
      approval_status: userData.approval_status
        ? userData.approval_status.toLowerCase()
        : null,
    };
  };

  const logoutUser = useCallback(() => {
    console.log("AuthContext: Logging out");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
    navigate("/login");
  }, [navigate]);

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

    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      const parsedUser = normalizeUser(JSON.parse(savedUser));
      setToken(savedToken);
      setUser(parsedUser);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;

      const verifyToken = async () => {
        try {
          const res = await axiosInstance.get("/auth/me");
          if (res.data && (res.data.user || res.data.id)) {
            const userData = res.data.user || res.data;
            const normalized = normalizeUser(userData);
            setUser(normalized);
            localStorage.setItem("user", JSON.stringify(normalized));
            console.log("AuthContext: Token verified");
          }
        } catch (err) {
          console.error("AuthContext: Token verification failed", err);
          logoutUser();
          navigate("/unauthorized");
        } finally {
          setLoading(false);
        }
      };

      verifyToken();
    } else {
      setLoading(false);
      if (!publicRoutes.includes(location.pathname)) {
        navigate("/unauthorized");
      }
    }
  }, [location.pathname, navigate, logoutUser]);

  const loginUser = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      const { token: jwtToken, user: userData } = res.data;
      if (!jwtToken || !userData) throw new Error("Invalid login response");

      const normalizedUser = normalizeUser(userData);
      setToken(jwtToken);
      setUser(normalizedUser);
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${jwtToken}`;

      toast.success("Logged in successfully");
      navigate(
        userData.role === "admin"
          ? "/admindashboard"
          : userData.role === "teacher"
          ? "/dashboard"
          : "/courses"
      );
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed";
      toast.error(errorMsg);
      throw err;
    }
  };

  const register = async (name, email, password, role, subject) => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email: email.toLowerCase(),
        password,
        role,
        subject,
      });

      if (res.data.user && res.data.user.approval_status === "approved") {
        const normalizedUser = normalizeUser(res.data.user);
        setToken(res.data.token);
        setUser(normalizedUser);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        toast.success("Registered and logged in successfully");
        navigate(
          role === "admin"
            ? "/admindashboard"
            : role === "teacher"
            ? "/dashboard"
            : "/courses"
        );
      } else {
        logoutUser();
        toast.info("Registration pending approval");
        navigate("/login");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateUser = (updatedUser) => {
    const normalizedUser = normalizeUser(updatedUser);
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
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
