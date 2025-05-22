
// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../../config";
// import "./CourseViewer.css";

// const CourseViewer = () => {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const headers = token ? { Authorization: `Bearer ${token}` } : {};

//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/courses/${id}`,
//           {
//             headers,
//             withCredentials: true,
//           }
//         );

//         const { success, course } = response.data;

//         if (!success || !course) {
//           throw new Error("Invalid course response format");
//         }

//         setCourse(course);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching course:", err.response?.data || err);
//         setError(
//           err.response?.data?.error || err.message || "Failed to load course"
//         );
//         setLoading(false);
//         toast.error("Failed to load course details");
//       }
//     };

//     fetchCourse();
//   }, [id]);

//   const handleEnroll = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("You must be logged in to enroll.");
//       return;
//     }

//     if (!course?.id) {
//       toast.error("Course ID is missing.");
//       console.error("Course data:", course);
//       return;
//     }

//     try {
//       console.log("Sending enrollment request with:", {
//         courseId: course.id,
//         token,
//       });

//       const response = await axios.post(
//         `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
//         { courseId: course.id },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.data?.url) {
//         window.location.href = response.data.url;
//       } else {
//         toast.error("No redirect URL returned from server.");
//       }
//     } catch (error) {
//       console.error("Enrollment error:", error.response?.data || error);
//       toast.error(
//         error.response?.data?.error || "Failed to initiate payment session"
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         <div className="spinner"></div>
//         Loading course...
//       </div>
//     );
//   }

//   if (error || !course) {
//     return (
//       <div className="error">
//         {error || "Course not found"}
//         <Link to="/courses" className="btn btn-primary">
//           Back to Courses
//         </Link>
//       </div>
//     );
//   }

//   const {
//     title,
//     description,
//     price,
//     lessons,
//     teacher,
//     unitCount,
//     lessonCount,
//   } = course;

//   return (
//     <div className="course-viewer">
//       <div className="container">
//         <Link to="/courses" className="btn btn-outline back-btn">
//           Back to Courses
//         </Link>
//         <header className="course-header">
//           <h1>{title}</h1>
//           <p className="course-description">{description}</p>
//           <div className="course-meta">
//             <span className="course-price">${price.toFixed(2)}</span>
//             {teacher && (
//               <span className="course-teacher">Taught by: {teacher.name}</span>
//             )}
//             <span className="course-stats">
//               {unitCount || 0} Units, {lessonCount || 0} Lessons
//             </span>
//           </div>
//         </header>

//         <section className="lessons-section">
//           <h2>Course Content</h2>
//           {lessons && lessons.length > 0 ? (
//             <ul className="lessons-list">
//               {lessons
//                 .sort((a, b) => a.orderIndex - b.orderIndex)
//                 .map((lesson) => (
//                   <li
//                     key={lesson.id}
//                     className={`lesson-item ${
//                       lesson.isUnitHeader ? "unit-header" : ""
//                     }`}
//                   >
//                     <div className="lesson-title">
//                       {lesson.isUnitHeader ? (
//                         <h3>{lesson.title}</h3>
//                       ) : (
//                         <span>{lesson.title}</span>
//                       )}
//                     </div>
//                     {lesson.isPreview && (
//                       <span className="preview-badge">Preview</span>
//                     )}
//                     {lesson.contentType === "video" && lesson.contentUrl && (
//                       <a
//                         href={lesson.contentUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="lesson-link"
//                       >
//                         Watch Video
//                       </a>
//                     )}
//                   </li>
//                 ))}
//             </ul>
//           ) : (
//             <p>No lessons available for this course.</p>
//           )}
//         </section>

//         <div className="course-actions">
//           <button onClick={handleEnroll} className="btn btn-primary enroll-btn">
//             Enroll Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseViewer;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config"; // Use STRIPE_PUBLIC_KEY

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY); // Update to STRIPE_PUBLIC_KEY

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching course:", {
          courseId,
          token: token ? `${token.substring(0, 20)}...` : "None",
        });
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
        console.log("Course fetch response:", response.data);

        // Normalize data (adjust based on Courses table schema)
        const courseData = {
          id: response.data.id,
          name:
            response.data.name ||
            response.data.title ||
            response.data.courseTitle,
          price: parseFloat(response.data.price || response.data.coursePrice),
        };

        if (
          !courseData.id ||
          !courseData.name ||
          isNaN(courseData.price) ||
          courseData.price <= 0
        ) {
          throw new Error(
            "Invalid course data: missing id, name, or valid price"
          );
        }

        setCourse(courseData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch course error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        toast.error(err.response?.data?.error || "Failed to load course");
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    console.log("Enroll Now clicked:", {
      courseId: course?.id,
      courseName: course?.name,
      coursePrice: course?.price,
      token: token ? `${token.substring(0, 20)}...` : "None",
    });

    if (!token) {
      toast.error("Please log in to enroll");
      navigate("/login");
      return;
    }

    if (!course || !course.id || !course.name || !course.price) {
      console.error("Course data incomplete:", course);
      toast.error("Course data not loaded properly");
      return;
    }

    try {
      const payload = {
        courseId: course.id,
        courseName: course.name,
        coursePrice: course.price,
      };
      console.log("Sending checkout request:", payload);

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

      console.log("Checkout session response:", response.data);
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        toast.error(`Failed to redirect to checkout: ${error.message}`);
      }
    } catch (err) {
      console.error("Enroll error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(
        err.response?.data?.error || "Failed to create checkout session"
      );
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