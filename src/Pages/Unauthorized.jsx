

// src/Pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Unauthorized.css"; // optional: create for styling

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>🚫 Unauthorized</h1>
      <p>You don’t have permission to access this page.</p>
      <Link to="/" className="btn-home">
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;
