// // components/CoursesPage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { api } from "../utils/axios";
// import "./CoursesPage.css";

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
  
//   // Check if user came from payment success page
//   const fromPayment = location.state?.fromPayment || searchParams.get('fromPayment') === 'true';

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const response = await api.get("/courses");
//       if (response.data.success) {
//         setCourses(response.data.courses);
//       }
//     } catch (err) {
//       setError("Failed to load courses");
//       console.error("Error fetching courses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFreePreview = (courseSlug) => {
//     navigate(`/courses/${courseSlug}/preview`);
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(price);
//   };

//   if (loading) return <div className="loading">Loading courses...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="courses-page">
//       {/* Payment Success Navigation Banner */}
//       {fromPayment && (
//         <div className="payment-success-navigation">
//           <div className="success-banner">
//             <h3>🎉 Payment Successful!</h3>
//             <p>Your enrollment is pending admin approval. You can browse more courses or check your enrolled courses.</p>
//           </div>
//           <div className="navigation-buttons">
//             <button 
//               onClick={() => navigate('/')}
//               className="nav-btn home-btn"
//             >
//               ← Return to Home
//             </button>
//             <button 
//               onClick={() => navigate('/my-courses')}
//               className="nav-btn courses-btn"
//             >
//               View My Courses
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="courses-header">
//         <h1>Our Courses</h1>
//         <p>
//           Browse our comprehensive math curriculum and preview course content
//         </p>
//       </div>

//       <div className="courses-grid">
//         {courses.map((course) => (
//           <div key={course.id} className="course-card">
//             <div className="course-image-container">
//               {course.thumbnail ? (
//                 <img
//                   src={course.thumbnail}
//                   alt={course.title}
//                   className="course-image"
//                 />
//               ) : (
//                 <div className="course-image-placeholder">
//                   <span>{course.title}</span>
//                 </div>
//               )}
//             </div>

//             <div className="course-content">
//               <h3 className="course-title">{course.title}</h3>
//               <p className="course-description">
//                 {course.description ||
//                   "Comprehensive math course with expert instruction"}
//               </p>

//               <div className="course-meta">
//                 <div className="course-teacher">
//                   <span>
//                     Instructor: {course.teacher?.name || "Math Instructor"}
//                   </span>
//                 </div>
//                 <div className="course-price">{formatPrice(course.price)}</div>
//               </div>

//               <div className="course-actions">
//                 <button
//                   className="btn-preview"
//                   onClick={() => handleFreePreview(course.slug)}
//                 >
//                   Free Preview
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;





// src/components/CoursesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "./CoursesPage.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const fromPayment =
    location.state?.fromPayment || searchParams.get("fromPayment") === "true";

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses");
      const data = res.data?.courses || res.data;
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleFreePreview = async (course) => {
    try {
      if (!course?.id) {
        toast.error("Invalid course");
        return;
      }
      const res = await axiosInstance.get(
        `/api/v1/courses/${course.id}/preview-lesson`
      );

      const lessonId = res.data?.lessonId;
      if (lessonId) {
        navigate(`/lessons/${lessonId}/preview`);
      } else {
        toast.error("No free preview available");
      }
    } catch (err) {
      console.error("Preview error:", err);
      toast.error("Unable to load preview");
    }
  };

  const formatPrice = (price) => {
    const n = Number(price || 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-page">
      {fromPayment && (
        <div className="payment-success-navigation">
          <div className="success-banner">
            <h3>🎉 Payment Successful!</h3>
            <p>
              Your enrollment is pending admin approval. You can browse more
              courses or check your enrolled courses.
            </p>
          </div>
          <div className="navigation-buttons">
            <button onClick={() => navigate("/")} className="nav-btn home-btn">
              ← Return to Home
            </button>
            <button
              onClick={() => navigate("/my-courses")}
              className="nav-btn courses-btn"
            >
              View My Courses
            </button>
          </div>
        </div>
      )}

      <div className="courses-header">
        <h1>Our Courses</h1>
        <p>Browse our comprehensive math curriculum and preview course content</p>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image-container">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="course-image"
                />
              ) : (
                <div className="course-image-placeholder">
                  <span>{course.title}</span>
                </div>
              )}
            </div>

            <div className="course-content">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">
                {course.description ||
                  "Comprehensive math course with expert instruction"}
              </p>

              <div className="course-meta">
                <div className="course-teacher">
                  <span>
                    Instructor: {course.teacher?.name || "Math Instructor"}
                  </span>
                </div>
                <div className="course-price">{formatPrice(course.price)}</div>
              </div>

              <div className="course-actions">
                <button
                  className="btn-preview"
                  onClick={() => handleFreePreview(course)}
                >
                  Free Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
