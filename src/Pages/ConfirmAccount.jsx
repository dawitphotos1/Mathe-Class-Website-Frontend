// src/pages/ConfirmAccount.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ConfirmAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function confirm() {
      try {
        if (!token) {
          setStatus("error");
          setMessage("No confirmation token found");
          return;
        }

        // Use environment variable with fallback
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
        
        const response = await axios.get(
          `${apiUrl}/auth/confirm-account?token=${token}`,
          {
            timeout: 15000,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && response.data.success) {
          setStatus("success");
          setMessage(response.data.message || "Account confirmed successfully!");
          
          // Auto-redirect after 5 seconds
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          setStatus("error");
          setMessage(response.data?.error || "Confirmation failed");
        }
      } catch (error) {
        console.error("Account confirmation error:", error);
        setStatus("error");
        
        if (error.response) {
          setMessage(error.response.data?.error || `Server error: ${error.response.status}`);
        } else if (error.request) {
          setMessage("No response from server. Please check your connection.");
        } else {
          setMessage(error.message || "An unexpected error occurred");
        }
      }
    }

    if (token) {
      confirm();
    } else {
      setStatus("error");
      setMessage("Invalid confirmation link - missing token");
    }
  }, [token, navigate]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirming Your Account</h2>
          <p className="text-gray-600">Please wait while we verify your account...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Confirmed!</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            You will be redirected to login in 5 seconds...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmation Failed</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="w-full py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Contact Support
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}