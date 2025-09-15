// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
// import RedirectIfAuthenticated from "./RedirectIfAuthenticated";
// import "./Login.css";

// const Login = () => {
//   const { loginUser } = useAuth();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!formData.email || !formData.password) {
//       toast.error("Please fill in all fields.");
//       console.log("Login: Form validation failed", { email: formData.email });
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log("Login: Submitting login form", { email: formData.email });
//       await loginUser(
//         formData.email.toLowerCase().trim(),
//         formData.password.trim()
//       );
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "Login failed";
//       console.error("Login: Login attempt failed", {
//         status: err.response?.status,
//         error: errorMsg,
//       });
//       // Error is handled in AuthContext.loginUser, but log here for clarity
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <RedirectIfAuthenticated>
//       <div className="auth-container">
//         <div className="auth-form">
//           <h2>Login to MathClass 📘</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 name="email"
//                 type="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div className="form-group password-group">
//               <label>Password</label>
//               <div className="password-input">
//                 <input
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
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

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);

    try {
      console.log("Login: Submitting login form", { email });
      await loginUser(email, password);
    } catch (err) {
      console.error("Login: Login attempt failed", {
        email,
        error: err.message,
      });
      // Toast is handled in AuthContext.js
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
