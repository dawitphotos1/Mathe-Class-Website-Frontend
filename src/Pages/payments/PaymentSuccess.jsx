
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

//   useEffect(() => {
//     console.log("🎯 Payment Success:", { sessionId, courseId });
//     if (!sessionId || !courseId) {
//       toast.error("Missing payment information. Please contact support.");
//       setStatus("error");
//       return;
//     }
//     confirmPayment();
//   }, [sessionId, courseId]);

//   const confirmPayment = async () => {
//     try {
//       setStatus("confirming");
//       setDebugInfo(`Confirming session ${sessionId} for course ${courseId}`);

//       const response = await axiosInstance.post("/payments/confirm", {
//         sessionId,
//         courseId,
//       });

//       if (response.data.success) {
//         await handleSuccess();
//       } else {
//         throw new Error(response.data.error || "Payment not confirmed");
//       }
//     } catch (error) {
//       console.error("❌ Payment confirmation failed:", error.message);
//       setStatus("error");
//       toast.error("Confirmation failed. Please try again.");
//     }
//   };

//   const handleSuccess = async () => {
//     await fetchCourseInfo();
//     updateLocalStorage(courseId);
//     toast.success("🎉 Payment confirmed! You're now enrolled.");
//     setStatus("success");

//     setTimeout(() => {
//       navigate("/my-courses", {
//         state: { message: "Enrollment successful!" },
//       });
//     }, 3000);
//   };

//   const fetchCourseInfo = async () => {
//     try {
//       const res = await axiosInstance.get(`/courses/${courseId}`);
//       setCourse(res.data);
//     } catch (error) {
//       console.warn("⚠️ Could not fetch course:", error.message);
//     }
//   };

//   const updateLocalStorage = (courseId) => {
//     try {
//       const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//       if (!enrolled.includes(courseId)) {
//         enrolled.push(courseId);
//         localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
//       }
//       localStorage.removeItem("pendingEnrollments");
//     } catch (e) {
//       console.warn("Local storage update failed:", e.message);
//     }
//   };

//   const handleTryAgain = () => window.location.reload();

//   return (
//     <div className="payment-success-container">
//       {status === "confirming" && (
//         <div className="loading-section">
//           <div className="spinner-large"></div>
//           <h2>Confirming Your Payment...</h2>
//           <p>Please wait while we complete your enrollment.</p>
//         </div>
//       )}

//       {status === "success" && (
//         <div className="success-section">
//           <div className="success-icon">🎉</div>
//           <h1>Enrollment Successful!</h1>
//           <h3>{course?.title || "Your Course"}</h3>
//           <p>You now have full access to your course materials.</p>
//           <button className="btn-primary" onClick={() => navigate("/my-courses")}>
//             Go to My Courses
//           </button>
//         </div>
//       )}

//       {status === "error" && (
//         <div className="error-section">
//           <div className="error-icon">❌</div>
//           <h1>Confirmation Failed</h1>
//           <p>
//             We couldn’t confirm your enrollment. Please disable browser
//             extensions (like McAfee) or try again.
//           </p>
//           <button className="btn-primary" onClick={handleTryAgain}>
//             Try Again
//           </button>
//           <Link to="/contact" className="btn-outline">
//             Contact Support
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;






// PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Step 1: Attempt normal confirmation
        await axiosInstance.post("/payments/confirm", { sessionId, courseId });
        setStatus("success");
      } catch (err) {
        console.warn("⚠️ Payment confirm API failed, fallback to polling:", err.message);

        // Step 2: Poll for webhook confirmation (max 10s)
        let enrolled = false;
        for (let i = 0; i < 10; i++) {
          try {
            const res = await axiosInstance.get("/enrollments/my-courses");
            const found = res.data?.courses?.some(c => String(c.id) === String(courseId));
            if (found) {
              enrolled = true;
              break;
            }
          } catch (pollErr) {
            console.warn("Polling failed:", pollErr.message);
          }
          await new Promise(r => setTimeout(r, 1000)); // wait 1s
        }

        setStatus(enrolled ? "success" : "failed");
      }
    };

    if (sessionId && courseId) confirmPayment();
  }, [sessionId, courseId]);

  if (status === "pending") {
    return (
      <div className="payment-status loading">
        <h2>Processing your payment...</h2>
        <p>This might take a few seconds.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="payment-status success">
        <h2>✅ Enrollment Confirmed!</h2>
        <p>You now have access to your course.</p>
        <button onClick={() => navigate("/my-courses")}>Go to My Courses</button>
      </div>
    );
  }

  return (
    <div className="payment-status failed">
      <h2>❌ Confirmation Failed</h2>
      <p>We couldn’t confirm your enrollment.</p>
      <p>It may still complete shortly — please refresh your My Courses page after 30 seconds.</p>
      <p>If the issue persists, disable McAfee WebAdvisor and try again.</p>
      <button onClick={() => navigate("/")}>Return Home</button>
    </div>
  );
};

export default PaymentSuccess;
