
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance"; // switched to axiosInstance
// import { toast } from "react-toastify";
// import "./Payment.css";

// const Payment = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [courseInfo, setCourseInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [redirecting, setRedirecting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user || !user.id || !user.email) {
//       toast.error("User not logged in or incomplete user data.");
//       navigate("/login");
//       return;
//     }

//     if (user.role !== "student") {
//       toast.error("Only students can enroll in courses.");
//       navigate("/courses");
//       return;
//     }

//     if (!courseId) {
//       const errMsg = "Invalid course ID";
//       setError(errMsg);
//       toast.error(errMsg);
//       setLoading(false);
//       return;
//     }

//     const fetchCourse = async () => {
//       try {
//         const response = await axiosInstance.get(`/api/v1/courses/${courseId}`);

//         if (response.data.success) {
//           setCourseInfo({
//             id: response.data.id,
//             title: response.data.title,
//             price: Number(response.data.price),
//           });
//         } else {
//           throw new Error(response.data.error || "Failed to fetch course");
//         }
//       } catch (err) {
//         const errorMessage =
//           err.response?.data?.error || "Invalid course selected";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [courseId, navigate]);

//   const handleConfirmPayment = async () => {
//     if (!courseInfo) {
//       toast.error("Course information not available");
//       return;
//     }

//     setRedirecting(true);
//     try {
//       const response = await axiosInstance.post(
//         "/api/v1/payments/create-checkout-session",
//         {
//           courseId: String(courseId),
//           courseName: courseInfo.title,
//           coursePrice: courseInfo.price,
//         }
//       );

//       if (response.data?.url) {
//         window.location.href = response.data.url;
//       } else {
//         throw new Error("No redirect URL received from payment server.");
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.error || "Failed to initiate payment";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setRedirecting(false);
//     }
//   };

//   if (loading) return <div className="spinner">⏳ Loading course info...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="payment-container">
//       <h2>Course Payment</h2>
//       <p>
//         <strong>Course:</strong> {courseInfo.title}
//       </p>
//       <p>
//         <strong>Price:</strong> ${courseInfo.price.toFixed(2)}
//       </p>

//       {redirecting ? (
//         <div className="spinner">🔁 Redirecting to Stripe...</div>
//       ) : (
//         <button
//           onClick={handleConfirmPayment}
//           className="btn-pay"
//           disabled={redirecting}
//         >
//           Pay Now
//         </button>
//       )}
//     </div>
//   );
// };

// export default Payment;




// src/Pages/payment/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import "./Payment.css";

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/courses/${courseId}`);
      setCourse(response.data);
    } catch (err) {
      console.error("Error fetching course:", err);
      // If the above fails, try the payments endpoint
      try {
        const response = await axios.get(`/payments/${courseId}`);
        setCourse(response.data.course);
      } catch (err2) {
        console.error("Error fetching course from payments:", err2);
        alert("Failed to load course information");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRealPayment = async () => {
    if (!user) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: `/payment/${courseId}` } });
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.post("/payments/create-checkout-session", {
        courseId: courseId
      });

      // Redirect to Stripe Checkout
      if (response.data.sessionId) {
        window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  const handleFakePayment = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/payment/${courseId}` } });
      return;
    }

    try {
      setProcessing(true);
      
      // Create a fake checkout session
      const response = await axios.post("/payments/create-checkout-session", {
        courseId: courseId
      });

      // Simulate successful payment and redirect to success page
      setTimeout(() => {
        navigate(`/payment-success?session_id=fake_session_${Date.now()}&courseId=${courseId}`);
      }, 1500);

    } catch (err) {
      console.error("Fake payment error:", err);
      alert("Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading">Loading payment information...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="payment-container">
        <div className="error">Course not found</div>
        <Link to="/courses" className="btn-back">← Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Enroll in {course.title}</h1>
        <p>Complete your enrollment by making the payment</p>
      </div>

      <div className="payment-content">
        <div className="course-summary">
          <h3>Course Summary</h3>
          <div className="summary-item">
            <span>Course:</span>
            <span>{course.title}</span>
          </div>
          <div className="summary-item">
            <span>Description:</span>
            <span>{course.description || "No description available"}</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>${course.price}</span>
          </div>
        </div>

        <div className="payment-options">
          <h3>Payment Methods</h3>
          
          {/* Real Stripe Payment */}
          <div className="payment-method">
            <h4>💳 Credit/Debit Card (Real Payment)</h4>
            <p>Secure payment via Stripe</p>
            <button 
              className="btn-payment-real"
              onClick={handleRealPayment}
              disabled={processing}
            >
              {processing ? "Processing..." : `Pay $${course.price} with Stripe`}
            </button>
          </div>

          {/* Fake Payment for Testing */}
          <div className="payment-method">
            <h4>🧪 Test Payment (Fake)</h4>
            <p>Use this for testing - no real payment required</p>
            <div className="fake-card-info">
              <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
              <p><strong>Expiry:</strong> Any future date</p>
              <p><strong>CVC:</strong> Any 3 digits</p>
            </div>
            <button 
              className="btn-payment-fake"
              onClick={handleFakePayment}
              disabled={processing}
            >
              {processing ? "Processing..." : `Test Payment - $${course.price}`}
            </button>
          </div>
        </div>

        {!user && (
          <div className="login-reminder">
            <p>🔐 You will be prompted to login when you proceed with payment</p>
            <p><small>Don't have an account? <Link to="/register">Register here</Link></small></p>
          </div>
        )}

        <div className="payment-footer">
          <Link to="/courses" className="btn-back">
            ← Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;