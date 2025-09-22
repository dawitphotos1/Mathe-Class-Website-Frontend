
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";

// ✅ Create context
export const AuthContext = createContext();

// ✅ Hook
export const useAuth = () => useContext(AuthContext);

// ✅ Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 Login
  const loginUser = async ({ email, password }) => {
    try {
      await authService.login({ email, password }); // sets cookie
      const me = await authService.getMe(); // fetch user profile
      setUser(me.user);
      toast.success("Logged in successfully");

      if (me.user.role === "admin") {
        navigate("/admindashboard");
      } else if (me.user.role === "teacher") {
        navigate("/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  // 📝 Register
  const registerUser = async (payload) => {
    try {
      const data = await authService.register(payload);
      if (data.user.approval_status === "approved") {
        setUser(data.user);
        toast.success("Registered and logged in");
        navigate("/courses");
      } else {
        toast.info("Registration pending approval");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  // 🔒 Logout
  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.info("Logged out");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  }, [navigate]);

  // 🚀 On mount: check session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await authService.getMe();
        setUser(me.user);
      } catch {
        console.warn("Not authenticated");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
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
