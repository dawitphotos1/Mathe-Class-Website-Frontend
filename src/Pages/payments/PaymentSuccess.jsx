
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
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);

  // Check if user is already enrolled (webhook might have processed it)
  const checkExistingEnrollment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mathe-class-website-backend.onrender.com/api/v1/users/me/enrollments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const enrollments = await response.json();
        const currentEnrollment = enrollments.find(e => e.courseId === courseId);
        
        if (currentEnrollment) {
          setStatus("success");
          setEnrollment(currentEnrollment);
          await fetchCourseDetails();
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Error checking enrollment:", err);
      return false;
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`https://mathe-class-website-backend.onrender.com/api/v1/courses/id/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
      }
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  // Simple enrollment check without complex confirmation
  const verifyEnrollment = async () => {
    // First, check if already enrolled
    const isEnrolled = await checkExistingEnrollment();
    if (isEnrolled) return;

    // If not enrolled yet, wait and check again (webhook might be processing)
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkInterval = setInterval(async () => {
      attempts++;
      console.log(`Checking enrollment (attempt ${attempts}/${maxAttempts})...`);
      
      const isEnrolled = await checkExistingEnrollment();
      
      if (isEnrolled) {
        clearInterval(checkInterval);
        return;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        setError("Enrollment is taking longer than expected. Your payment was successful, but we're still processing your enrollment. Please check 'My Courses' in a few minutes.");
        setStatus("delayed");
      }
    }, 2000); // Check every 2 seconds
  };

  useEffect(() => {
    // Add this to prevent extension interference
    const originalError = console.error;
    console.error = function(...args) {
      if (typeof args[0] === 'string' && args[0].includes('features')) {
        // Suppress the extension error
        return;
      }
      originalError.apply(console, args);
    };

    if (user && sessionId && courseId) {
      verifyEnrollment();
    } else {
      setError("Missing payment information. Please contact support with your session ID.");
      setStatus("error");
    }

    // Restore console.error
    return () => {
      console.error = originalError;
    };
  }, [sessionId, courseId, user]);

  const handleGoToCourses = () => {
    navigate("/my-courses");
  };

  const handleRetryCheck = () => {
    setStatus("checking");
    setError("");
    verifyEnrollment();
  };

  if (status === "checking") {
    return (
      <div className="payment-success-container">
        <div className="payment-status checking">
          <div className="spinner"></div>
          <h2>Verifying Your Enrollment...</h2>
          <p>Please wait while we confirm your course access.</p>
          <div className="processing-info">
            <p>✅ Payment received successfully</p>
            <p>🔄 Setting up your course access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "delayed") {
    return (
      <div className="payment-success-container">
        <div className="payment-status delayed">
          <div className="delayed-icon">⏳</div>
          <h2>Enrollment Processing</h2>
          <p>{error}</p>
          
          <div className="next-steps">
            <h4>What to do next:</h4>
            <ol>
              <li>Your payment was successful and secure</li>
              <li>Course access is being set up automatically</li>
              <li>This usually takes 1-5 minutes</li>
              <li>You'll receive email confirmation</li>
            </ol>
          </div>

          <div className="action-buttons">
            <button onClick={handleRetryCheck} className="btn-retry">
              Check Again
            </button>
            <button onClick={handleGoToCourses} className="btn-primary">
              Check My Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="payment-success-container">
        <div className="payment-status error">
          <div className="error-icon">⚠️</div>
          <h2>Verification Needed</h2>
          <p>{error}</p>
          
          <div className="support-info">
            <p><strong>Session ID:</strong> {sessionId}</p>
            <p><strong>Course ID:</strong> {courseId}</p>
            <p>Please save this information for support.</p>
          </div>

          <div className="action-buttons">
            <button onClick={handleGoToCourses} className="btn-primary">
              Check My Courses
            </button>
            <a 
              href={`mailto:support@matheclass.com?subject=Payment Verification Needed&body=Session ID: ${sessionId}%0ACourse ID: ${courseId}%0AUser: ${user?.email}`}
              className="btn-support"
            >
              Email Support
            </a>
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
          <h2>Welcome to Your Course!</h2>
          <p>You're now enrolled in <strong>{course?.title || "the course"}</strong></p>
          
          <div className="enrollment-details">
            <div className="detail-item">
              <span className="label">Course:</span>
              <span className="value">{course?.title || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="label">Access Granted:</span>
              <span className="value">Immediate</span>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleGoToCourses} className="btn-primary">
              Start Learning Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;