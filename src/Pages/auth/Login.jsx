// src/pages/auth/Login.jsx - COMPACT ONE-LINE HEADER
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

/* =========================
   Help Popup Component
========================= */
const HelpPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-popup-overlay" onClick={onClose}>
      <div className="help-popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="help-popup-header">
          <div className="help-popup-title">
            <div className="title-icon">🔐</div>
            <h3>Login Help & Support</h3>
          </div>
          <button className="help-popup-close" onClick={onClose}>
            <span className="close-icon">×</span>
          </button>
        </div>

        <div className="help-popup-body">
          <div className="help-section">
            <div className="section-header">
              <div className="section-icon">🚨</div>
              <h4>Common Login Issues</h4>
            </div>
            <ul className="styled-list">
              <li>
                <div className="list-icon">⏳</div>
                <div className="list-content">
                  <strong>Account Approval</strong>
                  <p>Student accounts require admin approval. You'll receive an email once approved.</p>
                </div>
              </li>
              <li>
                <div className="list-icon">🔑</div>
                <div className="list-content">
                  <strong>Invalid Credentials</strong>
                  <p>Ensure your email and password are correct. Passwords are case-sensitive.</p>
                </div>
              </li>
              <li>
                <div className="list-icon">❌</div>
                <div className="list-content">
                  <strong>Rejected Account</strong>
                  <p>If rejected, you'll receive an email explaining why and next steps.</p>
                </div>
              </li>
              <li>
                <div className="list-icon">🔓</div>
                <div className="list-content">
                  <strong>Forgot Password</strong>
                  <p>Use the "Forgot your password?" link to request password reset via email.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="help-section">
            <div className="section-header">
              <div className="section-icon">⚡</div>
              <h4>Quick Fixes</h4>
            </div>
            <ol className="numbered-list">
              <li>
                <span className="number-badge">1</span>
                <span>Double-check your email spelling</span>
              </li>
              <li>
                <span className="number-badge">2</span>
                <span>Check spam/junk folder for emails</span>
              </li>
              <li>
                <span className="number-badge">3</span>
                <span>Turn off Caps Lock</span>
              </li>
              <li>
                <span className="number-badge">4</span>
                <span>Clear browser cache & cookies</span>
              </li>
              <li>
                <span className="number-badge">5</span>
                <span>Try a different browser</span>
              </li>
            </ol>
          </div>

          <div className="help-section">
            <div className="section-header">
              <div className="section-icon">📧</div>
              <h4>Contact Support</h4>
            </div>
            <div className="contact-card">
              <div className="contact-info">
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">greenw17@yahoo.com</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Response Time:</span>
                  <span className="info-value highlight">24-48 hours</span>
                </div>
              </div>
              <div className="contact-requirements">
                <p className="requirements-title">Please include:</p>
                <ul className="requirements-list">
                  <li><span className="check-icon">✓</span> Your registered email</li>
                  <li><span className="check-icon">✓</span> Description of the issue</li>
                  <li><span className="check-icon">✓</span> Error message (if any)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="help-popup-footer">
          <button className="btn-primary popup-btn" onClick={onClose}>
            <span className="btn-icon">👌</span>
            Got it, thanks!
          </button>
          <button
            className="btn-secondary popup-btn email-btn"
            onClick={() => {
              const subject = "Login Support Request - Mathe-Class";
              const body = "I need assistance with login issues on Mathe-Class Platform.";
              window.location.href = `mailto:greenw17@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              onClose();
            }}
          >
            <span className="btn-icon">✉️</span>
            Email Support
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Login Component
========================= */
const Login = () => {
  const { login, isAuthenticated, user, checked } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getRedirectPath = (role) => {
    switch (role) {
      case "admin": return "/admin";
      case "teacher": return "/dashboard";
      case "student": return "/my-courses";
      default: return "/";
    }
  };

  // Session expired handling
  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      showToast.error("Your session has expired. Please log in again.");
      const params = new URLSearchParams(searchParams);
      params.delete("session");
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [searchParams, navigate, location]);

  // Redirect if already logged in
  useEffect(() => {
    if (checked && isAuthenticated && user?.role) {
      navigate(getRedirectPath(user.role), { replace: true });
    }
  }, [checked, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      showToast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);

      if (result.success) {
        showToast.success("Login successful! Redirecting...");
        navigate(getRedirectPath(result.user.role), { replace: true });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const msg = error.message?.toLowerCase() || "";

      if (msg.includes("pending approval")) {
        showToast.info("Your account is pending admin approval.", { autoClose: 8000 });
      } else if (msg.includes("rejected")) {
        showToast.error("Your account was rejected. Please contact support.", { autoClose: 10000 });
      } else if (msg.includes("invalid")) {
        showToast.error("Invalid email or password.");
      } else {
        showToast.error("Login failed. Please try again.");
      }

      setFormData((p) => ({ ...p, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  // Forgot password (email client)
  const handleForgotPassword = (e) => {
    e.preventDefault();
    const email = formData.email || forgotEmail;

    if (!email.trim()) {
      showToast.error("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast.error("Please enter a valid email address.");
      return;
    }

    const subject = "Password Reset Request - Mathe-Class Platform";
    const body = `
Dear Mathe-Class Support,

I need help accessing my account.

📧 Email: ${email}
🔑 Request: Password Reset / Login Assistance
📅 Date: ${new Date().toLocaleDateString()}
⏰ Time: ${new Date().toLocaleTimeString()}

Please help me regain access to my account.

Thank you,
${email}
    `.trim();

    window.location.href = `mailto:greenw17@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast.success("Email client opening with pre-filled message...");
    setForgotEmail("");
  };

  // Quick support email
  const handleQuickSupportEmail = () => {
    const subject = "Login Support - Mathe-Class Platform";
    const body = "I need assistance with my Mathe-Class account login.";
    window.location.href = `mailto:greenw17@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast.info("Opening quick support email...");
  };

  if (checked && isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <div className="redirecting-animation">
            <div className="spinner"></div>
            <h2>Welcome Back!</h2>
            <p>Redirecting you to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {/* Floating particles background */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--i': i,
            '--x': Math.random() * 100,
            '--y': Math.random() * 100,
            '--size': Math.random() * 3 + 1
          }}></div>
        ))}
      </div>

      <div className="auth-form">
        {/* Header - UPDATED: Combined icon and text on one line */}
        <div className="form-header">
          <div className="header-title-row">
            <span className="header-icon">🔐</span>
            <h2>Welcome Back</h2>
          </div>
          <p className="header-subtitle">Sign in to your Mathe-Class account</p>
        </div>

        {location.state?.justRegistered && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <div className="success-content">
              <strong>Registration Successful!</strong>
              <p>{location.state.message || "Please log in to continue."}</p>
            </div>
          </div>
        )}

        {showForgotPassword ? (
          // FORGOT PASSWORD SECTION
          <div className="forgot-password-section">
            <div className="forgot-header">
              <div className="forgot-title-row">
                <span className="forgot-icon">🔓</span>
                <h3>Reset Your Password</h3>
              </div>
              <p className="forgot-subtitle">Enter your email to request a password reset</p>
            </div>

            <form onSubmit={handleForgotPassword} className="forgot-form">
              <div className="form-group floating-group">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder=" "
                  required
                  className="floating-input"
                />
                <label className="floating-label">Your Registered Email</label>
                <div className="input-icon">📧</div>
              </div>

              <div className="button-group">
                <button type="submit" className="btn-primary forgot-btn">
                  <span className="btn-icon">✉️</span>
                  <span className="btn-text">Send Password Reset Request</span>
                </button>
                
                <button 
                  type="button" 
                  className="btn-secondary quick-support-btn"
                  onClick={handleQuickSupportEmail}
                >
                  <span className="btn-icon">⚡</span>
                  <span className="btn-text">Quick Support Email</span>
                </button>

                <button 
                  type="button" 
                  className="btn-tertiary back-btn"
                  onClick={() => setShowForgotPassword(false)}
                >
                  <span className="btn-icon">←</span>
                  <span className="btn-text">Back to Login</span>
                </button>
              </div>
            </form>

            <div className="forgot-info">
              <div className="info-icon">ℹ️</div>
              <p>We'll open your email client with a pre-filled message. Just send it to our support team.</p>
            </div>
          </div>
        ) : (
          // MAIN LOGIN SECTION
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group floating-group">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  disabled={loading}
                  className="floating-input"
                />
                <label className="floating-label">Email Address</label>
                <div className="input-icon">📧</div>
              </div>

              <div className="form-group floating-group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  disabled={loading}
                  className="floating-input"
                />
                <label className="floating-label">Password</label>
                <div className="input-icon">🔒</div>
                <button
                  type="button"
                  className="toggle-password fancy-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  disabled={loading}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className={`toggle-icon ${showPassword ? 'visible' : ''} ${isHovering ? 'hover' : ''}`}>
                    {showPassword ? '🙈' : '👁️'}
                  </div>
                </button>
              </div>

              <div className="form-options">
                <button
                  type="button"
                  className="forgot-link fancy-link"
                  onClick={() => setShowForgotPassword(true)}
                >
                  <span className="link-icon">🔓</span>
                  <span className="link-text">Forgot your password?</span>
                </button>
              </div>

              <button 
                type="submit" 
                className="btn-primary login-btn"
                disabled={loading}
              >
                <div className="btn-content">
                  <div className="btn-icon">{loading ? '⏳' : '🚀'}</div>
                  <div className="btn-text">
                    {loading ? 'Authenticating...' : 'Login to Account'}
                  </div>
                </div>
                {!loading && <div className="btn-arrow">→</div>}
              </button>
            </form>

            {/* DIVIDER: New user registration option */}
            <div className="auth-divider">
              <span className="divider-line"></span>
              <span className="divider-text">New to Mathe-Class?</span>
              <span className="divider-line"></span>
            </div>

            <div className="register-prompt">
              <Link to="/register" className="register-link">
                <span className="link-icon">✨</span>
                <span className="link-text">Create a New Account</span>
              </Link>
            </div>

            {/* Help section - only for login issues */}
            <div className="help-section">
              <button 
                className="help-button"
                onClick={() => setShowHelpPopup(true)}
              >
                <div className="help-button-content">
                  <div className="help-icon">❓</div>
                  <div className="help-text">
                    <span className="help-title">Having trouble logging in?</span>
                    <span className="help-subtitle">Get help here</span>
                  </div>
                </div>
                <div className="help-arrow">→</div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Help Popup */}
      <HelpPopup isOpen={showHelpPopup} onClose={() => setShowHelpPopup(false)} />
    </div>
  );
};

export default Login;