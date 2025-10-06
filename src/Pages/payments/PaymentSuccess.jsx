
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("loading");

//   useEffect(() => {
//     let isMounted = true;
//     const session_id = params.get("session_id");
//     const courseId = params.get("courseId");

//     if (!session_id || !courseId) {
//       toast.error("Missing payment details");
//       if (isMounted) setStatus("error");
//       return;
//     }

//     const confirmPaymentAndEnrollment = async () => {
//       try {
//         const paymentRes = await axiosInstance.post(
//           "/api/v1/payments/confirm",
//           { session_id }
//         );
//         if (!paymentRes.data.success) {
//           toast.error(paymentRes.data.error || "Payment not confirmed");
//           if (isMounted) setStatus("error");
//           return;
//         }

//         const enrollmentRes = await axiosInstance.post(
//           "/api/v1/enrollments/confirm",
//           { courseId }
//         );

//         if (enrollmentRes.data.success) {
//           toast.success("Enrollment request submitted for approval.");

//           // ✅ Save enrolled course ID to localStorage
//           const enrolledCourses =
//             JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//           if (!enrolledCourses.includes(courseId)) {
//             enrolledCourses.push(courseId);
//             localStorage.setItem(
//               "enrolledCourses",
//               JSON.stringify(enrolledCourses)
//             );
//           }

//           if (isMounted) {
//             setStatus("success");
//             setTimeout(() => navigate("/my-courses"), 3000);
//           }
//         } else {
//           toast.error(
//             enrollmentRes.data.error || "Enrollment confirmation failed."
//           );
//           if (isMounted) setStatus("error");
//         }
//       } catch (err) {
//         console.error("Error:", err);
//         toast.error("Something went wrong during confirmation");
//         if (isMounted) setStatus("error");
//       }
//     };

//     confirmPaymentAndEnrollment();

//     return () => {
//       isMounted = false;
//     };
//   }, [params, navigate]);

//   const handleDashboardRedirect = () => navigate("/dashboard");
//   const handleRetry = () => window.location.reload();

//   return (
//     <div className="payment-success-container">
//       {status === "loading" && (
//         <div className="payment-status-container">
//           <div className="spinner" />
//           <h2>Confirming your payment...</h2>
//           <p className="info-text">Please wait a moment.</p>
//         </div>
//       )}

//       {status === "success" && (
//         <div className="payment-status-container">
//           <div className="success-icon">✅</div>
//           <h2>Payment Confirmed</h2>
//           <div className="success-message">
//             <p>Your payment was successful.</p>
//             <p>Your enrollment is pending teacher/admin approval.</p>
//             <p>You’ll be redirected shortly...</p>
//           </div>
//           <div className="action-buttons">
//             <button className="btn-secondary" onClick={handleDashboardRedirect}>
//               Go to Dashboard
//             </button>
//           </div>
//         </div>
//       )}

//       {status === "error" && (
//         <div className="payment-status-container">
//           <div className="error-icon">❌</div>
//           <h2>Confirmation Failed</h2>
//           <div className="error-message">
//             <p>We couldn’t confirm your enrollment.</p>
//             <p>Please check your internet or contact support.</p>
//           </div>
//           <div className="action-buttons">
//             <button className="btn-outline" onClick={handleRetry}>
//               Try Again
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;


