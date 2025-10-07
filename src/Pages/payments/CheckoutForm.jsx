// // /Pages/payments/CheckoutForm.jsx
// import React, { useState } from "react";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// const CheckoutForm = ({ course }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [status, setStatus] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("Processing...");

//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card: elements.getElement(CardElement),
//     });

//     if (error) {
//       setStatus(`❌ Error: ${error.message}`);
//     } else {
//       // Simulate success
//       setStatus("✅ Payment successful! Enrollment confirmed.");
//       console.log("PaymentMethod:", paymentMethod);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement options={{ hidePostalCode: true }} />
//       <button type="submit" disabled={!stripe}>
//         Pay with Test Card
//       </button>
//       <div>{status}</div>
//     </form>
//   );
// };

// export default CheckoutForm;






import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const CheckoutForm = ({ course, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment system not ready");
      return;
    }

    setProcessing(true);

    try {
      // Create payment session
      const { data } = await axiosInstance.post(
        "/payments/create-checkout-session",
        {
          courseId: course.id,
        }
      );

      if (data.success && data.sessionId) {
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          toast.error(result.error.message);
        }
      } else {
        toast.error("Failed to create payment session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-section">
        <h3>Pay with Test Card</h3>
        <p>
          Use test card: <strong>4242 4242 4242 4242</strong>
        </p>
        <p>Any future date / Any CVC / Any ZIP</p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="pay-button"
      >
        {processing
          ? "Processing..."
          : `Pay $${parseFloat(course.price).toFixed(2)}`}
      </button>

      <div className="test-cards">
        <h4>Test Cards:</h4>
        <ul>
          <li>
            <strong>4242 4242 4242 4242</strong> - Visa (success)
          </li>
          <li>
            <strong>4000 0000 0000 0002</strong> - Visa (declined)
          </li>
          <li>
            <strong>5555 5555 5555 4444</strong> - Mastercard
          </li>
        </ul>
      </div>
    </form>
  );
};

export default CheckoutForm;