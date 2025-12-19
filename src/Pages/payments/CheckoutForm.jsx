
// /Pages/payments/CheckoutForm.jsx
import React, { useState } from "react";
import axiosInstance from '../../utils/axiosInstance';
import "./CheckoutForm.css";


const CheckoutForm = ({ courseId, courseTitle, price }) => {
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (processing) return;
    setProcessing(true);
    setMessage("Creating secure checkout session...");

    try {
      // ✅ Call backend to create Stripe Checkout session
      const { data } = await axiosInstance.post("/payments/create-checkout-session", {
        courseId,
      });

      if (data?.success && data?.url) {
        console.log("✅ Redirecting to Stripe:", data.url);
        window.location.href = data.url; // Redirect once
      } else {
        console.error("❌ Invalid response from server:", data);
        setMessage("Error: Payment service unavailable. Please try again later.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("🔥 Checkout session error:", err.response || err);
      if (err.response?.status === 401) {
        setMessage("You must be logged in to enroll.");
      } else {
        setMessage("Payment initialization failed. Please try again later.");
      }
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-form">
      <form onSubmit={handleCheckout}>
        <h3>Enroll in {courseTitle}</h3>
        <p>Course Price: ${price?.toFixed(2)}</p>

        <button
          type="submit"
          className="btn-primary"
          disabled={processing}
        >
          {processing ? "Processing..." : `Enroll Now - $${price?.toFixed(2)}`}
        </button>

        {message && <p className="status-message">{message}</p>}
      </form>
    </div>
  );
};

export default CheckoutForm;
