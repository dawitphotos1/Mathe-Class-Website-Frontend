
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



// src/pages/payment/PaymentSuccess.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  const [status, setStatus] = useState("processing");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    console.log("🎯 Payment Success page loaded");
    console.log("Session ID:", sessionId);
    console.log("Course ID:", courseId);
    console.log("User:", user?.email);

    // No API calls - just show success message
    // Webhook will handle enrollment in background
    
    // Countdown timer for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, courseId, user]);

  // Simple success page with no API calls
  return (
    <div className="payment-success-container">
      <div className="payment-status success">
        <div className="success-icon">✅</div>
        <h2>Payment Successful!</h2>
        
        <div className="payment-info">
          <p><strong>Thank you for your purchase!</strong></p>
          <p>Your payment has been processed successfully.</p>
        </div>

        <div className="processing-message">
          <h3>What happens next?</h3>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <strong>Payment Processed</strong>
                <p>Your payment has been securely processed by Stripe.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <strong>Automatic Enrollment</strong>
                <p>You're being enrolled in the course automatically.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <strong>Access Granted</strong>
                <p>You'll have immediate access to the course content.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="important-notes">
          <h4>📝 Important Notes:</h4>
          <ul>
            <li>Enrollment may take 1-2 minutes to process</li>
            <li>You'll receive a confirmation email</li>
            <li>Check "My Courses" if you don't see the course immediately</li>
            <li>Contact support if you don't have access within 5 minutes</li>
          </ul>
        </div>

        <div className="support-info">
          <p><strong>Reference ID:</strong> {sessionId}</p>
          <p><strong>Course ID:</strong> {courseId}</p>
          <p>Save this information for support if needed.</p>
        </div>

        <div className="action-buttons">
          <Link to="/my-courses" className="btn-primary">
            {countdown > 0 ? `Go to My Courses (${countdown})` : 'Go to My Courses'}
          </Link>
          <Link to="/courses" className="btn-secondary">
            Browse More Courses
          </Link>
          <a 
            href={`mailto:support@matheclass.com?subject=Payment Confirmation&body=Session ID: ${sessionId}%0ACourse ID: ${courseId}%0AUser: ${user?.email}`}
            className="btn-support"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;