
// // Mathe-Class-Website-Frontend/src/pages/Payment.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";
// import "./Payment.css";

// // Initialize Stripe with public key
// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// const Payment = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [courseInfo, setCourseInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [redirecting, setRedirecting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     // Validate user
//     if (!user || !user.id || !user.email) {
//       toast.error("Please log in to enroll.");
//       navigate("/login");
//       return;
//     }

//     if (user.role !== "student") {
//       toast.error("Only students can enroll in courses.");
//       navigate("/courses");
//       return;
//     }

//     const fetchCourse = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/courses/${courseId}`,
//           {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//           }
//         );
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

//     if (courseId) {
//       fetchCourse();
//     } else {
//       setError("Invalid course ID");
//       toast.error("Invalid course ID");
//       setLoading(false);
//     }
//   }, [courseId, navigate]);

//   const handleConfirmPayment = async () => {
//     if (!courseInfo) {
//       toast.error("Course information not available");
//       return;
//     }

//     setRedirecting(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please log in to proceed with payment");
//         navigate("/login");
//         return;
//       }

//       console.log(
//         "Payment - Sending request to:",
//         `${API_BASE_URL}/api/v1/payments/create-checkout-session`
//       );
//       console.log("Payment - Payload:", { courseId });

//       const response = await axios.post(
//         `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
//         { courseId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Redirect to Stripe checkout using sessionId
//       const { sessionId } = response.data;
//       const stripe = await stripePromise;
//       const { error } = await stripe.redirectToCheckout({ sessionId });
//       if (error) {
//         throw new Error(error.message);
//       }
//     } catch (err) {
//       console.error("Payment error:", {
//         message: err.message,
//         response: err.response?.data,
//       });
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
//         <strong>Course:</strong> {courseInfo?.title}
//       </p>
//       <p>
//         <strong>Price:</strong> ${courseInfo?.price?.toFixed(2)}
//       </p>

//       {redirecting ? (
//         <div className="spinner">🔁 Redirecting to Stripe...</div>
//       ) : (
//         <button onClick={handleConfirmPayment} className="btn-pay">
//           Pay Now
//         </button>
//       )}
//     </div>
//   );
// };

// export default Payment;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";
import "./Payment.css";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

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
      toast.error("Please log in to enroll.");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can enroll in courses.");
      navigate("/courses");
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          // Check if user is already enrolled
          const enrollmentCheck = await axios.get(
            `${API_BASE_URL}/api/v1/enrollments/check?courseId=${courseId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (enrollmentCheck.data.isEnrolled) {
            toast.info("You're already enrolled in this course");
            navigate(`/courses/${courseId}`);
            return;
          }

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

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        {
          courseId,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/courses/${courseId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { sessionId } = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Payment error:", {
        message: err.message,
        response: err.response?.data,
      });
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
      <div className="payment-details">
        <p>
          <strong>Course:</strong> {courseInfo?.title}
        </p>
        <p>
          <strong>Price:</strong> ${courseInfo?.price?.toFixed(2)}
        </p>
      </div>

      {redirecting ? (
        <div className="spinner">🔁 Redirecting to Stripe...</div>
      ) : (
        <div className="payment-actions">
          <button onClick={handleConfirmPayment} className="btn-pay">
            Pay Now
          </button>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;