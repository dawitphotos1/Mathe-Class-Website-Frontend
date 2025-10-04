
// // src/Pages/payment/Payment.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "../../utils/axiosInstance";
// import "./Payment.css";

// const Payment = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     setUser(userData);
//     fetchCourse();
//   }, [courseId]);

//   const fetchCourse = async () => {
//     try {
//      const response = await axios.get(`/courses/${courseId}`);
//       setCourse(response.data);
//     } catch (err) {
//       console.error("Error fetching course:", err);
//       // If the above fails, try the payments endpoint
//       try {
//        const response = await axios.get(`/payments/${courseId}`);
//         setCourse(response.data.course);
//       } catch (err2) {
//         console.error("Error fetching course from payments:", err2);
//         alert("Failed to load course information");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRealPayment = async () => {
//     if (!user) {
//       // Redirect to login with return URL
//       navigate('/login', { state: { from: `/payment/${courseId}` } });
//       return;
//     }

//     try {
//       setProcessing(true);
//       const response = await axios.post("/payments/create-checkout-session", {
//         courseId: courseId
//       });

//       // Redirect to Stripe Checkout
//       if (response.data.sessionId) {
//         window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
//       }
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert("Failed to process payment. Please try again.");
//       setProcessing(false);
//     }
//   };

//   const handleFakePayment = async () => {
//     if (!user) {
//       navigate('/login', { state: { from: `/payment/${courseId}` } });
//       return;
//     }

//     try {
//       setProcessing(true);
      
//       // Create a fake checkout session
//       const response = await axios.post("/payments/create-checkout-session", {
//         courseId: courseId
//       });

//       // Simulate successful payment and redirect to success page
//       setTimeout(() => {
//         navigate(`/payment-success?session_id=fake_session_${Date.now()}&courseId=${courseId}`);
//       }, 1500);

//     } catch (err) {
//       console.error("Fake payment error:", err);
//       alert("Failed to process payment. Please try again.");
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="payment-container">
//         <div className="loading">Loading payment information...</div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="payment-container">
//         <div className="error">Course not found</div>
//         <Link to="/courses" className="btn-back">← Back to Courses</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="payment-container">
//       <div className="payment-header">
//         <h1>Enroll in {course.title}</h1>
//         <p>Complete your enrollment by making the payment</p>
//       </div>

//       <div className="payment-content">
//         <div className="course-summary">
//           <h3>Course Summary</h3>
//           <div className="summary-item">
//             <span>Course:</span>
//             <span>{course.title}</span>
//           </div>
//           <div className="summary-item">
//             <span>Description:</span>
//             <span>{course.description || "No description available"}</span>
//           </div>
//           <div className="summary-item total">
//             <span>Total Amount:</span>
//             <span>${course.price}</span>
//           </div>
//         </div>

//         <div className="payment-options">
//           <h3>Payment Methods</h3>
          
//           {/* Real Stripe Payment */}
//           <div className="payment-method">
//             <h4>💳 Credit/Debit Card (Real Payment)</h4>
//             <p>Secure payment via Stripe</p>
//             <button 
//               className="btn-payment-real"
//               onClick={handleRealPayment}
//               disabled={processing}
//             >
//               {processing ? "Processing..." : `Pay $${course.price} with Stripe`}
//             </button>
//           </div>

//           {/* Fake Payment for Testing */}
//           <div className="payment-method">
//             <h4>🧪 Test Payment (Fake)</h4>
//             <p>Use this for testing - no real payment required</p>
//             <div className="fake-card-info">
//               <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
//               <p><strong>Expiry:</strong> Any future date</p>
//               <p><strong>CVC:</strong> Any 3 digits</p>
//             </div>
//             <button 
//               className="btn-payment-fake"
//               onClick={handleFakePayment}
//               disabled={processing}
//             >
//               {processing ? "Processing..." : `Test Payment - $${course.price}`}
//             </button>
//           </div>
//         </div>

//         {!user && (
//           <div className="login-reminder">
//             <p>🔐 You will be prompted to login when you proceed with payment</p>
//             <p><small>Don't have an account? <Link to="/register">Register here</Link></small></p>
//           </div>
//         )}

