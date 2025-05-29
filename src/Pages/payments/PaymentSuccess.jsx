
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

        if (res.data?.success) {
          toast.success(
            "✅ Payment successful! Your enrollment is pending approval."
          );
          setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          throw new Error(res.data?.error || "Unknown error");
        }
      } catch (err) {
        console.error("❌ Enrollment confirmation error:", err);

        if (err.response) {
          // Server responded with a status other than 2xx
          console.error("🔍 Server responded with:", err.response.data);
          toast.error(
            `❌ ${err.response.data.error || "Enrollment confirmation failed"}`
          );
        } else if (err.request) {
          // Request was made but no response
          console.error("🔌 No response from server:", err.request);
          toast.error(
            "❌ No response from the server. Please try again later."
          );
        } else {
          // Something went wrong setting up the request
          console.error("⚠️ Request setup error:", err.message);
          toast.error("❌ Unexpected error. Please try again.");
        }

        setTimeout(() => navigate("/courses"), 4000);
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
