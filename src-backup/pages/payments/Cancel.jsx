// File: frontend/src/pages/Cancel.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Cancel = () => {
  useEffect(() => {
    toast.error("Payment cancelled. Please try again.");
  }, []);

  return (
    <div className="auth-container">
      <h2>Payment Cancelled</h2>
      <p>Your payment was not completed. <Link to="/register">Try again</Link>.</p>
    </div>
  );
};

export default Cancel;
