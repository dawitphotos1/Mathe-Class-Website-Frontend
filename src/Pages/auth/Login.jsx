
// // src/Pages/auth/Login.jsx
// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { AuthContext } from "../../context/AuthContext";
// import axiosInstance from "../../utils/axiosInstance"; // centralized axios
// import RedirectIfAuthenticated from "../../Pages/auth/RedirectIfAuthenticated";
// import "./Login.css";

// const Login = () => {
//   const { loginUser } = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const { data } = await axiosInstance.post("/auth/login", {
//         email: email.toLowerCase().trim(),
//         password: password.trim(),
//       });

//       // ✅ Save user + token
//       loginUser(data.token, data.user);
//       toast.success("Logged in successfully");

//       // ✅ Role-based redirects
//       if (data.user.role === "admin") {
//         navigate("/admindashboard");
//       } else if (data.user.role === "teacher") {
//         navigate("/dashboard");
//       } else {
//         navigate("/courses");
//       }
//     } catch (err) {
//       const msg = err.response?.data?.error || "Login failed";

//       // ✅ Special handling for unapproved students
//       if (msg.toLowerCase().includes("pending approval")) {
//         setError("Your account is still pending approval by an admin.");
//         toast.info("Your account is still pending approval by an admin.");
//       } else {
//         setError(msg);
//         toast.error(msg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <RedirectIfAuthenticated>
//       <div className="auth-container">
//         <div className="auth-form">
//           <h2>Login to MathClass 📘</h2>
//           {error && <p className="error">{error}</p>}
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div className="form-group password-group">
//               <label>Password</label>
//               <div className="password-input">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   className="toggle-password"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={loading}
//                 >
//                   {showPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>
//             </div>

//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <div className="auth-footer">
//             Don’t have an account? <Link to="/register">Register here</Link>
//           </div>
//         </div>
//       </div>
//     </RedirectIfAuthenticated>
//   );
// };

// export default Login;




// src/Pages/auth/Login.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import RedirectIfAuthenticated from "../../Pages/auth/RedirectIfAuthenticated";
import "./Login.css";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return "Please enter both email and password.";
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
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const { data } = await axiosInstance.post("/auth/login", payload);

      if (data?.user) {
        if (data.user.role === "student" && data.user.approval_status !== "approved") {
          // 🚫 Student is still pending or rejected
          toast.error(
            data.user.approval_status === "pending"
              ? "Your account is awaiting admin approval."
              : "Your account has been rejected."
          );
          return;
        }

        if (data.token) {
          // ✅ Login success
          loginUser(data.token, data.user);
          toast.success("Login successful!");

          if (data.user.role === "admin") {
            navigate("/admindashboard");
          } else if (data.user.role === "teacher") {
            navigate("/dashboard");
          } else {
            navigate("/my-courses");
          }
        } else {
          toast.error("Login failed: no token returned.");
        }
      } else {
        toast.error("Invalid login response from server.");
      }
    } catch (err) {
      const serverError =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Login failed. Please try again.";
      toast.error(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RedirectIfAuthenticated>
      <div className="auth-container">
        <div className="auth-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            Don’t have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
};

export default Login;
