
// src/components/PaymentButton.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentButton = ({ course }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!course || !course.id) {
      toast.error("Missing course ID");
      return;
    }

    setLoading(true);
    try {
      console.log("💳 Starting payment for course:", course.id);

      const response = await axiosInstance.post(
        "/payments/create-checkout-session",
        { courseId: course.id }
      );

      if (response.data?.sessionId) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        toast.error("Could not start payment session");
      }
    } catch (error) {
      console.error("❌ Payment error:", error);
      toast.error(
        error.response?.data?.error || "Failed to start checkout session"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn-primary"
      disabled={loading}
      onClick={handlePayment}
    >
      {loading ? "Processing..." : `Pay $${course.price} with Stripe`}
    </button>
  );
};

export default PaymentButton;
