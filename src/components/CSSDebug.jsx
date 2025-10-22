// src/components/CSSDebug.jsx
import React from 'react';
import '../Pages/AdminDashboard.css';

const CSSDebug = () => {
  return (
    <div style={{ display: 'none' }}>
      {/* This forces CSS to load */}
      <div className="admin-layout debug"></div>
      <div className="admin-sidebar debug"></div>
      <div className="admin-main-content debug"></div>
    </div>
  );
};

export default CSSDebug;