
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success(
      "✅ Payment successful! Your enrollment is pending approval."
    );

    const timeout = setTimeout(() => {
      navigate("/dashboard"); // or "/courses", depending on UX
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="payment-success">
      <h2>🎉 Payment Confirmation</h2>
      <p>Your payment was successful.</p>
      <p>Your course enrollment is now pending teacher/admin approval.</p>
      <p>You will be redirected shortly...</p>
    </div>
  );
};

export default PaymentSuccess;
