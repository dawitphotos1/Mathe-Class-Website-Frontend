
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./Register.css";

const Register = ({ setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
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

  const handleEmailBlur = () => {
    if (email.trim() && !showConfirmEmail) {
      setShowConfirmEmail(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim() || !email.trim() || !password || !role) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (showConfirmEmail && email.trim() !== confirmEmail.trim()) {
      setError("Emails do not match.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if ((role === "student" || role === "teacher") && !subject.trim()) {
      setError("Subject is required for students and teachers.");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role,
        subject: role !== "admin" ? subject.trim() : null,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message.includes("pending")) {
        toast.info(response.data.message);
      } else {
        toast.success(response.data.message);
      }

      setUser({ id: response.data.userId, role });
      localStorage.setItem(
        "user",
        JSON.stringify({ id: response.data.userId, role })
      );

      navigate(
        role === "student"
          ? "/login"
          : role === "admin"
          ? "/dashboard"
          : "/courses"
      );
    } catch (err) {
      const serverError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Registration failed. Please try again.";

      const validationErrors = err.response?.data?.validationErrors || [];

      const fullMessage =
        validationErrors.length > 0
          ? `${serverError}: ${validationErrors.join(", ")}`
          : serverError;

      setError(fullMessage);
      toast.error(fullMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register for MathClass 🔒</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              required
              disabled={loading}
            />
          </div>
          {showConfirmEmail && (
            <div className="form-group">
              <label>Confirm Email</label>
              <input
                type="email"
                placeholder="Confirm Email Address"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}
          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <div className="form-group password-group">
            <label>Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setSubject("");
              }}
              required
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {(role === "student" || role === "teacher") && (
            <div className="form-group">
              <label>Subject</label>
              {role === "student" ? (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {studentSubjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g., Algebra"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={loading}
                />
              )}
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
        {role === "student" && (
          <p className="test-card-notice">
            Note: Your account will be pending approval by a teacher or admin.
          </p>
        )}
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
