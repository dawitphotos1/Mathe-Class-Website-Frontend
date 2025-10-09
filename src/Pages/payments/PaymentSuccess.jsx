
// // src/pages/payments/PaymentSuccess.jsx
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
//   const courseId = searchParams.get("course_id");

//   useEffect(() => {
//     console.log("✅ PaymentSuccess page loaded:", { sessionId, courseId });

//     if (!courseId) {
//       toast.error("Missing course information. Please contact support.");
//       setStatus("error");
//       return;
//     }

//     fetchCourseInfo();
//   }, [courseId, sessionId]);

//   const fetchCourseInfo = async () => {
//     try {
//       // ✅ Use the correct endpoint: /api/v1/payments/:courseId
//       const res = await axiosInstance.get(`/payments/${courseId}`);
//       if (!res.data?.success || !res.data?.course) {
//         throw new Error("Invalid server response");
//       }

//       const courseData = res.data.course;
//       setCourse(courseData);
//       setStatus("success");

//       updateLocalStorage(courseId);

//       toast.success("🎉 Payment confirmed successfully!");
//       setTimeout(() => navigate("/my-courses"), 3000);
//     } catch (err) {
//       console.error("❌ Failed to fetch course info:", err);
//       setStatus("error");
//       toast.error("Failed to load course information. Please contact support.");
//     }
//   };

//   const updateLocalStorage = (courseId) => {
//     try {
//       const enrolled =
//         JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//       if (!enrolled.includes(courseId)) {
//         enrolled.push(courseId);
//         localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
//       }

//       const pending =
//         JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
//       localStorage.setItem(
//         "pendingEnrollments",
//         JSON.stringify(pending.filter((id) => id !== courseId))
//       );

//       // Clear cached user courses to force refresh next time
//       localStorage.removeItem("userCourses");
//     } catch (err) {
//       console.error("⚠️ localStorage update failed:", err);
//     }
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
//               {course?.price && (
//                 <div className="detail-item">
//                   <span>Amount Paid:</span>
//                   <span>${parseFloat(course.price).toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="detail-item">
//                 <span>Status:</span>
//                 <span className="status-badge approved">Approved</span>
//               </div>
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
//             <h1>Payment Error</h1>
//             <p>
//               We couldn’t verify your payment details. Please contact support.
//             </p>
//             <div className="action-buttons">
//               <button
//                 className="btn-secondary"
//                 onClick={() => navigate("/courses")}
//               >
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





// src/pages/payments/PaymentSuccess.jsx - ENHANCED VERSION
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
  const [apiError, setApiError] = useState("");

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  useEffect(() => {
    console.log("🎯 Payment Success Page Loaded", { sessionId, courseId });

    if (!sessionId || !courseId) {
      toast.error("Missing payment information. Please contact support.");
      setStatus("error");
      return;
    }

    // Start payment confirmation with retry logic
    confirmPaymentWithRetry();
  }, [sessionId, courseId]);

  const confirmPaymentWithRetry = async (retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      setStatus("confirming");
      console.log(`🔄 Payment confirmation attempt ${retryCount + 1}`);

      const response = await axiosInstance.post("/payments/confirm", {
        sessionId: sessionId,
        courseId: courseId
      }, {
        timeout: 10000 // 10 second timeout
      });

      console.log("✅ Payment confirmation successful:", response.data);

      if (response.data.success) {
        // Success! Fetch course info and update UI
        await fetchCourseInfo();
        updateLocalStorage(courseId);
        setStatus("success");
        toast.success("🎉 Payment confirmed! You're now enrolled.");
        
        setTimeout(() => navigate("/my-courses"), 3000);
      } else {
        throw new Error(response.data.error || "Payment confirmation failed");
      }

    } catch (error) {
      console.error(`❌ Payment confirmation failed (attempt ${retryCount + 1}):`, error);

      let errorMessage = "We couldn't confirm your enrollment.";
      let shouldRetry = false;

      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = "Network issue detected. This might be caused by a browser extension.";
        shouldRetry = retryCount < maxRetries;
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || errorMessage;
        setApiError(`Server Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // No response received
        errorMessage = "No response from server. This might be blocked by a security extension.";
        shouldRetry = retryCount < maxRetries;
      } else {
        errorMessage = error.message || errorMessage;
      }

      if (shouldRetry) {
        console.log(`🔄 Retrying payment confirmation in 2 seconds... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => confirmPaymentWithRetry(retryCount + 1), 2000);
        return;
      }

      setStatus("error");
      setApiError(errorMessage);
      toast.error(errorMessage);
      
      // Check if enrollment actually worked despite the error
      checkEnrollmentStatus();
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      console.log("🔍 Checking enrollment status as fallback...");
      const response = await axiosInstance.get("/enrollments/my-courses");
      const enrolledCourses = response.data.courses || [];
      const isEnrolled = enrolledCourses.some(course => course.id == courseId);
      
      if (isEnrolled) {
        console.log("✅ Enrollment actually worked! Updating UI...");
        await fetchCourseInfo();
        updateLocalStorage(courseId);
        setStatus("success");
        toast.success("🎉 Your enrollment was successful!");
        setTimeout(() => navigate("/my-courses"), 3000);
      }
    } catch (error) {
      console.log("🔍 Could not verify enrollment status:", error.message);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      const response = await axiosInstance.get(`/payments/${courseId}`);
      if (response.data?.success && response.data?.course) {
        setCourse(response.data.course);
      }
    } catch (error) {
      console.warn("⚠️ Could not fetch course details:", error.message);
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
    } catch (error) {
      console.warn("⚠️ Local storage update failed:", error.message);
    }
  };

  const handleManualCheck = async () => {
    toast.info("🔍 Checking your enrollment status...");
    await checkEnrollmentStatus();
  };

  const handleTryAgain = () => {
    // Clear any cached data and retry
    localStorage.removeItem("userCourses");
    window.location.reload();
  };

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {status === "confirming" && (
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Confirming Your Payment...</h2>
            <p>Please wait while we verify your payment and complete your enrollment.</p>
            <div className="browser-tips">
              <h4>⚠️ Having issues?</h4>
              <p>• Try disabling browser extensions temporarily</p>
              <p>• Ensure you have a stable internet connection</p>
              <p>• This usually takes less than 10 seconds</p>
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
            <p>{apiError || "We encountered an issue confirming your payment."}</p>
            
            <div className="troubleshooting-tips">
              <h4>🔧 Quick Solutions:</h4>
              <div className="solution-steps">
                <div className="solution-step">
                  <strong>1. Disable Browser Extensions</strong>
                  <p>Temporarily turn off McAfee or other security extensions and try again.</p>
                </div>
                <div className="solution-step">
                  <strong>2. Check Your Courses</strong>
                  <p>Your payment might have worked - check "My Courses" to see if you're enrolled.</p>
                </div>
                <div className="solution-step">
                  <strong>3. Try Incognito Mode</strong>
                  <p>Open the site in a private window where extensions are disabled.</p>
                </div>
              </div>
            </div>

            {sessionId && (
              <div className="session-info">
                <p><strong>Reference for support:</strong></p>
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
                onClick={handleManualCheck}
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