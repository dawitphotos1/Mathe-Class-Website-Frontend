
// // src/pages/payments/PaymentSuccess.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("confirming");
//   const [course, setCourse] = useState(null);
//   const [debugInfo, setDebugInfo] = useState("");

//   const sessionId = searchParams.get("session_id");
//   const courseId = searchParams.get("course_id");

//   // 🛡️ Token protection
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please log in to confirm your payment.");
//       navigate("/login", { state: { message: "Please log in to continue your enrollment." } });
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (!sessionId || !courseId) {
//       toast.error("Missing payment information. Please contact support.");
//       setStatus("error");
//       return;
//     }
//     confirmPayment();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sessionId, courseId]);

//   const confirmPayment = async () => {
//     try {
//       setStatus("confirming");
//       setDebugInfo("🔄 Starting payment confirmation...");

//       // small delay to let Stripe finalize
//       await new Promise((r) => setTimeout(r, 2500));

//       const response = await axiosInstance.post("/payments/confirm", {
//         sessionId,
//         courseId,
//       });

//       if (response.data.success) {
//         console.log("✅ Payment confirmed:", response.data);
//         await handleSuccess();
//         return;
//       }

//       console.warn("⚠️ Payment not confirmed immediately:", response.data);
//       toast.warn("Retrying confirmation...");
//       await pollEnrollmentStatus();
//     } catch (error) {
//       console.error(
//         "❌ Payment confirmation error:",
//         error.response?.data || error.message
//       );
//       await pollEnrollmentStatus();
//     }
//   };

//   // ✅ Poll /enrollments/my-courses for up to 15 seconds
//   const pollEnrollmentStatus = async () => {
//     const maxRetries = 5;
//     const delay = (ms) => new Promise((res) => setTimeout(res, ms));

//     for (let i = 0; i < maxRetries; i++) {
//       try {
//         const res = await axiosInstance.get("/enrollments/my-courses");
//         const courses = res.data?.courses || [];
//         const enrolled = courses.some((c) => String(c.id) === String(courseId));

//         if (enrolled) {
//           console.log("✅ Enrollment detected via webhook!");
//           await handleSuccess(true);
//           return;
//         }
//       } catch (err) {
//         console.error("Polling error:", err.message);
//       }

//       await delay(3000);
//     }

//     console.warn("❌ Enrollment not confirmed after polling");
//     setStatus("error");
//     toast.error("We couldn’t confirm your enrollment. Please retry or contact support.");
//   };

//   const handleSuccess = async (fromWebhook = false) => {
//     await fetchCourseInfo();
//     updateLocalStorage(courseId);
//     setStatus("success");
//     toast.success("🎉 Payment confirmed! You're now enrolled.");
//     if (fromWebhook) {
//       setDebugInfo((prev) => prev + "\n✅ Webhook confirmation detected");
//     }

//     setTimeout(() => {
//       navigate("/my-courses", {
//         state: { message: "Enrollment successful!" },
//       });
//     }, 3000);
//   };

//   const fetchCourseInfo = async () => {
//     try {
//       const response = await axiosInstance.get(`/payments/${courseId}`);
//       setCourse(response.data.course);
//     } catch (error) {
//       console.warn("⚠️ Could not fetch course info:", error.message);
//     }
//   };

//   const updateLocalStorage = (courseId) => {
//     try {
//       const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//       if (!enrolled.includes(courseId)) {
//         enrolled.push(courseId);
//         localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
//       }

//       const pending = JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
//       localStorage.setItem(
//         "pendingEnrollments",
//         JSON.stringify(pending.filter((id) => id !== courseId))
//       );

//       localStorage.removeItem("userCourses");
//     } catch (err) {
//       console.error("LocalStorage update error:", err);
//     }
//   };

//   const handleTryAgain = () => {
//     window.location.reload();
//   };

//   return (
//     <div className="payment-success-container">
//       <div className="payment-status-container">
//         {status === "confirming" && (
//           <div className="loading-section">
//             <div className="spinner-large"></div>
//             <h2>Confirming Your Payment...</h2>
//             <p>This may take a few seconds. Please don’t close this page.</p>
//           </div>
//         )}

//         {status === "success" && (
//           <div className="success-section">
//             <div className="success-icon">🎉</div>
//             <h1>Enrollment Successful!</h1>
//             <p>Welcome to your new course:</p>
//             <h3>{course?.title || "Your Course"}</h3>
//             <p className="redirect-notice">Redirecting to your courses...</p>
//             <div className="action-buttons">
//               <button className="btn-primary" onClick={() => navigate("/my-courses")}>
//                 Go to My Courses
//               </button>
//             </div>
//           </div>
//         )}

//         {status === "error" && (
//           <div className="error-section">
//             <div className="error-icon">❌</div>
//             <h1>Confirmation Failed</h1>
//             <p>We couldn’t confirm your enrollment.</p>
//             <div className="action-buttons">
//               <button className="btn-primary" onClick={handleTryAgain}>
//                 🔄 Try Again
//               </button>
//               <Link to="/contact" className="btn-outline">
//                 📞 Contact Support
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;





import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  const [status, setStatus] = useState("confirming");
  const [error, setError] = useState("");
  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId || !courseId) {
        setError("Missing payment information");
        setStatus("error");
        return;
      }

      try {
        setStatus("confirming");

        // Confirm payment with backend
        const response = await axios.post("/payments/confirm", {
          sessionId,
          courseId,
        });

        if (response.data.success) {
          setStatus("success");
          setEnrollment(response.data.enrollment);

          // Fetch course details
          const courseResponse = await axios.get(`/courses/id/${courseId}`);
          setCourse(courseResponse.data);
        } else {
          throw new Error(response.data.error || "Payment confirmation failed");
        }
      } catch (err) {
        console.error("Payment confirmation error:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Payment confirmation failed"
        );
        setStatus("error");
      }
    };

    if (user && sessionId && courseId) {
      confirmPayment();
    }
  }, [sessionId, courseId, user]);

  const handleRetry = () => {
    setError("");
    setStatus("confirming");
    // Retry logic or redirect
    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate("/courses");
    }
  };

  if (status === "confirming") {
    return (
      <div className="payment-success-container">
        <div className="payment-status confirming">
          <div className="spinner"></div>
          <h2>Confirming Your Payment...</h2>
          <p>Please wait while we process your enrollment.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="payment-success-container">
        <div className="payment-status error">
          <div className="error-icon">❌</div>
          <h2>Confirmation Failed</h2>
          <p>{error}</p>
          <div className="action-buttons">
            <button onClick={handleRetry} className="btn-retry">
              Try Again
            </button>
            <Link to="/contact" className="btn-support">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success" && enrollment && course) {
    return (
      <div className="payment-success-container">
        <div className="payment-status success">
          <div className="success-icon">🎉</div>
          <h2>Payment Successful!</h2>
          <p>
            You are now enrolled in <strong>{course.title}</strong>
          </p>

          <div className="enrollment-details">
            <div className="detail-item">
              <span className="label">Course:</span>
              <span className="value">{course.title}</span>
            </div>
            <div className="detail-item">
              <span className="label">Amount Paid:</span>
              <span className="value">
                ${parseFloat(course.price).toFixed(2)}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Enrollment Date:</span>
              <span className="value">
                {new Date(enrollment.enrollmentDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="action-buttons">
            <Link to={`/my-courses`} className="btn-primary">
              Go to My Courses
            </Link>
            <Link
              to={`/courses/${course.slug || course.id}`}
              className="btn-secondary"
            >
              View Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;