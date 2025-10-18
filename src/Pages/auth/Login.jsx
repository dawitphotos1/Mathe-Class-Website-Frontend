// //auth/Login.jsx
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import "./Login.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const { loginUser } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const user = await loginUser({ email, password });

//       // ✅ Save token & user to localStorage
//       if (user?.token) {
//         localStorage.setItem("token", user.token);
//         localStorage.setItem("user", JSON.stringify(user));
//       }

//       // ✅ Navigate based on role
//       if (user?.role === "admin") {
//         navigate("/admin");
//       } else if (user?.role === "teacher") {
//         navigate("/dashboard");
//       } else if (user?.role === "student") {
//         navigate("/my-courses");
//       } else {
//         navigate("/");
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed. Try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2>Login</h2>

//         {location.state?.message && (
//           <div className="auth-message info">{location.state.message}</div>
//         )}
//         {error && <div className="auth-message error">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={isSubmitting}
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="form-group password-group">
//             <label htmlFor="password">Password</label>
//             <div className="password-input">
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 disabled={isSubmitting}
//                 placeholder="Enter your password"
//               />
//             </div>
//           </div>

//           <button type="submit" className="btn-primary" disabled={isSubmitting}>
//             {isSubmitting ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <div className="auth-footer">
//           Don&apos;t have an account?{" "}
//           <button
//             onClick={() => navigate("/register")}
//             className="text-link"
//             disabled={isSubmitting}
//           >
//             Register
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;





//auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // redirect based on role
        const role = data.user.role;
        if (role === "admin") navigate("/admin");
        else if (role === "teacher") navigate("/dashboard");
        else if (role === "student") navigate("/my-courses");
        else navigate("/");
      } else {
        setError("Login failed: no token returned.");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>

        {location.state?.message && (
          <div className="auth-message info">{location.state.message}</div>
        )}
        {error && <div className="auth-message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-link"
            disabled={isSubmitting}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
