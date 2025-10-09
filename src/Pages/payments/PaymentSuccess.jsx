
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






// src/pages/payments/PaymentSuccess.jsx - DEBUG VERSION
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
    console.log("🔍 DEBUG: PaymentSuccess mounted", { sessionId, courseId });
    setDebugInfo(`Session: ${sessionId}\nCourse: ${courseId}`);

    if (!sessionId || !courseId) {
      const errorMsg = "Missing session_id or course_id in URL";
      console.error("❌", errorMsg);
      setDebugInfo(prev => prev + `\n❌ ${errorMsg}`);
      toast.error("Missing payment information. Please contact support.");
      setStatus("error");
      return;
    }

    confirmPayment();
  }, [sessionId, courseId]);

  const confirmPayment = async () => {
    try {
      setStatus("confirming");
      setDebugInfo(prev => prev + `\n🔄 Starting payment confirmation...`);
      
      console.log("🔄 Making API call to /payments/confirm", {
        sessionId,
        courseId
      });

      // Step 1: Confirm the payment with Stripe
      const confirmationResponse = await axiosInstance.post("/payments/confirm", {
        sessionId: sessionId,
        courseId: courseId
      });

      console.log("✅ Backend response:", confirmationResponse);
      setDebugInfo(prev => prev + `\n✅ Backend response: ${JSON.stringify(confirmationResponse.data, null, 2)}`);

      if (!confirmationResponse.data.success) {
        throw new Error(confirmationResponse.data.error || "Payment confirmation failed");
      }

      // Step 2: Fetch course details for display
      await fetchCourseInfo();

      // Step 3: Update local storage
      updateLocalStorage(courseId);

      setStatus("success");
      setDebugInfo(prev => prev + `\n🎉 Payment confirmed successfully!`);
      toast.success("🎉 Payment confirmed successfully! You're now enrolled.");

      // Redirect after delay
      setTimeout(() => navigate("/my-courses"), 4000);

    } catch (error) {
      console.error("❌ Payment confirmation failed:", error);
      
      let errorMessage = "Failed to confirm payment. Please contact support.";
      let errorDetails = "";
      
      if (error.response) {
        // Server responded with error status
        errorDetails = `Status: ${error.response.status}\nData: ${JSON.stringify(error.response.data, null, 2)}`;
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorDetails = "No response received from server";
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other error
        errorDetails = error.message;
        errorMessage = error.message || errorMessage;
      }
      
      setDebugInfo(prev => prev + `\n❌ Error: ${errorDetails}`);
      setStatus("error");
      toast.error(errorMessage);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      setDebugInfo(prev => prev + `\n📚 Fetching course info...`);
      const res = await axiosInstance.get(`/payments/${courseId}`);
      if (!res.data?.success || !res.data?.course) {
        throw new Error("Invalid server response");
      }
      setCourse(res.data.course);
      setDebugInfo(prev => prev + `\n✅ Course info: ${res.data.course.title}`);
    } catch (err) {
      console.error("❌ Failed to fetch course info:", err);
      setDebugInfo(prev => prev + `\n⚠️ Course info fetch failed: ${err.message}`);
      // Don't set error status here - we still want to show success if payment worked
    }
  };

  const updateLocalStorage = (courseId) => {
    try {
      setDebugInfo(prev => prev + `\n💾 Updating localStorage...`);
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
      
      setDebugInfo(prev => prev + `\n✅ localStorage updated`);
      console.log("✅ Local storage updated for course:", courseId);
    } catch (err) {
      console.error("⚠️ localStorage update failed:", err);
      setDebugInfo(prev => prev + `\n⚠️ localStorage update failed: ${err.message}`);
    }
  };

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {/* DEBUG PANEL - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-panel">
            <h4>Debug Information</h4>
            <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflow: 'auto' }}>
              {debugInfo}
            </pre>
          </div>
        )}

        {status === "confirming" && (
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Confirming Your Payment...</h2>
            <p>Please wait while we verify your payment and complete your enrollment.</p>
            <div className="processing-details">
              <p><small>Session: {sessionId}</small></p>
              <p><small>Course: {courseId}</small></p>
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
            <h1>Payment Confirmation Failed</h1>
            <p>
              We couldn't confirm your enrollment. Please try the following:
            </p>
            
            <div className="troubleshooting-tips">
              <h4>Quick Fixes:</h4>
              <p>1. <strong>Check "My Courses"</strong> - Your enrollment might have worked</p>
              <p>2. <strong>Wait 2 minutes</strong> - Sometimes payments take a moment to process</p>
              <p>3. <strong>Refresh and try again</strong> - Click "Try Again" below</p>
            </div>

            {sessionId && (
              <div className="session-info">
                <p><strong>Session ID for support:</strong></p>
                <code className="session-code">{sessionId}</code>
              </div>
            )}

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/my-courses")}
              >
                Check My Courses
              </button>
              <Link to="/contact" className="btn-outline">
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;