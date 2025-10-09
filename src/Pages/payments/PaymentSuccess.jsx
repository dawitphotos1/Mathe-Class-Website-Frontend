
// src/pages/payments/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("confirming");
  const [course, setCourse] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  useEffect(() => {
    console.log("🎯 Payment Success:", { sessionId, courseId });
    if (!sessionId || !courseId) {
      toast.error("Missing payment information. Please contact support.");
      setStatus("error");
      return;
    }
    confirmPayment();
  }, [sessionId, courseId]);

  const confirmPayment = async () => {
    try {
      setStatus("confirming");
      setDebugInfo(`Confirming session ${sessionId} for course ${courseId}`);

      const response = await axiosInstance.post("/payments/confirm", {
        sessionId,
        courseId,
      });

      if (response.data.success) {
        await handleSuccess();
      } else {
        throw new Error(response.data.error || "Payment not confirmed");
      }
    } catch (error) {
      console.error("❌ Payment confirmation failed:", error.message);
      setStatus("error");
      toast.error("Confirmation failed. Please try again.");
    }
  };

  const handleSuccess = async () => {
    await fetchCourseInfo();
    updateLocalStorage(courseId);
    toast.success("🎉 Payment confirmed! You're now enrolled.");
    setStatus("success");

    setTimeout(() => {
      navigate("/my-courses", {
        state: { message: "Enrollment successful!" },
      });
    }, 3000);
  };

  const fetchCourseInfo = async () => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch (error) {
      console.warn("⚠️ Could not fetch course:", error.message);
    }
  };

  const updateLocalStorage = (courseId) => {
    try {
      const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
      if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
      }
      localStorage.removeItem("pendingEnrollments");
    } catch (e) {
      console.warn("Local storage update failed:", e.message);
    }
  };

  const handleTryAgain = () => window.location.reload();

  return (
    <div className="payment-success-container">
      {status === "confirming" && (
        <div className="loading-section">
          <div className="spinner-large"></div>
          <h2>Confirming Your Payment...</h2>
          <p>Please wait while we complete your enrollment.</p>
        </div>
      )}

      {status === "success" && (
        <div className="success-section">
          <div className="success-icon">🎉</div>
          <h1>Enrollment Successful!</h1>
          <h3>{course?.title || "Your Course"}</h3>
          <p>You now have full access to your course materials.</p>
          <button className="btn-primary" onClick={() => navigate("/my-courses")}>
            Go to My Courses
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="error-section">
          <div className="error-icon">❌</div>
          <h1>Confirmation Failed</h1>
          <p>
            We couldn’t confirm your enrollment. Please disable browser
            extensions (like McAfee) or try again.
          </p>
          <button className="btn-primary" onClick={handleTryAgain}>
            Try Again
          </button>
          <Link to="/contact" className="btn-outline">
            Contact Support
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
