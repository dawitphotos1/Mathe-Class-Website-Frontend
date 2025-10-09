
// // src/components/PaymentButton.jsx
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// const PaymentButton = ({ course }) => {
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async () => {
//     if (!course || !course.id) {
//       toast.error("Missing course ID");
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log("💳 Starting payment for course:", course.id);

//       const response = await axiosInstance.post(
//         "/payments/create-checkout-session",
//         { courseId: course.id }
//       );

//       if (response.data?.sessionId) {
//         const stripe = await stripePromise;
//         await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
//       } else {
//         toast.error("Could not start payment session");
//       }
//     } catch (error) {
//       console.error("❌ Payment error:", error);
//       toast.error(
//         error.response?.data?.error || "Failed to start checkout session"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       className="btn-primary"
//       disabled={loading}
//       onClick={handlePayment}
//     >
//       {loading ? "Processing..." : `Pay $${course.price} with Stripe`}
//     </button>
//   );
// };

// export default PaymentButton;



// src/components/payments/PaymentButton.jsx
import React from "react";
import axiosInstance from "../utils/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentButton = ({ course }) => {
  const handlePayment = async () => {
    try {
      if (!course?.id) {
        toast.error("Course ID missing. Cannot start payment.");
        console.error("❌ No course ID provided:", course);
        return;
      }

      console.log("💳 Starting payment for course:", course.id);

      const stripe = await stripePromise;
      if (!stripe) {
        toast.error("Stripe failed to load. Please refresh and try again.");
        return;
      }

      // ✅ Send courseId in body
      const response = await axiosInstance.post("/payments/create-checkout-session", {
        courseId: course.id,
      });

      if (!response.data || !response.data.url) {
        toast.error("Payment session not created. Please try again.");
        console.error("❌ Invalid response from backend:", response.data);
        return;
      }

      // ✅ Redirect user to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("❌ Payment creation error:", error);
      const message =
        error.response?.data?.error ||
        "Failed to start payment. Please try again.";
      toast.error(message);
    }
  };

  return (
    <button
      className="btn-primary"
      onClick={handlePayment}
      style={{
        width: "100%",
        padding: "12px 20px",
        fontSize: "1rem",
        fontWeight: "600",
        borderRadius: "10px",
        marginTop: "10px",
      }}
    >
      Enroll Now – ${course?.price || "0"}
    </button>
  );
};

export default PaymentButton;
