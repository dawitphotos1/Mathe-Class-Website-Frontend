// src/Pages/PendingApproval.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./PendingApproval.css"; // optional: create for styling

const PendingApproval = () => {
  return (
    <div className="pending-container">
      <h1>⏳ Account Pending Approval</h1>
      <p>
        Thank you for registering! Your account has been created and is
        currently awaiting approval from an administrator.
      </p>
      <p>
        You’ll be notified once your account is approved. Please check back
        later or contact support if you have questions.
      </p>
      <Link to="/" className="btn-home">
        Return to Home
      </Link>
    </div>
  );
};

export default PendingApproval;
