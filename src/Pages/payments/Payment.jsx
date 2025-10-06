
// // src/Pages/payment/Payment.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import axios from "../../utils/axiosInstance";
// import "./Payment.css";

// const Payment = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     console.log("🔍 Payment page loaded with Course ID:", courseId);
    
//     if (!courseId || courseId === "undefined") {
//       setError("Invalid course ID. Please go back and try again.");
//       setLoading(false);
//       return;
//     }

//     fetchCourse();
//   }, [courseId]);

//   const fetchCourse = async () => {
//     try {
//       console.log("📡 Fetching course with ID:", courseId);
      
//       const response = await axios.get(`/payments/${courseId}`);
//       console.log("✅ Course data received:", response.data);
      
//       if (response.data.success) {
//         setCourse(response.data.course);
//       } else {
//         throw new Error("No course data received");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching course:", err);
//       setError("Failed to load course information. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if user is a student (only students should see enrollment options)
//   const isStudent = user && user.role === 'student';

//   const handleRealPayment = async () => {
//     if (!isAuthenticated || !user) {
//       navigate('/login', { 
//         state: { 
//           from: `/payment/${courseId}`,
//           message: "Please login to complete your payment"
//         } 
//       });
//       return;
//     }

//     try {
//       setProcessing(true);
//       console.log("💳 Processing real payment for course:", courseId);
      
//       const response = await axios.post("/payments/create-checkout-session", {
//         courseId,
//       });

//       if (response.data.sessionId) {
//         console.log("✅ Redirecting to Stripe with session:", response.data.sessionId);
//         window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
//       } else {
//         throw new Error("No session ID received from server");
//       }
//     } catch (err) {
//       console.error("❌ Payment error:", err);
//       alert("Failed to process payment. Please try again.");
//       setProcessing(false);
//     }
//   };

//   const handleTestPayment = async () => {
//     if (!isAuthenticated || !user) {
//       navigate('/login', { 
//         state: { 
//           from: `/payment/${courseId}`,
//           message: "Please login to complete your payment"
//         } 
//       });
//       return;
//     }

//     try {
//       setProcessing(true);
      
//       // For testing, directly navigate to success
//       setTimeout(() => {
//         navigate(`/payment-success?session_id=test_session_${Date.now()}&courseId=${courseId}`);
//       }, 1500);

//     } catch (err) {
//       console.error("❌ Test payment error:", err);
//       alert("Failed to process test payment. Please try again.");
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="payment-container">
//         <div className="loading">
//           <div className="spinner"></div>
//           Loading payment information...
//         </div>
//       </div>
//     );
//   }

//   if (error || !course) {
//     return (
//       <div className="payment-container">
//         <div className="error">
//           <h3>❌ {error || "Course not found"}</h3>
//           <div className="error-details">
//             <p><strong>Course ID:</strong> {courseId}</p>
//             <p>Please check the course ID and try again.</p>
//           </div>
//         </div>
//         <Link to="/courses" className="btn-back">← Back to Courses</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="payment-container">
//       <div className="payment-header">
//         <h1>Complete Your Enrollment</h1>
//         <p>Finish your registration for {course.title}</p>
//       </div>

//       <div className="payment-content">
//         <div className="course-summary">
//           <h3>📚 Course Summary</h3>
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
//             <span>${course.price ? course.price.toFixed(2) : '0.00'}</span>
//           </div>
//         </div>

//         <div className="user-status">
//           {isAuthenticated ? (
//             <div className="user-authenticated">
//               <p>✅ Logged in as: <strong>{user.name}</strong></p>
//               <p>Role: <strong className={`role-${user.role}`}>{user.role}</strong></p>
//             </div>
//           ) : (
//             <div className="user-not-authenticated">
//               <p>🔐 You need to login to complete your enrollment</p>
//             </div>
//           )}
//         </div>

//         {/* Show payment options only for students */}
//         {isStudent ? (
//           <div className="payment-options">
//             <h3>💳 Payment Methods</h3>
            
//             {/* Real Stripe Payment */}
//             <div className="payment-method">
//               <h4>🔒 Secure Credit/Debit Card Payment</h4>
//               <p>Real payment processed securely via Stripe</p>
//               <button 
//                 className="btn-payment-real"
//                 onClick={handleRealPayment}
//                 disabled={processing || !isAuthenticated}
//               >
//                 {processing ? "🔄 Processing..." : `Pay $${course.price ? course.price.toFixed(2) : '0'} with Stripe`}
//               </button>
//             </div>

