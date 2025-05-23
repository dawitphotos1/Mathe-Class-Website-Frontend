
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { loadStripe } from "@stripe/stripe-js";
// import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config"; // Use STRIPE_PUBLIC_KEY

// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY); // Update to STRIPE_PUBLIC_KEY

// const CourseViewer = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         console.log("Fetching course:", {
//           courseId,
//           token: token ? `${token.substring(0, 20)}...` : "None",
//         });
//         if (!token) {
//           toast.error("Please log in to view courses");
//           navigate("/login");
//           return;
//         }

//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/courses/${courseId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log("Course fetch response:", response.data);

//         // Normalize data (adjust based on Courses table schema)
//         const courseData = {
//           id: response.data.id,
//           name:
//             response.data.name ||
//             response.data.title ||
//             response.data.courseTitle,
//           price: parseFloat(response.data.price || response.data.coursePrice),
//         };

//         if (
//           !courseData.id ||
//           !courseData.name ||
//           isNaN(courseData.price) ||
//           courseData.price <= 0
//         ) {
//           throw new Error(
//             "Invalid course data: missing id, name, or valid price"
//           );
//         }

//         setCourse(courseData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch course error:", {
//           message: err.message,
//           status: err.response?.status,
//           data: err.response?.data,
//         });
//         toast.error(err.response?.data?.error || "Failed to load course");
//         setLoading(false);
//       }
//     };
//     fetchCourse();
//   }, [courseId, navigate]);

//   const handleEnroll = async () => {
//     const token = localStorage.getItem("token");
//     console.log("Enroll Now clicked:", {
//       courseId: course?.id,
//       courseName: course?.name,
//       coursePrice: course?.price,
//       token: token ? `${token.substring(0, 20)}...` : "None",
//     });

//     if (!token) {
//       toast.error("Please log in to enroll");
//       navigate("/login");
//       return;
//     }

//     if (!course || !course.id || !course.name || !course.price) {
//       console.error("Course data incomplete:", course);
//       toast.error("Course data not loaded properly");
//       return;
//     }

//     try {
//       const payload = {
//         courseId: course.id,
//         courseName: course.name,
//         coursePrice: course.price,
//       };
//       console.log("Sending checkout request:", payload);

//       const response = await axios.post(
//         `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       console.log("Checkout session response:", response.data);
//       const stripe = await stripePromise;
//       const { error } = await stripe.redirectToCheckout({
//         sessionId: response.data.sessionId,
//       });

//       if (error) {
//         console.error("Stripe redirect error:", error);
//         toast.error(`Failed to redirect to checkout: ${error.message}`);
//       }
//     } catch (err) {
//       console.error("Enroll error:", {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(
//         err.response?.data?.error || "Failed to create checkout session"
//       );
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!course) return <div>Course not found</div>;

//   return (
//     <div className="course-view-container">
//       <h2>{course.name}</h2>
//       <p>Price: ${course.price.toFixed(2)}</p>
//       <button onClick={handleEnroll} className="enroll-button">
//         Enroll Now
//       </button>
//     </div>
//   );
// };

// export default CourseViewer;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view courses");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const courseData = response.data;

        const formatted = {
          id: courseData.id,
          name: courseData.name || courseData.title || "Untitled Course",
          price: parseFloat(courseData.price),
        };

        if (
          !formatted.id ||
          !formatted.name ||
          isNaN(formatted.price) ||
          formatted.price <= 0
        ) {
          throw new Error("Invalid course data");
        }

        setCourse(formatted);
        setLoading(false);
      } catch (err) {
        console.error(
          "❌ Fetch course error:",
          err.response?.data || err.message
        );
        toast.error("Failed to load course");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to enroll");
      navigate("/login");
      return;
    }

    if (!course || !course.id || !course.name || isNaN(course.price)) {
      console.error("🚫 Invalid course object:", course);
      toast.error("Course data not loaded properly");
      return;
    }

    console.log("✅ Sending to checkout:", {
      courseId: course.id,
      courseName: course.name,
      coursePrice: course.price,
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        {
          courseId: String(course.id),
          courseName: course.name,
          coursePrice: parseFloat(course.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (err) {
      console.error("❌ Enroll error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Enrollment failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-view-container">
      <h2>{course.name}</h2>
      <p>Price: ${course.price.toFixed(2)}</p>
      <button onClick={handleEnroll} className="enroll-button">
        Enroll Now
      </button>
    </div>
  );
};

export default CourseViewer;
