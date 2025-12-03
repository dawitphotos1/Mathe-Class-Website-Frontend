// // src/pages/PaymentPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { toast } from "react-toastify";
// import axios from "../utils/axiosInstance";
// import "./PaymentPage.css";

// /* =========================================================
//    💳 Stripe Initialization
// ========================================================= */
// let stripePromise = null;

// const initializeStripe = async () => {
//   const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
//   if (!stripeKey) {
//     console.error("❌ Missing Stripe publishable key");
//     throw new Error("Stripe is not configured. Contact support.");
//   }

//   try {
//     stripePromise = await loadStripe(stripeKey);
//     console.log("✅ Stripe initialized successfully");
//     return stripePromise;
//   } catch (err) {
//     console.error("❌ Stripe initialization failed:", err);
//     throw new Error("Failed to initialize Stripe.");
//   }
// };

// /* =========================================================
//    💰 Payment Page Component
// ========================================================= */
// const PaymentPage = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");

//   /* =========================================================
//      🧭 Fetch Course Details
//   ========================================================== */
//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       if (!courseId) {
//         setError("No course ID provided.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError("");
//       console.log(`🔍 Fetching course by ID: ${courseId}`);

//       try {
//         const res = await axios.get(`/courses/id/${courseId}`);

//         if (res.data?.course || res.data?._id) {
//           const courseData = res.data.course || res.data;
//           const price = parseFloat(courseData.price || 0);
//           setCourse({ ...courseData, price });
//           console.log("✅ Course loaded successfully:", courseData.title);
//         } else {
//           throw new Error("Invalid course data received.");
//         }
//       } catch (err) {
//         console.error("❌ Error fetching course:", err);
//         setError("Failed to load course information. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [courseId]);

//   /* =========================================================
//      💳 Handle Stripe Payment
//   ========================================================== */
//   const handlePayment = async () => {
//     if (!course) {
//       toast.error("Course not loaded yet.");
//       return;
//     }

//     if (Number(course.price) <= 0) {
//       toast.info("This course is free. No payment required.");
//       return;
//     }

//     try {
//       setProcessing(true);
//       console.log("💳 Starting payment for:", course.title);

//       const stripe = stripePromise ? stripePromise : await initializeStripe();

//       const { data } = await axios.post("/payments/create-checkout-session", {
//         courseId: course._id || course.id,
//       });

//       if (data?.sessionId) {
//         console.log("✅ Stripe session created:", data.sessionId);
//         const { error } = await stripe.redirectToCheckout({
//           sessionId: data.sessionId,
//         });

//         if (error) {
//           console.error("❌ Stripe redirect error:", error);
//           toast.error(error.message || "An unexpected error occurred.");
//         }
//       } else {
//         throw new Error(data.error || "Failed to start checkout session.");
//       }
//     } catch (err) {
//       console.error("❌ Payment error:", err);
//       const msg =
//         err.response?.data?.error ||
//         err.message ||
//         "Failed to process payment.";
//       toast.error(msg);

//       if (
//         msg.toLowerCase().includes("already paid") ||
//         msg.toLowerCase().includes("already enrolled")
//       ) {
//         navigate("/my-courses");
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   /* =========================================================
//      🚪 Cancel Navigation
//   ========================================================== */
//   const handleCancel = () => navigate(-1);

//   /* =========================================================
//      🧱 Conditional UI
//   ========================================================== */
//   if (loading)
//     return (
//       <div className="payment-container">
//         <div className="payment-card">
//           <h2>Loading Course Details...</h2>
//           <p>Please wait while we load the course information.</p>
//           <div className="loading-spinner">⏳</div>
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="payment-container">
//         <div className="payment-card error">
//           <h2>Error Loading Course</h2>
//           <p>{error}</p>
//           <div className="payment-actions">
//             <button
//               onClick={() => window.location.reload()}
//               className="btn-primary"
//             >
//               Try Again
//             </button>
//             <button onClick={handleCancel} className="btn-secondary">
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );

//   if (!course)
//     return (
//       <div className="payment-container">
//         <div className="payment-card error">
//           <h2>Course Not Found</h2>
//           <p>The requested course could not be found.</p>
//           <button onClick={() => navigate("/courses")} className="btn-primary">
//             Browse Courses
//           </button>
//         </div>
//       </div>
//     );

//   /* =========================================================
//      💵 Payment UI
//   ========================================================== */
//   const displayPrice =
//     course?.price !== undefined && course?.price !== null
//       ? Number(course.price).toFixed(2)
//       : "0.00";

//   return (
//     <div className="payment-container">
//       <div className="payment-card">
//         <h2>Complete Your Enrollment</h2>

//         <div className="course-summary">
//           <h3>{course.title}</h3>
//           <p className="course-description">
//             {course.description || "No description available."}
//           </p>
//           {course.teacher && (
//             <p className="course-teacher">
//               <strong>Instructor:</strong> {course.teacher.name}
//             </p>
//           )}
//         </div>

