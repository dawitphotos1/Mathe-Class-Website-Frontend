
// src/components/Navbar.jsx
import React, { useState } from "react";
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

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Math Logo" className="navbar-logo" />
          <span>Math Class</span>
        </Link>
      </div>

      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>

      <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        <Link to="/courses" onClick={handleLinkClick}>Courses</Link>

        {user ? (
          <>
            {/* ✅ NEW: Show My Courses for Students */}
            {user.role === "student" && (
              <Link to="/my-courses" onClick={handleLinkClick}>
                My Courses
              </Link>
            )}

            {user.role === "teacher" && (
              <Link to="/create-course" onClick={handleLinkClick}>
                Create Course
              </Link>
            )}

            {(user.role === "teacher" || user.role === "admin") && (
              <Link to="/dashboard" onClick={handleLinkClick}>
                Admin Dashboard
              </Link>
            )}

            <Link to="/profile" onClick={handleLinkClick}>Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" onClick={handleLinkClick}>Register</Link>
            <Link to="/login" onClick={handleLinkClick}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


