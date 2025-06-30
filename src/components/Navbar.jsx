
// src/components/Navbar.jsx
import React, { useState ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";
import logo from "../assets/images/mathlogo.jpeg"; // ✅ your logo path

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      toast.success("Logged out successfully");
      navigate("/");
    }
  };
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
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

        {user ? (
          <>
            {user.role === "student" && (
              <div className="dropdown">
                <button className="dropbtn">🎓 Student</button>
                <div className="dropdown-content">
                  <Link to="/courses" onClick={handleLinkClick}>
                    Courses
                  </Link>
                  <Link to="/my-courses" onClick={handleLinkClick}>
                    My Courses
                  </Link>
                  <Link to="/profile" onClick={handleLinkClick}>
                    Profile
                  </Link>
                  <div className="dropdown-toggle">
                    <label className="dark-switch">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                      />
                      Dark Mode
                    </label>
                  </div>
                </div>
              </div>
            )}

            {user.role === "teacher" && (
              <div className="dropdown">
                <button className="dropbtn">👨‍🏫 Teacher</button>
                <div className="dropdown-content">
                  <Link to="/courses" onClick={handleLinkClick}>
                    Courses
                  </Link>
                  <Link to="/my-teaching-courses" onClick={handleLinkClick}>
                    My Teaching Courses
                  </Link>
                  <Link to="/create-course" onClick={handleLinkClick}>
                    Create Course
                  </Link>
                  <Link to="/dashboard" onClick={handleLinkClick}>
                    Admin Dashboard
                  </Link>
                  <Link to="/profile" onClick={handleLinkClick}>
                    Profile
                  </Link>
                  <div className="dropdown-toggle">
                    <label className="dark-switch">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                      />
                      Dark Mode
                    </label>
                  </div>
                </div>
              </div>
            )}

            {user.role === "admin" && (
              <div className="dropdown">
                <button className="dropbtn">🛡️ Admin</button>
                <div className="dropdown-content">
                  <Link to="/courses" onClick={handleLinkClick}>
                    Courses
                  </Link>
                  <Link to="/dashboard" onClick={handleLinkClick}>
                    Admin Dashboard
                  </Link>
                  <Link to="/profile" onClick={handleLinkClick}>
                    Profile
                  </Link>
                  <div className="dropdown-toggle">
                    <label className="dark-switch">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                      />
                      Dark Mode
                    </label>
                  </div>
                </div>
              </div>
            )}

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



