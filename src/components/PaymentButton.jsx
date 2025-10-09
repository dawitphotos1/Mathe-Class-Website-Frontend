
// src/components/payments/PaymentButton.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const PaymentButton = ({ course }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!course || !course.id) {
        console.error("❌ No course or course.id found:", course);
        alert("Missing course information. Please refresh and try again.");
        return;
      }

      console.log("💳 Starting payment for course:", course.id, course.title);

      setLoading(true);

      const payload = { courseId: course.id };
      console.log("📦 Sending payload to backend:", payload);

      const response = await axiosInstance.post(
        "/payments/create-checkout-session",
        payload
      );

      console.log("✅ Checkout session created:", response.data);

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        alert("Stripe session creation failed.");
      }
    } catch (error) {
      console.error("❌ Payment creation error:", error);
      const errMsg =
        error.response?.data?.error || "Failed to start Stripe checkout";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="stripe-pay-button"
    >
      {loading
        ? "Processing..."
        : `Pay $${parseFloat(course?.price || 0).toFixed(2)} with Stripe`}
    </button>
  );
};

export default PaymentButton;
