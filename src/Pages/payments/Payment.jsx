
// src/Pages/payment/Payment.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Import auth context
import axios from "../../utils/axiosInstance";
import "./Payment.css";

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // ✅ Use auth context
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 Payment page loaded with Course ID:", courseId);
    console.log("👤 User authentication status:", isAuthenticated);
    console.log("👤 Current user:", user);
    
    if (!courseId || courseId === "undefined") {
      setError("Invalid course ID. Please go back and try again.");
      setLoading(false);
      return;
    }

    fetchCourse();
  }, [courseId, isAuthenticated, user]);

  const fetchCourse = async () => {
    try {
      console.log("📡 Fetching course with ID:", courseId);
      
      // ✅ Use the new endpoint to get course by ID
      const response = await axios.get(`/courses/id/${courseId}`);
      console.log("✅ Course data received:", response.data);
      
      if (response.data) {
        setCourse(response.data);
      } else {
        throw new Error("No course data received");
      }
    } catch (err) {
      console.error("❌ Error fetching course:", err);
      
      // ✅ Fallback: try to get from all courses list
      try {
        console.log("🔄 Trying fallback method...");
        const allCoursesResponse = await axios.get("/courses");
        const allCourses = allCoursesResponse.data;
        const foundCourse = allCourses.find(c => c.id === parseInt(courseId));
        
        if (foundCourse) {
          console.log("✅ Course found via fallback:", foundCourse.title);
          setCourse(foundCourse);
        } else {
          throw new Error(`Course with ID ${courseId} not found`);
        }
      } catch (fallbackErr) {
        console.error("❌ Fallback also failed:", fallbackErr);
        setError("Failed to load course information. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRealPayment = async () => {
    console.log("💳 Payment button clicked - User:", user);
    console.log("💳 Is authenticated:", isAuthenticated);

    if (!isAuthenticated || !user) {
      console.log("🔐 User not authenticated, redirecting to login...");
      navigate('/login', { 
        state: { 
          from: `/payment/${courseId}`,
          message: "Please login to complete your payment"
        } 
      });
      return;
    }

    try {
      setProcessing(true);
      console.log("💳 Processing real payment for course:", courseId);
      
      const response = await axios.post("/payments/create-checkout-session", {
        courseId: courseId
      });

      // Redirect to Stripe Checkout
      if (response.data.sessionId) {
        console.log("✅ Redirecting to Stripe with session:", response.data.sessionId);
        window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
      } else {
        throw new Error("No session ID received from server");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  const handleTestPayment = async () => {
    console.log("🧪 Test payment button clicked - User:", user);
    console.log("🧪 Is authenticated:", isAuthenticated);

    if (!isAuthenticated || !user) {
      console.log("🔐 User not authenticated, redirecting to login...");
      navigate('/login', { 
        state: { 
          from: `/payment/${courseId}`,
          message: "Please login to complete your payment"
        } 
      });
      return;
    }

    try {
      setProcessing(true);
      console.log("🧪 Processing test payment for course:", courseId);
      
      // For testing, directly navigate to success
      setTimeout(() => {
        navigate(`/payment-success?session_id=test_session_${Date.now()}&courseId=${courseId}`);
      }, 1500);

    } catch (err) {
      console.error("❌ Test payment error:", err);
      alert("Failed to process test payment. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading">
          <div className="spinner"></div>
          Loading payment information...
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="payment-container">
        <div className="error">
          <h3>❌ {error || "Course not found"}</h3>
          <div className="error-details">
            <p><strong>Course ID:</strong> {courseId}</p>
            <p>Please check the course ID and try again.</p>
          </div>
        </div>
        <Link to="/courses" className="btn-back">← Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Enroll in {course.title}</h1>
        <p>Complete your enrollment by making the payment</p>
      </div>

      <div className="payment-content">
        <div className="course-summary">
          <h3>📚 Course Summary</h3>
          <div className="summary-item">
            <span>Course:</span>
            <span>{course.title}</span>
          </div>
          <div className="summary-item">
            <span>Instructor:</span>
            <span>{course.teacher?.name || "Unknown Instructor"}</span>
          </div>
          <div className="summary-item">
            <span>Description:</span>
            <span>{course.description || "No description available"}</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>${course.price}</span>
          </div>
        </div>

        <div className="user-status">
          {isAuthenticated ? (
            <div className="user-authenticated">
              <p>✅ Logged in as: <strong>{user.name}</strong> ({user.email})</p>
              <p>Role: <strong>{user.role}</strong></p>
            </div>
          ) : (
            <div className="user-not-authenticated">
              <p>🔐 You need to login to complete your payment</p>
            </div>
          )}
        </div>

        <div className="payment-options">
          <h3>💳 Payment Methods</h3>
          
          {/* Real Stripe Payment */}
          <div className="payment-method">
            <h4>🔒 Secure Credit/Debit Card Payment</h4>
            <p>Real payment processed securely via Stripe</p>
            <button 
              className="btn-payment-real"
              onClick={handleRealPayment}
              disabled={processing || !isAuthenticated}
            >
              {processing ? "🔄 Processing..." : `Pay $${course.price} with Stripe`}
            </button>
            {!isAuthenticated && (
              <p className="login-required">* Please login to use this payment method</p>
            )}
          </div>

          {/* Test Payment */}
          <div className="payment-method">
            <h4>🧪 Test Payment (No Real Charge)</h4>
            <p>Use this for testing - no real payment required</p>
            <div className="test-card-info">
              <p><strong>Test Card Number:</strong> 4242 4242 4242 4242</p>
              <p><strong>Expiry Date:</strong> Any future date (e.g., 12/34)</p>
              <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
            </div>
            <button 
              className="btn-payment-test"
              onClick={handleTestPayment}
              disabled={processing || !isAuthenticated}
            >
              {processing ? "🔄 Processing..." : `Test Payment - $${course.price}`}
            </button>
            {!isAuthenticated && (
              <p className="login-required">* Please login to use this payment method</p>
            )}
          </div>
        </div>

        {!isAuthenticated && (
          <div className="login-actions">
            <p>🔐 Please login or register to complete your payment</p>
            <div className="auth-buttons">
              <button 
                onClick={() => navigate('/login', { state: { from: `/payment/${courseId}` } })}
                className="btn-login"
              >
                📝 Login
              </button>
              <button 
                onClick={() => navigate('/register', { state: { from: `/payment/${courseId}` } })}
                className="btn-register"
              >
                ✍️ Register
              </button>
            </div>
          </div>
        )}

        <div className="payment-footer">
          <Link to="/courses" className="btn-back">
            ← Back to Courses
          </Link>
          <div className="security-notice">
            <small>🔒 Your payment is secure and encrypted</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;