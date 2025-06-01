import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./Payment.css";

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Check if user is logged in and has valid role
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

    // Fetch course information
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/courses/${courseId}`
        );

        if (response.data.success) {
          setCourseInfo({
            id: response.data.id,
            title: response.data.title,
            price: Number(response.data.price), // Ensure price is a number
          });
        } else {
          throw new Error(response.data.error || "Failed to fetch course");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Invalid course selected";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Ensure courseId is valid
    if (courseId) {
      fetchCourse();
    } else {
      setError("Invalid course ID");
      toast.error("Invalid course ID");
      setLoading(false);
    }
  }, [courseId, navigate]);

  const handleConfirmPayment = async () => {
    if (!courseInfo) {
      toast.error("Course information not available");
      return;
    }

    setRedirecting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to proceed with payment");
        navigate("/login");
        return;
      }

      console.log(
        "Payment - Sending request to:",
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`
      );
      console.log("Payment - Payload:", {
        courseId: String(courseId),
        courseName: courseInfo.title,
        coursePrice: courseInfo.price,
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        {
          courseId: String(courseId),
          courseName: courseInfo.title,
          coursePrice: courseInfo.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the URL exists in the response
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No redirect URL received from payment server.");
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
        <button
          onClick={handleConfirmPayment}
          className="btn-pay"
          disabled={redirecting} // Disable button during redirect
        >
          Pay Now
        </button>
      )}
    </div>
  );
};

export default Payment;