//             {/* Test Payment */}
//             <div className="payment-method">
//               <h4>🧪 Test Payment (No Real Charge)</h4>
//               <p>Use this for testing - no real payment required</p>
//               <div className="test-card-info">
//                 <p><strong>Test Card Number:</strong> 4242 4242 4242 4242</p>
//                 <p><strong>Expiry Date:</strong> Any future date (e.g., 12/34)</p>
//                 <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
//               </div>
//               <button 
//                 className="btn-payment-test"
//                 onClick={handleTestPayment}
//                 disabled={processing || !isAuthenticated}
//               >
//                 {processing ? "🔄 Processing..." : `Test Payment - $${course.price ? course.price.toFixed(2) : '0'}`}
//               </button>
//             </div>
//           </div>
//         ) : isAuthenticated ? (
//           // Show this for teachers and admins
//           <div className="non-student-access">
//             <div className="access-message">
//               <h3>
//                 {user.role === 'teacher' ? '👨‍🏫 Teacher Account' : '👑 Admin Account'}
//               </h3>
//               <p>
//                 {user.role === 'teacher' 
//                   ? 'As a teacher, you have full access to course content without enrollment.'
//                   : 'As an administrator, you have access to all course content.'
//                 }
//               </p>
//               <div className="access-actions">
//                 <button 
//                   onClick={() => navigate(`/courses/${course.slug}`)}
//                   className="btn-view-course"
//                 >
//                   📚 View Course Content
//                 </button>
//                 <button 
//                   onClick={() => navigate('/dashboard')}
//                   className="btn-dashboard"
//                 >
//                   📊 Go to Dashboard
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           // Show login prompt for non-authenticated users
//           <div className="login-required">
//             <div className="login-prompt">
//               <h3>🔐 Login Required</h3>
//               <p>Please log in to enroll in this course</p>
//               <div className="auth-buttons">
//                 <button 
//                   onClick={() => navigate('/login', { state: { from: `/payment/${courseId}` } })}
//                   className="btn-login"
//                 >
//                   📝 Login
//                 </button>
//                 <button 
//                   onClick={() => navigate('/register', { state: { from: `/payment/${courseId}` } })}
//                   className="btn-register"
//                 >
//                   ✍️ Register
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="payment-footer">
//           <Link to="/courses" className="btn-back">
//             ← Back to Courses
//           </Link>
//           {isStudent && (
//             <div className="security-notice">
//               <small>🔒 Your payment is secure and encrypted</small>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;



import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axiosInstance from "../../utils/axiosInstance";
import CheckoutForm from "./CheckoutForm";
import "./Payment.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setDebugInfo(
          `Fetching course ${courseId} from: ${axiosInstance.defaults.baseURL}/courses/id/${courseId}`
        );
        console.log("🔍 Fetching course for payment:", courseId);

        // Use the courses endpoint instead of payments endpoint
        const response = await axiosInstance.get(`/courses/id/${courseId}`);
        console.log("✅ Course response:", response.data);

        if (response.data) {
          setCourse(response.data);
          setDebugInfo(
            `Course loaded: ${response.data.title} - Price: $${response.data.price}`
          );

          console.log("💰 Course price details:", {
            rawPrice: response.data.price,
            parsedPrice: parseFloat(response.data.price),
            type: typeof response.data.price,
          });
        } else {
          throw new Error("Failed to load course data");
        }
      } catch (err) {
        console.error("❌ Error fetching course:", err);

        // Try alternative endpoint
        try {
          console.log("🔄 Trying alternative endpoint: /courses/${courseId}");
          const altResponse = await axiosInstance.get(`/courses/${courseId}`);
          if (altResponse.data) {
            setCourse(altResponse.data);
            setDebugInfo(
              `Course loaded from alt endpoint: ${altResponse.data.title}`
            );
          } else {
            throw new Error("Alternative endpoint also failed");
          }
        } catch (altErr) {
          setError("Failed to load course information from all endpoints");
          setDebugInfo(`All endpoints failed: ${altErr.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setError("No course ID provided");
      setLoading(false);
    }
  }, [courseId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <div className="loading-section">
            <div className="spinner"></div>
            <h2>Loading Course Information...</h2>
            <p>Course ID: {courseId}</p>
            <p className="debug-info">{debugInfo}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h2>Error Loading Course</h2>
            <p>{error}</p>
            <p className="debug-info">{debugInfo}</p>
            <div className="action-buttons">
              <button onClick={handleBack} className="btn-secondary">
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <div className="error-section">
            <h2>Course Not Found</h2>
            <p>The course you're trying to enroll in could not be found.</p>
            <button onClick={handleBack} className="btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const coursePrice = parseFloat(course.price);
  const isValidPrice = !isNaN(coursePrice) && coursePrice > 0;

  console.log("🎯 Final price check:", {
    courseId,
    courseTitle: course.title,
    rawPrice: course.price,
    parsedPrice: coursePrice,
    isValidPrice,
    baseURL: axiosInstance.defaults.baseURL,
  });

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-header">
          <h1>Complete Your Enrollment</h1>
          <button onClick={handleBack} className="back-button">
            ← Back to Course
          </button>
        </div>

        <div className="course-summary">
          <h2>{course.title}</h2>
          <p className="course-description">{course.description}</p>

          <div className="price-section">
            <h3>Total: ${isValidPrice ? coursePrice.toFixed(2) : "0.00"}</h3>
            {!isValidPrice && (
              <div className="price-warning">
                <p>⚠️ Invalid course price. Please contact support.</p>
              </div>
            )}
          </div>
        </div>

        {isValidPrice ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              courseId={courseId}
              courseTitle={course.title}
              price={coursePrice}
            />
          </Elements>
        ) : (
          <div className="payment-disabled">
            <p>Cannot proceed with payment - invalid course price.</p>
            <p>Please contact support or try again later.</p>
            <button onClick={handleBack} className="btn-secondary">
              Go Back
            </button>
          </div>
        )}

        {/* Debug information - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="debug-info">
            <h4>Debug Information:</h4>
            <p>
              <strong>Course ID:</strong> {courseId}
            </p>
            <p>
              <strong>Course Title:</strong> {course.title}
            </p>
            <p>
              <strong>API Base URL:</strong> {axiosInstance.defaults.baseURL}
            </p>
            <p>
              <strong>Raw Price:</strong> {course.price}
            </p>
            <p>
              <strong>Parsed Price:</strong> {coursePrice}
            </p>
            <p>
              <strong>Price Valid:</strong> {isValidPrice ? "Yes" : "No"}
            </p>
            <p>
              <strong>Environment:</strong> {process.env.NODE_ENV}
            </p>
            <p>
              <strong>Custom API URL:</strong>{" "}
              {process.env.REACT_APP_API_URL || "Not set"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;