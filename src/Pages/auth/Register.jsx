// src/Pages/auth/Register.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import RedirectIfAuthenticated from "../../Pages/auth/RedirectIfAuthenticated";
import "./Register.css";

const Register = () => {
  const { loginUser } = useContext(AuthContext);
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
    const { name, email, confirmEmail, password, confirmPassword, role, subject } = formData;

    if (!name || !email || !password || !role) {
      return "Please fill in all required fields.";
    }
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      return "Emails do not match.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    if (role === "teacher" && !subject.trim()) {
      return "Subject is required for teachers.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setLoading(true);
    try {
      const { name, email, password, role, subject } = formData;

      const payload = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: role.toLowerCase(),
        subject: role === "teacher" || role === "student" ? subject.trim() : null,
      };

      // ✅ Register user
      const { data } = await axiosInstance.post("/auth/register", payload);

      if (data?.user) {
        if (data.token) {
          // Teacher/Admin → backend returned token
          loginUser(data.token, data.user);
          toast.success("Registration successful! You are now logged in.");
          navigate("/dashboard");
        } else {
          // Student → pending approval
          toast.success("Registration successful! Pending admin approval.");
          navigate("/login");
        }
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      const serverError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Registration failed. Please try again.";
      toast.error(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RedirectIfAuthenticated>
      <div className="auth-container">
        <div className="auth-form">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Confirm Email */}
            <div className="form-group">
              <label>Confirm Email</label>
              <input
                name="confirmEmail"
                type="email"
                value={formData.confirmEmail}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group password-group">
              <label>Confirm Password</label>
              <div className="password-input">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label>Role</label>
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
                <label>Subject</label>
                {formData.role === "teacher" ? (
                  <input
                    name="subject"
                    type="text"
                    placeholder="e.g., Algebra"
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
    </RedirectIfAuthenticated>
  );
};

export default Register;
