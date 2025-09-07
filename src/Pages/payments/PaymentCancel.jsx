import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.info("Payment was canceled ❌");
    const timer = setTimeout(() => navigate("/courses"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-cancel-page" style={{ padding: "2rem" }}>
      <h1>Payment Canceled</h1>
      <p>
        Your payment was not completed. If this was a mistake, you can try
        again.
      </p>
    </div>
  );
};

export default PaymentCancel;
