
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../utils/axiosInstance";

// Use your existing environment variable name
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentButton = ({ course, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!course || !course.id) {
      onPaymentError?.("Course information is missing");
      return;
    }

    setLoading(true);

    try {
      console.log("Starting payment for course:", course.id);

      // Create checkout session
      const response = await axios.post("/payments/create-checkout-session", {
        courseId: course.id,
      });

      console.log("Checkout session created:", response.data);

      const { sessionId } = response.data;

      if (!sessionId) {
        throw new Error("No session ID received from server");
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        onPaymentError?.(error.message || "Payment redirect failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Payment failed";
      onPaymentError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !course}
      className={`payment-button ${loading ? "loading" : ""}`}
      style={{
        padding: "12px 24px",
        backgroundColor: loading ? "#6c757d" : "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: loading ? "not-allowed" : "pointer",
        width: "100%",
        fontWeight: "bold",
      }}
    >
      {loading ? "Processing..." : `Pay $${course?.price || "0"} with Stripe`}
    </button>
  );
};

export default PaymentButton;