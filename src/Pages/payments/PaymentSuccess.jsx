// // /payments/PaymentSuccess.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [status, setStatus] = useState("loading"); // loading | success | error
//   const [course, setCourse] = useState(null);

//   const sessionId = searchParams.get("session_id");
//   const courseId =
//     searchParams.get("course_id") || searchParams.get("courseId");

//   // =============================
//   // 🔹 On load: Fetch course info
//   // =============================
//   useEffect(() => {
//     console.log("✅ PaymentSuccess page loaded:", { sessionId, courseId });

//     if (!courseId) {
//       toast.error("Missing course information. Please contact support.");
//       setStatus("error");
//       return;
//     }

//     fetchCourse();
//   }, [courseId]);

//   // ===========================================================
//   // 🔹 Fetch course info (optional, for display)
//   // ===========================================================
//   const fetchCourse = async () => {
//     try {
//       const res = await axiosInstance.get(`/api/v1/courses/${courseId}`);
//       const courseData = res.data.course || res.data; // support both API shapes

//       setCourse(courseData);
//       updateLocalStorage(courseId);
//       setStatus("success");

//       toast.success("🎉 Payment confirmed automatically!");
//       setTimeout(() => navigate("/my-courses"), 3000);
//     } catch (err) {
//       console.warn("⚠️ Course fetch failed, continuing...", err);
//       setStatus("success"); // even if fetch fails, webhook handled enrollment
//       toast.success("🎉 Payment confirmed automatically!");
//       setTimeout(() => navigate("/my-courses"), 3000);
//     }
//   };

//   // ===========================================================
//   // 🔹 Update localStorage (mark course as enrolled)
//   // ===========================================================
//   const updateLocalStorage = (courseId) => {
//     try {
//       const enrolled =
//         JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//       if (!enrolled.includes(courseId)) {
//         enrolled.push(courseId);
//         localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
//       }

//       const pending =
//         JSON.parse(localStorage.getItem("pendingEnrollments")) || [];
//       localStorage.setItem(
//         "pendingEnrollments",
//         JSON.stringify(pending.filter((id) => id !== courseId))
//       );

//       localStorage.removeItem("userCourses");
//     } catch (err) {
//       console.error("⚠️ Failed to update localStorage:", err);
//     }
//   };

//   // ===========================================================
//   // 🔹 Render
//   // ===========================================================
//   return (
//     <div className="payment-success-container">
//       <div className="payment-status-container">
//         {/* Loading */}
//         {status === "loading" && (
//           <div className="loading-section">
//             <div className="spinner-large"></div>
//             <h2>Processing Payment...</h2>
//             <p>Just a moment while we finalize your enrollment.</p>
//           </div>
//         )}

//         {/* Success */}
//         {status === "success" && (
//           <div className="success-section">
//             <div className="success-icon">🎉</div>
//             <h1>Payment Successful!</h1>
//             <p>You’re now enrolled in:</p>
//             <h3>{course?.title || "Your course"}</h3>

//             <div className="enrollment-details">
//               {course?.price && (
//                 <div className="detail-item">
//                   <span>Amount Paid:</span>
//                   <span>${parseFloat(course.price).toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="detail-item">
//                 <span>Status:</span>
//                 <span className="status-badge approved">Approved</span>
//               </div>
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

//         {/* Error */}
//         {status === "error" && (
//           <div className="error-section">
//             <div className="error-icon">❌</div>
//             <h1>Payment Processing Error</h1>
//             <p>
//               We couldn’t verify your payment details. Please contact support.
//             </p>
//             <div className="action-buttons">
//               <button
//                 className="btn-secondary"
//                 onClick={() => navigate("/courses")}
//               >
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
  const [status, setStatus] = useState("loading");
  const [course, setCourse] = useState(null);

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  useEffect(() => {
    console.log("✅ PaymentSuccess page loaded:", { sessionId, courseId });

    if (!courseId) {
      toast.error("Missing course information. Please contact support.");
      setStatus("error");
      return;
    }

    fetchCourse();
  }, [courseId, sessionId]);

  const fetchCourse = async () => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      const courseData = res.data.course || res.data;
      setCourse(courseData);
      setStatus("success");
      updateLocalStorage(courseId);

      toast.success("🎉 Payment confirmed automatically!");
      setTimeout(() => navigate("/my-courses"), 3000);
    } catch (err) {
      console.warn("⚠️ Failed to fetch course (still okay):", err);
      setStatus("success");
      toast.success("🎉 Payment confirmed automatically!");
      setTimeout(() => navigate("/my-courses"), 3000);
    }
  };

  const updateLocalStorage = (courseId) => {
    try {
      const enrolled =
        JSON.parse(localStorage.getItem("enrolledCourses")) || [];
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
    } catch (err) {
      console.error("⚠️ localStorage update failed:", err);
    }
  };

  return (
    <div className="payment-success-container">
      <div className="payment-status-container">
        {status === "loading" && (
          <div className="loading-section">
            <div className="spinner-large"></div>
            <h2>Processing Payment...</h2>
            <p>Just a moment while we finalize your enrollment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="success-section">
            <div className="success-icon">🎉</div>
            <h1>Payment Successful!</h1>
            <p>You’re now enrolled in:</p>
            <h3>{course?.title || "Your course"}</h3>

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
              <button
                className="btn-primary"
                onClick={() => navigate("/my-courses")}
              >
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
            <h1>Payment Error</h1>
            <p>
              We couldn’t verify your payment details. Please contact support.
            </p>
            <div className="action-buttons">
              <button
                className="btn-secondary"
                onClick={() => navigate("/courses")}
              >
                Back to Courses
              </button>
              <Link to="/contact" className="btn-outline">
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
