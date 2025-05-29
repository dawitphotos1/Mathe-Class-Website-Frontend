
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
      const sessionId = searchParams.get("session_id");
      const token = localStorage.getItem("token");

      if (!sessionId) {
        toast.error("❌ No session ID found. Please try again.");
        return navigate("/courses");
      }

      if (!token) {
        toast.error("❌ Please log in again to confirm enrollment.");
        return navigate("/login");
      }

      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/v1/enrollments/confirm`,
          { session_id: sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "✅ Payment successful! Your enrollment is pending approval."
        );
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (err) {
        console.error("Enrollment confirmation error:", err);
        toast.error(
          "❌ Failed to confirm your enrollment. Please contact support."
        );
        setTimeout(() => navigate("/courses"), 3000);
      }
    };

    confirmEnrollment();
  }, [navigate, searchParams]);

  return (
    <div className="payment-success">
      <h2>🎉 Payment Confirmation</h2>
      <p>Your payment was successful.</p>
      <p>Your course enrollment is now pending teacher/admin approval.</p>
      <p>You will be redirected shortly...</p>
    </div>
  );
};

export default PaymentSuccess;