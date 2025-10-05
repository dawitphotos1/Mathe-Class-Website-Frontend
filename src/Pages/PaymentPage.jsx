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
        const response = await axios.get(`/payments/${courseId}`);
        setCourse(response.data.course);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course information");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  const handlePaymentSuccess = () => {
    // This will be called if payment is successful (after Stripe redirect)
    console.log("Payment initiated successfully");
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>Loading course information...</div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        <button onClick={() => navigate("/courses")}>Back to Courses</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Complete Your Enrollment</h1>

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
          <h2>{course.title}</h2>
          <p>{course.description}</p>
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
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Total: ${course.price}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "1rem",
            borderRadius: "5px",
            marginBottom: "1rem",
            border: "1px solid #ffcccc",
          }}
        >
          {error}
        </div>
      )}

      <PaymentButton
        course={course}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />

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