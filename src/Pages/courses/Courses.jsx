// // src/pages/courses/Courses.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import "./Courses.css";

// const CourseSkeleton = () => (
//   <div className="course-item skeleton">
//     <div className="skeleton-title"></div>
//     <div className="skeleton-text short"></div>
//     <div className="skeleton-text long"></div>
//     <div className="skeleton-btn"></div>
//   </div>
// );

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();

//   const { user } = useAuth();

//   const fromPayment =
//     location.state?.fromPayment || searchParams.get("fromPayment") === "true";

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await axiosInstance.get("/courses");
//       const data = res.data?.courses || res.data;
//       setCourses(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to load courses:", err);
//       toast.error("Failed to load courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewCurriculum = (slug) => {
//     setSelectedCourseSlug(slug);
//   };

//   const handleEnrollNow = (id) => {
//     if (!user) {
//       navigate("/login", { state: { from: `/courses` } });
//       return;
//     }
//     navigate(`/payment/${id}`);
//   };

//   const handleCourseClick = (slug) => {
//     navigate(`/courses/${slug}`);
//   };

//   // ✅ FIXED: Removed duplicate /api/v1 prefix
//   const handleFreePreview = async (course) => {
//     try {
//       if (!course?.id) {
//         toast.error("Invalid course");
//         return;
//       }
      
//       console.log(`Fetching preview for course ID: ${course.id}`);
      
//       // ✅ FIXED: Remove /api/v1 prefix (it's already in baseURL)
//       const res = await axiosInstance.get(`/courses/${course.id}/preview-lesson`);
      
//       console.log("Preview API Response:", res.data);

//       if (res.data.success && res.data.lesson) {
//         // Navigate to the preview page
//         navigate(`/preview/${res.data.lesson.id}`, {
//           state: {
//             lesson: res.data.lesson,
//             courseId: course.id,
//             courseTitle: course.title
//           }
//         });
//       } else if (res.data.error === "No preview lesson found for this course") {
//         // Try to get the first lesson instead
//         const lessonsRes = await axiosInstance.get(`/courses/${course.id}/lessons`);
//         if (lessonsRes.data.success && lessonsRes.data.lessons?.length > 0) {
//           const firstLesson = lessonsRes.data.lessons[0];
//           navigate(`/preview/${firstLesson.id}`, {
//             state: {
//               lesson: firstLesson,
//               courseId: course.id,
//               courseTitle: course.title
//             }
//           });
//         } else {
//           toast.error("No preview content available for this course");
//         }
//       } else {
//         toast.error(res.data.error || "No free preview available");
//       }
//     } catch (error) {
//       console.error("Preview error:", error);
//       console.error("Error details:", error.response?.data);
      
//       // Try alternative preview route
//       if (error.response?.status === 404) {
//         navigate(`/courses/${course.id}/preview`);
//       } else {
//         toast.error("Unable to load preview. Please try again.");
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="courses">
//         {fromPayment && (
//           <div className="payment-success-navigation">
//             <div className="success-banner">
//               <h3>🎉 Payment Successful!</h3>
//               <p>Your enrollment is pending admin approval.</p>
//             </div>
//             <div className="navigation-buttons">
//               <button onClick={() => navigate("/")} className="nav-btn home-btn">
//                 ← Return to Home
//               </button>
//               <button onClick={() => navigate("/my-courses")} className="nav-btn courses-btn">
//                 View My Courses
//               </button>
//             </div>
//           </div>
//         )}

//         <h1>Available Courses</h1>
//         <div className="course-list">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <CourseSkeleton key={i} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!courses.length) {
//     return (
//       <div className="courses">
//         {fromPayment && (
//           <div className="payment-success-navigation">
//             <div className="success-banner">
//               <h3>🎉 Payment Successful!</h3>
//               <p>Your enrollment is pending admin approval.</p>
//             </div>
//             <div className="navigation-buttons">
//               <button onClick={() => navigate("/")} className="nav-btn home-btn">
//                 ← Return to Home
//               </button>
//               <button onClick={() => navigate("/my-courses")} className="nav-btn courses-btn">
//                 View My Courses
//               </button>
//             </div>
//           </div>
//         )}
//         <div className="error">No courses available</div>
//       </div>
//     );
//   }

//   return (
//     <div className="courses">
//       {fromPayment && (
//         <div className="payment-success-navigation">
//           <div className="success-banner">
//             <h3>🎉 Payment Successful!</h3>
//             <p>Your enrollment is pending admin approval.</p>
//           </div>
//           <div className="navigation-buttons">
//             <button onClick={() => navigate("/")} className="nav-btn home-btn">
//               ← Return to Home
//             </button>
//             <button onClick={() => navigate("/my-courses")} className="nav-btn courses-btn">
//               View My Courses
//             </button>
//           </div>
//         </div>
//       )}

