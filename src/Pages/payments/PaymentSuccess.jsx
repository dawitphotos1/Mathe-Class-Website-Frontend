// src/pages/payment/PaymentSuccess.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  const [status, setStatus] = useState("processing");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    console.log("🎯 Payment Success page loaded");
    console.log("Session ID:", sessionId);
    console.log("Course ID:", courseId);
    console.log("User:", user?.email);

    // No API calls - just show success message
    // Webhook will handle enrollment in background
    
    // Countdown timer for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, courseId, user]);

  // Simple success page with no API calls
  return (
    <div className="payment-success-container">
      <div className="payment-status success">
        <div className="success-icon">✅</div>
        <h2>Payment Successful!</h2>
        
        <div className="payment-info">
          <p><strong>Thank you for your purchase!</strong></p>
          <p>Your payment has been processed successfully.</p>
        </div>

        <div className="processing-message">
          <h3>What happens next?</h3>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <strong>Payment Processed</strong>
                <p>Your payment has been securely processed by Stripe.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <strong>Automatic Enrollment</strong>
                <p>You're being enrolled in the course automatically.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <strong>Access Granted</strong>
                <p>You'll have immediate access to the course content.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="important-notes">
          <h4>📝 Important Notes:</h4>
          <ul>
            <li>Enrollment may take 1-2 minutes to process</li>
            <li>You'll receive a confirmation email</li>
            <li>Check "My Courses" if you don't see the course immediately</li>
            <li>Contact support if you don't have access within 5 minutes</li>
          </ul>
        </div>

        <div className="support-info">
          <p><strong>Reference ID:</strong> {sessionId}</p>
          <p><strong>Course ID:</strong> {courseId}</p>
          <p>Save this information for support if needed.</p>
        </div>

        <div className="action-buttons">
          <Link to="/my-courses" className="btn-primary">
            {countdown > 0 ? `Go to My Courses (${countdown})` : 'Go to My Courses'}
          </Link>
          <Link to="/courses" className="btn-secondary">
            Browse More Courses
          </Link>
          <a 
            href={`mailto:support@matheclass.com?subject=Payment Confirmation&body=Session ID: ${sessionId}%0ACourse ID: ${courseId}%0AUser: ${user?.email}`}
            className="btn-support"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;