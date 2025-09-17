
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
//     const publicRoutes = ["/register", "/login", "/courses", "/", "/unauthorized"];

//     if (publicRoutes.includes(location.pathname)) {
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

//       const verifyToken = async () => {
//         try {
//           const res = await axiosInstance.get("/auth/me");

//           if (res.data && (res.data.user || res.data.id)) {
//             const userData = res.data.user || res.data;
//             setUser(normalizeUser(userData));
//             localStorage.setItem(
//               "authUser",
//               JSON.stringify(normalizeUser(userData))
//             );
//             return;
//           }
//         } catch (err) {
//           console.error("AuthContext: Token verification failed", err);
//           logoutUser();
//           if (!publicRoutes.includes(location.pathname)) {
//             navigate("/unauthorized");
//           }
//         } finally {
//           setLoading(false);
//         }
//       };

//       verifyToken();
//     } else {
//       console.log("AuthContext: No token/user found");
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

//       const { token: jwtToken, user: userData } = res.data;
//       if (!jwtToken || !userData) {
//         throw new Error("Invalid login response");
//       }

//       const normalizedUser = normalizeUser(userData);
//       setToken(jwtToken);
//       setUser(normalizedUser);

//       // ✅ always use same keys
//       localStorage.setItem("authToken", jwtToken);
//       localStorage.setItem("authUser", JSON.stringify(normalizedUser));

//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${jwtToken}`;

//       toast.success("Logged in successfully");
//       navigate(
//         userData.role === "admin"
//           ? "/admindashboard"
//           : userData.role === "teacher"
//           ? "/dashboard"
//           : "/courses"
//       );
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "Login failed";
//       console.error("AuthContext: Login failed", err);
//       toast.error(`Login failed: ${errorMsg}`);
//       throw err;
//     }
//   };

//   const register = async (name, email, password, role, subject) => {
//     try {
//       const res = await axiosInstance.post("/auth/register", {
//         name,
//         email: email.toLowerCase(),
//         password,
//         role,
//         subject,
//       });

//       if (res.data.user && res.data.user.approval_status === "approved") {
//         const normalizedUser = normalizeUser(res.data.user);
//         setToken(res.data.token);
//         setUser(normalizedUser);

//         // ✅ consistent keys
//         localStorage.setItem("authToken", res.data.token);
//         localStorage.setItem("authUser", JSON.stringify(normalizedUser));

//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${res.data.token}`;

//         toast.success("Registered and logged in successfully");
//         navigate(
//           role === "admin"
//             ? "/admindashboard"
//             : role === "teacher"
//             ? "/dashboard"
//             : "/courses"
//         );
//       } else {
//         logoutUser();
//         toast.info(res.data.message || "Registration pending approval");
//         navigate("/login");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "Registration failed";
//       toast.error(`Registration failed: ${errorMsg}`);
//       throw err;
//     }
//   };

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
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
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

    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken && savedUser) {
      const parsedUser = normalizeUser(JSON.parse(savedUser));
      setToken(savedToken);
      setUser(parsedUser);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;

      const verifyToken = async (attempt = 1) => {
        try {
          console.log("AuthContext: Verifying token, attempt", { attempt });
          const res = await axiosInstance.get("/auth/me");
          const userData = res.data.user || res.data;
          setUser(normalizeUser(userData));
          localStorage.setItem(
            "authUser",
            JSON.stringify(normalizeUser(userData))
          );
          setLoading(false);
        } catch (err) {
          console.error("AuthContext: Token verification failed", err);
          if (attempt < 3) {
            setTimeout(() => verifyToken(attempt + 1), 1000); // Retry after 1s
          } else {
            logoutUser();
            if (!publicRoutes.includes(location.pathname)) {
              navigate("/unauthorized");
            }
            setLoading(false);
          }
        }
      };

      verifyToken();
    } else {
      console.log("AuthContext: No token/user found");
      setLoading(false);
      if (!publicRoutes.includes(location.pathname)) {
        navigate("/unauthorized");
      }
    }
  }, [location.pathname, navigate, logoutUser]);

  const loginUser = async (email, password) => {
    try {
      console.log("AuthContext: Attempting login", { email });
      const res = await axiosInstance.post("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      const { token: jwtToken, user: userData } = res.data;
      if (!jwtToken || !userData) {
        throw new Error("Invalid login response");
      }

      const normalizedUser = normalizeUser(userData);
      setToken(jwtToken);
      setUser(normalizedUser);

      localStorage.setItem("authToken", jwtToken);
      localStorage.setItem("authUser", JSON.stringify(normalizedUser));

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
      console.error("AuthContext: Login failed", err);
      toast.error(`Login failed: ${errorMsg}`);
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

        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("authUser", JSON.stringify(normalizedUser));

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
        toast.info(res.data.message || "Registration pending approval");
        navigate("/login");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(`Registration failed: ${errorMsg}`);
      throw err;
    }
  };

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