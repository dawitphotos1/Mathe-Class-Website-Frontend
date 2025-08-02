// // File: src/Pages/payments/EnrollmentSuccess.jsx

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../../config";
// import Loading from "../../components/Loading";

// const EnrollmentSuccess = () => {
//   const [status, setStatus] = useState("loading"); // loading, success, error
//   const [message, setMessage] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Extract session_id and courseId from query params
//   useEffect(() => {
//     const query = new URLSearchParams(location.search);
//     const sessionId = query.get("session_id");
//     const courseId = query.get("courseId"); // Ensure you pass this when creating checkout session

//     if (!sessionId || !courseId) {
//       setStatus("error");
//       setMessage("Missing payment session details.");
//       return;
//     }

//     const confirmEnrollment = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setStatus("error");
//           setMessage("You need to log in first.");
//           return;
//         }

//         const res = await axios.post(
//           `${API_BASE_URL}/api/v1/enrollments/confirm`,
//           { courseId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (res.data.success) {
//           setStatus("success");
//           setMessage("Enrollment confirmed! Redirecting to My Courses...");
//           setTimeout(() => navigate("/my-courses"), 2500);
//         } else {
//           setStatus("error");
//           setMessage(res.data.error || "Failed to confirm enrollment.");
//         }
//       } catch (err) {
//         setStatus("error");
//         setMessage(err.response?.data?.error || "An error occurred.");
//       }
//     };

//     confirmEnrollment();
//   }, [location, navigate]);

//   if (status === "loading") {
//     return <Loading />;
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen text-center">
//       {status === "success" ? (
//         <>
//           <h1 className="text-2xl font-bold text-green-600 mb-4">
//             ✅ Payment Successful!
//           </h1>
//           <p>{message}</p>
//         </>
//       ) : (
//         <>
//           <h1 className="text-2xl font-bold text-red-600 mb-4">
//             ❌ Something went wrong
//           </h1>
//           <p>{message}</p>
//         </>
//       )}
//     </div>
//   );
// };

// export default EnrollmentSuccess;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import Loading from "../../components/Loading";

const EnrollmentSuccess = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");
    const courseId = query.get("courseId"); // Ensure backend adds this in success URL

    if (!sessionId || !courseId) {
      setStatus("error");
      setMessage("Missing payment details.");
      return;
    }

    const confirmEnrollment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("error");
          setMessage("Please log in to complete enrollment.");
          return;
        }

        const res = await axios.post(
          `${API_BASE_URL}/api/v1/enrollments/confirm`,
          { courseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setStatus("success");
          setMessage("Enrollment confirmed! Redirecting to My Courses...");
          setTimeout(() => navigate("/my-courses"), 2500);
        } else {
          setStatus("error");
          setMessage(res.data.error || "Failed to confirm enrollment.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Something went wrong.");
      }
    };

    confirmEnrollment();
  }, [location, navigate]);

  if (status === "loading") return <Loading />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      {status === "success" ? (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Payment Successful!
          </h1>
          <p>{message}</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ❌ Something went wrong
          </h1>
          <p>{message}</p>
        </>
      )}
    </div>
  );
};

export default EnrollmentSuccess;
