// //pages/PaymentPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../utils/axiosInstance";
// import PaymentButton from "../components/PaymentButton";

// const PaymentPage = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         setLoading(true);
//         console.log("🔍 Fetching course for payment, courseId:", courseId);

//         const response = await axios.get(`/payments/${courseId}`);
//         console.log("✅ Payment API response:", response.data);

//         // ✅ Correct response handling
//         if (response.data.success && response.data.course) {
//           setCourse(response.data.course);
//         } else {
//           throw new Error(response.data.error || "Invalid response format");
//         }
//       } catch (err) {
//         console.error("❌ Error fetching course:", err);
//         console.error("Error details:", err.response?.data);
//         setError(
//           err.response?.data?.error || "Failed to load course information"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (courseId) {
//       fetchCourse();
//     } else {
//       setError("No course ID provided");
//       setLoading(false);
//     }
//   }, [courseId]);

//   const handlePaymentError = (errorMessage) => {
//     setError(errorMessage);
//   };

//   const handlePaymentSuccess = () => {
//     console.log("Payment initiated successfully");
//     // Optionally redirect or show success message
//   };

//   if (loading) {
//     return (
//       <div
//         style={{
//           padding: "2rem",
//           textAlign: "center",
//           maxWidth: "600px",
//           margin: "0 auto",
//         }}
//       >
//         <div
//           style={{
//             fontSize: "1.2rem",
//             marginBottom: "1rem",
//           }}
//         >
//           Loading course information...
//         </div>
//         <div style={{ color: "#666" }}>Course ID: {courseId}</div>
//       </div>
//     );
//   }

//   if (error && !course) {
//     return (
//       <div
//         style={{
//           padding: "2rem",
//           textAlign: "center",
//           maxWidth: "600px",
//           margin: "0 auto",
//         }}
//       >
//         <div
//           style={{
//             color: "red",
//             marginBottom: "1rem",
//             fontSize: "1.1rem",
//           }}
//         >
//           {error}
//         </div>
//         <button
//           onClick={() => navigate("/courses")}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Back to Courses
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         maxWidth: "600px",
//         margin: "2rem auto",
//         padding: "0 1rem",
//       }}
//     >
//       <h1
//         style={{
//           textAlign: "center",
//           marginBottom: "2rem",
//           color: "#333",
//         }}
//       >
//         Complete Your Enrollment
//       </h1>

//       {course && (
//         <div
//           style={{
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             padding: "1.5rem",
//             marginBottom: "2rem",
//             backgroundColor: "#f9f9f9",
//           }}
//         >
//           <h2 style={{ marginTop: 0 }}>{course.title}</h2>
//           <p style={{ color: "#666" }}>{course.description}</p>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginTop: "1rem",
//               paddingTop: "1rem",
//               borderTop: "1px solid #eee",
//             }}
//           >
//             <span
//               style={{
//                 fontSize: "1.5rem",
//                 fontWeight: "bold",
//                 color: "#28a745",
//               }}
//             >
//               Total: $
//               {typeof course.price === "number"
//                 ? course.price.toFixed(2)
//                 : "0.00"}
//             </span>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div
//           style={{
//             color: "#721c24",
//             backgroundColor: "#f8d7da",
//             padding: "1rem",
//             borderRadius: "5px",
//             marginBottom: "1rem",
//             border: "1px solid #f5c6cb",
//           }}
//         >
//           {error}
//         </div>
//       )}

//       {course && (
//         <PaymentButton
//           course={course}
//           onPaymentSuccess={handlePaymentSuccess}
//           onPaymentError={handlePaymentError}
//         />
//       )}

//       <button
//         onClick={() => navigate(-1)}
//         style={{
//           marginTop: "1rem",
//           padding: "10px 20px",
//           backgroundColor: "#6c757d",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//           width: "100%",
//         }}
//       >
//         Cancel
//       </button>
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

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log(`🔄 Fetching course details for ID: ${courseId}`);
      
      // Try multiple endpoints to get course data
      let courseData = null;
      
      try {
        // First try the payments endpoint
        const paymentResponse = await axios.get(`/payments/${courseId}`);
        console.log("💰 Payment endpoint response:", paymentResponse.data);
        if (paymentResponse.data.success && paymentResponse.data.course) {
          courseData = paymentResponse.data.course;
        }
      } catch (paymentError) {
        console.log("⚠️ Payment endpoint failed, trying courses endpoint...");
      }
      
      // If payment endpoint failed, try courses endpoint
      if (!courseData) {
        try {
          const coursesResponse = await axios.get(`/courses/id/${courseId}`);
          console.log("📚 Courses endpoint response:", coursesResponse.data);
          if (coursesResponse.data.success && coursesResponse.data.course) {
            courseData = coursesResponse.data.course;
          }
        } catch (coursesError) {
          console.log("⚠️ Courses endpoint failed");
        }
      }
      
      if (courseData) {
        console.log("✅ Course details loaded:", courseData);
        
        // Ensure price is properly formatted
        const formattedCourse = {
          ...courseData,
          price: parseFloat(courseData.price) || 0
        };
        
        setCourse(formattedCourse);
        
        if (formattedCourse.price === 0) {
          console.warn("⚠️ Course price is $0.00 - this might be an issue");
        }
      } else {
        throw new Error("Course not found in any endpoint");
      }
    } catch (err) {
      console.error("❌ Error fetching course:", err);
      const errorMsg = err.response?.data?.error || "Failed to load course details. Please try again.";
      setError(errorMsg);
      toast.error("Failed to load course information");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!course || !course.price || course.price <= 0) {
      toast.error("Invalid course price. Please contact support.");
      return;
    }

    try {
      setProcessing(true);
      console.log("💳 Starting payment process for course:", courseId);

      const { data } = await axios.post("/payments/create-checkout-session", {
        courseId: courseId,
      });

      if (data.success && data.sessionId) {
        console.log("✅ Checkout session created:", data.sessionId);
        
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("❌ Stripe redirect error:", error);
          toast.error("Payment failed. Please try again.");
        }
      } else {
        throw new Error(data.error || "Failed to create payment session");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Payment failed";
      toast.error(errorMsg);
      
      // Handle specific errors
      if (err.response?.data?.error?.includes("already paid")) {
        navigate("/my-courses");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2>Loading Course Details...</h2>
          <p>Please wait while we load the course information.</p>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-container">
        <div className="payment-card error">
          <h2>Error Loading Course</h2>
          <p>{error}</p>
          <div className="payment-actions">
            <button onClick={fetchCourseDetails} className="btn-primary">
              Try Again
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
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
  }

  const displayPrice = parseFloat(course.price || 0).toFixed(2);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Complete Your Enrollment</h2>
        
        <div className="course-summary">
          <h3>{course.title}</h3>
          <p className="course-description">
            {course.description || "No description available"}
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
            <span><strong>Total:</strong></span>
            <span><strong>${displayPrice}</strong></span>
          </div>
        </div>

        <div className="payment-actions">
          <button
            onClick={handlePayment}
            disabled={processing || !course.price || course.price <= 0}
            className="btn-primary payment-btn"
          >
            {processing ? "Processing..." : `Pay $${displayPrice} with Stripe`}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={processing}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

        {(!course.price || course.price <= 0) && (
          <div className="payment-warning">
            <p>⚠️ This course appears to be free. Please contact support if this seems incorrect.</p>
          </div>
        )}

        <div className="payment-security">
          <p>🔒 Your payment is secure and encrypted</p>
          <small>Powered by Stripe</small>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;