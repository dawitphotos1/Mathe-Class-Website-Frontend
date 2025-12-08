
// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  /* ============================================================
     📨 Submit Forgot Password Form
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      toast.success(
        response.data.message ||
          "If an account exists with that email, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      console.error("❌ Forgot password error:", err);

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send reset email. Please try again later.";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🧩 Render
  ============================================================ */
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <p className="text-muted">
          Enter your registered email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email address"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth-footer">
          Remember your password? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
