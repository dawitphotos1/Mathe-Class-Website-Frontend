// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import "./PaymentPage.css";

// Initialize Stripe with error handling
let stripePromise = null;

const initializeStripe = async () => {
  const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    console.error("❌ Stripe publishable key is not configured");
    throw new Error("Stripe is not properly configured. Please contact support.");
  }

  try {
    stripePromise = await loadStripe(stripeKey);
    console.log("✅ Stripe initialized successfully");
    return stripePromise;
  } catch (error) {
    console.error("❌ Failed to initialize Stripe:", error);
    throw new Error("Failed to initialize payment system. Please try again.");
  }
};

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log(`🔄 Fetching course details for ID: ${courseId}`);
      
      // Try multiple endpoints to get course data
      let courseData = null;
      
      try {
        // First try the payments endpoint
        const paymentResponse = await axios.get(`/payments/${courseId}`);
        console.log("💰 Payment endpoint response:", paymentResponse.data);
        if (paymentResponse.data.success && paymentResponse.data.course) {
          courseData = paymentResponse.data.course;
        }
      } catch (paymentError) {
        console.log("⚠️ Payment endpoint failed, trying courses endpoint...");
      }
      
      // If payment endpoint failed, try courses endpoint
      if (!courseData) {
        try {
          const coursesResponse = await axios.get(`/courses/id/${courseId}`);
          console.log("📚 Courses endpoint response:", coursesResponse.data);
          if (coursesResponse.data.success && coursesResponse.data.course) {
            courseData = coursesResponse.data.course;
          }
        } catch (coursesError) {
          console.log("⚠️ Courses endpoint failed");
        }
      }
      
      if (courseData) {
        console.log("✅ Course details loaded:", courseData);
        
        // Ensure price is properly formatted
        const formattedCourse = {
          ...courseData,
          price: parseFloat(courseData.price) || 0
        };
        
        setCourse(formattedCourse);
        
        if (formattedCourse.price === 0) {
          console.warn("⚠️ Course price is $0.00 - this might be an issue");
        }
      } else {
        throw new Error("Course not found in any endpoint");
      }
    } catch (err) {
      console.error("❌ Error fetching course:", err);
      const errorMsg = err.response?.data?.error || "Failed to load course details. Please try again.";
      setError(errorMsg);
      toast.error("Failed to load course information");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!course || !course.price || course.price <= 0) {
      toast.error("Invalid course price. Please contact support.");
      return;
    }

    try {
      setProcessing(true);
      console.log("💳 Starting payment process for course:", courseId);

      // Initialize Stripe if not already initialized
      let stripe;
      try {
        stripe = stripePromise ? stripePromise : await initializeStripe();
      } catch (stripeError) {
        toast.error(stripeError.message);
        setProcessing(false);
        return;
      }

      const { data } = await axios.post("/payments/create-checkout-session", {
        courseId: courseId,
      });

      if (data.success && data.sessionId) {
        console.log("✅ Checkout session created:", data.sessionId);
        
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("❌ Stripe redirect error:", error);
          
          // Handle specific Stripe errors
          if (error.type === "card_error" || error.type === "validation_error") {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
        }
      } else {
        throw new Error(data.error || "Failed to create payment session");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Payment failed";
      toast.error(errorMsg);
      
      // Handle specific errors
      if (err.response?.data?.error?.includes("already paid") || 
          err.response?.data?.error?.includes("already enrolled")) {
        navigate("/my-courses");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2>Loading Course Details...</h2>
          <p>Please wait while we load the course information.</p>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-container">
        <div className="payment-card error">
          <h2>Error Loading Course</h2>
          <p>{error}</p>
          <div className="payment-actions">
            <button onClick={fetchCourseDetails} className="btn-primary">
              Try Again
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="payment-container">
        <div className="payment-card error">
          <h2>Course Not Found</h2>
          <p>The requested course could not be found.</p>
          <button onClick={() => navigate("/courses")} className="btn-primary">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = parseFloat(course.price || 0).toFixed(2);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Complete Your Enrollment</h2>
        
        <div className="course-summary">
          <h3>{course.title}</h3>
          <p className="course-description">
            {course.description || "No description available"}
          </p>
          
          {course.teacher && (
            <p className="course-teacher">
              <strong>Instructor:</strong> {course.teacher.name}
            </p>
          )}
        </div>

        <div className="payment-summary">
          <div className="price-row">
            <span>Course Price:</span>
            <span>${displayPrice}</span>
          </div>
          <div className="price-row total">
            <span><strong>Total:</strong></span>
            <span><strong>${displayPrice}</strong></span>
          </div>
        </div>

        <div className="payment-actions">
          <button
            onClick={handlePayment}
            disabled={processing || !course.price || course.price <= 0}
            className="btn-primary payment-btn"
          >
            {processing ? "Processing..." : `Pay $${displayPrice} with Stripe`}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={processing}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

        {(!course.price || course.price <= 0) && (
          <div className="payment-warning">
            <p>⚠️ This course appears to be free. Please contact support if this seems incorrect.</p>
          </div>
        )}

        <div className="payment-security">
          <p>🔒 Your payment is secure and encrypted</p>
          <small>Powered by Stripe</small>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;