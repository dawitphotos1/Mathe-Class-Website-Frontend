// Frontend: payment-success.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

const PaymentSuccess = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const confirmEnrollment = async () => {
      const session_id = params.get("session_id");
      const token = localStorage.getItem("token");

      if (!session_id) return toast.error("Missing session ID");

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/payments/confirm`,
          { session_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(response.data.message || "Enrollment confirmed!");
      } catch (err) {
        toast.error(err.response?.data?.error || "Enrollment confirmation failed");
      }
    };

    confirmEnrollment();
  }, [params]);

  return <div>Thank you! Your payment was successful.</div>;
};

export default PaymentSuccess;
