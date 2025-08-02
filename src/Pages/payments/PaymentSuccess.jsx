// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../../config";
// import "./PaymentSuccess.css"; // Make sure this path is correct

// const PaymentSuccess = () => {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("loading");

//   useEffect(() => {
//     const confirmEnrollment = async () => {
//       const session_id = params.get("session_id");
//       const token = localStorage.getItem("token");

//       if (!session_id) {
//         toast.error("Missing session ID");
//         setStatus("error");
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE_URL}/api/v1/payments/confirm`,
//           { session_id },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         toast.success(response.data.message || "Enrollment confirmed!");
//         setStatus("success");

//         // inside PaymentSuccess.jsx success case
//         setTimeout(() => navigate("/my-courses"), 3000);
//       } catch (err) {
//         console.error("❌ Enrollment confirmation error:", err);
//         toast.error(
//           err.response?.data?.error || "Enrollment confirmation failed"
//         );
//         setStatus("error");
//       }
//     };

//     confirmEnrollment();
//   }, [params, navigate]);

//   const handleDashboardRedirect = () => {
//     navigate("/dashboard"); // Adjust this path if needed
//   };

//   const handleRetry = () => {
//     window.location.reload(); // Retry current payment confirmation
//   };

//   return (
//     <div className="payment-success-container">
//       {status === "loading" && (
//         <div className="payment-status-container">
//           <div className="spinner" />
//           <h2>Confirming your payment...</h2>
//           <p className="info-text">Please wait a moment.</p>
//         </div>
//       )}

//       {status === "success" && (
//         <div className="payment-status-container">
//           <div className="success-icon">✅</div>
//           <h2>Payment Confirmed</h2>
//           <div className="success-message">
//             <p>Your payment was successful.</p>
//             <p>Your enrollment is pending teacher/admin approval.</p>
//             <p>You’ll be redirected shortly...</p>
//           </div>
//           <div className="action-buttons">
//             <button className="btn-secondary" onClick={handleDashboardRedirect}>
//               Go to Dashboard
//             </button>
//           </div>
//         </div>
//       )}

//       {status === "error" && (
//         <div className="payment-status-container">
//           <div className="error-icon">❌</div>
//           <h2>Payment Failed</h2>
//           <div className="error-message">
//             <p>We couldn’t confirm your enrollment.</p>
//             <p>Please check your internet or contact support.</p>
//           </div>
//           <div className="action-buttons">
//             <button className="btn-outline" onClick={handleRetry}>
//               Try Again
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const confirmPaymentAndEnrollment = async () => {
      const session_id = params.get("session_id");
      const courseId = params.get("courseId");
      const token = localStorage.getItem("token");

      if (!session_id || !courseId) {
        toast.error("Missing payment details");
        setStatus("error");
        return;
      }

      try {
        // ✅ Step 1: Confirm payment with backend (Stripe validation)
        const paymentRes = await axios.post(
          `${API_BASE_URL}/api/v1/payments/confirm`,
          { session_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!paymentRes.data.success) {
          toast.error(paymentRes.data.error || "Payment not confirmed");
          setStatus("error");
          return;
        }

        // ✅ Step 2: Confirm enrollment (create pending enrollment)
        const enrollmentRes = await axios.post(
          `${API_BASE_URL}/api/v1/enrollments/confirm`,
          { courseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (enrollmentRes.data.success) {
          toast.success("Enrollment request submitted for approval.");
          setStatus("success");
          setTimeout(() => navigate("/my-courses"), 3000);
        } else {
          toast.error(
            enrollmentRes.data.error || "Enrollment confirmation failed."
          );
          setStatus("error");
        }
      } catch (err) {
        console.error("Error:", err);
        toast.error("Something went wrong during confirmation");
        setStatus("error");
      }
    };

    confirmPaymentAndEnrollment();
  }, [params, navigate]);

  const handleDashboardRedirect = () => {
    navigate("/dashboard");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="payment-success-container">
      {status === "loading" && (
        <div className="payment-status-container">
          <div className="spinner" />
          <h2>Confirming your payment...</h2>
          <p className="info-text">Please wait a moment.</p>
        </div>
      )}

      {status === "success" && (
        <div className="payment-status-container">
          <div className="success-icon">✅</div>
          <h2>Payment Confirmed</h2>
          <div className="success-message">
            <p>Your payment was successful.</p>
            <p>Your enrollment is pending teacher/admin approval.</p>
            <p>You’ll be redirected shortly...</p>
          </div>
          <div className="action-buttons">
            <button className="btn-secondary" onClick={handleDashboardRedirect}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="payment-status-container">
          <div className="error-icon">❌</div>
          <h2>Confirmation Failed</h2>
          <div className="error-message">
            <p>We couldn’t confirm your enrollment.</p>
            <p>Please check your internet or contact support.</p>
          </div>
          <div className="action-buttons">
            <button className="btn-outline" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
