
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
        const token = localStorage.getItem("token");
        const fullUrl = window.location.href;
        console.log("PaymentSuccess: Confirming enrollment", {
          fullUrl,
          session_id: sessionId,
          hasToken: !!token,
          tokenPrefix: token ? token.substring(0, 20) + "..." : null,
          searchParams: Object.fromEntries(searchParams),
        });

        if (!sessionId) {
          console.log("PaymentSuccess: No session_id in URL query");
          toast.error("No session ID provided. Please try again.");
          navigate("/courses");
          return;
        }

        if (!token) {
          console.log("PaymentSuccess: No JWT token found");
          toast.error("Please log in again.");
          navigate("/login");
          return;
        }

        const payload = { session_id: sessionId };
        console.log("PaymentSuccess: Sending payload to backend:", payload);

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/users/confirm-enrollment`,
          payload,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("PaymentSuccess: Enrollment confirmed:", response.data);
        toast.success(
          "✅ Payment successful! Your enrollment is pending approval."
        );

        const timeout = setTimeout(() => {
          navigate("/dashboard");
        }, 3000);

        return () => clearTimeout(timeout);
      } catch (err) {
        console.error("PaymentSuccess: Error confirming enrollment:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          request: err.config,
        });
        toast.error(
          "❌ Failed to confirm your enrollment. Please contact support."
        );
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