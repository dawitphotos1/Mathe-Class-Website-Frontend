
// // src/pages/payment/PaymentSuccess.jsx
// import React, { useState, useEffect } from "react";
// import { useSearchParams, Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import axiosInstance from "../../utils/axiosInstance";
// import { toast } from "react-toastify";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const sessionId = searchParams.get("session_id");
//   const courseId = searchParams.get("course_id");

//   const [status, setStatus] = useState("processing");
//   const [countdown, setCountdown] = useState(10);
//   const [enrollmentData, setEnrollmentData] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     const confirmPayment = async () => {
//       try {
//         if (!sessionId || !courseId) {
//           console.warn("⚠️ Missing session or course ID for confirmation");
//           setStatus("error");
//           toast.error("Missing payment/session information.");
//           return;
//         }

//         if (!user) {
//           console.warn("⚠️ No user detected — please log in before confirming payment");
//           setStatus("error");
//           toast.error("Please log in again to confirm your payment.");
//           return;
//         }

//         console.log("💰 Confirming payment with backend:", {
//           sessionId,
//           courseId,
//           user: user.email,
//         });

//         const res = await axiosInstance.post("/payments/confirm", {
//           sessionId,
//           courseId,
//         });

//         console.log("🔍 Backend response:", res.data);

//         if (res?.data?.success) {
//           console.log("✅ Payment confirmed on backend:", res.data.enrollment || res.data);
//           if (!mounted) return;
//           setStatus("success");
//           setEnrollmentData(res.data.enrollment);
//           toast.success("Payment confirmed! Enrollment pending admin approval.");
//         } else {
//           console.error("❌ Payment confirmation failed:", res?.data);
//           if (!mounted) return;
//           setStatus("error");
//           toast.error(res?.data?.error || "Payment confirmation failed.");
//         }
//       } catch (err) {
//         console.error("❌ Payment confirmation error:", err);
//         if (!mounted) return;
//         setStatus("error");
//         toast.error(err.response?.data?.error || "Error confirming payment. Please contact support.");
//       }
//     };

//     // Fire off confirmation immediately
//     confirmPayment();

//     // countdown for the "Go to My Courses" button
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       mounted = false;
//       clearInterval(timer);
//     };
//   }, [sessionId, courseId, user]);

//   // ✅ FIXED: Handle button clicks based on user role
//   const handleMyCoursesClick = () => {
//     if (user?.role === 'admin') {
//       navigate('/admin'); // Admin goes to admin dashboard
//     } else {
//       navigate('/my-courses'); // Student/teacher goes to their courses
//     }
//   };

//   const handleBrowseCoursesClick = () => {
//     if (user?.role === 'admin') {
//       navigate('/admin/courses'); // Admin goes to admin courses management
//     } else {
//       navigate('/courses'); // Student/teacher goes to public courses
//     }
//   };

//   return (
//     <div className="payment-success-container">
//       <div className="payment-status">
//         <div className="success-icon">
//           {status === "processing" ? "⏳" : status === "success" ? "🎉" : "❌"}
//         </div>
        
//         <h1>
//           {status === "processing" 
//             ? "Processing your payment..." 
//             : status === "success" 
//             ? "Payment Successful!" 
//             : "Payment Confirmation Failed"
//           }
//         </h1>

//         {status === "success" ? (
//           <>
//             <p>Thank you for your purchase! Your payment has been processed successfully.</p>
//             <p>Your enrollment is <strong>pending admin approval</strong> and should appear in the Admin Dashboard for review.</p>
//             {enrollmentData && (
//               <div className="payment-info">
//                 <p><strong>Enrollment ID:</strong> {enrollmentData.id}</p>
//                 <p><strong>Status:</strong> {enrollmentData.approval_status}</p>
//               </div>
//             )}
//           </>
//         ) : status === "processing" ? (
//           <p>Please wait while we confirm your enrollment...</p>
//         ) : (
//           <p>We couldn't confirm your payment. Please contact support with your Reference ID below.</p>
//         )}

//         <hr />

//         <div className="processing-message">
//           <h3>What happens next?</h3>
//           <div className="steps">
//             <div className="step">
//               <div className="step-number">1</div>
//               <div className="step-content">
//                 <strong>Payment Processed</strong>
//                 <p>Your payment has been securely processed by Stripe.</p>
//               </div>
//             </div>

//             <div className="step">
//               <div className="step-number">2</div>
//               <div className="step-content">
//                 <strong>Enrollment Created</strong>
//                 <p>If payment succeeded, an enrollment record is created and set to <em>pending</em> for admin approval.</p>
//               </div>
//             </div>

//             <div className="step">
//               <div className="step-number">3</div>
//               <div className="step-content">
//                 <strong>Admin Approval</strong>
//                 <p>An admin will review and approve the enrollment. Once approved, you'll get access.</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="important-notes">
//           <h4>📝 Important Notes</h4>
//           <ul>
//             <li>Enrollment is processed automatically via Stripe webhooks and a backend confirmation endpoint.</li>
//             <li>If you do not see your course listed after a few minutes, contact support and provide the Reference ID below.</li>
//             <li>Admin approval typically takes 1-2 business hours.</li>
//           </ul>
//         </div>

//         <div className="support-info">
//           <p><strong>Reference ID:</strong> {sessionId || "N/A"}</p>
//           <p><strong>Course ID:</strong> {courseId || "N/A"}</p>
//           {enrollmentData && (
//             <p><strong>Enrollment ID:</strong> {enrollmentData.id}</p>
//           )}
//         </div>

