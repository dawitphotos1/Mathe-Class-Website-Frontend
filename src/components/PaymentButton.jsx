// src/components/payments/PaymentButton.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const PaymentButton = ({ course, onPaymentError, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!course || !course.id) {
        console.error("❌ No course or course.id found:", course);
        onPaymentError?.("Missing course information. Please refresh and try again.");
        return;
      }

      console.log("💳 Starting payment for course:", course.id, course.title);

      setLoading(true);

      const payload = { courseId: course.id };
      console.log("📦 Sending payload to backend:", payload);

      // ✅ CHANGE THIS LINE - use the correct endpoint
      const response = await axiosInstance.post(
        "/payments/create-session", // ✅ Changed from "/payments/create-checkout-session"
        payload
      );

      console.log("✅ Checkout session created:", response.data);

      if (response.data.success && response.data.url) {
        // Call success callback if provided
        onPaymentSuccess?.();
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        throw new Error(response.data.error || "Invalid response from server");
      }
    } catch (error) {
      console.error("❌ Payment creation error:", error);
      console.error("Error details:", error.response?.data);
      
      const errMsg = error.response?.data?.error || "Failed to start Stripe checkout";
      onPaymentError?.(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="stripe-pay-button"
      style={{
        padding: "15px 30px",
        fontSize: "1.1rem",
        backgroundColor: loading ? "#95a5a6" : "#5469d4",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: loading ? "not-allowed" : "pointer",
        width: "100%",
        fontWeight: "bold"
      }}
    >
      {loading
        ? "Processing..."
        : `Pay $${parseFloat(course?.price || 0).toFixed(2)} with Stripe`}
    </button>
  );
};

export default PaymentButton;