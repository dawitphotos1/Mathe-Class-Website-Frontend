
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
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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

  // Direct API call that bypasses axios and potential extension interference
  const confirmPaymentDirect = async () => {
    console.log("🚀 Starting direct payment confirmation...");
    
    if (!sessionId || !courseId || !user) {
      setError("Missing required information. Please contact support.");
      setStatus("error");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("📤 Making direct fetch request...");
      
      const response = await fetch("https://mathe-class-website-backend.onrender.com/api/v1/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId,
          courseId
        })
      });

      console.log("📥 Response received, status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Payment confirmation success:", data);

      if (data.success) {
        setStatus("success");
        setEnrollment(data.enrollment);
        
        // Fetch course details
        try {
          const courseResponse = await fetch(`https://mathe-class-website-backend.onrender.com/api/v1/courses/id/${courseId}`);
          if (courseResponse.ok) {
            const courseData = await courseResponse.json();
            setCourse(courseData);
          }
        } catch (courseErr) {
          console.warn("Could not fetch course details:", courseErr);
        }
      } else {
        throw new Error(data.error || "Payment confirmation failed");
      }

    } catch (err) {
      console.error("❌ Direct payment confirmation failed:", err);
      
      let errorMessage = "Payment confirmation failed. ";
      
      if (err.message.includes("Failed to fetch")) {
        errorMessage += "Network error. Please check your internet connection.";
      } else if (err.message.includes("token")) {
        errorMessage += "Authentication issue. Please log in again.";
      } else {
        errorMessage += err.message;
      }

      setError(errorMessage);
      setStatus("error");
    }
  };

  useEffect(() => {
    console.log("🎯 PaymentSuccess mounted");

    const initialize = async () => {
      // Wait for Stripe to complete processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (user && sessionId && courseId) {
        await confirmPaymentDirect();
      } else {
        setError("Missing required payment information");
        setStatus("error");
      }
    };

    initialize();
  }, [sessionId, courseId, user]);

  const handleRetry = async () => {
    setError("");
    setStatus("confirming");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await confirmPaymentDirect();
  };

  const handleGoToCourses = () => {
    navigate("/my-courses");
  };

  const handleContactSupport = () => {
    // You can pre-fill support form with session details
    const supportMessage = `Payment Confirmation Issue - Session: ${sessionId}, Course: ${courseId}, User: ${user?.email}`;
    navigate("/contact", { 
      state: { 
        presetMessage: supportMessage 
      } 
    });
  };

  if (status === "confirming") {
    return (
      <div className="payment-success-container">
        <div className="payment-status confirming">
          <div className="spinner"></div>
          <h2>Confirming Your Payment...</h2>
          <p>Please wait while we process your enrollment.</p>
          <div className="browser-tips">
            <h4>💡 If this takes too long:</h4>
            <ul>
              <li>Try in <strong>Incognito Mode</strong></li>
              <li>Disable browser extensions temporarily</li>
              <li>Use a different browser</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="payment-success-container">
        <div className="payment-status error">
          <div className="error-icon">❌</div>
          <h2>Confirmation Incomplete</h2>
          <p>{error}</p>

          <div className="troubleshooting">
            <h4>🛠️ Quick Solutions:</h4>
            <div className="solution-cards">
              <div className="solution-card">
                <h5>Try Incognito Mode</h5>
                <p>Open this page in a private/incognito window to bypass extensions.</p>
              </div>
              <div className="solution-card">
                <h5>Check My Courses</h5>
                <p>Your payment may have succeeded even if confirmation failed.</p>
              </div>
              <div className="solution-card">
                <h5>Contact Support</h5>
                <p>We'll manually verify your payment and enroll you.</p>
              </div>
            </div>
          </div>

          <div className="debug-info">
            <p><strong>Session ID:</strong> {sessionId}</p>
            <p><strong>Course ID:</strong> {courseId}</p>
            <p><strong>User:</strong> {user?.email}</p>
          </div>

          <div className="action-buttons">
            <button onClick={handleRetry} className="btn-retry">
              Try Confirmation Again
            </button>
            <button onClick={handleGoToCourses} className="btn-secondary">
              Check My Courses
            </button>
            <button onClick={handleContactSupport} className="btn-support">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="payment-success-container">
        <div className="payment-status success">
          <div className="success-icon">🎉</div>
          <h2>Enrollment Successful!</h2>
          <p>Welcome to <strong>{course?.title || "your new course"}</strong></p>
          
          {enrollment && (
            <div className="enrollment-details">
              <div className="detail-item">
                <span className="label">Enrolled in:</span>
                <span className="value">{course?.title || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Enrollment Date:</span>
                <span className="value">
                  {new Date(enrollment.enrollmentDate || new Date()).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <Link to="/my-courses" className="btn-primary">
              Start Learning
            </Link>
            {course?.slug && (
              <Link to={`/courses/${course.slug}`} className="btn-secondary">
                View Course Details
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;