//         <div className="action-buttons">
//           {/* ✅ FIXED: Using onClick handlers instead of Link to respect user roles */}
//           <button className="btn-primary" onClick={handleMyCoursesClick}>
//             {countdown > 0 ? `Go to My Courses (${countdown})` : "Go to My Courses"}
//           </button>
//           <button className="btn-secondary" onClick={handleBrowseCoursesClick}>
//             Browse More Courses
//           </button>
//           <a href="mailto:support@matheclass.com" className="btn-support">
//             Contact Support
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;




// src/pages/payment/PaymentSuccess.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  const [status, setStatus] = useState("processing");
  const [countdown, setCountdown] = useState(10);
  const [enrollmentData, setEnrollmentData] = useState(null);

  // Debug: Check what's happening
  useEffect(() => {
    console.log("🔍 PaymentSuccess Debug:");
    console.log("📍 Current URL:", window.location.href);
    console.log("🎯 User role:", user?.role);
    console.log("💰 Session ID:", sessionId);
    console.log("📚 Course ID:", courseId);
  }, [user, sessionId, courseId]);

  useEffect(() => {
    let mounted = true;

    const confirmPayment = async () => {
      try {
        if (!sessionId || !courseId) {
          console.warn("⚠️ Missing session or course ID for confirmation");
          setStatus("error");
          toast.error("Missing payment/session information.");
          return;
        }

        if (!user) {
          console.warn("⚠️ No user detected — please log in before confirming payment");
          setStatus("error");
          toast.error("Please log in again to confirm your payment.");
          return;
        }

        console.log("💰 Confirming payment with backend:", {
          sessionId,
          courseId,
          user: user.email,
        });

        const res = await axiosInstance.post("/payments/confirm", {
          sessionId,
          courseId,
        });

        console.log("🔍 Backend response:", res.data);

        if (res?.data?.success) {
          console.log("✅ Payment confirmed on backend:", res.data.enrollment || res.data);
          if (!mounted) return;
          setStatus("success");
          setEnrollmentData(res.data.enrollment);
          toast.success("Payment confirmed! Enrollment pending admin approval.");
        } else {
          console.error("❌ Payment confirmation failed:", res?.data);
          if (!mounted) return;
          setStatus("error");
          toast.error(res?.data?.error || "Payment confirmation failed.");
        }
      } catch (err) {
        console.error("❌ Payment confirmation error:", err);
        if (!mounted) return;
        setStatus("error");
        toast.error(err.response?.data?.error || "Error confirming payment. Please contact support.");
      }
    };

    // Fire off confirmation immediately
    confirmPayment();

    // countdown for the "Go to My Courses" button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [sessionId, courseId, user]);

  // Handle button clicks based on user role
  const handleMyCoursesClick = () => {
    console.log("🎯 Navigating to My Courses");
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/my-courses');
    }
  };

  const handleBrowseCoursesClick = () => {
    console.log("🔄 Navigating to MAIN COURSES LISTING page");
    console.log("📍 Should go to: /courses");
    
    // Force navigation to main courses listing page
    navigate('/courses', { 
      state: { fromPayment: true }
    });
  };

  return (
    <div className="payment-success-container">
      <div className="payment-status">
        <div className="success-icon">
          {status === "processing" ? "⏳" : status === "success" ? "🎉" : "❌"}
        </div>
        
        <h1>
          {status === "processing" 
            ? "Processing your payment..." 
            : status === "success" 
            ? "Payment Successful!" 
            : "Payment Confirmation Failed"
          }
        </h1>

        {status === "success" ? (
          <>
            <p>Thank you for your purchase! Your payment has been processed successfully.</p>
            <p>Your enrollment is <strong>pending admin approval</strong> and should appear in the Admin Dashboard for review.</p>
            {enrollmentData && (
              <div className="payment-info">
                <p><strong>Enrollment ID:</strong> {enrollmentData.id}</p>
                <p><strong>Status:</strong> {enrollmentData.approval_status}</p>
              </div>
            )}
          </>
        ) : status === "processing" ? (
          <p>Please wait while we confirm your enrollment...</p>
        ) : (
          <p>We couldn't confirm your payment. Please contact support with your Reference ID below.</p>
        )}

        <hr />

        <div className="processing-message">
          <h3>What happens next?</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Payment Processed</strong>
                <p>Your payment has been securely processed by Stripe.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Enrollment Created</strong>
                <p>If payment succeeded, an enrollment record is created and set to <em>pending</em> for admin approval.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Admin Approval</strong>
                <p>An admin will review and approve the enrollment. Once approved, you'll get access.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="important-notes">
          <h4>📝 Important Notes</h4>
          <ul>
            <li>Enrollment is processed automatically via Stripe webhooks and a backend confirmation endpoint.</li>
            <li>If you do not see your course listed after a few minutes, contact support and provide the Reference ID below.</li>
            <li>Admin approval typically takes 1-2 business hours.</li>
          </ul>
        </div>

        <div className="support-info">
          <p><strong>Reference ID:</strong> {sessionId || "N/A"}</p>
          <p><strong>Course ID:</strong> {courseId || "N/A"}</p>
          {enrollmentData && (
            <p><strong>Enrollment ID:</strong> {enrollmentData.id}</p>
          )}
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={handleMyCoursesClick}>
            {countdown > 0 ? `Go to My Courses (${countdown})` : "Go to My Courses"}
          </button>
          <button 
            className="btn-secondary" 
            onClick={handleBrowseCoursesClick}
          >
            Browse More Courses
          </button>
          <a href="mailto:support@matheclass.com" className="btn-support">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;