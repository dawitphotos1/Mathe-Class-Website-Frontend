// // src/components/PaymentModal.jsx
// import React from "react";
// import PaymentButton from "./PaymentButton";
// import "./PaymentModal.css";

// const PaymentModal = ({ course, onClose }) => {
//   if (!course) return null;

//   return (
//     <div className="payment-modal-overlay">
//       <div className="payment-modal">
//         <h2>Complete Your Enrollment</h2>
//         <h3>{course.title}</h3>
//         <p>{course.description}</p>

//         <div className="payment-details">
//           <div className="price">Total: ${parseFloat(course.price).toFixed(2)}</div>
//         </div>

//         <PaymentButton course={course} onClose={onClose} />

//         <button className="btn-cancel" onClick={onClose}>
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentModal;




import React from "react";
import "./PaymentModal.css";
import PaymentButton from "./PaymentButton";

const PaymentModal = ({ show, course, onClose }) => {
  if (!show || !course) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div
        className="payment-modal"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="payment-modal-header">
          <h2>Complete Your Enrollment</h2>
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="payment-modal-content">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-description">
            {course.description || "No course description available."}
          </p>

          <div className="payment-summary">
            <p>
              <strong>Total:</strong>{" "}
              <span className="course-price">
                ${parseFloat(course.price || 0).toFixed(2)}
              </span>
            </p>
          </div>

          {/* ✅ Stripe Payment Button */}
          <PaymentButton course={course} />

          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
