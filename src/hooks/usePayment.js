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
      console.log('🔑 Token available:', !!token);

      const response = await fetch(`${API_BASE}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      console.log('📡 Response status:', response.status);

      // Try to get more detailed error information
      if (!response.ok) {
        let errorDetails;
        try {
          errorDetails = await response.json();
          console.error('❌ Backend error details:', errorDetails);
        } catch (parseError) {
          const textError = await response.text();
          console.error('❌ Backend error (text):', textError);
          errorDetails = { error: textError || `HTTP error! status: ${response.status}` };
        }
        
        throw new Error(errorDetails.error || `Payment failed with status: ${response.status}`);
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
      
      // Provide more specific error messages
      let userMessage = 'Failed to start payment';
      if (error.message.includes('500')) {
        userMessage = 'Payment system is temporarily unavailable. Please try again later.';
      } else if (error.message.includes('401')) {
        userMessage = 'Please log in again to continue with payment.';
      } else if (error.message.includes('Stripe')) {
        userMessage = 'Payment service error. Please contact support.';
      }
      
      toast.error(userMessage);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  // Test Stripe connection
  const testStripeConnection = async () => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'https://mathe-class-website-backend-1.onrender.com/api/v1';
      const token = localStorage.getItem('token');
      
      console.log('🧪 Testing Stripe connection...');
      
      const response = await fetch(`${API_BASE}/payments/debug/stripe`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Debug endpoint failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🧪 Stripe debug:', data);
      return data;
    } catch (error) {
      console.error('❌ Stripe debug failed:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    createCheckout,
    testStripeConnection,
    processing
  };
};