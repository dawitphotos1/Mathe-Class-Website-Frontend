// // src/pages/auth/ResetPassword.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import "./Auth.css";

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [token, setToken] = useState("");
//   const [formData, setFormData] = useState({
//     password: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   /* ============================================================
//      🔍 Extract token from URL on mount
//   ============================================================ */
//   useEffect(() => {
//     const urlToken = searchParams.get("token");
//     if (!urlToken) {
//       toast.error("Invalid or missing reset token.");
//       navigate("/forgot-password");
//       return;
//     }
//     setToken(urlToken);
//   }, [searchParams, navigate]);

//   /* ============================================================
//      🧠 Handle form changes
//   ============================================================ */
//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   /* ============================================================
//      ✅ Validate before submit
//   ============================================================ */
//   const validateForm = () => {
//     const { password, confirmPassword } = formData;

//     if (!password || !confirmPassword) {
//       return "Please fill in both fields.";
//     }
//     if (password.length < 6) {
//       return "Password must be at least 6 characters long.";
//     }
//     if (password !== confirmPassword) {
//       return "Passwords do not match.";
//     }
//     return null;
//   };

//   /* ============================================================
//      🔐 Handle password reset submit
//   ============================================================ */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const errorMessage = validateForm();
//     if (errorMessage) {
//       toast.error(errorMessage);
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axiosInstance.post("/auth/reset-password", {
//         token,
//         password: formData.password,
//       });

//       toast.success(
//         response.data.message ||
//           "Password has been reset successfully! You can now log in."
//       );
//       setTimeout(() => navigate("/login"), 1500);
//     } catch (err) {
//       console.error("❌ Reset password error:", err);

//       const errorMsg =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         "Failed to reset password. Please try again.";

//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ============================================================
//      🧩 Render
//   ============================================================ */
//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2>Reset Your Password</h2>
//         <p className="text-muted">Enter a new password for your account.</p>

//         <form onSubmit={handleSubmit}>
//           {/* New Password */}
//           <div className="form-group password-group">
//             <label>New Password *</label>
//             <div className="password-input">
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 placeholder="Enter new password"
//                 minLength="6"
//               />
//               <button
//                 type="button"
//                 className="toggle-password"
//                 onClick={() => setShowPassword((v) => !v)}
//                 disabled={loading}
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div className="form-group password-group">
//             <label>Confirm Password *</label>
//             <div className="password-input">
//               <input
//                 name="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 placeholder="Confirm new password"
//                 minLength="6"
//               />
//               <button
//                 type="button"
//                 className="toggle-password"
//                 onClick={() => setShowConfirmPassword((v) => !v)}
//                 disabled={loading}
//               >
//                 {showConfirmPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           <button type="submit" className="btn-primary" disabled={loading}>
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <Link to="/login">Back to Login</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;



// src/pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
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