//         <div className="payment-summary">
//           <div className="price-row">
//             <span>Course Price:</span>
//             <span>${displayPrice}</span>
//           </div>
//           <div className="price-row total">
//             <strong>Total:</strong>
//             <strong>${displayPrice}</strong>
//           </div>
//         </div>

//         <div className="payment-actions">
//           <button
//             onClick={handlePayment}
//             disabled={processing || Number(course.price) <= 0}
//             className="btn-primary payment-btn"
//           >
//             {processing
//               ? "Processing..."
//               : Number(course.price) <= 0
//               ? "Enroll for Free"
//               : `Pay $${displayPrice} with Stripe`}
//           </button>

//           <button
//             onClick={handleCancel}
//             disabled={processing}
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//         </div>

//         <div className="payment-security">
//           <p>🔒 Your payment is secure and encrypted</p>
//           <small>Powered by Stripe</small>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;






// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import "./PaymentPage.css";

/* =========================================================
   💳 Stripe Initialization - VITE VERSION
========================================================= */
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/* =========================================================
   💰 Payment Page Component
========================================================= */
const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     🧭 Fetch Course Details
  ========================================================== */
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setError("No course ID provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      console.log(`🔍 Fetching course by ID: ${courseId}`);

      try {
        const res = await axios.get(`/courses/id/${courseId}`);

        if (res.data?.course || res.data?._id) {
          const courseData = res.data.course || res.data;
          const price = parseFloat(courseData.price || 0);
          setCourse({ ...courseData, price });
          console.log("✅ Course loaded successfully:", courseData.title);
        } else {
          throw new Error("Invalid course data received.");
        }
      } catch (err) {
        console.error("❌ Error fetching course:", err);
        setError("Failed to load course information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  /* =========================================================
     💳 Handle Stripe Payment
  ========================================================== */
  const handlePayment = async () => {
    if (!course) {
      toast.error("Course not loaded yet.");
      return;
    }

    if (Number(course.price) <= 0) {
      toast.info("This course is free. No payment required.");
      return;
    }

    try {
      setProcessing(true);
      console.log("💳 Starting payment for:", course.title);

      // Check if user is already enrolled
      try {
        const enrollmentCheck = await axios.get(`/enrollments/check/${courseId}`);
        if (enrollmentCheck.data.enrolled) {
          toast.error("You are already enrolled in this course");
          navigate("/my-courses");
          return;
        }
      } catch (error) {
        console.log("Enrollment check skipped:", error.message);
      }

      // Create Stripe checkout session
      const { data } = await axios.post("/payments/create-checkout-session", {
        courseId: course.id || course._id,
      });

      console.log("✅ Stripe session response:", data);

      if (data.success && data.sessionId && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.url) {
        // Some APIs return URL directly
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to process payment.";
      toast.error(msg);

      if (
        msg.toLowerCase().includes("already paid") ||
        msg.toLowerCase().includes("already enrolled")
      ) {
        navigate("/my-courses");
      }
    } finally {
      setProcessing(false);
    }
  };

  /* =========================================================
     🚪 Cancel Navigation
  ========================================================== */
  const handleCancel = () => navigate(-1);

  /* =========================================================
     🧱 Conditional UI
  ========================================================== */
  if (loading)
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2>Loading Course Details...</h2>
          <p>Please wait while we load the course information.</p>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="payment-container">
        <div className="payment-card error">
          <h2>Error Loading Course</h2>
          <p>{error}</p>
          <div className="payment-actions">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );

  if (!course)
    return (
      <div className="payment-container">
        <div className="payment-card error">
          <h2>Course Not Found</h2>
          <p>The requested course could not be found.</p>
          <button onClick={() => navigate("/courses")} className="btn-primary">
            Browse Courses
          </button>
        </div>
      </div>
    );

  /* =========================================================
     💵 Payment UI
  ========================================================== */
  const displayPrice =
    course?.price !== undefined && course?.price !== null
      ? Number(course.price).toFixed(2)
      : "0.00";

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Complete Your Enrollment</h2>

        <div className="course-summary">
          <h3>{course.title}</h3>
          <p className="course-description">
            {course.description || "No description available."}
          </p>
          {course.teacher && (
            <p className="course-teacher">
              <strong>Instructor:</strong> {course.teacher.name}
            </p>
          )}
        </div>

        <div className="payment-summary">
          <div className="price-row">
            <span>Course Price:</span>
            <span>${displayPrice}</span>
          </div>
          <div className="price-row total">
            <strong>Total:</strong>
            <strong>${displayPrice}</strong>
          </div>
        </div>

        <div className="payment-actions">
          <button
            onClick={handlePayment}
            disabled={processing || Number(course.price) <= 0}
            className="btn-primary payment-btn"
          >
            {processing
              ? "Processing..."
              : Number(course.price) <= 0
              ? "Enroll for Free"
              : `Pay $${displayPrice} with Stripe`}
          </button>

          <button
            onClick={handleCancel}
            disabled={processing}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

        <div className="payment-security">
          <p>🔒 Your payment is secure and encrypted</p>
          <small>Powered by Stripe</small>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;