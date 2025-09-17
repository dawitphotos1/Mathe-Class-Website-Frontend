
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // switched to axiosInstance
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

    if (!courseId) {
      const errMsg = "Invalid course ID";
      setError(errMsg);
      toast.error(errMsg);
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/courses/${courseId}`);

        if (response.data.success) {
          setCourseInfo({
            id: response.data.id,
            title: response.data.title,
            price: Number(response.data.price),
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

    fetchCourse();
  }, [courseId, navigate]);

  const handleConfirmPayment = async () => {
    if (!courseInfo) {
      toast.error("Course information not available");
      return;
    }

    setRedirecting(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/payments/create-checkout-session",
        {
          courseId: String(courseId),
          courseName: courseInfo.title,
          coursePrice: courseInfo.price,
        }
      );

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
          disabled={redirecting}
        >
          Pay Now
        </button>
      )}
    </div>
  );
};

export default Payment;
