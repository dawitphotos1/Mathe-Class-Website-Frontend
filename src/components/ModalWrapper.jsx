
// ✅ Shared UI Component: ModalWrapper.jsx
import React from "react";
import { motion } from "framer-motion";

const ModalWrapper = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-400"
        >
          ✕
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default ModalWrapper;
