
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
  const [retryCount, setRetryCount] = useState(0);

  // Debug mount
  useEffect(() => {
    console.log("🔍 PaymentSuccess mounted with:", {
      sessionId,
      courseId,
      user: user ? `${user.email} (id: ${user.id})` : 'No user',
      hasToken: !!localStorage.getItem('token')
    });
  }, []);

  // Function to confirm payment with retry logic
  const confirmPayment = async () => {
    console.log("🔍 confirmPayment function called");
    console.log("📦 Request data:", { sessionId, courseId, userId: user?.id });

    if (!sessionId || !courseId) {
      console.log("❌ Missing sessionId or courseId");
      setError("Missing payment information: session_id or course_id");
      setStatus("error");
      return;
    }

    if (!user) {
      console.log("❌ No user found");
      setError("User not authenticated. Please log in again.");
      setStatus("error");
      return;
    }

    try {
      setStatus("confirming");
      console.log("🔄 Starting payment confirmation...");

      // Test if axios is working by making a simple request first
      try {
        console.log("🧪 Testing API connection...");
        const healthResponse = await axios.get('/health');
        console.log("✅ API health check passed:", healthResponse.data);
      } catch (healthError) {
        console.error("❌ API health check failed:", healthError);
        throw new Error(`Cannot connect to server: ${healthError.message}`);
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      console.log("📤 Sending confirmation request to /payments/confirm...");
      
      // Confirm payment with backend
      const response = await axios.post(
        "/payments/confirm",
        {
          sessionId,
          courseId,
        },
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      console.log("✅ Backend response received:", response.data);

      if (response.data.success) {
        console.log("🎉 Payment confirmation successful!");
        setStatus("success");
        setEnrollment(response.data.enrollment);

        // Fetch course details
        try {
          console.log("📚 Fetching course details...");
          const courseResponse = await axios.get(`/courses/id/${courseId}`);
          setCourse(courseResponse.data);
          console.log("✅ Course details fetched");
        } catch (courseErr) {
          console.warn("⚠️ Could not fetch course details:", courseErr);
        }
      } else {
        console.log("❌ Backend returned success: false");
        throw new Error(response.data.error || "Payment confirmation failed");
      }
    } catch (err) {
      console.error("❌ Payment confirmation error:", err);
      console.error("❌ Error details:", {
        name: err.name,
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });

      let errorMessage = "Payment confirmation failed. Please contact support.";
      
      if (err.name === 'AbortError') {
        errorMessage = "Request timeout. Please check your internet connection and try again.";
      } else if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        if (status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (status === 404) {
          errorMessage = "Payment confirmation endpoint not found (404). Please contact support.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again or contact support.";
        } else {
          errorMessage = err.response.data?.error || `Server error (${status}). Please try again.`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your internet connection.";
      } else {
        errorMessage = err.message || "Payment confirmation failed.";
      }

      setError(errorMessage);
      setStatus("error");
    }
  };

  useEffect(() => {
    console.log("🎯 useEffect triggered");
    
    // Wait a bit for Stripe to complete processing
    const initializeConfirmation = async () => {
      console.log("⏳ Waiting for Stripe processing...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("🚀 Starting payment confirmation process...");
      
      if (user && sessionId && courseId) {
        console.log("✅ All required data present, calling confirmPayment...");
        confirmPayment();
      } else {
        console.error("❌ Missing required data:", { 
          user: !!user, 
          sessionId: !!sessionId, 
          courseId: !!courseId 
        });
        setError("Missing required payment information");
        setStatus("error");
      }
    };

    initializeConfirmation();
  }, [sessionId, courseId, user]);

  const handleRetry = async () => {
    if (retryCount >= 3) {
      setError("Maximum retry attempts reached. Please contact support.");
      return;
    }

    setError("");
    setStatus("confirming");
    setRetryCount((prev) => prev + 1);

    // Wait before retry
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await confirmPayment();
  };

  const handleManualCheck = () => {
    // Redirect to my-courses page to check if enrollment actually worked
    navigate("/my-courses");
  };

  const handleAbsoluteUrlTest = async () => {
    console.log("🔧 Testing with absolute URL...");
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("https://mathe-class-website-backend.onrender.com/api/v1/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId, courseId })
      });
      
      const data = await response.json();
      console.log("🔧 Absolute URL test response:", data);
      
      if (data.success) {
        setStatus("success");
        setEnrollment(data.enrollment);
      } else {
        setError(data.error || "Absolute URL test failed");
      }
    } catch (err) {
      console.error("🔧 Absolute URL test error:", err);
      setError("Absolute URL test failed: " + err.message);
    }
  };

  if (status === "confirming") {
    return (
      <div className="payment-success-container">
        <div className="payment-status confirming">
          <div className="spinner"></div>
          <h2>Confirming Your Payment...</h2>
          <p>Please wait while we process your enrollment.</p>
          <p className="debug-info">
            <strong>Note:</strong> If this takes more than 30 seconds, your
            browser extensions might be interfering.
          </p>
          {retryCount > 0 && (
            <p className="retry-count">Retry attempt: {retryCount}/3</p>
          )}
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

          <div className="browser-warning">
            <h4>⚠️ Browser Extension Detected</h4>
            <p>
              We've detected that a browser extension (McAfee WebAdvisor) might
              be interfering with payment confirmation.
            </p>
            <ul>
              <li>
                Try in <strong>Incognito/Private Mode</strong>
              </li>
              <li>Disable the McAfee extension temporarily</li>
              <li>Or try a different browser</li>
            </ul>
          </div>

          <div className="debug-info">
            <p>
              <strong>Session ID:</strong> {sessionId}
            </p>
            <p>
              <strong>Course ID:</strong> {courseId}
            </p>
            <p>
              <strong>User:</strong> {user?.email}
            </p>
            <p>
              <strong>Retry Attempt:</strong> {retryCount}/3
            </p>
          </div>

          <div className="action-buttons">
            {retryCount < 3 ? (
              <button onClick={handleRetry} className="btn-retry">
                Try Again ({3 - retryCount} left)
              </button>
            ) : null}
            <button onClick={handleManualCheck} className="btn-secondary">
              Check My Courses Anyway
            </button>
            <button onClick={handleAbsoluteUrlTest} className="btn-test">
              Test Absolute URL
            </button>
            <Link to="/contact" className="btn-support">
              Contact Support
            </Link>
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
          <h2>Payment Successful!</h2>
          <p>
            You are now enrolled in{" "}
            <strong>{course?.title || "the course"}</strong>
          </p>

          {enrollment && (
            <div className="enrollment-details">
              <div className="detail-item">
                <span className="label">Course:</span>
                <span className="value">{course?.title || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Amount Paid:</span>
                <span className="value">
                  $
                  {parseFloat(course?.price || enrollment.price || 0).toFixed(
                    2
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Enrollment Date:</span>
                <span className="value">
                  {new Date(
                    enrollment.enrollmentDate || new Date()
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <Link to="/my-courses" className="btn-primary">
              Go to My Courses
            </Link>
            {course?.slug && (
              <Link to={`/courses/${course.slug}`} className="btn-secondary">
                View Course
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