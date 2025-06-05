
import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

const PaymentSuccess = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const confirmEnrollment = async () => {
      const session_id = params.get("session_id");
      const token = localStorage.getItem("token");

      console.log("Confirming enrollment for session ID:", session_id);

      if (!session_id) {
        toast.error("Missing session ID");
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/payments/confirm`, // ✅ Correct endpoint
          { session_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success(response.data.message || "Enrollment confirmed!");
      } catch (err) {
        console.error("❌ Enrollment confirmation error:", err);
        toast.error(
          err.response?.data?.error || "Enrollment confirmation failed"
        );
      }
    };

    confirmEnrollment();
  }, [params]);

  return (
    <div>
      <h2>🎉 Payment Confirmation</h2>
      <p>Your payment was successful.</p>
      <p>Your course enrollment is now pending teacher/admin approval.</p>
    </div>
  );
};

export default PaymentSuccess;
