// src/components/PaymentModal.jsx
import React from "react";
import PaymentButton from "./PaymentButton";
import "./PaymentModal.css";

const PaymentModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>Complete Your Enrollment</h2>
        <h3>{course.title}</h3>
        <p>{course.description}</p>

        <div className="payment-details">
          <div className="price">Total: ${parseFloat(course.price).toFixed(2)}</div>
        </div>

        <PaymentButton course={course} onClose={onClose} />

        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
