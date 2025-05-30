// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../../config";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [confirmed, setConfirmed] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const confirmEnrollment = async () => {
//       const sessionId = searchParams.get("session_id");
//       console.log("Confirming enrollment for session ID:", sessionId);

//       const token = localStorage.getItem("token");

//       if (!sessionId) {
//         toast.error("❌ No session ID found. Please try again.");
//         setError("Missing session ID.");
//         return;
//       }

//       if (!token) {
//         toast.error("❌ Please log in again to confirm enrollment.");
//         navigate("/login");
//         return;
//       }

//       try {
//         const res = await axios.post(
//           `${API_BASE_URL}/api/v1/enrollments/confirm`,
//           { session_id: sessionId },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (res.data?.success) {
//           toast.success("✅ Payment successful! Enrollment pending approval.");
//           setConfirmed(true);
//         } else {
//           throw new Error(res.data?.error || "Unknown error");
//         }
//       } catch (err) {
//         console.error("❌ Enrollment confirmation error:", err);

//         if (err.response) {
//           console.error("🔍 Server responded with:", err.response.data);
//           toast.error(
//             `❌ ${err.response.data.error || "Enrollment confirmation failed"}`
//           );
//           setError(err.response.data.error || "Confirmation failed.");
//         } else if (err.request) {
//           console.error("🔌 No response from server:", err.request);
//           toast.error("❌ No response from the server. Please try again.");
//           setError("Server did not respond.");
//         } else {
//           console.error("⚠️ Request setup error:", err.message);
//           toast.error("❌ Unexpected error. Please try again.");
//           setError("Unexpected error.");
//         }
//       }
//     };

//     confirmEnrollment();
//   }, [navigate, searchParams]);

//   return (
//     <div className="payment-success">
//       <h2>🎉 Payment Confirmation</h2>
//       <p>Your payment was successful.</p>
//       <p>Your course enrollment is now pending teacher/admin approval.</p>

//       {confirmed ? (
//         <>
//           <p>You can now explore other courses or return to the dashboard.</p>
//           <div style={{ marginTop: "1rem" }}>
//             <button className="btn" onClick={() => navigate("/courses")}>
//               📚 View Courses
//             </button>
//             <button className="btn" onClick={() => navigate("/dashboard")} style={{ marginLeft: "10px" }}>
//               🏠 Go to Dashboard
//             </button>
//           </div>
//         </>
//       ) : error ? (
//         <>
//           <p className="error-message">⚠️ {error}</p>
//           <button className="btn" onClick={() => navigate("/support")}>
//             Contact Support
//           </button>
//         </>
//       ) : (
//         <p>Verifying your enrollment...</p>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;




import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({
    loading: true,
    confirmed: false,
    error: null,
    courseInfo: null,
  });

  useEffect(() => {
    const confirmEnrollment = async () => {
      const sessionId = searchParams.get("session_id");
      const token = localStorage.getItem("token");

      if (!sessionId) {
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: "Missing session ID. Please try again.",
        }));
        toast.error("❌ No session ID found. Please try again.");
        return;
      }

      if (!token) {
        toast.error("❌ Please log in again to confirm enrollment.");
        navigate("/login");
        return;
      }

      try {
        // First verify the payment session
        const sessionRes = await axios.get(
          `${API_BASE_URL}/api/v1/payments/session/${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (sessionRes.data.payment_status !== "paid") {
          throw new Error("Payment not completed");
        }

        // Then confirm enrollment
        const enrollmentRes = await axios.post(
          `${API_BASE_URL}/api/v1/enrollments/confirm`,
          { session_id: sessionId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (enrollmentRes.data?.success) {
          setStatus((prev) => ({
            ...prev,
            loading: false,
            confirmed: true,
            courseInfo: enrollmentRes.data.course,
          }));
          toast.success("✅ Payment successful! Enrollment pending approval.");
        } else {
          throw new Error(
            enrollmentRes.data?.error || "Enrollment confirmation failed"
          );
        }
      } catch (err) {
        console.error("❌ Enrollment confirmation error:", err);

        let errorMessage = "An error occurred during enrollment confirmation";
        if (err.response) {
          errorMessage = err.response.data.error || errorMessage;
          console.error("🔍 Server responded with:", err.response.data);
        } else if (err.request) {
          errorMessage = "No response from server. Please try again.";
          console.error("🔌 No response from server:", err.request);
        } else {
          errorMessage = err.message || errorMessage;
          console.error("⚠️ Request setup error:", err.message);
        }

        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        toast.error(`❌ ${errorMessage}`);
      }
    };

    confirmEnrollment();
  }, [navigate, searchParams]);

  if (status.loading) {
    return (
      <div className="payment-status-container">
        <div className="spinner">
          ⏳ Verifying your payment and enrollment...
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      {status.confirmed ? (
        <>
          <div className="success-icon">🎉</div>
          <h2>Payment Confirmed!</h2>
          <div className="success-message">
            <p>
              Your payment for{" "}
              <strong>{status.courseInfo?.title || "the course"}</strong> was
              successful.
            </p>
            <p>Your enrollment is now pending teacher/admin approval.</p>
            <p>You'll receive an email once your enrollment is approved.</p>
          </div>

          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/courses")}
            >
              Browse More Courses
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/my-courses")}
            >
              View My Courses
            </button>
            {status.courseInfo?.id && (
              <button
                className="btn-outline"
                onClick={() => navigate(`/courses/${status.courseInfo.id}`)}
              >
                View Course Details
              </button>
            )}
          </div>
        </>
      ) : status.error ? (
        <>
          <div className="error-icon">❌</div>
          <h2>Payment Verification Failed</h2>
          <div className="error-message">
            <p>{status.error}</p>
            <p>
              Please contact support if you were charged but didn't receive
              access.
            </p>
          </div>

          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/support")}
            >
              Contact Support
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/courses")}
            >
              Back to Courses
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PaymentSuccess;
