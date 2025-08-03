// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../../config";
// import "./Register.css";

// const Register = ({ setUser }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     confirmEmail: "",
//     password: "",
//     confirmPassword: "",
//     role: "student",
//     subject: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   const studentSubjects = [
//     "Algebra 1",
//     "Algebra 2",
//     "Pre-Calculus",
//     "Calculus",
//     "Geometry & Trigonometry",
//     "Statistics & Probability",
//   ];

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validateForm = () => {
//     const {
//       name,
//       email,
//       confirmEmail,
//       password,
//       confirmPassword,
//       role,
//       subject,
//     } = formData;

//     if (!name || !email || !password || !role) {
//       return "Please fill in all required fields.";
//     }
//     if (email !== confirmEmail) {
//       return "Emails do not match.";
//     }
//     if (password !== confirmPassword) {
//       return "Passwords do not match.";
//     }
//     if (role === "teacher" && !subject.trim()) {
//       return "Subject is required for teachers.";
//     }
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errorMessage = validateForm();
//     if (errorMessage) {
//       toast.error(errorMessage);
//       return;
//     }

//     setLoading(true);
//     try {
//       const { name, email, password, role, subject } = formData;
//       const payload = {
//         name: name.trim(),
//         email: email.toLowerCase().trim(),
//         password,
//         role,
//         subject: role === "teacher" ? subject.trim() : null,
//       };

//       const response = await axios.post(
//         `${API_BASE_URL}/api/v1/auth/register`,
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );

//       const { token, user } = response.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user);

//       if (user.role === "teacher") {
//         toast.info(
//           "Registration successful. Your account is pending admin approval."
//         );
//         navigate("/login");
//       } else if (user.role === "student") {
//         toast.success("Registration successful! You can now log in.");
//         navigate("/login");
//       } else {
//         toast.success("Admin registration successful!");
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       const serverError =
//         err.response?.data?.error || "Registration failed. Please try again.";
//       toast.error(serverError);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2>Create Your Account</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               name="name"
//               type="text"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group">
//             <label>Confirm Email</label>
//             <input
//               name="confirmEmail"
//               type="email"
//               value={formData.confirmEmail}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group password-group">
//             <label>Password</label>
//             <div className="password-input">
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 className="toggle-password"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           <div className="form-group password-group">
//             <label>Confirm Password</label>
//             <div className="password-input">
//               <input
//                 name="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 className="toggle-password"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Role</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               disabled={loading}
//             >
//               <option value="student">Student</option>
//               <option value="teacher">Teacher</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           {formData.role === "teacher" && (
//             <div className="form-group">
//               <label>Subject</label>
//               <input
//                 name="subject"
//                 type="text"
//                 placeholder="e.g., Algebra"
//                 value={formData.subject}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//             </div>
//           )}

//           {formData.role === "student" && (
//             <div className="form-group">
//               <label>Choose Subject</label>
//               <select
//                 name="subject"
//                 value={formData.subject}
//                 onChange={handleChange}
//                 disabled={loading}
//               >
//                 <option value="">Select a subject</option>
//                 {studentSubjects.map((subj) => (
//                   <option key={subj} value={subj}>
//                     {subj}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <button type="submit" className="btn-primary" disabled={loading}>
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <div className="auth-footer">
//           Already have an account? <Link to="/login">Login here</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;



// Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./Register.css";

const Register = ({ setUser }) => {
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
        subject: role === "teacher" ? subject.trim() : null,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      if (user.role === "teacher") {
        toast.info(
          "Registration successful. Your account is pending admin approval."
        );
        navigate("/login");
      } else if (user.role === "student") {
        toast.success("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        toast.success("Admin registration successful!");
        navigate("/dashboard");
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
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
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

          {formData.role === "teacher" && (
            <div className="form-group">
              <label>Subject</label>
              <input
                name="subject"
                type="text"
                placeholder="e.g., Algebra"
                value={formData.subject}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          )}

          {formData.role === "student" && (
            <div className="form-group">
              <label>Choose Subject</label>
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
