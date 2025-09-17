
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

//   // ✅ Normalize user and always keep avatar
//   const normalizeUser = (userData) => {
//     if (!userData) return null;
//     return {
//       id: userData.id,
//       name: userData.name,
//       email: userData.email,
//       role: userData.role ? userData.role.toLowerCase() : null,
//       approval_status: userData.approval_status
//         ? userData.approval_status.toLowerCase()
//         : null,
//       avatar: userData.avatar || userData.profileImage || null, // ✅ keep avatar/profileImage
//       subject: userData.subject || null,
//     };
//   };

//   const logoutUser = useCallback(() => {
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

//       const verifyToken = async (attempt = 1) => {
//         try {
//           const res = await axiosInstance.get("/auth/me");
//           const userData = res.data.user || res.data;
//           const normalized = normalizeUser(userData);
//           setUser(normalized);
//           localStorage.setItem("authUser", JSON.stringify(normalized));
//           setLoading(false);
//         } catch (err) {
//           if (attempt < 3) {
//             setTimeout(() => verifyToken(attempt + 1), 1000);
//           } else {
//             logoutUser();
//             if (!publicRoutes.includes(location.pathname)) {
//               navigate("/unauthorized");
//             }
//             setLoading(false);
//           }
//         }
//       };

//       verifyToken();
//     } else {
//       setLoading(false);
//       if (!publicRoutes.includes(location.pathname)) {
//         navigate("/unauthorized");
//       }
//     }
//   }, [location.pathname, navigate, logoutUser]);

//   const loginUser = async (email, password) => {
//     try {
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




// src/context/AuthContext.js
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

  // Normalize user object for consistency
  const normalizeUser = (userData) => {
    if (!userData) return null;
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role ? userData.role.toLowerCase() : null,
      approval_status: userData.approval_status
        ? userData.approval_status.toLowerCase()
        : null,
      avatar: userData.avatar || userData.profileImage || null,
      subject: userData.subject || null,
    };
  };

  const logoutUser = useCallback(() => {
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
          const res = await axiosInstance.get("/auth/me");
          const userData = res.data.user || res.data;
          const normalized = normalizeUser(userData);
          setUser(normalized);
          localStorage.setItem("authUser", JSON.stringify(normalized));
          setLoading(false);
        } catch (err) {
          if (attempt < 3) {
            setTimeout(() => verifyToken(attempt + 1), 1000);
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
