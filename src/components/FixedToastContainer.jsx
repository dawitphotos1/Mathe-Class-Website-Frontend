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



// src/components/FixedToastContainer.jsx - FIXED VERSION
import React from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom ProgressBar to avoid defaultProps warning
const CustomProgressBar = ({ progress, isRunning, rtl, controlledProgress }) => {
  const width = typeof progress === 'number' ? `${progress}%` : '0%';
  
  return (
    <div 
      className="Toastify__progress-bar" 
      style={{ 
        width: width,
        animationPlayState: isRunning ? 'running' : 'paused',
        direction: rtl ? 'rtl' : 'ltr'
      }}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={typeof progress === 'number' ? Math.round(progress) : 0}
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
      transition={Slide}
      // Pass empty object to avoid defaultProps warning
      closeButton={{}}
      // Use our custom ProgressBar
      progressBar={CustomProgressBar}
    />
  );
};

export { FixedToastContainer };