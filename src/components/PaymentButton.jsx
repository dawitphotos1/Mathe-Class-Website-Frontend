// src/components/payments/PaymentButton.jsx

import React, { useState } from "react";
import axiosInstance from '../utils/axiosInstance'; // ✅ adjust path if needed

const PaymentButton = ({ course, onPaymentError, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!course || !course.id) {
        console.error("❌ Missing course or course.id:", course);
        onPaymentError?.(
          "Missing course information. Please refresh and try again."
        );
        return;
      }

      console.log("💳 Starting payment for course:", course.id, course.title);
      setLoading(true);

      // ✅ Include Authorization header manually to ensure backend sees req.user
      const token = localStorage.getItem("token");
      if (!token) {
        onPaymentError?.("You must be logged in to make a payment.");
        setLoading(false);
        return;
      }

      const payload = { courseId: course.id };
      console.log("📦 Sending payload:", payload);

      const response = await axiosInstance.post(
        "/payments/create-session",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Stripe session response:", response.data);

      if (response.data.success && response.data.url) {
        onPaymentSuccess?.();
        window.location.href = response.data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error(response.data.error || "Invalid response from server");
      }
    } catch (error) {
      console.error(
        "❌ Payment creation error:",
        error.response?.data || error.message
      );

      // Handle duplicate payment error from backend
      const errMsg =
        error.response?.data?.error ||
        "Failed to start Stripe checkout. Please try again.";
      onPaymentError?.(errMsg);
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
      style={{
        padding: "15px 30px",
        fontSize: "1.1rem",
        backgroundColor: loading ? "#95a5a6" : "#5469d4",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: loading ? "not-allowed" : "pointer",
        width: "100%",
        fontWeight: "bold",
        transition: "background 0.2s ease",
      }}
    >
      {loading ? (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="spinner"
            style={{
              width: "18px",
              height: "18px",
              border: "2px solid #fff",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              marginRight: "10px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Processing...
        </span>
      ) : (
        `Pay $${parseFloat(course?.price || 0).toFixed(2)} with Stripe`
      )}
    </button>
  );
};

export default PaymentButton;
