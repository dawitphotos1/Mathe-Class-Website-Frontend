import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("Verifying your payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEnrollment = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );

      if (!sessionId) {
        setStatus("Missing session ID.");
        return;
      }

      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/users/confirm-enrollment`,
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success("Enrollment confirmed and pending approval ✅");
        setStatus(
          "✅ Your enrollment has been submitted for teacher approval."
        );
        setTimeout(() => navigate("/courses"), 4000); // redirect after success
      } catch (err) {
        console.error("Error confirming enrollment:", err);
        toast.error("Failed to confirm enrollment ❌");
        setStatus("❌ Failed to confirm your enrollment.");
      }
    };

    confirmEnrollment();
  }, [navigate]);

  return (
    <div className="payment-success-page" style={{ padding: "2rem" }}>
      <h1>Payment Confirmation</h1>
      <p>{status}</p>
    </div>
  );
};

export default PaymentSuccess;
