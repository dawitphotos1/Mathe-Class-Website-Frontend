// src/pages/auth/Register.jsx - OPTIMIZED VERSION
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

// Registration Info Popup Component
const RegistrationInfoPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-popup-overlay" onClick={onClose}>
      <div className="help-popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="help-popup-header">
          <h3>📝 Registration Information</h3>
          <button className="help-popup-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="help-popup-body">
          <div className="help-section">
            <h4>👨‍🎓 Student Accounts</h4>
            <ul>
              <li>Require admin approval (1-3 business days)</li>
              <li>Select from predefined subject list</li>
              <li>Can enroll in courses</li>
              <li>Will receive email notification upon approval</li>
              <li>Cannot create courses</li>
            </ul>
          </div>
          
          <div className="help-section">
            <h4>👨‍🏫 Teacher Accounts</h4>
            <ul>
              <li>Auto-approved (instant access)</li>
              <li>Enter your teaching subject</li>
              <li>Can create and manage courses</li>
              <li>Can manage enrolled students</li>
              <li>Access to teacher dashboard</li>
            </ul>
          </div>
          
          <div className="help-section">
            <h4>👨‍💼 Admin Accounts</h4>
            <ul>
              <li>Auto-approved (instant access)</li>
              <li>Full system access</li>
              <li>Approve/Reject student registrations</li>
              <li>Manage all users and courses</li>
              <li>Access to admin dashboard</li>
            </ul>
          </div>
          
          <div className="help-section">
            <h4>📧 Email Notifications</h4>
            <div className="support-contact">
              <p>You'll receive emails for:</p>
              <ul>
                <li>Registration confirmation</li>
                <li>Account approval/rejection</li>
                <li>Password resets (if requested)</li>
                <li>Important platform updates</li>
              </ul>
              <p><strong>Support:</strong> greenw17@yahoo.com</p>
            </div>
          </div>
        </div>
        
        <div className="help-popup-footer">
          <button className="btn-primary" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showInfoPopup, setShowInfoPopup] = useState(false);

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
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="John Doe"
              />
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="john@example.com"
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
                placeholder="Re-enter your email"
              />
            </div>
          </div>

          <div className="form-row">
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
                  placeholder="••••••"
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
              <small className="field-hint">Min. 6 characters</small>
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
                  placeholder="••••••"
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
          </div>

          {(formData.role === "teacher" || formData.role === "student") && (
            <div className="form-group">
              <label>
                {formData.role === "teacher" ? "Teaching Subject *" : "Study Subject *"}
              </label>
              {formData.role === "teacher" ? (
                <input
                  name="subject"
                  type="text"
                  placeholder="e.g., Algebra, Calculus, Geometry"
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
              <small className="field-hint">
                {formData.role === "teacher" 
                  ? "Enter your primary teaching subject" 
                  : "Select your primary study interest"}
              </small>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "⚡ Creating Account..." : "Create Account"}
            </button>
            
            <div className="quick-info-button">
              <button 
                type="button" 
                className="info-btn"
                onClick={() => setShowInfoPopup(true)}
              >
                <span className="info-icon">ℹ️</span>
                <span className="info-text">Registration Details</span>
              </button>
            </div>
          </div>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>

      {/* Registration Info Popup */}
      <RegistrationInfoPopup isOpen={showInfoPopup} onClose={() => setShowInfoPopup(false)} />
    </div>
  );
};

export default Register;