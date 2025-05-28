


// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     toast.success(
//       "✅ Payment successful! Your enrollment is pending approval."
//     );

//     const timeout = setTimeout(() => {
//       navigate("/dashboard"); // or wherever you want to send the user
//     }, 3000); // 3 seconds delay before redirect

//     return () => clearTimeout(timeout);
//   }, [navigate]);

//   return (
//     <div className="payment-success">
//       <h2>🎉 Payment Confirmation</h2>
//       <p>Your payment was successful.</p>
//       <p>Your course enrollment is pending teacher/admin approval.</p>
//       <p>You will be redirected shortly...</p>
//     </div>
//   );
// };

// export default PaymentSuccess;



import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmEnrollment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          toast.error("No session ID provided");
          navigate("/courses");
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/users/confirm-enrollment`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        toast.success(
          "✅ Payment successful! Your enrollment is pending approval."
        );

        const timeout = setTimeout(() => {
          navigate("/dashboard");
        }, 3000);

        return () => clearTimeout(timeout);
      } catch (err) {
        console.error("Error confirming enrollment:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        toast.error("Failed to confirm enrollment. Please contact support.");
        navigate("/courses");
      }
    };

    confirmEnrollment();
  }, [navigate, searchParams]);

  return (
    <div className="payment-success">
      <h2>🎉 Payment Confirmation</h2>
      <p>Your payment was successful.</p>
      <p>Your course enrollment is pending teacher/admin approval.</p>
      <p>You will be redirected shortly...</p>
    </div>
  );
};

export default PaymentSuccess;