// //payments/PaymentCancel.jsx
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const PaymentCancel = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     toast.info("Payment was canceled ❌");
//     const timer = setTimeout(() => navigate("/courses"), 4000);
//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div className="payment-cancel-page" style={{ padding: "2rem" }}>
//       <h1>Payment Canceled</h1>
//       <p>
//         Your payment was not completed. If this was a mistake, you can try
//         again.
//       </p>
//     </div>
//   );
// };

// export default PaymentCancel;




// /payments/PaymentCancel.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./PaymentSuccess.css"; // reuse styles

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.info("❌ Payment was canceled.");
    const timer = setTimeout(() => navigate("/courses"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-success-container">
      <div className="payment-status-container error-section">
        <div className="error-icon">⚠️</div>
        <h1>Payment Canceled</h1>
        <p>Your payment was not completed. You can retry anytime.</p>

        <div className="action-buttons">
          <button className="btn-primary" onClick={() => navigate("/courses")}>
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
