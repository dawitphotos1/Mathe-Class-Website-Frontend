
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./Login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/users/login`,
        { email: email.toLowerCase().trim(), password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Logged in successfully");

      navigate(data.user.role === "student" ? "/courses" : "/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to MathClass 📘</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.80769 2.80754C2.41717 3.19807 2.41717 3.83123 2.80769 4.22176L19.7783 21.1923C20.1688 21.5828 20.8019 21.5828 21.1925 21.1923C21.583 20.8018 21.583 20.1686 21.1925 19.7781L4.22191 2.80754C3.83138 2.41702 3.19822 2.41702 2.80769 2.80754ZM0.853566 11.0499C1.81667 9.66931 2.87124 8.49162 3.9897 7.52506L5.33664 8.87201C4.34176 9.71473 3.38404 10.7628 2.49107 12.0246C4.64797 15.3395 8.05011 17.8002 11.9841 17.8002C12.6828 17.8002 13.3682 17.7204 14.0349 17.5703L15.5771 19.1125C14.4412 19.4899 13.238 19.6998 11.9841 19.6998C7.16233 19.6998 3.20136 16.6654 0.820516 12.9394C0.639165 12.6577 0.545108 12.3286 0.550199 11.9935C0.555305 11.6575 0.660199 11.3301 0.851082 11.0534L0.853566 11.0499ZM7.8 11.9998C7.8 11.7895 7.81547 11.5827 7.84532 11.3807L12.6191 16.1545C12.4171 16.1843 12.2103 16.1998 12 16.1998C9.68041 16.1998 7.8 14.3194 7.8 11.9998ZM11.3808 7.84513L16.1547 12.619C16.1845 12.4169 16.2 12.2102 16.2 11.9998C16.2 9.68021 14.3196 7.7998 12 7.7998C11.7896 7.7998 11.5829 7.81527 11.3808 7.84513ZM21.5137 12.0017C20.7374 13.196 19.7909 14.2808 18.7162 15.1805L20.0631 16.5274C21.2822 15.4826 22.335 14.2461 23.1806 12.9222C23.3571 12.6472 23.4509 12.3273 23.4509 12.0005C23.4509 11.673 23.3565 11.3522 23.1793 11.0767L23.178 11.0747C20.7897 7.38605 16.7263 4.2998 11.9841 4.2998C10.7917 4.2998 9.60227 4.50324 8.43887 4.90318L9.97269 6.43699C10.6474 6.27837 11.3204 6.2002 11.9841 6.2002C15.8389 6.2002 19.3439 8.71129 21.5137 12.0017Z" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 4.5C7.30558 4.5 3.13994 7.08119 0.750122 11.25C0.583496 11.5556 0.5 11.8889 0.5 12.2222C0.5 12.5556 0.583496 12.8889 0.750122 13.1944C3.13994 17.3627 7.30558 19.9444 12 19.9444C16.6944 19.9444 20.8601 17.3627 23.2499 13.1944C23.4165 12.8889 23.5 12.5556 23.5 12.2222C23.5 11.8889 23.4165 11.5556 23.2499 11.25C20.8601 7.08119 16.6944 4.5 12 4.5ZM12 17.5C9.23858 17.5 7 15.2614 7 12.5C7 9.73858 9.23858 7.5 12 7.5C14.7614 7.5 17 9.73858 17 12.5C17 15.2614 14.7614 17.5 12 17.5ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="auth-footer">
          Don’t have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;