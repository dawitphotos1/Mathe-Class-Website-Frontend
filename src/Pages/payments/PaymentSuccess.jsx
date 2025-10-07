
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




// src/Pages/payments/PaymentSuccess.jsx
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

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id") || searchParams.get("courseId");

  useEffect(() => {
    console.log("💳 PaymentSuccess loaded:", { sessionId, courseId });

    if (!courseId) {
      toast.error("Missing course information. Please contact support.");
      setStatus("error");
      return;
    }

    // Fetch course details (optional, for display)
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/courses/${courseId}`);
        const courseData = response.data?.course || response.data;
        setCourse(courseData);

        // 🎉 Payment already handled by Stripe webhook — mark success
        setStatus("success");
        toast.success("🎉 Payment confirmed automatically!");
        updateLocalStorage(courseId);

        // Redirect user after a short delay
        setTimeout(() => navigate("/my-courses"), 3000);
      } catch (err) {
        console.warn("⚠️ Could not load course info (not critical):", err);
        setStatus("success");
      }
    };

    fetchCourse();
  }, [courseId, sessionId, navigate]);

  // 🧠 Update localStorage to reflect enrollment
  const updateLocalStorage = (courseId) => {
    const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId);
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
    }

    const pending =
      JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
    localStorage.setItem(
      "pendingEnrollments",
      JSON.stringify(pending.filter((id) => id !== courseId))
    );

    localStorage.removeItem("userCourses");
  };

  // 🧭 Navigation handlers
  const handleGoCourses = () => navigate("/my-courses");
  const handleBack = () => navigate("/courses");
  const handleSupport = () => navigate("/contact");

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {/* 🕒 Loading State */}
        {status === "loading" && (
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Finalizing Your Payment...</h2>
            <p>Please wait while we activate your course access.</p>
          </div>
        )}

        {/* ✅ Success State */}
        {status === "success" && (
          <div className="success-section">
            <div className="success-icon">🎉</div>
            <h1>Payment Successful!</h1>
            <p>Your enrollment has been confirmed automatically.</p>

            <h3>{course?.title || "Course Enrolled Successfully"}</h3>

            <div className="enrollment-details">
              {course?.price && (
                <div className="detail-item">
                  <span>Amount Paid:</span>
                  <span>${parseFloat(course.price).toFixed(2)}</span>
                </div>
              )}
              <div className="detail-item">
                <span>Status:</span>
                <span className="status-badge approved">Approved</span>
              </div>
              {sessionId && (
                <div className="detail-item">
                  <span>Session ID:</span>
                  <span className="code">{sessionId}</span>
                </div>
              )}
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
            <h1>Payment Error</h1>
            <p>We couldn’t verify your course enrollment.</p>
            <p>Please check your internet connection or contact support.</p>

            <div className="action-buttons">
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
