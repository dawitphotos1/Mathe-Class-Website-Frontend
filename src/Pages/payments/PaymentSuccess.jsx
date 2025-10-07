
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
  const [diagnosticLog, setDiagnosticLog] = useState([]);

  const sessionId = searchParams.get("session_id");
  const courseId =
    searchParams.get("course_id") || searchParams.get("courseId");

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(`[${type.toUpperCase()}] ${logEntry}`);
    setDiagnosticLog((prev) => [
      ...prev,
      { message: logEntry, type, timestamp },
    ]);
  };

  useEffect(() => {
    addLog("PaymentSuccess component mounted");
    addLog(`URL Parameters - Session: ${sessionId}, Course: ${courseId}`);

    if (!sessionId || !courseId) {
      const errorMsg = "Missing payment information. Please contact support.";
      setErrorDetails(errorMsg);
      addLog(errorMsg, "error");
      toast.error(errorMsg);
      setStatus("error");
      return;
    }

    const runDiagnostics = async () => {
      addLog("Starting diagnostic checks...");

      try {
        // Test 1: Backend connectivity
        addLog("Test 1: Checking backend connectivity");
        const healthResponse = await fetch(
          "https://mathe-class-website-backend-1.onrender.com/api/v1/health"
        );
        const healthData = await healthResponse.json();
        addLog(
          `Backend health: ${healthData.status}`,
          healthData.status === "OK" ? "success" : "error"
        );

        // Test 2: CORS test
        addLog("Test 2: Checking CORS");
        const corsResponse = await fetch(
          "https://mathe-class-website-backend-1.onrender.com/api/v1/debug-cors"
        );
        const corsData = await corsResponse.json();
        addLog(`CORS test: ${corsData.message}`, "success");

        // Test 3: Check authentication
        addLog("Test 3: Checking authentication");
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        addLog(`Token exists: ${!!token}`, token ? "success" : "error");

        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        // Test 4: Payment endpoint accessibility
        addLog("Test 4: Testing payment endpoint without auth");
        const paymentTestResponse = await fetch(
          `https://mathe-class-website-backend-1.onrender.com/api/v1/debug-payment-test?sessionId=${sessionId}&courseId=${courseId}`
        );
        const paymentTestData = await paymentTestResponse.json();
        addLog(`Payment endpoint test: ${paymentTestData.message}`, "success");

        // Test 5: Payment endpoint with auth
        addLog("Test 5: Testing payment endpoint with auth");
        const authTestResponse = await fetch(
          "https://mathe-class-website-backend-1.onrender.com/api/v1/debug-payment-auth-test",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (authTestResponse.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }

        const authTestData = await authTestResponse.json();
        addLog(`Payment auth test: ${authTestData.message}`, "success");

        // All tests passed - proceed with actual payment confirmation
        addLog("All diagnostics passed. Proceeding with payment confirmation.");
        await confirmActualPayment();
      } catch (error) {
        addLog(`Diagnostic failed: ${error.message}`, "error");
        handleDiagnosticError(error);
      }
    };

    const confirmActualPayment = async () => {
      try {
        setStatus("loading");
        addLog("Starting actual payment confirmation...");

        const response = await axiosInstance.post("/payments/confirm", {
          sessionId,
          courseId,
        });

        addLog("Payment confirmation successful", "success");

        // Fetch course details for display
        await fetchCourseDetails();

        // Update local storage
        updateLocalStorage(courseId);

        setStatus("success");
        toast.success("🎉 Payment confirmed! You are now enrolled.");

        // Redirect after delay
        setTimeout(() => navigate("/my-courses"), 4000);
      } catch (error) {
        addLog(`Payment confirmation failed: ${error.message}`, "error");
        handlePaymentError(error);
      }
    };

    const fetchCourseDetails = async () => {
      try {
        addLog("Fetching course details...");
        const courseResponse = await axiosInstance.get(
          `/courses/id/${courseId}`
        );
        setCourse(courseResponse.data);
        addLog("Course details fetched", "success");
      } catch (err) {
        addLog(`Could not load course details: ${err.message}`, "warning");
      }
    };

    const handleDiagnosticError = (error) => {
      let userMessage = "System configuration issue. Please contact support.";

      if (error.message.includes("No authentication token")) {
        userMessage = "Your session has expired. Please log in again.";
        // Redirect to login
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.message.includes("CORS")) {
        userMessage =
          "Network configuration issue. Please try a different browser or contact support.";
      } else if (!error.response) {
        userMessage =
          "Cannot connect to server. Please check your internet connection.";
      }

      setErrorDetails(userMessage);
      toast.error(userMessage);
      setStatus("error");
    };

    const handlePaymentError = (error) => {
      let userMessage =
        "Payment confirmation failed. Please try again or contact support.";

      if (error.response?.status === 401) {
        userMessage = "Your session has expired. Please log in again.";
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.status === 404) {
        userMessage = "Payment endpoint not found. Please contact support.";
      } else if (error.response?.status === 500) {
        userMessage = "Server error. Please try again in a few moments.";
      } else if (error.response?.data?.error) {
        userMessage = error.response.data.error;
      }

      setErrorDetails(userMessage);
      toast.error(userMessage);
      setStatus("error");
    };

    runDiagnostics();
  }, [sessionId, courseId, navigate]);

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

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
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
            </div>
            <div className="diagnostic-log">
              <h4>Diagnostic Log:</h4>
              <div className="log-entries">
                {diagnosticLog.map((log, index) => (
                  <div key={index} className={`log-entry ${log.type}`}>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
              </div>
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

            <div className="diagnostic-log">
              <h4>Diagnostic Log:</h4>
              <div className="log-entries">
                {diagnosticLog.map((log, index) => (
                  <div key={index} className={`log-entry ${log.type}`}>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

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