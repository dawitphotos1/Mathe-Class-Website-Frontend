
// // /payments/PaymentSuccess.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [status, setStatus] = useState("loading");
//   const [course, setCourse] = useState(null);

//   const sessionId = searchParams.get("session_id");
//   const courseId = searchParams.get("course_id") || searchParams.get("courseId");

//   useEffect(() => {
//     console.log("✅ PaymentSuccess page loaded:", { sessionId, courseId });

//     if (!courseId) {
//       toast.error("Missing course information. Please contact support.");
//       setStatus("error");
//       return;
//     }

//     fetchCourse();
//   }, [courseId]);

//   const fetchCourse = async () => {
//     try {
//       const response = await axiosInstance.get(`/courses/${courseId}`);
//       setCourse(response.data);
//       setStatus("success");
//       toast.success("🎉 Payment confirmed automatically!");
//       updateLocalStorage();

//       setTimeout(() => navigate("/my-courses"), 3000);
//     } catch (err) {
//       console.error("⚠️ Error loading course:", err);
//       setStatus("success"); // still success, enrollment handled by webhook
//     }
//   };

//   const updateLocalStorage = () => {
//     const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//     if (!enrolled.includes(courseId)) {
//       enrolled.push(courseId);
//       localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
//     }

//     const pending = JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
//     localStorage.setItem(
//       "pendingEnrollments",
//       JSON.stringify(pending.filter((id) => id !== courseId))
//     );

//     localStorage.removeItem("userCourses");
//   };

//   return (
//     <div className="payment-success-container">
//       <div className="payment-status-container">
//         {status === "loading" && (
//           <div className="loading-section">
//             <div className="spinner-large"></div>
//             <h2>Processing Payment...</h2>
//             <p>Just a moment while we finalize your enrollment.</p>
//           </div>
//         )}

//         {status === "success" && (
//           <div className="success-section">
//             <div className="success-icon">🎉</div>
//             <h1>Payment Successful!</h1>
//             <p>You’re now enrolled in:</p>
//             <h3>{course?.title || "Your course"}</h3>

//             <div className="enrollment-details">
//               <div className="detail-item">
//                 <span>Status:</span>
//                 <span className="status-badge approved">Approved</span>
//               </div>
//               {course?.price && (
//                 <div className="detail-item">
//                   <span>Amount Paid:</span>
//                   <span>${parseFloat(course.price).toFixed(2)}</span>
//                 </div>
//               )}
//               {sessionId && (
//                 <div className="detail-item">
//                   <span>Session ID:</span>
//                   <span className="code">{sessionId}</span>
//                 </div>
//               )}
//             </div>

//             <p className="redirect-notice">
//               Redirecting to your courses in a few seconds...
//             </p>

//             <div className="action-buttons">
//               <button
//                 className="btn-primary"
//                 onClick={() => navigate("/my-courses")}
//               >
//                 Go to My Courses
//               </button>
//               <Link to="/courses" className="btn-secondary">
//                 Browse More Courses
//               </Link>
//             </div>
//           </div>
//         )}

//         {status === "error" && (
//           <div className="error-section">
//             <div className="error-icon">❌</div>
//             <h1>Payment Processing Error</h1>
//             <p>We couldn’t verify your payment details. Please contact support.</p>
//             <div className="action-buttons">
//               <button className="btn-secondary" onClick={() => navigate("/courses")}>
//                 Back to Courses
//               </button>
//               <Link to="/contact" className="btn-outline">
//                 Contact Support
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;