import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    console.log(
      "🔍 Payment Success Page - Session ID:",
      sessionId,
      "Course ID:",
      courseId
    );

    if (!sessionId || !courseId) {
      setError("Missing payment information. Please contact support.");
      setStatus("error");
      setLoading(false);
      return;
    }

    confirmEnrollment();
  }, [sessionId, courseId]);

  const confirmEnrollment = async () => {
    try {
      setLoading(true);
      console.log("🔄 Starting enrollment confirmation...");

      // Step 1: Get course details
      try {
        const courseResponse = await axiosInstance.get(
          `/api/v1/payments/${courseId}`
        );
        if (courseResponse.data.success) {
          setCourse(courseResponse.data.course);
          console.log("✅ Course details loaded:", courseResponse.data.course);
        }
      } catch (courseError) {
        console.warn(
          "⚠️ Could not load course details, but continuing...",
          courseError
        );
      }

      // Step 2: Confirm enrollment - FIXED ENDPOINT
      console.log(
        "📤 Sending payment confirmation to /api/v1/payments/confirm..."
      );
      const response = await axiosInstance.post("/api/v1/payments/confirm", {
        sessionId: sessionId,
        courseId: parseInt(courseId, 10),
      });

      console.log("✅ Payment confirmation response:", response.data);

      if (response.data.success) {
        toast.success(
          "🎉 Payment confirmed and enrollment completed successfully!"
        );
        setStatus("success");

        // Update local storage with enrolled course
        const enrolledCourses =
          JSON.parse(localStorage.getItem("enrolledCourses")) || [];
        if (!enrolledCourses.includes(courseId)) {
          enrolledCourses.push(courseId);
          localStorage.setItem(
            "enrolledCourses",
            JSON.stringify(enrolledCourses)
          );
        }

        // Clear any pending enrollments
        const pendingEnrollments =
          JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
        const updatedPending = pendingEnrollments.filter(
          (id) => id !== courseId
        );
        localStorage.setItem(
          "pendingEnrollments",
          JSON.stringify(updatedPending)
        );

        // Redirect after delay
        setTimeout(() => {
          navigate("/my-courses");
        }, 3000);
      } else {
        throw new Error(response.data.error || "Payment confirmation failed");
      }
    } catch (err) {
      console.error("❌ Payment confirmation error:", err);

      let errorMessage = "We couldn't confirm your payment and enrollment.";

      if (err.response) {
        const serverError = err.response.data;
        errorMessage = serverError.error || serverError.message || errorMessage;

        switch (err.response.status) {
          case 400:
            errorMessage =
              serverError.error ||
              "Invalid payment session. Please try enrolling again.";
            break;
          case 404:
            errorMessage =
              "Payment confirmation endpoint not found. Please contact support.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              serverError.error ||
              `Server error (${err.response.status}). Please try again.`;
        }

        console.error("🔧 Server error details:", serverError);
      } else if (err.request) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
        console.error("🔧 Network error details:", err.request);
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
        console.error("🔧 Other error details:", err);
      }

      setError(errorMessage);
      setStatus("error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setStatus("loading");
    setError("");
    setLoading(true);
    confirmEnrollment();
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  const handleGoToMyCourses = () => {
    navigate("/my-courses");
  };

  const handleContactSupport = () => {
    navigate("/contact");
  };

  if (loading) {
    return (
      <div className="payment-success-container">
        <div className="payment-status-container">
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Processing Your Payment...</h2>
            <p>
              Please wait while we confirm your payment and complete your
              enrollment.
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
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {status === "success" ? (
          <div className="success-section">
            <div className="success-icon">🎉</div>
            <h1>Payment Successful!</h1>
            <div className="success-message">
              <p>Your payment has been confirmed and you're now enrolled in:</p>
              <h3>{course?.title || "the course"}</h3>

              <div className="enrollment-details">
                <div className="detail-item">
                  <span>Amount Paid:</span>
                  <span>
                    ${course?.price ? course.price.toFixed(2) : "0.00"}
                  </span>
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
            </div>

            <div className="redirect-notice">
              <p>You will be redirected to your courses in a few seconds...</p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleGoToMyCourses}>
                Go to My Courses
              </button>
              <Link to="/courses" className="btn-secondary">
                Browse More Courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h1>Payment Confirmation Failed</h1>
            <div className="error-message">
              <p>{error}</p>
              <p className="error-help">
                If this problem continues, please contact support with your
                Session ID.
              </p>
            </div>

            <div className="error-details">
              <h3>Technical Information</h3>
              <div className="detail-item">
                <span>Session ID:</span>
                <span className="code">{sessionId}</span>
              </div>
              <div className="detail-item">
                <span>Course ID:</span>
                <span>{courseId}</span>
              </div>
              <div className="detail-item">
                <span>Course:</span>
                <span>{course?.title || "Unknown"}</span>
              </div>
            </div>

            <div className="troubleshooting-tips">
              <h4>What you can do:</h4>
              <ul>
                <li>Wait a few minutes and try again</li>
                <li>Check your internet connection</li>
                <li>Verify you're logged in with the correct account</li>
                <li>Contact support if the problem continues</li>
              </ul>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleRetry}>
                Try Again
              </button>
              <button className="btn-secondary" onClick={handleBackToCourses}>
                Back to Courses
              </button>
              <button className="btn-outline" onClick={handleContactSupport}>
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