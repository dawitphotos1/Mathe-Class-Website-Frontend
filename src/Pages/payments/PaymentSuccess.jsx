// //payments/PaymentSuccess.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [status, setStatus] = useState("loading");
//   const [error, setError] = useState("");
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const sessionId = searchParams.get("session_id");
//   const courseId = searchParams.get("courseId");

//   useEffect(() => {
//     console.log(
//       "🔍 Payment Success Page - Session ID:",
//       sessionId,
//       "Course ID:",
//       courseId
//     );

//     if (!sessionId || !courseId) {
//       setError("Missing payment information. Please contact support.");
//       setStatus("error");
//       setLoading(false);
//       return;
//     }

//     confirmEnrollment();
//   }, [sessionId, courseId]);

//   const confirmEnrollment = async () => {
//     try {
//       setLoading(true);
//       console.log("🔄 Starting enrollment confirmation...");

//       // Step 1: Get course details
//       try {
//         const courseResponse = await axiosInstance.get(`/payments/${courseId}`);
//         if (courseResponse.data.success) {
//           setCourse(courseResponse.data.course);
//           console.log("✅ Course details loaded:", courseResponse.data.course);
//         }
//       } catch (courseError) {
//         console.warn(
//           "⚠️ Could not load course details, but continuing...",
//           courseError
//         );
//       }

//       // Step 2: Confirm enrollment - USE CORRECT ENDPOINT
//       console.log("📤 Sending payment confirmation to /payments/confirm...");
//       const response = await axiosInstance.post("/payments/confirm", {
//         sessionId: sessionId,
//         courseId: parseInt(courseId, 10),
//       });

//       console.log("✅ Payment confirmation response:", response.data);

//       if (response.data.success) {
//         toast.success(
//           "🎉 Payment confirmed and enrollment completed successfully!"
//         );
//         setStatus("success");

//         // Update local storage
//         updateLocalStorage();

//         // Redirect after delay
//         setTimeout(() => {
//           navigate("/my-courses");
//         }, 3000);
//       } else {
//         throw new Error(response.data.error || "Payment confirmation failed");
//       }
//     } catch (err) {
//       console.error("❌ Payment confirmation error:", err);

//       let errorMessage = "We couldn't confirm your payment and enrollment.";

//       if (err.response) {
//         const serverError = err.response.data;
//         errorMessage = serverError.error || serverError.message || errorMessage;

//         switch (err.response.status) {
//           case 400:
//             errorMessage =
//               serverError.error ||
//               "Invalid payment session. Please try enrolling again.";
//             break;
//           case 404:
//             errorMessage =
//               "Payment confirmation endpoint not found. Please contact support.";
//             break;
//           case 500:
//             errorMessage = "Server error. Please try again later.";
//             break;
//           default:
//             errorMessage =
//               serverError.error ||
//               `Server error (${err.response.status}). Please try again.`;
//         }
//       } else if (err.request) {
//         errorMessage =
//           "Network error. Please check your internet connection and try again.";
//       } else {
//         errorMessage = err.message || "An unexpected error occurred.";
//       }

