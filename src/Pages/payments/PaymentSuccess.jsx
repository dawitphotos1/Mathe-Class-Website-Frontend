
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
      setDebugInfo("🔄 Starting payment confirmation...");

      const response = await axiosInstance.post("/payments/confirm", {
        sessionId,
        courseId,
      });

      if (response.data.success) {
        await handleSuccess();
        return;
      }

      // fallback
      toast.warn("Retrying confirmation...");
      await pollEnrollmentStatus();
    } catch (error) {
      console.warn("⚠️ Confirmation failed, trying webhook fallback...");
      await pollEnrollmentStatus();
    }
  };

  // ✅ Poll /enrollments/my-courses for up to 15 seconds
  const pollEnrollmentStatus = async () => {
    const maxRetries = 5;
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await axiosInstance.get("/enrollments/my-courses");
        const courses = res.data?.courses || [];
        const enrolled = courses.some((c) => String(c.id) === String(courseId));

        if (enrolled) {
          console.log("✅ Enrollment detected via webhook!");
          await handleSuccess(true);
          return;
        }
      } catch (err) {
        console.error("Polling error:", err.message);
      }

      await delay(3000);
    }

    console.warn("❌ Enrollment not confirmed after polling");
    setStatus("error");
    toast.error("We couldn’t confirm your enrollment. Please retry or contact support.");
  };

  const handleSuccess = async (fromWebhook = false) => {
    await fetchCourseInfo();
    updateLocalStorage(courseId);
    setStatus("success");
    toast.success("🎉 Payment confirmed! You're now enrolled.");
    if (fromWebhook) {
      setDebugInfo((prev) => prev + "\n✅ Webhook confirmation detected");
    }

    setTimeout(() => {
      navigate("/my-courses", {
        state: { message: "Enrollment successful!" },
      });
    }, 3000);
  };

  const fetchCourseInfo = async () => {
    try {
      const response = await axiosInstance.get(`/payments/${courseId}`);
      setCourse(response.data.course);
    } catch (error) {
      console.warn("⚠️ Could not fetch course info:", error.message);
    }
  };

  const updateLocalStorage = (courseId) => {
    try {
      const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
      if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
      }

      const pending = JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
      localStorage.setItem(
        "pendingEnrollments",
        JSON.stringify(pending.filter((id) => id !== courseId))
      );

      localStorage.removeItem("userCourses");
    } catch (err) {
      console.error("LocalStorage update error:", err);
    }
  };

  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {status === "confirming" && (
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Confirming Your Payment...</h2>
            <p>This may take a few seconds. Please don’t close this page.</p>
          </div>
        )}

        {status === "success" && (
          <div className="success-section">
            <div className="success-icon">🎉</div>
            <h1>Enrollment Successful!</h1>
            <p>Welcome to your new course:</p>
            <h3>{course?.title || "Your Course"}</h3>
            <p className="redirect-notice">Redirecting to your courses...</p>
            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate("/my-courses")}>
                Go to My Courses
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h1>Confirmation Failed</h1>
            <p>We couldn’t confirm your enrollment.</p>
            <div className="action-buttons">
              <button className="btn-primary" onClick={handleTryAgain}>
                🔄 Try Again
              </button>
              <Link to="/contact" className="btn-outline">
                📞 Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
