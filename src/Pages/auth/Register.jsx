// src/pages/auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

const Register = () => {
  const { register } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const errorMessage = validateForm();
    if (errorMessage) {
      showToast.error(errorMessage);
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
      const result = await register(payload);
      console.log("📥 Registration response:", result);

      if (result.success) {
        if (result.user) {
          // Auto-approved (teacher/admin)
          showToast.success("Registration successful! Welcome!");
          navigate("/my-courses");
        } else {
          // Student needs admin approval
          showToast.success(
            <div>
              <strong>✅ Registration Submitted!</strong>
              <br />
              Your student account is pending admin approval.
              <br />
              Check your email for updates.
            </div>,
            { autoClose: 5000, position: "top-center" }
          );

          // Clear form
          setFormData({
            name: "",
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: "",
            role: "student",
            subject: "",
          });

          // Redirect to login
          setTimeout(() => {
            navigate("/login", {
              state: {
                message:
                  "Registration submitted! Please wait for admin approval.",
                email: payload.email,
              },
            });
          }, 3000);
        }
      } else {
        showToast.error(result.error || "Registration failed");
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      let errorMsg = "Registration failed. Please try again.";

      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }

      if (
        errorMsg.toLowerCase().includes("already exists") ||
        errorMsg.toLowerCase().includes("duplicate")
      ) {
        errorMsg = "An account with this email already exists.";
      }

      showToast.error(errorMsg);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
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
            <small className="password-hint">Minimum 6 characters</small>
          </div>

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
            <small className="role-hint">
              • Students: Need admin approval (1-2 business days)
              <br />
              • Teachers: Auto-approved, can create courses
              <br />• Admin: Auto-approved, full system access
            </small>
          </div>

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
            {loading ? "⚡ Processing..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>

        <div className="registration-info">
          <h4>📝 Registration Info:</h4>
          <ul>
            <li>✅ Students: Account requires admin approval (check email)</li>
            <li>✅ Teachers: Auto-approved, can create courses immediately</li>
            <li>✅ Admins: Auto-approved, full system access</li>
            <li>📧 You'll receive email notifications for approvals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
