
// components/Loading.jsx
import React from "react";
import "./Loading.css"; // Make sure this doesn't have infinite animations

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;