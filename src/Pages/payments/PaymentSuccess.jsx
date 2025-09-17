import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    const session_id = params.get("session_id");
    const courseId = params.get("courseId");
    const token = localStorage.getItem("token");

    if (!session_id || !courseId) {
      toast.error("Missing payment details");
      if (isMounted) setStatus("error");
      return;
    }

    const confirmPaymentAndEnrollment = async () => {
      try {
        const paymentRes = await axiosInstance.post(
          "/api/v1/payments/confirm",
          { session_id }
        );
        if (!paymentRes.data.success) {
          toast.error(paymentRes.data.error || "Payment not confirmed");
          if (isMounted) setStatus("error");
          return;
        }

        const enrollmentRes = await axiosInstance.post(
          "/api/v1/enrollments/confirm",
          { courseId }
        );

        if (enrollmentRes.data.success) {
          toast.success("Enrollment request submitted for approval.");
          if (isMounted) {
            setStatus("success");
            setTimeout(() => navigate("/my-courses"), 3000);
          }
        } else {
          toast.error(
            enrollmentRes.data.error || "Enrollment confirmation failed."
          );
          if (isMounted) setStatus("error");
        }
      } catch (err) {
        console.error("Error:", err);
        toast.error("Something went wrong during confirmation");
        if (isMounted) setStatus("error");
      }
    };

    confirmPaymentAndEnrollment();

    return () => {
      isMounted = false;
    };
  }, [params, navigate]);

  const handleDashboardRedirect = () => navigate("/dashboard");
  const handleRetry = () => window.location.reload();

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