//       <h1>Available Courses</h1>
//       <p className="courses-subtitle">Browse all available math courses</p>

//       <div className="course-list">
//         {courses.map((course) => (
//           <div key={course.id || course._id} className="course-item">
//             <div className="course-header" onClick={() => handleCourseClick(course.slug)}>
//               <h2>{course.title}</h2>
//               <p className="course-description">{course.description}</p>
//             </div>

//             <div className="course-details">
//               <p className="course-price">
//                 Price: ${parseFloat(course.price || 0).toFixed(2)}
//               </p>
//               {course.teacher && (
//                 <p className="course-teacher">Instructor: {course.teacher.name}</p>
//               )}
//             </div>

//             <div className="course-actions">
//               <button
//                 className="btn-enroll"
//                 onClick={() => handleEnrollNow(course.id || course._id)}
//               >
//                 Enroll Now - ${parseFloat(course.price || 0).toFixed(2)}
//               </button>

//               <button
//                 className="btn-preview"
//                 onClick={() => handleFreePreview(course)}
//               >
//                 Free Preview
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Courses;






// src/pages/courses/Courses.jsx - UPDATED VERSION
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./Courses.css";

const CourseSkeleton = () => (
  <div className="course-item skeleton">
    <div className="skeleton-title"></div>
    <div className="skeleton-text short"></div>
    <div className="skeleton-text long"></div>
    <div className="skeleton-btn"></div>
  </div>
);

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { user } = useAuth();

  const fromPayment =
    location.state?.fromPayment || searchParams.get("fromPayment") === "true";

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses");
      const data = res.data?.courses || res.data;
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    if (!user) {
      setLoadingEnrollments(false);
      return;
    }

    try {
      setLoadingEnrollments(true);
      const res = await axiosInstance.get("/enrollments/my-courses");
      if (res.data.success && res.data.courses) {
        setEnrolledCourses(res.data.courses);
      }
    } catch (err) {
      console.error("Failed to load enrolled courses:", err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleViewCurriculum = (slug) => {
    setSelectedCourseSlug(slug);
  };

  const handleEnrollNow = (id) => {
    if (!user) {
      navigate("/login", { state: { from: `/courses` } });
      return;
    }
    
    // Check if already enrolled
    const isEnrolled = enrolledCourses.some(course => course.id === id);
    if (isEnrolled) {
      toast.info("You are already enrolled in this course!");
      navigate(`/courses/${id}/view-lessons`);
      return;
    }
    
    navigate(`/payment/${id}`);
  };

  const handleCourseClick = (slug) => {
    navigate(`/courses/${slug}`);
  };

  const handleFreePreview = async (course) => {
    try {
      if (!course?.id) {
        toast.error("Invalid course");
        return;
      }
      
      console.log(`Fetching preview for course ID: ${course.id}`);
      
      // Check if user is already enrolled
      const isEnrolled = enrolledCourses.some(enrolled => enrolled.id === course.id);
      if (isEnrolled) {
        toast.info("You are already enrolled in this course! Access full content.");
        navigate(`/courses/${course.id}/view-lessons`);
        return;
      }
      
      // Check if user is a teacher/admin - they should have different access
      if (user?.role === "teacher" || user?.role === "admin") {
        // Teachers/admins can access course directly
        navigate(`/teacher/courses/${course.id}/view`);
        return;
      }
      
      // For non-enrolled students, show preview
      const res = await axiosInstance.get(`/courses/${course.id}/preview-lesson`);
      
      console.log("Preview API Response:", res.data);

      if (res.data.success && res.data.lesson) {
        // Navigate to the preview page
        navigate(`/preview/${res.data.lesson.id}`, {
          state: {
            lesson: res.data.lesson,
            courseId: course.id,
            courseTitle: course.title
          }
        });
      } else if (res.data.error === "No preview lesson found for this course") {
        // Try to get the first lesson instead
        const lessonsRes = await axiosInstance.get(`/courses/${course.id}/lessons`);
        if (lessonsRes.data.success && lessonsRes.data.lessons?.length > 0) {
          const firstLesson = lessonsRes.data.lessons[0];
          navigate(`/preview/${firstLesson.id}`, {
            state: {
              lesson: firstLesson,
              courseId: course.id,
              courseTitle: course.title
            }
          });
        } else {
          toast.error("No preview content available for this course");
        }
      } else {
        toast.error(res.data.error || "No free preview available");
      }
    } catch (error) {
      console.error("Preview error:", error);
      console.error("Error details:", error.response?.data);
      
      // Try alternative preview route
      if (error.response?.status === 404) {
        navigate(`/courses/${course.id}/preview`);
      } else {
        toast.error("Unable to load preview. Please try again.");
      }
    }
  };

  // Helper function to check if user is enrolled in a specific course
  const isUserEnrolledInCourse = (courseId) => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  // Helper function to check if user is teacher/admin
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  // Helper function to get the appropriate button text and action
  const getCourseActionButton = (course) => {
    const isEnrolled = isUserEnrolledInCourse(course.id);
    
    if (isEnrolled) {
      return {
        text: "Access Course",
        className: "btn-access",
        onClick: () => navigate(`/courses/${course.id}/view-lessons`)
      };
    } else if (user?.role === "student") {
      return {
        text: `Enroll Now - $${parseFloat(course.price || 0).toFixed(2)}`,
        className: "btn-enroll",
        onClick: () => handleEnrollNow(course.id)
      };
    } else {
      // For non-students (teachers, admins, or logged out users)
      return {
        text: "Free Preview",
        className: "btn-preview",
        onClick: () => handleFreePreview(course)
      };
    }
  };

  if (loading || (user && loadingEnrollments)) {
    return (
      <div className="courses">
        {fromPayment && (
          <div className="payment-success-navigation">
            <div className="success-banner">
              <h3>🎉 Payment Successful!</h3>
              <p>Your enrollment is pending admin approval.</p>
            </div>
            <div className="navigation-buttons">
              <button onClick={() => navigate("/")} className="nav-btn home-btn">
                ← Return to Home
              </button>
              <button onClick={() => navigate("/my-courses")} className="nav-btn courses-btn">
                View My Courses
              </button>
            </div>
          </div>
        )}

        <h1>Available Courses</h1>
        <div className="course-list">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="courses">
        {fromPayment && (
          <div className="payment-success-navigation">
            <div className="success-banner">
              <h3>🎉 Payment Successful!</h3>
              <p>Your enrollment is pending admin approval.</p>
            </div>
            <div className="navigation-buttons">
              <button onClick={() => navigate("/")} className="nav-btn home-btn">
                ← Return to Home
              </button>
              <button onClick={() => navigate("/my-courses")} className="nav-btn courses-btn">
                View My Courses
              </button>
            </div>
          </div>
        )}
        <div className="error">No courses available</div>
      </div>
    );
  }

  return (
    <div className="courses">
      {fromPayment && (
        <div className="payment-success-navigation">
          <div className="success-banner">
            <h3>🎉 Payment Successful!</h3>
            <p>Your enrollment is pending admin approval.</p>
          </div>
          <div className="navigation-buttons">
            <button onClick={() => navigate("/")} className="nav-btn home-btn">
              ← Return to Home
            </button>
            <button onClick={() => navigate("/my-courses")} className="nav-btn courses-btn">
              View My Courses
            </button>
          </div>
        </div>
      )}

      <h1>Available Courses</h1>
      <p className="courses-subtitle">Browse all available math courses</p>

      {user && enrolledCourses.length > 0 && (
        <div className="enrollment-notice">
          <p>
            <strong>Note:</strong> You are enrolled in {enrolledCourses.length} course(s). 
            Enrolled courses show "Access Course" button instead of "Enroll Now".
          </p>
        </div>
      )}

      <div className="course-list">
        {courses.map((course) => {
          const isEnrolled = isUserEnrolledInCourse(course.id);
          const actionButton = getCourseActionButton(course);
          
          return (
            <div key={course.id || course._id} className="course-item">
              <div className="course-header" onClick={() => handleCourseClick(course.slug)}>
                <h2>{course.title}</h2>
                <p className="course-description">{course.description}</p>
              </div>

              <div className="course-details">
                <p className="course-price">
                  Price: ${parseFloat(course.price || 0).toFixed(2)}
                </p>
                {course.teacher && (
                  <p className="course-teacher">Instructor: {course.teacher.name}</p>
                )}
                
                {/* Show enrollment badge if enrolled */}
                {isEnrolled && (
                  <div className="enrollment-badge">
                    <span className="badge enrolled">✓ Enrolled</span>
                  </div>
                )}
                
                {/* Show role badge for teachers/admins */}
                {isTeacherOrAdmin && !isEnrolled && (
                  <div className="enrollment-badge">
                    <span className="badge teacher">👨‍🏫 Teacher View</span>
                  </div>
                )}
              </div>

              <div className="course-actions">
                <button
                  className={actionButton.className}
                  onClick={actionButton.onClick}
                >
                  {actionButton.text}
                </button>

                {/* Only show "Free Preview" for non-enrolled students */}
                {!isEnrolled && user?.role === "student" && (
                  <button
                    className="btn-preview"
                    onClick={() => handleFreePreview(course)}
                  >
                    Free Preview
                  </button>
                )}
                
                {/* Show "View Details" for all users */}
                <button
                  className="btn-details"
                  onClick={() => handleCourseClick(course.slug)}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;