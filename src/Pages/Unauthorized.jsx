//pages/Unauthorized.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Unauthorized.css";

const roleLabels = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
};

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRole = user?.role ? roleLabels[user.role] : null;

  return (
    <div className="unauth-wrapper">
      <div className="unauth-content">
        <div className="unauth-icon">🔒</div>

        <h1 className="unauth-title">Access Denied</h1>

        <p className="unauth-text">
          Sorry, you don’t have permission to view this page.
        </p>

        {user ? (
          <p className="unauth-subtext">
            You are logged in as <span className="unauth-role">{userRole}</span>
            . This page is restricted to users with a different role.
          </p>
        ) : (
          <p className="unauth-subtext">
            Please <span className="unauth-role">log in</span> to continue.
          </p>
        )}

        <div className="unauth-actions">
          <button className="unauth-btn" onClick={() => navigate(-1)}>
            ⬅ Back
          </button>
          <button className="unauth-btn primary" onClick={() => navigate("/")}>
            🏠 Home
          </button>
          {!user && (
            <button className="unauth-btn" onClick={() => navigate("/login")}>
              🔑 Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
