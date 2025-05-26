
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { loadStripe } from "@stripe/stripe-js";
// import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";

// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// const CourseViewer = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const token = localStorage.getItem("token");
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

//         // ✅ Extract only the needed data
//         const { id, title, price } = response.data;

//         const formatted = {
//           id: id?.toString(), // Ensure it's a string
//           name: title?.toString(), // Ensure it's a string
//           price: parseFloat(price),
//         };

//         console.log("✅ Final course data:", formatted);

//         if (!formatted.id || !formatted.name || isNaN(formatted.price)) {
//           throw new Error("Invalid course data");
//         }

//         setCourse(formatted);
//         setLoading(false);
//       } catch (err) {
//         console.error(
//           "❌ Fetch course error:",
//           err.response?.data || err.message
//         );
//         toast.error("Failed to load course");
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [courseId, navigate]);

//   const handleEnroll = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Please log in to enroll");
//       navigate("/login");
//       return;
//     }

//     if (!course || !course.id || !course.name || isNaN(course.price)) {
//       console.error("🚫 Invalid course object:", course);
//       toast.error("Course data not loaded properly");
//       return;
//     }

//     // ✅ Show exact payload before sending
//     const payload = {
//       courseId: course.id,
//       courseName: course.name,
//       coursePrice: course.price,
//     };

//     console.log("✅ Sending checkout payload:", payload);

//     try {
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

//       const stripe = await stripePromise;
//       await stripe.redirectToCheckout({
//         sessionId: response.data.sessionId,
//       });
//     } catch (err) {
//       console.error("❌ Enroll error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.error || "Enrollment failed");
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




// Mathe-Class-Website-Frontend/src/Pages/courses/CourseViewer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CourseViewer = () => {
  const { id: courseId } = useParams(); // Renamed for clarity
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          id: courseData.id?.toString(),
          name: courseData.title?.toString(),
          price: parseFloat(courseData.price) || 0,
          description: courseData.description || "No description available",
          teacher: courseData.teacher?.name || "Unknown",
        };

        console.log("✅ Fetched course data:", formatted);

        if (!formatted.id || !formatted.name) {
          throw new Error("Invalid course data");
        }

        setCourse(formatted);
        setLoading(false);
      } catch (err) {
        console.error("❌ Fetch course error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load course");
        toast.error(err.response?.data?.error || "Failed to load course");
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

    const payload = {
      courseId: course.id,
      courseName: course.name,
      coursePrice: course.price,
    };

    console.log("✅ Sending checkout payload:", payload);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        payload,
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
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-view-container">
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <p>Price: ${course.price.toFixed(2)}</p>
      <p>Instructor: {course.teacher}</p>
      <button onClick={handleEnroll} className="enroll-button">
        Enroll Now
      </button>
    </div>
  );
};

export default CourseViewer;