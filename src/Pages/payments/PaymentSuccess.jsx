
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



import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [course, setCourse] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);

  const sessionId = searchParams.get("session_id");
  const courseId =
    searchParams.get("course_id") || searchParams.get("courseId");

  useEffect(() => {
    console.log("💳 PaymentSuccess loaded:", { sessionId, courseId });

    if (!sessionId || !courseId) {
      toast.error("Missing payment information. Please contact support.");
      setStatus("error");
      return;
    }

    const confirmPaymentAndEnrollment = async () => {
      try {
        setStatus("loading");

        // Step 1: Confirm payment with backend
        console.log("🔄 Confirming payment with backend...");
        const confirmationResponse = await axiosInstance.post(
          "/payments/confirm",
          {
            sessionId,
            courseId,
          }
        );

        console.log(
          "✅ Payment confirmation response:",
          confirmationResponse.data
        );

        if (confirmationResponse.data.success) {
          // Step 2: Fetch course details for display
          try {
            const courseResponse = await axiosInstance.get(
              `/courses/id/${courseId}`
            );
            const courseData = courseResponse.data;
            setCourse(courseData);
          } catch (courseErr) {
            console.warn("⚠️ Could not load course details:", courseErr);
            // Continue even if course details fail
          }

          // Step 3: Update local state and storage
          setEnrollmentData(confirmationResponse.data.enrollment);
          updateLocalStorage(courseId);
          setStatus("success");
          toast.success("🎉 Payment confirmed! You are now enrolled.");

          // Redirect after delay
          setTimeout(() => navigate("/my-courses"), 4000);
        } else {
          throw new Error(
            confirmationResponse.data.error || "Payment confirmation failed"
          );
        }
      } catch (error) {
        console.error("❌ Payment confirmation error:", error);

        // Check if it's a network error or server error
        if (!error.response) {
          toast.error("Network error. Please check your connection.");
        } else if (error.response.status === 404) {
          toast.error("Payment endpoint not found. Please contact support.");
        } else {
          toast.error(
            error.response.data?.error || "Payment confirmation failed"
          );
        }

        setStatus("error");
      }
    };

    confirmPaymentAndEnrollment();
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
              <p>Session: {sessionId}</p>
              <p>Course: {courseId}</p>
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
            <p>We couldn't confirm your enrollment automatically.</p>
            <p>
              Don't worry - your payment was likely successful. Please check
              your email for confirmation or contact support if you don't see
              the course in your account.
            </p>

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