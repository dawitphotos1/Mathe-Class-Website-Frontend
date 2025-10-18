

// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { loginUser, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check for session expiration message
  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      toast.error("Your session has expired. Please log in again.");
      // Clean up the URL
      const newSearch = new URLSearchParams(searchParams);
      newSearch.delete("session");
      navigate(`${location.pathname}?${newSearch.toString()}`, {
        replace: true,
      });
    }
  }, [searchParams, navigate, location]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ Already authenticated, redirecting...");
      const from = location.state?.from?.pathname || getDefaultRoute();
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const getDefaultRoute = () => {
    // This will be set by AuthContext user data
    return "/my-courses";
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { email, password } = formData;
    if (!email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Attempting login...");
      const user = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Login successful! Redirecting...");
      console.log("✅ Login successful, user:", user);

      // Determine redirect path based on user role
      let redirectPath = "/my-courses";
      if (user.role === "admin") {
        redirectPath = "/admin";
      } else if (user.role === "teacher") {
        redirectPath = "/dashboard";
      }

      // Use the original intended path or role-based path
      const from = location.state?.from?.pathname || redirectPath;
      console.log(`🔄 Redirecting to: ${from}`);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Redirecting...</h2>
          <p>You are already logged in. Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>

        {location.state?.message && (
          <div className="auth-message info">{location.state.message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-input">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
