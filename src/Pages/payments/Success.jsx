
// File: frontend/src/pages/Success.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");
    console.log("Payment success, session ID:", sessionId);
    toast.success("Payment successful! Your account is pending approval.");
    setTimeout(() => navigate("/login"), 3000);
  }, [navigate, location]);

  return (
    <div className="auth-container">
      <h2>Payment Successful</h2>
      <p>Your account is being processed. You will be redirected to the login page...</p>
    </div>
  );
};

export default Success;
