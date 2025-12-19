// src/pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from '../../utils/axiosInstance';
import "./Auth.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Redirect to Forgot Password if token is missing
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("/auth/reset-password", { token, password });
      setMessage(res.data.message || "Password reset successful!");
      toast.success("✅ Password updated successfully. Please login.");
      navigate("/login");
    } catch (err) {
      console.error("❌ Reset password error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to reset password.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Reset Your Password</h2>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="auth-footer">
          Remembered your password? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
