// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { loginUser, isAuthenticated, user, checked } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  /* ============================================================
     🔁 Redirect Path Logic
  ============================================================ */
  const getRedirectPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "teacher":
        return "/dashboard";
      case "student":
        return "/my-courses";
      default:
        return "/";
    }
  };

  /* ============================================================
     ⚠️ Handle Expired Session (from axios interceptor)
  ============================================================ */
  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      toast.error("Your session has expired. Please log in again.");
      const newSearch = new URLSearchParams(searchParams);
      newSearch.delete("session");
      navigate(`${location.pathname}?${newSearch.toString()}`, { replace: true });
    }
  }, [searchParams, navigate, location]);

  /* ============================================================
     🚀 Auto Redirect if Already Logged In
  ============================================================ */
  useEffect(() => {
    if (checked && isAuthenticated && user?.role) {
      navigate(getRedirectPath(user.role), { replace: true });
    }
  }, [checked, isAuthenticated, user, navigate]);

  /* ============================================================
     🧠 Form Handlers
  ============================================================ */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ============================================================
     🔐 Submit Login
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Login successful! Redirecting...");
      navigate(getRedirectPath(loggedInUser.role), { replace: true });
    } catch (error) {
      console.error("❌ Login error:", error);

      let errorMsg = "Login failed. Please try again.";
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }

      // Special case: pending approval
      if (errorMsg.toLowerCase().includes("pending")) {
        toast.info("Your account is pending admin approval. Please wait.");
      } else {
        toast.error(errorMsg);
      }

      // Optional: clear password field after error
      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🧩 Render
  ============================================================ */
  if (checked && isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Redirecting...</h2>
          <p>You are already logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label>Email *</label>
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

          {/* Password */}
          <div className="form-group password-group">
            <label>Password *</label>
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
          Don’t have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