//         <div className="payment-footer">
//           <Link to="/courses" className="btn-back">
//             ← Back to Courses
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;




// src/Pages/payment/Payment.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import "./Payment.css";

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 Payment page loaded with Course ID:", courseId);
    
    if (!courseId || courseId === "undefined") {
      setError("Invalid course ID. Please go back and try again.");
      setLoading(false);
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      console.log("📡 Fetching course with ID:", courseId);
      
      // ✅ Use the new endpoint to get course by ID
      const response = await axios.get(`/courses/id/${courseId}`);
      console.log("✅ Course data received:", response.data);
      
      if (response.data) {
        setCourse(response.data);
      } else {
        throw new Error("No course data received");
      }
    } catch (err) {
      console.error("❌ Error fetching course:", err);
      
      // ✅ Fallback: try to get from all courses list
      try {
        console.log("🔄 Trying fallback method...");
        const allCoursesResponse = await axios.get("/courses");
        const allCourses = allCoursesResponse.data;
        const foundCourse = allCourses.find(c => c.id === parseInt(courseId));
        
        if (foundCourse) {
          console.log("✅ Course found via fallback:", foundCourse.title);
          setCourse(foundCourse);
        } else {
          throw new Error("Course not found in fallback");
        }
      } catch (fallbackErr) {
        console.error("❌ Fallback also failed:", fallbackErr);
        setError("Failed to load course information. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRealPayment = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/payment/${courseId}` } });
      return;
    }

    try {
      setProcessing(true);
      console.log("💳 Processing real payment for course:", courseId);
      
      const response = await axios.post("/payments/create-checkout-session", {
        courseId: courseId
      });

      // Redirect to Stripe Checkout
      if (response.data.sessionId) {
        console.log("✅ Redirecting to Stripe with session:", response.data.sessionId);
        window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
      } else {
        throw new Error("No session ID received from server");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  const handleTestPayment = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/payment/${courseId}` } });
      return;
    }

    try {
      setProcessing(true);
      console.log("🧪 Processing test payment for course:", courseId);
      
      // Simulate successful payment
      setTimeout(() => {
        navigate(`/payment-success?session_id=test_session_${Date.now()}&courseId=${courseId}`);
      }, 1500);

    } catch (err) {
      console.error("❌ Test payment error:", err);
      alert("Failed to process test payment. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading">
          <div className="spinner"></div>
          Loading payment information...
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="payment-container">
        <div className="error">
          <h3>❌ {error || "Course not found"}</h3>
          <div className="error-details">
            <p><strong>Course ID:</strong> {courseId}</p>
            <p>Please check the course ID and try again.</p>
          </div>
        </div>
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
          <h3>📚 Course Summary</h3>
          <div className="summary-item">
            <span>Course:</span>
            <span>{course.title}</span>
          </div>
          <div className="summary-item">
            <span>Instructor:</span>
            <span>{course.teacher?.name || "Unknown Instructor"}</span>
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
          <h3>💳 Payment Methods</h3>
          
          {/* Real Stripe Payment */}
          <div className="payment-method">
            <h4>🔒 Secure Credit/Debit Card Payment</h4>
            <p>Real payment processed securely via Stripe</p>
            <button 
              className="btn-payment-real"
              onClick={handleRealPayment}
              disabled={processing}
            >
              {processing ? "🔄 Processing..." : `Pay $${course.price} with Stripe`}
            </button>
          </div>

          {/* Test Payment */}
          <div className="payment-method">
            <h4>🧪 Test Payment (No Real Charge)</h4>
            <p>Use this for testing - no real payment required</p>
            <div className="test-card-info">
              <p><strong>Test Card Number:</strong> 4242 4242 4242 4242</p>
              <p><strong>Expiry Date:</strong> Any future date (e.g., 12/34)</p>
              <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
              <p><strong>ZIP:</strong> Any 5 digits</p>
            </div>
            <button 
              className="btn-payment-test"
              onClick={handleTestPayment}
              disabled={processing}
            >
              {processing ? "🔄 Processing..." : `Test Payment - $${course.price}`}
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
          <div className="security-notice">
            <small>🔒 Your payment is secure and encrypted</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;