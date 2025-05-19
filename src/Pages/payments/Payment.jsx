
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";
import { toast } from "react-toastify";
import "./Payment.css";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const courseDetails = {
  7: { title: "Algebra 1", price: 1200 },
  8: { title: "Algebra 2", price: 1200 },
  9: { title: "Pre-Calculus", price: 1200 },
  10: { title: "Calculus", price: 1250 },
  11: { title: "Geometry & Trigonometry", price: 1250 },
  12: { title: "Statistics & Probability", price: 1250 },
};

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id || !user.email) {
      toast.error("User not logged in or incomplete user data.");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can enroll in courses.");
      navigate("/courses");
      return;
    }

    const course = courseDetails[courseId];
    if (!course) {
      toast.error("Invalid course selected");
      setError("Invalid course selected");
      return;
    }

    setCourseInfo(course);
    setLoading(false);
  }, [courseId, navigate]);

  const handleConfirmPayment = async () => {
    setRedirecting(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        {
          courseId,
          userData: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to initiate payment";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setRedirecting(false);
    }
  };

  if (loading) return <div className="spinner">⏳ Loading course info...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="payment-container">
      <h2>Course Payment</h2>
      <p>
        <strong>Course:</strong> {courseInfo.title}
      </p>
      <p>
        <strong>Price:</strong> ${courseInfo.price.toFixed(2)}
      </p>

      {redirecting ? (
        <div className="spinner">🔁 Redirecting to Stripe...</div>
      ) : (
        <button onClick={handleConfirmPayment} className="btn-pay">
          Pay Now
        </button>
      )}
    </div>
  );
};

export default Payment;
