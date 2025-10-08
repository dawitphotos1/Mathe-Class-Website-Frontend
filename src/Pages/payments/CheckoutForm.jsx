// /Pages/payments/CheckoutForm.jsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ course }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setStatus(`❌ Error: ${error.message}`);
    } else {
      // Simulate success
      setStatus("✅ Payment successful! Enrollment confirmed.");
      console.log("PaymentMethod:", paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe}>
        Pay with Test Card
      </button>
      <div>{status}</div>
    </form>
  );
};

export default CheckoutForm;
