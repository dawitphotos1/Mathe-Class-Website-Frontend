//auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // redirect based on role
        const role = data.user.role;
        if (role === "admin") navigate("/admin");
        else if (role === "teacher") navigate("/dashboard");
        else if (role === "student") navigate("/my-courses");
        else navigate("/");
      } else {
        setError("Login failed: no token returned.");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>

        {location.state?.message && (
          <div className="auth-message info">{location.state.message}</div>
        )}
        {error && <div className="auth-message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-link"
            disabled={isSubmitting}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
