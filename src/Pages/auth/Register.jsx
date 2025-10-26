
// src/pages/auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    role: "student",
    subject: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const studentSubjects = [
    "Algebra 1",
    "Algebra 2",
    "Pre-Calculus",
    "Calculus",
    "Geometry & Trigonometry",
    "Statistics & Probability",
  ];

  /* ============================================================
     🧠 Handlers
  ============================================================ */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const {
      name,
      email,
      confirmEmail,
      password,
      confirmPassword,
      role,
      subject,
    } = formData;

    if (!name.trim() || !email.trim() || !password.trim() || !role) {
      return "Please fill in all required fields.";
    }
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      return "Emails do not match.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if ((role === "teacher" || role === "student") && !subject.trim()) {
      return "Subject is required for this role.";
    }
    return null;
  };

  /* ============================================================
     📨 Submit Registration
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role.toLowerCase(),
      subject: formData.subject.trim(),
    };

    console.log("📤 Submitting registration:", payload);
    setLoading(true);

    try {
      const result = await registerUser(payload);

      if (!result) {
        toast.error("Unexpected error. Please try again.");
        return;
      }

      // ✅ Handle different backend responses
      if (result.token) {
        toast.success("Registration successful! Welcome!");
        navigate("/my-courses");
      } else if (
        result.message?.toLowerCase().includes("pending") ||
        result.user?.approval_status === "pending"
      ) {
        toast.info(
          result.message ||
            "Your registration is pending admin approval. You’ll be notified once approved."
        );
        navigate("/login");
      } else {
        toast.success(result.message || "Registration complete!");
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Registration failed:", error);

      let errorMsg = "Registration failed. Please try again.";

      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }

      // 🧹 Optional: Clear passwords for safety
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🧩 JSX
  ============================================================ */
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Name *</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your full name"
            />
          </div>

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

          {/* Confirm Email */}
          <div className="form-group">
            <label>Confirm Email *</label>
            <input
              name="confirmEmail"
              type="email"
              value={formData.confirmEmail}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Confirm your email"
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
                minLength="6"
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

          {/* Confirm Password */}
          <div className="form-group password-group">
            <label>Confirm Password *</label>
            <div className="password-input">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Confirm your password"
                minLength="6"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((v) => !v)}
                disabled={loading}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Subject */}
          {(formData.role === "teacher" || formData.role === "student") && (
            <div className="form-group">
              <label>Subject *</label>
              {formData.role === "teacher" ? (
                <input
                  name="subject"
                  type="text"
                  placeholder="e.g., Algebra, Calculus, etc."
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              ) : (
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="">Select a subject</option>
                  {studentSubjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
