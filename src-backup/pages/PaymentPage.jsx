// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import "./PaymentPage.css";

/* =========================================================
   💳 Stripe Initialization (Create-React-App Compatible)
========================================================= */
console.log("Stripe Key Loaded:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

/* =========================================================
   💰 Payment Page Component
========================================================= */
const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     🧭 Fetch Course Details
  ========================================================== */
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setError("No course ID provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`/courses/id/${courseId}`);

        if (res.data?.course || res.data?._id) {
          const courseData = res.data.course || res.data;
          const price = parseFloat(courseData.price || 0);

          setCourse({ ...courseData, price });
        } else {
          throw new Error("Invalid course data received.");
        }
      } catch (err) {
        console.error("❌ Error fetching course:", err);
        setError("Failed to load course information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  /* =========================================================
     💳 Handle Stripe Payment
  ========================================================== */
  const handlePayment = async () => {
    if (!course) {
      toast.error("Course not loaded yet.");
      return;
    }

    if (Number(course.price) <= 0) {
      toast.info("This course is free. No payment required.");
      return;
    }

    try {
      setProcessing(true);

      // Check if already enrolled
      try {
        const check = await axios.get(`/enrollments/check/${courseId}`);
        if (check.data?.enrolled) {
          toast.error("You are already enrolled in this course");
          navigate("/my-courses");
          return;
        }
      } catch (err) {
        console.log("Enrollment check skipped:", err.message);
      }

      // Create checkout session
      const { data } = await axios.post("/payments/create-checkout-session", {
        courseId: course.id || course._id,
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session.");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);

      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to process payment.";

      toast.error(msg);

      if (
        msg.toLowerCase().includes("already enrolled") ||
        msg.toLowerCase().includes("already paid")
      ) {
        navigate("/my-courses");
      }
    } finally {
      setProcessing(false);
    }
  };

  /* =========================================================
     🚪 Cancel Navigation
  ========================================================== */
  const handleCancel = () => navigate(-1);

  /* =========================================================
     🧱 Conditional UI
  ========================================================== */
  if (loading)
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2>Loading Course Details...</h2>
          <p>Please wait while we load the course information.</p>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="payment-container">
        <div className="payment-card error">
          <h2>Error Loading Course</h2>
          <p>{error}</p>
          <div className="payment-actions">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );

  if (!course)
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

  /* =========================================================
     💵 Payment UI
  ========================================================== */
  const displayPrice =
    course?.price !== undefined && course?.price !== null
      ? Number(course.price).toFixed(2)
      : "0.00";

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Complete Your Enrollment</h2>

        <div className="course-summary">
          <h3>{course.title}</h3>
          <p className="course-description">
            {course.description || "No description available."}
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
            <strong>Total:</strong>
            <strong>${displayPrice}</strong>
          </div>
        </div>

        <div className="payment-actions">
          <button
            onClick={handlePayment}
            disabled={processing || Number(course.price) <= 0}
            className="btn-primary payment-btn"
          >
            {processing
              ? "Processing..."
              : Number(course.price) <= 0
              ? "Enroll for Free"
              : `Pay $${displayPrice} with Stripe`}
          </button>

          <button
            onClick={handleCancel}
            disabled={processing}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

        <div className="payment-security">
          <p>🔒 Your payment is secure and encrypted</p>
          <small>Powered by Stripe</small>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
