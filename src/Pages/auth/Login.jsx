import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import RedirectIfAuthenticated from "./RedirectIfAuthenticated";
import "./Login.css";

const Login = () => {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      console.log("Login: Form validation failed", { email: formData.email });
      return;
    }

    setLoading(true);
    try {
      console.log("Login: Submitting login form", { email: formData.email });
      await loginUser(
        formData.email.toLowerCase().trim(),
        formData.password.trim()
      );
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed";
      console.error("Login: Login attempt failed", {
        status: err.response?.status,
        error: errorMsg,
      });
      // Error is handled in AuthContext.loginUser, but log here for clarity
    } finally {
      setLoading(false);
    }
  };

  return (
    <RedirectIfAuthenticated>
      <div className="auth-container">
        <div className="auth-form">
          <h2>Login to MathClass 📘</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
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
    </RedirectIfAuthenticated>
  );
};

export default Login;