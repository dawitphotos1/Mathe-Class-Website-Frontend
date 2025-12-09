// // src/components/FixedToastContainer.jsx
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const FixedToastContainer = () => {
//   return (
//     <ToastContainer
//       position="top-right"
//       autoClose={5000}
//       hideProgressBar={false}
//       newestOnTop={false}
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover
//       theme="light"
//     />
//   );
// };

// // Also update ProgressBar if you're using it
// const FixedProgressBar = ({ progress }) => {
//   return (
//     <div className="Toastify__progress-bar" style={{ width: `${progress}%` }} />
//   );
// };

// export { FixedToastContainer, FixedProgressBar };




// src/components/FixedToastContainer.jsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom ProgressBar component to avoid defaultProps warning
const FixedProgressBar = ({ progress, rtl, controlledProgress, isRunning, ariaLabel = "progress bar" }) => {
  return (
    <div 
      className="Toastify__progress-bar" 
      style={{ 
        width: `${progress}%`,
        direction: rtl ? 'rtl' : 'ltr'
      }}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
    />
  );
};

const FixedToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      // Override default components to avoid warnings
      // We'll handle progress bar separately if needed
    />
  );
};

export { FixedToastContainer, FixedProgressBar };