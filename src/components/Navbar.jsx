// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext";
// import "./Navbar.css";
// import logo from "../assets/images/mathlogo.jpeg";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user, logoutUser, isAuthenticated, loading } = useAuth();

//   const toggleMenu = (e) => {
//     e.stopPropagation();
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleLinkClick = () => setIsMenuOpen(false);

//   const handleLogout = () => {
//     logoutUser();
//     toast.success("Logged out successfully");
//     navigate("/");
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <Link to="/" onClick={handleLinkClick}>
//           <img src={logo} alt="Math Logo" className="navbar-logo" />
//           <span>Math Class</span>
//         </Link>
//       </div>

//       <button
//         className="hamburger"
//         onClick={toggleMenu}
//         aria-label="Toggle menu"
//       >
//         <span className="hamburger-bar"></span>
//         <span className="hamburger-bar"></span>
//         <span className="hamburger-bar"></span>
//       </button>

//       <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
//         <Link to="/" onClick={handleLinkClick}>
//           Home
//         </Link>
//         <Link to="/courses" onClick={handleLinkClick}>
//           Courses
//         </Link>

//         {loading ? (
//           <div className="navbar-spinner" title="Checking login..."></div>
//         ) : isAuthenticated ? (
//           <>
//             {/* ✅ Greeting with name and role */}
//             <span className="navbar-greeting">
//               Welcome, {user?.name} ({user?.role})
//             </span>

//             {user?.role === "teacher" && (
//               <Link to="/create-course" onClick={handleLinkClick}>
//                 Create Course
//               </Link>
//             )}
//             {(user?.role === "teacher" || user?.role === "admin") && (
//               <Link
//                 to={user?.role === "admin" ? "/admindashboard" : "/dashboard"}
//                 onClick={handleLinkClick}
//               >
//                 {user?.role === "admin"
//                   ? "Admin Dashboard"
//                   : "Teacher Dashboard"}
//               </Link>
//             )}
//             <Link to="/profile" onClick={handleLinkClick}>
//               Profile
//             </Link>
//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/register" onClick={handleLinkClick}>
//               Register
//             </Link>
//             <Link to="/login" onClick={handleLinkClick}>
//               Login
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import logo from "../assets/images/mathlogo.jpeg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser, isAuthenticated, loading } = useAuth();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Math Logo" className="navbar-logo" />
          <span>Math Class</span>
        </Link>
      </div>

      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>

      <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>
          Home
        </Link>
        <Link to="/courses" onClick={handleLinkClick}>
          Courses
        </Link>

        {loading ? (
          <div className="navbar-spinner" title="Checking login..."></div>
        ) : isAuthenticated ? (
          <>
            {/* ✅ Greeting with name and role */}
            <span className="navbar-greeting">
              Welcome, {user?.name} ({user?.role})
            </span>

            {user?.role === "teacher" && (
              <Link to="/create-course" onClick={handleLinkClick}>
                Create Course
              </Link>
            )}
            {(user?.role === "teacher" || user?.role === "admin") && (
              <Link
                to={user?.role === "admin" ? "/admindashboard" : "/dashboard"}
                onClick={handleLinkClick}
              >
                {user?.role === "admin"
                  ? "Admin Dashboard"
                  : "Teacher Dashboard"}
              </Link>
            )}
            <Link to="/profile" onClick={handleLinkClick}>
              Profile
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" onClick={handleLinkClick}>
              Register
            </Link>
            <Link to="/login" onClick={handleLinkClick}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;