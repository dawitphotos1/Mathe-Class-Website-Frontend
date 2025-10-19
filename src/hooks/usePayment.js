// // src/hooks/usePayment.js
// import { useState } from "react";
// import { toast } from "react-toastify";

// export const usePayment = () => {
//   const [processing, setProcessing] = useState(false);

//   const createCheckout = async (courseId) => {
//     setProcessing(true);
//     try {
//       // Use absolute URL to your backend
//       const API_BASE =
//         process.env.REACT_APP_API_URL ||
//         "https://mathe-class-website-backend-1.onrender.com/api/v1";
//       const token = localStorage.getItem("token");

//       console.log("🛒 Starting checkout for course:", courseId);
//       console.log("🔗 Using API base:", API_BASE);

//       const response = await fetch(
//         `${API_BASE}/payments/create-checkout-session`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ courseId }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.error || `HTTP error! status: ${response.status}`
//         );
//       }

//       const data = await response.json();
//       console.log("💬 Checkout response:", data);

//       if (data.success && data.url) {
//         // Redirect to Stripe Checkout
//         console.log("🔗 Redirecting to Stripe Checkout");
//         window.location.href = data.url;
//       } else {
//         throw new Error(data.error || "Failed to create checkout session");
//       }
//     } catch (error) {
//       console.error("💥 Checkout error:", error);
//       toast.error("Failed to start payment: " + error.message);
//       throw error;
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return {
//     createCheckout,
//     processing,
//   };
// };



// src/hooks/usePayment.js
import { useState } from 'react';
import { toast } from 'react-toastify';

export const usePayment = () => {
  const [processing, setProcessing] = useState(false);

  const createCheckout = async (courseId) => {
    setProcessing(true);
    try {
      // Use absolute URL to your backend
      const API_BASE = process.env.REACT_APP_API_URL || 'https://mathe-class-website-backend-1.onrender.com/api/v1';
      const token = localStorage.getItem('token');
      
      console.log('🛒 Starting checkout for course:', courseId);
      console.log('🔗 Using API base:', API_BASE);

      const response = await fetch(`${API_BASE}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('💬 Checkout response:', data);
      
      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        console.log('🔗 Redirecting to Stripe Checkout');
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('💥 Checkout error:', error);
      toast.error('Failed to start payment: ' + error.message);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  return {
    createCheckout,
    processing
  };
};