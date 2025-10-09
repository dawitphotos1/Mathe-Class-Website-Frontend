
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
    console.log("🎯 Payment Success - Session:", sessionId, "Course:", courseId);
    setDebugInfo(`Starting payment confirmation...\nSession: ${sessionId}\nCourse: ${courseId}`);

    if (!sessionId || !courseId) {
      const errorMsg = "Missing payment information in URL";
      setDebugInfo(prev => prev + `\n❌ ${errorMsg}`);
      toast.error("Missing payment information. Please contact support.");
      setStatus("error");
      return;
    }

    confirmPayment();
  }, [sessionId, courseId]);

  const confirmPayment = async (retryCount = 0) => {
    const MAX_RETRIES = 3;
    
    try {
      setStatus("confirming");
      setDebugInfo(prev => prev + `\n🔄 Payment confirmation attempt ${retryCount + 1}...`);

      // Call the payment confirmation endpoint
      const response = await axiosInstance.post("/payments/confirm", {
        sessionId: sessionId,
        courseId: courseId
      });

      console.log("✅ Payment confirmation response:", response.data);
      setDebugInfo(prev => prev + `\n✅ Backend response: ${JSON.stringify(response.data, null, 2)}`);

      if (response.data.success) {
        // Success - update UI and redirect
        await fetchCourseInfo();
        updateLocalStorage(courseId);
        setStatus("success");
        toast.success("🎉 Payment confirmed! You're now enrolled.");
        
        // Redirect to courses after delay
        setTimeout(() => {
          navigate("/my-courses", { 
            state: { message: "Enrollment successful!" } 
          });
        }, 3000);
      } else {
        throw new Error(response.data.error || "Payment confirmation failed");
      }

    } catch (error) {
      console.error("❌ Payment confirmation error:", error);
      
      let errorMessage = "We couldn't confirm your enrollment.";
      let shouldRetry = false;

      // Determine error type and whether to retry
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = "Network issue detected. This might be caused by a browser extension blocking the request.";
        shouldRetry = retryCount < MAX_RETRIES;
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || errorMessage;
        setDebugInfo(prev => prev + `\n❌ Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // No response received (likely blocked by extension)
        errorMessage = "No response from server. This is often caused by security extensions like McAfee WebAdvisor.";
        shouldRetry = retryCount < MAX_RETRIES;
      } else {
        errorMessage = error.message || errorMessage;
      }

      setDebugInfo(prev => prev + `\n❌ Error: ${errorMessage}`);

      // Retry logic for network issues
      if (shouldRetry) {
        const nextRetry = retryCount + 1;
        setDebugInfo(prev => prev + `\n🔄 Retrying in 2 seconds... (${nextRetry}/${MAX_RETRIES})`);
        setTimeout(() => confirmPayment(nextRetry), 2000);
        return;
      }

      // Final error state - check if enrollment actually worked
      setStatus("error");
      toast.error(errorMessage);
      checkEnrollmentStatus();
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      setDebugInfo(prev => prev + `\n🔍 Checking enrollment status as fallback...`);
      
      const response = await axiosInstance.get("/enrollments/my-courses");
      const enrolledCourses = response.data.courses || [];
      const isEnrolled = enrolledCourses.some(course => course.id == courseId);
      
      if (isEnrolled) {
        setDebugInfo(prev => prev + `\n✅ Enrollment actually succeeded! Updating UI...`);
        await fetchCourseInfo();
        updateLocalStorage(courseId);
        setStatus("success");
        toast.success("🎉 Your enrollment was successful!");
        setTimeout(() => navigate("/my-courses"), 3000);
      } else {
        setDebugInfo(prev => prev + `\n❌ Not enrolled in course ${courseId}`);
      }
    } catch (error) {
      setDebugInfo(prev => prev + `\n⚠️ Could not verify enrollment: ${error.message}`);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      const response = await axiosInstance.get(`/payments/${courseId}`);
      if (response.data?.success && response.data?.course) {
        setCourse(response.data.course);
        setDebugInfo(prev => prev + `\n📚 Course info: ${response.data.course.title}`);
      }
    } catch (error) {
      setDebugInfo(prev => prev + `\n⚠️ Could not fetch course details: ${error.message}`);
    }
  };

  const updateLocalStorage = (courseId) => {
    try {
      // Update enrolled courses
      const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
      if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
      }

      // Remove from pending enrollments
      const pending = JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
      localStorage.setItem(
        "pendingEnrollments",
        JSON.stringify(pending.filter((id) => id !== courseId))
      );

      // Clear cached user courses to force refresh
      localStorage.removeItem("userCourses");
      
      setDebugInfo(prev => prev + `\n💾 Local storage updated for course ${courseId}`);
    } catch (error) {
      setDebugInfo(prev => prev + `\n⚠️ Local storage update failed: ${error.message}`);
    }
  };

  const handleTryAgain = () => {
    // Clear cache and reload
    localStorage.removeItem("userCourses");
    window.location.reload();
  };

  const handleCheckEnrollment = () => {
    toast.info("Checking your enrollment status...");
    checkEnrollmentStatus();
  };

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {/* Debug Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-panel">
            <h4>Debug Information</h4>
            <pre>{debugInfo}</pre>
          </div>
        )}

        {status === "confirming" && (
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Confirming Your Payment...</h2>
            <p>Please wait while we verify your payment and complete your enrollment.</p>
            
            <div className="extension-warning">
              <h4>⚠️ If this takes more than 10 seconds:</h4>
              <ul>
                <li>Disable McAfee WebAdvisor extension temporarily</li>
                <li>Try in Incognito/Private mode</li>
                <li>Use a different browser without security extensions</li>
              </ul>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="success-section">
            <div className="success-icon">🎉</div>
            <h1>Enrollment Successful!</h1>
            <p>Welcome to your new course:</p>
            <h3>{course?.title || "Your Course"}</h3>

            <div className="enrollment-details">
              {course?.price && (
                <div className="detail-item">
                  <span>Amount Paid:</span>
                  <span>${parseFloat(course.price).toFixed(2)}</span>
                </div>
              )}
              <div className="detail-item">
                <span>Status:</span>
                <span className="status-badge approved">Enrolled & Approved</span>
              </div>
              <div className="detail-item">
                <span>Access:</span>
                <span className="status-badge access">Full Course Access</span>
              </div>
            </div>

            <p className="redirect-notice">
              Redirecting to your courses in a few seconds...
            </p>

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/my-courses")}
              >
                Go to My Courses Now
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/courses")}
              >
                Browse More Courses
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h1>Payment Confirmation Issue</h1>
            <p>
              We encountered an issue confirming your payment. This is often caused by browser extensions.
            </p>
            
            <div className="troubleshooting">
              <h4>🔧 Quick Solutions:</h4>
              
              <div className="solution-card">
                <div className="solution-number">1</div>
                <div className="solution-content">
                  <strong>Disable McAfee Extension</strong>
                  <p>Go to chrome://extensions and toggle off "McAfee WebAdvisor"</p>
                </div>
              </div>

              <div className="solution-card">
                <div className="solution-number">2</div>
                <div className="solution-content">
                  <strong>Try Incognito Mode</strong>
                  <p>Open in private browsing (extensions are disabled)</p>
                </div>
              </div>

              <div className="solution-card">
                <div className="solution-number">3</div>
                <div className="solution-content">
                  <strong>Check Your Courses</strong>
                  <p>Your payment might have worked - check "My Courses"</p>
                </div>
              </div>
            </div>

            {sessionId && (
              <div className="session-info">
                <p><strong>Reference ID for support:</strong></p>
                <code className="session-code">{sessionId}</code>
              </div>
            )}

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={handleTryAgain}
              >
                🔄 Try Again
              </button>
              <button
                className="btn-secondary"
                onClick={handleCheckEnrollment}
              >
                🔍 Check Enrollment Status
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/my-courses")}
              >
                📚 Check My Courses
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