//src/Pages/payments/PaymentSuccess.jsx

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [course, setCourse] = useState(null);
  const [errorDetails, setErrorDetails] = useState("");
  const [backendStatus, setBackendStatus] = useState("unknown");

  const sessionId = searchParams.get("session_id");
  const courseId =
    searchParams.get("course_id") || searchParams.get("courseId");

  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        console.log("🔍 Checking backend health...");
        const response = await fetch(
          "https://mathe-class-website-backend-1.onrender.com/api/v1/health"
        );
        if (response.ok) {
          const data = await response.json();
          setBackendStatus("healthy");
          console.log("✅ Backend is healthy:", data);
        } else {
          setBackendStatus("unhealthy");
          console.error("❌ Backend responded with error:", response.status);
        }
      } catch (error) {
        setBackendStatus("down");
        console.error("❌ Backend is down:", error);
      }
    };

    checkBackendHealth();
  }, []);

  useEffect(() => {
    console.log("💳 PaymentSuccess mounted:", {
      sessionId,
      courseId,
      backendStatus,
    });

    if (!sessionId || !courseId) {
      const errorMsg = "Missing payment information. Please contact support.";
      setErrorDetails(errorMsg);
      toast.error(errorMsg);
      setStatus("error");
      return;
    }

    // If backend is down, show appropriate message
    if (backendStatus === "down") {
      setStatus("backend-down");
      return;
    }

    const confirmPaymentAndEnrollment = async () => {
      try {
        setStatus("loading");

        console.log("🔄 Step 1: Confirming payment with backend...");

        // Test backend connection first with timeout
        const healthCheck = await Promise.race([
          axiosInstance.get("/payments/health/check"),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Backend timeout")), 10000)
          ),
        ]);

        console.log("✅ Backend health check:", healthCheck.data);

        // Step 1: Confirm payment with backend
        console.log("🔄 Step 2: Sending payment confirmation...");
        const confirmationResponse = await axiosInstance.post(
          "/payments/confirm",
          {
            sessionId,
            courseId,
          }
        );

        console.log(
          "✅ Payment confirmation response:",
          confirmationResponse.data
        );

        if (confirmationResponse.data.success) {
          // Success path
          handleSuccess(confirmationResponse.data);
        } else {
          throw new Error(
            confirmationResponse.data.error || "Payment confirmation failed"
          );
        }
      } catch (error) {
        console.error("❌ Payment confirmation error:", error);
        handleError(error);
      }
    };

    const handleSuccess = (confirmationData) => {
      // Fetch course details for display (non-critical)
      fetchCourseDetails();

      // Update local state and storage
      updateLocalStorage(courseId);
      setStatus("success");
      toast.success("🎉 Payment confirmed! You are now enrolled.");

      // Redirect after delay
      setTimeout(() => navigate("/my-courses"), 4000);
    };

    const fetchCourseDetails = async () => {
      try {
        console.log("🔄 Fetching course details...");
        const courseResponse = await axiosInstance.get(
          `/courses/id/${courseId}`
        );
        setCourse(courseResponse.data);
      } catch (courseErr) {
        console.warn("⚠️ Could not load course details:", courseErr);
        // Continue even if course details fail
      }
    };

    const handleError = (error) => {
      let userFriendlyError =
        "Payment confirmation failed. Please try again or contact support.";

      if (error.message === "Backend timeout") {
        userFriendlyError =
          "Backend is not responding. Please try again in a few minutes.";
      } else if (!error.response) {
        userFriendlyError =
          "Network error. Please check your internet connection and try again.";
      } else if (error.response.status === 404) {
        userFriendlyError =
          "Payment endpoint not found. Please contact support.";
      } else if (error.response.status === 500) {
        userFriendlyError = "Server error. Please try again in a few moments.";
      } else if (error.response.data?.error) {
        userFriendlyError = error.response.data.error;
      }

      setErrorDetails(userFriendlyError);
      toast.error(userFriendlyError);
      setStatus("error");
    };

    if (backendStatus === "healthy") {
      confirmPaymentAndEnrollment();
    }
  }, [sessionId, courseId, navigate, backendStatus]);

  // 🧠 Update localStorage to reflect enrollment
  const updateLocalStorage = (courseId) => {
    try {
      const enrolled =
        JSON.parse(localStorage.getItem("enrolledCourses")) || [];
      if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
      }

      // Clear any cached data that might be outdated
      localStorage.removeItem("userCourses");
      localStorage.removeItem("pendingEnrollments");
    } catch (err) {
      console.warn("⚠️ Could not update localStorage:", err);
    }
  };

  // 🧭 Navigation handlers
  const handleGoCourses = () => navigate("/my-courses");
  const handleBack = () => navigate("/courses");
  const handleSupport = () => navigate("/contact");
  const handleRetry = () => window.location.reload();
  const handleManualCheck = () => navigate("/my-courses");

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {/* 🚨 Backend Down State */}
        {status === "backend-down" && (
          <div className="backend-down-section">
            <div className="error-icon">🚨</div>
            <h1>Backend Service Temporarily Unavailable</h1>
            <p>
              Our payment confirmation service is currently down for
              maintenance.
            </p>
            <p>
              <strong>Your payment was successful with Stripe!</strong> The
              funds have been processed.
            </p>

            <div className="next-steps">
              <h3>📋 What to do next:</h3>
              <ol>
                <li>Your payment with Stripe was completed successfully</li>
                <li>
                  We'll automatically enroll you when the service is restored
                </li>
                <li>Check your "My Courses" page in 10-15 minutes</li>
                <li>You'll receive a confirmation email once enrolled</li>
              </ol>
            </div>

            <div className="payment-proof">
              <h4>Payment Proof:</h4>
              <p>
                <strong>Stripe Session ID:</strong> {sessionId}
              </p>
              <p>
                <strong>Course ID:</strong> {courseId}
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date().toLocaleString()}
              </p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleManualCheck}>
                Check My Courses Now
              </button>
              <button className="btn-secondary" onClick={handleRetry}>
                Try Again
              </button>
              <button className="btn-outline" onClick={handleSupport}>
                Contact Support
              </button>
            </div>
          </div>
        )}

        {/* 🕒 Loading State */}
        {status === "loading" && (
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Confirming Your Payment...</h2>
            <p>Please wait while we process your enrollment.</p>
            <div className="loading-details">
              <p>
                <strong>Session:</strong> {sessionId}
              </p>
              <p>
                <strong>Course:</strong> {courseId}
              </p>
              <p>
                <strong>Backend Status:</strong> {backendStatus}
              </p>
            </div>
          </div>
        )}

        {/* ✅ Success State */}
        {status === "success" && (
          <div className="success-section">
            <div className="success-icon">🎉</div>
            <h1>Payment Successful!</h1>
            <p>
              Your enrollment has been confirmed and you now have access to the
              course.
            </p>

            {course && (
              <div className="course-card">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                {course.price && (
                  <div className="price">
                    Amount: ${parseFloat(course.price).toFixed(2)}
                  </div>
                )}
              </div>
            )}

            <div className="enrollment-details">
              <div className="detail-item">
                <span>Status:</span>
                <span className="status-badge approved">Enrolled</span>
              </div>
              <div className="detail-item">
                <span>Enrollment Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <p className="redirect-notice">
              Redirecting to your courses in a few seconds...
            </p>

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleGoCourses}>
                Go to My Courses
              </button>
              <Link to="/courses" className="btn-secondary">
                Browse More Courses
              </Link>
            </div>
          </div>
        )}

        {/* ❌ Error State */}
        {status === "error" && (
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h1>Payment Confirmation Failed</h1>
            <p>{errorDetails}</p>

            <div className="troubleshooting-tips">
              <h4>💡 Troubleshooting Tips:</h4>
              <ul>
                <li>
                  Try disabling browser extensions (Grammarly, ad blockers,
                  etc.)
                </li>
                <li>Use Chrome Incognito mode or a different browser</li>
                <li>Check your internet connection</li>
                <li>Wait a few minutes and check your "My Courses" page</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>

            <div className="error-details">
              <p>
                <strong>Session ID:</strong> {sessionId}
              </p>
              <p>
                <strong>Course ID:</strong> {courseId}
              </p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleRetry}>
                Try Again
              </button>
              <button className="btn-secondary" onClick={handleGoCourses}>
                Check My Courses
              </button>
              <button className="btn-outline" onClick={handleSupport}>
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;