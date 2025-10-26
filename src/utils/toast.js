// // src/utils/toast.js
// import { toast } from "react-toastify";

// // Safe toast functions
// export const showToast = {
//   success: (message) => {
//     try {
//       toast.success(message, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } catch (error) {
//       console.log("✅", message);
//     }
//   },

//   error: (message) => {
//     try {
//       toast.error(message, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } catch (error) {
//       console.log("❌", message);
//     }
//   },

//   warning: (message) => {
//     try {
//       toast.warning(message, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } catch (error) {
//       console.log("⚠️", message);
//     }
//   },

//   info: (message) => {
//     try {
//       toast.info(message, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } catch (error) {
//       console.log("ℹ️", message);
//     }
//   },
// };

// export default showToast;



// src/utils/toast.js
import { toast } from 'react-toastify';

// Safe toast functions that prevent the removalReason error
export const showToast = {
  success: (message, options = {}) => {
    try {
      if (typeof toast !== 'function' || !toast.success) {
        console.log('✅', message);
        return;
      }
      
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        ...options
      });
    } catch (error) {
      console.log('✅', message);
    }
  },

  error: (message, options = {}) => {
    try {
      if (typeof toast !== 'function' || !toast.error) {
        console.log('❌', message);
        return;
      }
      
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        ...options
      });
    } catch (error) {
      console.log('❌', message);
    }
  },

  warning: (message, options = {}) => {
    try {
      if (typeof toast !== 'function' || !toast.warning) {
        console.log('⚠️', message);
        return;
      }
      
      toast.warning(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        ...options
      });
    } catch (error) {
      console.log('⚠️', message);
    }
  },

  info: (message, options = {}) => {
    try {
      if (typeof toast !== 'function' || !toast.info) {
        console.log('ℹ️', message);
        return;
      }
      
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        ...options
      });
    } catch (error) {
      console.log('ℹ️', message);
    }
  }
};

export default showToast;