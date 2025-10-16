// //Pages/PaymentPage.jsx
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
//         const response = await axios.get(`/payments/${courseId}`);
//         setCourse(response.data.course);
//       } catch (err) {
//         console.error("Error fetching course:", err);
//         setError("Failed to load course information");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (courseId) {
//       fetchCourse();
//     }
//   }, [courseId]);

//   const handlePaymentError = (errorMessage) => {
//     setError(errorMessage);
//   };

//   const handlePaymentSuccess = () => {
//     // This will be called if payment is successful (after Stripe redirect)
//     console.log("Payment initiated successfully");
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: "2rem", textAlign: "center" }}>
//         <div>Loading course information...</div>
//       </div>
//     );
//   }

//   if (error && !course) {
//     return (
//       <div style={{ padding: "2rem", textAlign: "center" }}>
//         <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
//         <button onClick={() => navigate("/courses")}>Back to Courses</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
//       <h1>Complete Your Enrollment</h1>

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
//           <h2>{course.title}</h2>
//           <p>{course.description}</p>
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
//             <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
//               Total: ${course.price}
//             </span>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div
//           style={{
//             color: "red",
//             backgroundColor: "#ffe6e6",
//             padding: "1rem",
//             borderRadius: "5px",
//             marginBottom: "1rem",
//             border: "1px solid #ffcccc",
//           }}
//         >
//           {error}
//         </div>
//       )}

//       <PaymentButton
//         course={course}
//         onPaymentSuccess={handlePaymentSuccess}
//         onPaymentError={handlePaymentError}
//       />

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





import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import PaymentButton from "../components/PaymentButton";

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching course for payment, courseId:", courseId);

        const response = await axios.get(`/payments/${courseId}`);
        console.log("✅ Payment API response:", response.data);

        // ✅ Correct response handling
        if (response.data.success && response.data.course) {
          setCourse(response.data.course);
        } else {
          throw new Error(response.data.error || "Invalid response format");
        }
      } catch (err) {
        console.error("❌ Error fetching course:", err);
        console.error("Error details:", err.response?.data);
        setError(
          err.response?.data?.error || "Failed to load course information"
        );
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

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  const handlePaymentSuccess = () => {
    console.log("Payment initiated successfully");
    // Optionally redirect or show success message
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: "1.2rem",
            marginBottom: "1rem",
          }}
        >
          Loading course information...
        </div>
        <div style={{ color: "#666" }}>Course ID: {courseId}</div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            color: "red",
            marginBottom: "1rem",
            fontSize: "1.1rem",
          }}
        >
          {error}
        </div>
        <button
          onClick={() => navigate("/courses")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "0 1rem",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "#333",
        }}
      >
        Complete Your Enrollment
      </h1>

      {course && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "2rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 style={{ marginTop: 0 }}>{course.title}</h2>
          <p style={{ color: "#666" }}>{course.description}</p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #eee",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#28a745",
              }}
            >
              Total: $
              {typeof course.price === "number"
                ? course.price.toFixed(2)
                : "0.00"}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            color: "#721c24",
            backgroundColor: "#f8d7da",
            padding: "1rem",
            borderRadius: "5px",
            marginBottom: "1rem",
            border: "1px solid #f5c6cb",
          }}
        >
          {error}
        </div>
      )}

      {course && (
        <PaymentButton
          course={course}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default PaymentPage;