//       setError(errorMessage);
//       setStatus("error");
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateLocalStorage = () => {
//     const enrolledCourses =
//       JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//     if (!enrolledCourses.includes(courseId)) {
//       enrolledCourses.push(courseId);
//       localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
//     }

//     const pendingEnrollments =
//       JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
//     const updatedPending = pendingEnrollments.filter((id) => id !== courseId);
//     localStorage.setItem("pendingEnrollments", JSON.stringify(updatedPending));

//     localStorage.removeItem("userCourses");
//   };

//   const handleRetry = () => {
//     setStatus("loading");
//     setError("");
//     setLoading(true);
//     confirmEnrollment();
//   };

//   const handleBackToCourses = () => {
//     navigate("/courses");
//   };

//   const handleGoToMyCourses = () => {
//     navigate("/my-courses");
//   };

//   const handleContactSupport = () => {
//     navigate("/contact");
//   };

//   if (loading) {
//     return (
//       <div className="payment-success-container">
//         <div className="payment-status-container">
//           <div className="loading-section">
//             <div className="spinner-large"></div>
//             <h2>Processing Your Payment...</h2>
//             <p>
//               Please wait while we confirm your payment and complete your
//               enrollment.
//             </p>
//             <div className="processing-details">
//               <p>
//                 <strong>Session ID:</strong>{" "}
//                 <span className="code">{sessionId}</span>
//               </p>
//               <p>
//                 <strong>Course ID:</strong> {courseId}
//               </p>
//               <p>
//                 <strong>Course:</strong> {course?.title || "Loading..."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="payment-success-container">
//       <div className="payment-status-container">
//         {status === "success" ? (
//           <div className="success-section">
//             <div className="success-icon">🎉</div>
//             <h1>Payment Successful!</h1>
//             <div className="success-message">
//               <p>Your payment has been confirmed and you're now enrolled in:</p>
//               <h3>{course?.title || "the course"}</h3>

//               <div className="enrollment-details">
//                 <div className="detail-item">
//                   <span>Amount Paid:</span>
//                   <span>
//                     ${course?.price ? course.price.toFixed(2) : "0.00"}
//                   </span>
//                 </div>
//                 <div className="detail-item">
//                   <span>Status:</span>
//                   <span className="status-badge approved">Approved</span>
//                 </div>
//                 <div className="detail-item">
//                   <span>Session:</span>
//                   <span className="code">{sessionId}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="redirect-notice">
//               <p>You will be redirected to your courses in a few seconds...</p>
//             </div>

//             <div className="action-buttons">
//               <button className="btn-primary" onClick={handleGoToMyCourses}>
//                 Go to My Courses
//               </button>
//               <Link to="/courses" className="btn-secondary">
//                 Browse More Courses
//               </Link>
//             </div>
//           </div>
//         ) : (
//           <div className="error-section">
//             <div className="error-icon">❌</div>
//             <h1>Payment Confirmation Failed</h1>
//             <div className="error-message">
//               <p>{error}</p>
//             </div>

//             <div className="error-details">
//               <h3>Technical Information</h3>
//               <div className="detail-item">
//                 <span>Session ID:</span>
//                 <span className="code">{sessionId}</span>
//               </div>
//               <div className="detail-item">
//                 <span>Course ID:</span>
//                 <span>{courseId}</span>
//               </div>
//               <div className="detail-item">
//                 <span>Course:</span>
//                 <span>{course?.title || "Unknown"}</span>
//               </div>
//             </div>

//             <div className="troubleshooting-tips">
//               <h4>What you can do:</h4>
//               <ul>
//                 <li>Wait a few minutes and try again</li>
//                 <li>Check your internet connection</li>
//                 <li>Verify you're logged in with the correct account</li>
//                 <li>Contact support if the problem continues</li>
//               </ul>
//             </div>

//             <div className="action-buttons">
//               <button className="btn-primary" onClick={handleRetry}>
//                 Try Again
//               </button>
//               <button className="btn-secondary" onClick={handleBackToCourses}>
//                 Back to Courses
//               </button>
//               <button className="btn-outline" onClick={handleContactSupport}>
//                 Contact Support
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;



// /payments/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState("");
  const [course, setCourse] = useState(null);

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    console.log("🔍 Payment Success Page:", { sessionId, courseId });

    if (!sessionId || !courseId) {
      setError("Missing payment information. Please contact support.");
      setStatus("error");
      return;
    }

    confirmEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, courseId]);

  const confirmEnrollment = async () => {
    try {
      setStatus("loading");

      // Step 1: Load course info
      try {
        const courseResponse = await axiosInstance.get(`/payments/${courseId}`);
        if (courseResponse.data.success) {
          setCourse(courseResponse.data.course);
          console.log("✅ Course details:", courseResponse.data.course);
        }
      } catch (err) {
        console.warn("⚠️ Course fetch failed, continuing...", err);
      }

      // Step 2: Confirm payment on backend
      console.log("📤 Sending POST /payments/confirm");
      const response = await axiosInstance.post("/payments/confirm", {
        session_id: sessionId,
        course_id: parseInt(courseId, 10),
      });

      if (response.data.success) {
        toast.success("🎉 Payment confirmed successfully!");
        setStatus("success");
        updateLocalStorage();

        // Redirect after short delay
        setTimeout(() => navigate("/my-courses"), 3000);
      } else {
        throw new Error(response.data.error || "Payment confirmation failed");
      }
    } catch (err) {
      console.error("❌ Payment confirmation error:", err);

      let errorMessage = "We couldn't confirm your payment.";
      if (err.response) {
        const { status, data } = err.response;
        errorMessage =
          data?.error ||
          (status === 404
            ? "Confirmation endpoint not found. Contact support."
            : status === 500
            ? "Server error. Please try again later."
            : data?.message || errorMessage);
      } else if (err.request) {
        errorMessage = "Network error. Please check your internet.";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setStatus("error");
      toast.error(errorMessage);
    }
  };

  const updateLocalStorage = () => {
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
  };

  const handleRetry = () => confirmEnrollment();
  const handleBack = () => navigate("/courses");
  const handleSupport = () => navigate("/contact");

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {status === "loading" && (
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Confirming Your Payment...</h2>
            <p>
              Please wait while we confirm your payment and activate your
              course.
            </p>
            <div className="processing-details">
              <p>
                <strong>Session ID:</strong>{" "}
                <span className="code">{sessionId}</span>
              </p>
              <p>
                <strong>Course ID:</strong> {courseId}
              </p>
              <p>
                <strong>Course:</strong> {course?.title || "Loading..."}
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="success-section">
            <div className="success-icon">🎉</div>
            <h1>Payment Successful!</h1>
            <p>Your payment was confirmed and you’re now enrolled in:</p>
            <h3>{course?.title || "the course"}</h3>

            <div className="enrollment-details">
              <div className="detail-item">
                <span>Amount Paid:</span>
                <span>${course?.price?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="detail-item">
                <span>Status:</span>
                <span className="status-badge approved">Approved</span>
              </div>
              <div className="detail-item">
                <span>Session:</span>
                <span className="code">{sessionId}</span>
              </div>
            </div>

            <p className="redirect-notice">
              Redirecting to your courses in a few seconds...
            </p>

            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate("/my-courses")}>
                Go to My Courses
              </button>
              <Link to="/courses" className="btn-secondary">
                Browse More Courses
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h1>Payment Confirmation Failed</h1>
            <p className="error-message">{error}</p>

            <div className="error-details">
              <h3>Technical Information</h3>
              <div className="detail-item">
                <span>Session ID:</span> <span className="code">{sessionId}</span>
              </div>
              <div className="detail-item">
                <span>Course ID:</span> {courseId}
              </div>
              <div className="detail-item">
                <span>Course:</span> {course?.title || "Unknown"}
              </div>
            </div>

            <div className="troubleshooting-tips">
              <h4>Try This:</h4>
              <ul>
                <li>Wait a moment and try again</li>
                <li>Check your internet connection</li>
                <li>Ensure you’re logged in correctly</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleRetry}>
                Try Again
              </button>
              <button className="btn-secondary" onClick={handleBack}>
                Back to Courses
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
