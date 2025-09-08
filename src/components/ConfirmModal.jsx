
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ConfirmModal.css";

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setSuccess(true); // Show success animation
    await onConfirm(); // Wait for actual delete to complete
  };

  // Auto-close after animation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        onCancel(); // Also resets modal state in parent
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [success, onCancel]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="confirm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="confirm-modal"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {success ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="success-content"
              >
                <div className="checkmark">✅</div>
                <p>Deleted successfully!</p>
              </motion.div>
            ) : (
              <>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="confirm-actions">
                  <button onClick={onCancel} className="btn-cancel">
                    Cancel
                  </button>
                  <button onClick={handleConfirm} className="btn-confirm">
                    Confirm
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
