
// // context/AuthContext.jsx
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   login,
//   register,
//   getCurrentUser,
//   logout,
// } from "../services/authService";

// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [checkedOnce, setCheckedOnce] = useState(false);
//   const navigate = useNavigate();

//   // 🔐 Login
//   const loginUser = async ({ email, password }) => {
//     try {
//       await login({ email, password });
//       const me = await getCurrentUser();
//       setUser(me.data.user);
//       toast.success("Logged in successfully");

//       if (me.data.user.role === "admin") {
//         navigate("/admin");
//       } else if (me.data.user.role === "teacher") {
//         navigate("/dashboard");
//       } else if (me.data.user.role === "student") {
//         navigate("/my-courses"); // ✅ fixed student redirect
//       } else {
//         navigate("/");
//       }

//       return me.data.user; // 👈 allows caller to use the user object if needed
//     } catch (err) {
//       console.error("❌ Login failed:", err.response?.data || err.message);
//       toast.error(err.response?.data?.error || "Login failed");
//       throw err;
//     }
//   };

//   // 📝 Register
//   const registerUser = async (payload) => {
//     try {
//       const res = await register(payload);
//       const data = res.data;

//       if (data.user.approval_status === "approved") {
//         setUser(data.user);
//         toast.success("Registered and logged in");

//         if (data.user.role === "admin") {
//           navigate("/admin");
//         } else if (data.user.role === "teacher") {
//           navigate("/dashboard");
//         } else if (data.user.role === "student") {
//           navigate("/my-courses"); // ✅ fixed student redirect
//         } else {
//           navigate("/");
//         }
//       } else {
//         toast.info("Registration pending approval");
//         navigate("/login");
//       }

//       return data.user;
//     } catch (err) {
//       console.error("❌ Register failed:", err.response?.data || err.message);
//       toast.error(err.response?.data?.error || "Registration failed");
//       throw err;
//     }
//   };

//   // 🔒 Logout
//   const logoutUser = useCallback(async () => {
//     try {
//       await logout();
//       setUser(null);
//       toast.info("Logged out");
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout error:", err);
//       toast.error("Logout failed");
//     }
//   }, [navigate]);

//   // 🚀 On mount: check session once
//   useEffect(() => {
//     const checkAuth = async () => {
//       if (checkedOnce) return;
//       setCheckedOnce(true);

//       try {
//         const me = await getCurrentUser();
//         setUser(me.data.user);
//       } catch {
//         console.warn("Not authenticated");
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [checkedOnce]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         isAuthenticated: !!user,
//         loginUser,
//         registerUser,
//         logoutUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;




// context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  login,
  register,
  getCurrentUser,
  logout,
} from "../services/authService";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🛠 Save token
  const saveToken = (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  // 🔐 Login
  const loginUser = async ({ email, password }) => {
    try {
      const res = await login({ email, password });
      const { token, user } = res.data;

      saveToken(token);
      setUser(user);
      toast.success("Logged in successfully");

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "teacher") {
        navigate("/dashboard");
      } else if (user.role === "student") {
        navigate("/my-courses");
      } else {
        navigate("/");
      }

      return user;
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  // 📝 Register
  const registerUser = async (payload) => {
    try {
      const res = await register(payload);
      const { token, user } = res.data;

      if (user.approval_status === "approved") {
        saveToken(token);
        setUser(user);
        toast.success("Registered and logged in");

        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "teacher") {
          navigate("/dashboard");
        } else if (user.role === "student") {
          navigate("/my-courses");
        } else {
          navigate("/");
        }
      } else {
        toast.info("Registration pending approval");
        navigate("/login");
      }

      return user;
    } catch (err) {
      console.error("❌ Register failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  // 🔒 Logout
  const logoutUser = useCallback(async () => {
    try {
      await logout();
      saveToken(null);
      setUser(null);
      toast.info("Logged out");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  }, [navigate]);

  // 🚀 On mount: restore session
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await getCurrentUser();
        setUser(me.data.user);
      } catch {
        console.warn("Session expired, clearing token");
        saveToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
