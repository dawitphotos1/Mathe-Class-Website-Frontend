// // src/components/Navbar.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./Navbar.css";
// import logo from "../assets/images/mathlogo.jpeg";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user, logoutUser, isAuthenticated, loading } = useAuth();

//   const toggleMenu = (e) => {
//     e.stopPropagation();
//     setIsMenuOpen((prev) => !prev);
//   };

//   const handleLinkClick = () => setIsMenuOpen(false);

//   const handleLogout = async () => {
//     await logoutUser();
//     navigate("/");
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => {
//       if (isMenuOpen) setIsMenuOpen(false);
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isMenuOpen]);

//   // Avatar renderer
//   const renderAvatar = () => {
//     if (user?.avatar || user?.profileImage) {
//       return (
//         <img
//           src={user.avatar || user.profileImage}
//           alt={user?.name || "User"}
//           className="navbar-avatar"
//         />
//       );
//     }
//     const initials = user?.name
//       ? user.name
//           .split(" ")
//           .map((n) => n[0])
//           .join("")
//           .toUpperCase()
//       : "?";
//     return <div className="navbar-avatar fallback">{initials}</div>;
//   };

//   return (
//     <nav className="navbar">
//       {/* Brand */}
//       <div className="navbar-brand">
//         <Link to="/" onClick={handleLinkClick}>
//           <img src={logo} alt="Math Logo" className="navbar-logo" />
//           <span>Math Class</span>
//         </Link>
//       </div>

//       {/* Mobile toggle */}
//       <button
//         className="hamburger"
//         onClick={toggleMenu}
//         aria-label="Toggle menu"
//       >
//         <span className="hamburger-bar"></span>
//         <span className="hamburger-bar"></span>
//         <span className="hamburger-bar"></span>
//       </button>

//       {/* Links */}
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
//             {/* Greeting */}
//             <span className="navbar-greeting">
//               {renderAvatar()} Welcome, {user?.name} ({user?.role})
//             </span>

//             {/* Role-specific links */}
//             {user?.role === "teacher" && (
//               <Link to="/create-course" onClick={handleLinkClick}>
//                 Create Course
//               </Link>
//             )}
//             {(user?.role === "teacher" || user?.role === "admin") && (
//               <Link
//                 to={user?.role === "admin" ? "/admin" : "/dashboard"}
//                 onClick={handleLinkClick}
//               >
//                 {user?.role === "admin"
//                   ? "Admin Dashboard"
//                   : "Teacher Dashboard"}
//               </Link>
//             )}

//             {/* Shared */}
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




// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import logo from "../assets/images/mathlogo.jpeg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser, isAuthenticated, loading } = useAuth();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const renderAvatar = () => {
    if (user?.avatar || user?.profileImage) {
      return (
        <img
          src={user.avatar || user.profileImage}
          alt={user?.name || "User"}
          className="navbar-avatar"
        />
      );
    }
    const initials = user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";
    return <div className="navbar-avatar fallback">{initials}</div>;
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Math Logo" className="navbar-logo" />
          <span>Math Class</span>
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>

      {/* Links */}
      <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        {loading ? (
          <div className="navbar-spinner" title="Checking login..."></div>
        ) : isAuthenticated ? (
          <>
            {/* Student-specific: put My Courses at the top */}
            {user?.role === "student" && (
              <Link
                to="/my-courses"
                className="my-courses-link"
                onClick={handleLinkClick}
              >
                My Courses
              </Link>
            )}

            {/* Common links */}
            <Link to="/" onClick={handleLinkClick}>
              Home
            </Link>
            <Link to="/courses" onClick={handleLinkClick}>
              Courses
            </Link>

            {/* Greeting */}
            <span className="navbar-greeting">
              {renderAvatar()} Welcome, {user?.name} ({user?.role})
            </span>

            {/* Teacher-specific */}
            {user?.role === "teacher" && (
              <Link to="/create-course" onClick={handleLinkClick}>
                Create Course
              </Link>
            )}

            {/* Teacher/Admin dashboard */}
            {(user?.role === "teacher" || user?.role === "admin") && (
              <Link
                to={user?.role === "admin" ? "/admin" : "/dashboard"}
                onClick={handleLinkClick}
              >
                {user?.role === "admin"
                  ? "Admin Dashboard"
                  : "Teacher Dashboard"}
              </Link>
            )}

            {/* Shared */}
            <Link to="/profile" onClick={handleLinkClick}>
              Profile
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" onClick={handleLinkClick}>
              Home
            </Link>
            <Link to="/courses" onClick={handleLinkClick}>
              Courses
            </Link>
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
