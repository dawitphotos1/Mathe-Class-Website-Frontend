// // // src/pages/payment/PaymentSuccess.jsx
// import React, { useState, useEffect } from "react";
// import { useSearchParams, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import axiosInstance from "../../utils/axiosInstance";
// import { toast } from "react-toastify";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const { user } = useAuth();

//   const sessionId = searchParams.get("session_id");
//   const courseId = searchParams.get("course_id");

//   const [status, setStatus] = useState("processing");
//   const [countdown, setCountdown] = useState(10);

//   useEffect(() => {
//     const confirmPayment = async () => {
//       try {
//         if (!sessionId || !courseId) {
//           console.warn("⚠️ Missing session or course ID for confirmation");
//           setStatus("error");
//           return;
//         }

//         if (!user) {
//           console.warn(
//             "⚠️ No user detected — please log in before confirming payment"
//           );
//           setStatus("error");
//           toast.error("Please log in again to confirm your payment.");
//           return;
//         }

//         console.log("💰 Confirming payment with backend:", {
//           sessionId,
//           courseId,
//           user: user.email,
//         });

//         // 🔥 Call backend to confirm the payment and create enrollment
//         const res = await axiosInstance.post("/payment/confirm-payment", {
//           sessionId,
//           courseId,
//         });

//         if (res.data.success) {
//           console.log("✅ Payment confirmed on backend:", res.data.enrollment);
//           setStatus("success");
//           toast.success(
//             "Payment confirmed! Enrollment pending admin approval."
//           );
//         } else {
//           console.error("❌ Payment confirmation failed:", res.data.error);
//           setStatus("error");
//           toast.error(res.data.error || "Payment confirmation failed.");
//         }
//       } catch (err) {
//         console.error("❌ Payment confirmation error:", err);
//         setStatus("error");
//         toast.error("Error confirming payment. Please contact support.");
//       }
//     };

//     confirmPayment();

//     // Countdown for redirect
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [sessionId, courseId, user]);

//   return (
//     <div className="payment-success-container">
//       <div className="payment-status success">
//         <div className="success-icon">✅</div>
//         <h2>
//           {status === "processing"
//             ? "Processing your payment..."
//             : status === "success"
//             ? "Payment Successful!"
//             : "Payment Confirmation Failed"}
//         </h2>

//         <div className="payment-info">
//           {status === "success" ? (
//             <>
//               <p>
//                 <strong>Thank you for your purchase!</strong>
//               </p>
//               <p>Your payment has been processed successfully.</p>
//             </>
//           ) : status === "processing" ? (
//             <p>Please wait while we confirm your enrollment...</p>
//           ) : (
//             <p>We couldn’t confirm your payment. Please contact support.</p>
//           )}
//         </div>

//         <div className="processing-message">
//           <h3>What happens next?</h3>
//           <div className="steps">
//             <div className="step">
//               <span className="step-number">1</span>
//               <div className="step-content">
//                 <strong>Payment Processed</strong>
//                 <p>Your payment has been securely processed by Stripe.</p>
//               </div>
//             </div>
//             <div className="step">
//               <span className="step-number">2</span>
//               <div className="step-content">
//                 <strong>Enrollment Created</strong>
//                 <p>Your enrollment is now pending admin approval.</p>
//               </div>
//             </div>
//             <div className="step">
//               <span className="step-number">3</span>
//               <div className="step-content">
//                 <strong>Access Granted</strong>
//                 <p>
//                   Once approved, you’ll have access to your course materials.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="important-notes">
//           <h4>📝 Important Notes:</h4>
//           <ul>
//             <li>Enrollment confirmation may take 1–2 minutes</li>
//             <li>You’ll receive a confirmation email once approved</li>
//             <li>
//               Check <strong>My Courses</strong> after a few minutes
//             </li>
//             <li>Contact support if you don’t have access soon</li>
//           </ul>
//         </div>

//         <div className="support-info">
//           <p>
//             <strong>Reference ID:</strong> {sessionId}
//           </p>
//           <p>
//             <strong>Course ID:</strong> {courseId}
//           </p>
//           <p>Keep this information for support if needed.</p>
//         </div>

//         <div className="action-buttons">
//           <Link to="/my-courses" className="btn-primary">
//             {countdown > 0
//               ? `Go to My Courses (${countdown})`
//               : "Go to My Courses"}
//           </Link>
//           <Link to="/courses" className="btn-secondary">
//             Browse More Courses
//           </Link>
//           <a
//             href={`mailto:support@matheclass.com?subject=Payment Confirmation&body=Session ID: ${sessionId}%0ACourse ID: ${courseId}%0AUser: ${user?.email}`}
//             className="btn-support"
//           >
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
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("course_id");

  const [status, setStatus] = useState("processing");
  const [countdown, setCountdown] = useState(10);

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

        // NOTE: backend mounts payment routes under /api/v1/payment
        // axiosInstance baseURL is /api/v1 so we call /payment/confirm (we also add alias on backend)
        const res = await axiosInstance.post("/payment/confirm", {
          sessionId,
          courseId,
        });

        if (res?.data?.success) {
          console.log("✅ Payment confirmed on backend:", res.data.enrollment || res.data);
          if (!mounted) return;
          setStatus("success");
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
        toast.error("Error confirming payment. Please contact support.");
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

  return (
    <div className="success-container">
      <div className="info-box">
        <h1>🎉 {status === "processing" ? "Processing your payment..." : status === "success" ? "Payment Successful!" : "Payment Confirmation Failed"}</h1>

        {status === "success" ? (
          <>
            <p>Thank you for your purchase! Your payment has been processed successfully.</p>
            <p>Your enrollment is pending admin approval and should appear in the Admin Dashboard for review.</p>
          </>
        ) : status === "processing" ? (
          <p>Please wait while we confirm your enrollment...</p>
        ) : (
          <p>We couldn’t confirm your payment. Please contact support with your Reference ID below.</p>
        )}

        <hr />

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

        <div className="important-notes">
          <h4>📝 Important Notes</h4>
          <ul>
            <li>Enrollment is processed automatically via Stripe webhooks and a backend confirmation endpoint.</li>
            <li>If you do not see your course listed after a few minutes, contact support and provide the Reference ID below.</li>
            <li>Admin approval typically takes 1–2 business hours.</li>
          </ul>
        </div>

        <div className="support-info">
          <p><strong>Reference ID:</strong> {sessionId || "N/A"}</p>
          <p><strong>Course ID:</strong> {courseId || "N/A"}</p>
        </div>

        <div className="buttons">
          <Link to="/my-courses" className="btn btn-primary">{countdown > 0 ? `Go to My Courses (${countdown})` : "Go to My Courses"}</Link>
          <Link to="/courses" className="btn btn-secondary">Browse More Courses</Link>
          <a href="mailto:support@example.com" className="btn btn-support">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
