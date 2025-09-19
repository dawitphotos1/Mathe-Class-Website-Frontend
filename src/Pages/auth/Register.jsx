import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

const Register = () => {
  const { register } = useAuth();
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
  const navigate = useNavigate();

  const studentSubjects = [
    "Algebra 1",
    "Algebra 2",
    "Pre-Calculus",
    "Calculus",
    "Geometry & Trigonometry",
    "Statistics & Probability",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

    if (!name || !email || !password || !role) {
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
    if (role === "teacher" && !subject.trim()) {
      return "Subject is required for teachers.";
    }
    if (role === "student" && !subject.trim()) {
      return "Subject is required for students.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setLoading(true);
    try {
      const { name, email, password, role, subject } = formData;
      await register(
        name.trim(),
        email.toLowerCase().trim(),
        password,
        role.toLowerCase(),
        subject.trim()
      );
    } catch (err) {
      // Error is handled in AuthContext.register
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
                />
              ) : (
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={loading}
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
