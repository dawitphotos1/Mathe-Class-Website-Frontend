import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const confirmEnrollment = async () => {
      const sessionId = searchParams.get("session_id");
      console.log("Confirming enrollment for session ID:", sessionId);

      const token = localStorage.getItem("token");

      if (!sessionId) {
        toast.error("❌ No session ID found. Please try again.");
        setError("Missing session ID.");
        return;
      }

      if (!token) {
        toast.error("❌ Please log in again to confirm enrollment.");
        navigate("/login");
        return;
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
          toast.success("✅ Payment successful! Enrollment pending approval.");
          setConfirmed(true);
        } else {
          throw new Error(res.data?.error || "Unknown error");
        }
      } catch (err) {
        console.error("❌ Enrollment confirmation error:", err);

        if (err.response) {
          console.error("🔍 Server responded with:", err.response.data);
          toast.error(
            `❌ ${err.response.data.error || "Enrollment confirmation failed"}`
          );
          setError(err.response.data.error || "Confirmation failed.");
        } else if (err.request) {
          console.error("🔌 No response from server:", err.request);
          toast.error("❌ No response from the server. Please try again.");
          setError("Server did not respond.");
        } else {
          console.error("⚠️ Request setup error:", err.message);
          toast.error("❌ Unexpected error. Please try again.");
          setError("Unexpected error.");
        }
      }
    };

    confirmEnrollment();
  }, [navigate, searchParams]);

  return (
    <div className="payment-success">
      <h2>🎉 Payment Confirmation</h2>
      <p>Your payment was successful.</p>
      <p>Your course enrollment is now pending teacher/admin approval.</p>

      {confirmed ? (
        <>
          <p>You can now explore other courses or return to the dashboard.</p>
          <div style={{ marginTop: "1rem" }}>
            <button className="btn" onClick={() => navigate("/courses")}>
              📚 View Courses
            </button>
            <button className="btn" onClick={() => navigate("/dashboard")} style={{ marginLeft: "10px" }}>
              🏠 Go to Dashboard
            </button>
          </div>
        </>
      ) : error ? (
        <>
          <p className="error-message">⚠️ {error}</p>
          <button className="btn" onClick={() => navigate("/support")}>
            Contact Support
          </button>
        </>
      ) : (
        <p>Verifying your enrollment...</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
