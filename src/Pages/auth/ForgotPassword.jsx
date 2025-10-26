// //auth/ForgotPassword.jsx
// import React, { useState } from "react";
// import axios from "../../utils/axiosInstance"; // assuming you have this set up
// import "./Auth.css";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/auth/forgot-password", { email });
//       setMessage(res.data.message);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to send reset email");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2>Forgot Password</h2>
//         {error && <div className="error-message">{error}</div>}
//         {message && <div className="success-message">{message}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit">Send Reset Link</button>
//         </form>
//         <p className="auth-footer">
//           Remember your password? <a href="/login">Login here</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;




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
