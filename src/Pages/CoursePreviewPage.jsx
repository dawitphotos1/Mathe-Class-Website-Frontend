// // src/pages/CoursePreviewPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext";
// import { usePayment } from "../hooks/usePayment";
// import axiosInstance from "../utils/axiosInstance";
// import "./CoursePreviewPage.css";

// const CoursePreviewPage = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();
//   const { createCheckout, processing } = usePayment();

//   const [course, setCourse] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       if (!courseId) {
//         setError("No course ID provided");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);

//         // Fetch course details
//         const courseResponse = await axiosInstance.get(
//           `/courses/id/${courseId}`
//         );
//         if (courseResponse.data?.course) {
//           setCourse(courseResponse.data.course);
//         } else {
//           throw new Error("Course not found");
//         }

//         // Fetch lessons for this course
//         const lessonsResponse = await axiosInstance.get(
//           `/lessons/course/${courseId}`
//         );
//         setLessons(lessonsResponse.data?.lessons || []);

//         // Check enrollment status if user is logged in
//         if (user) {
//           const enrollmentResponse = await axiosInstance.get(
//             `/enrollments/check/${courseId}`
//           );
//           setIsEnrolled(enrollmentResponse.data.enrolled || false);
//         }
//       } catch (err) {
//         console.error("Error fetching course data:", err);
//         setError("Failed to load course preview");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseData();
//   }, [courseId, user]);

//   const handleEnroll = async () => {
//     if (!isAuthenticated) {
//       toast.error("Please log in to enroll in this course.");
//       navigate("/login", { state: { from: `/courses/${courseId}/preview` } });
//       return;
//     }

//     if (isEnrolled) {
//       toast.error("You are already enrolled in this course!");
//       navigate(`/courses/${courseId}/view-lessons`);
//       return;
//     }

//     try {
//       await createCheckout(courseId);
//     } catch (error) {
//       console.error("Enrollment failed:", error);
//     }
//   };

//   const getDisplayPrice = () => {
//     if (!course?.price) return "0.00";
//     return parseFloat(course.price).toFixed(2);
//   };

//   if (loading) {
//     return (
//       <div className="course-preview-page">
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading course preview...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="course-preview-page">
//         <div className="error-container">
//           <h2>❌ Error</h2>
//           <p>{error}</p>
//           <button onClick={() => navigate("/courses")} className="btn-primary">
//             Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="course-preview-page">
//         <div className="error-container">
//           <h2>Course Not Found</h2>
//           <p>The requested course could not be found.</p>
//           <button onClick={() => navigate("/courses")} className="btn-primary">
//             Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Group lessons by unit (assuming lessons have unit information)
//   const groupedLessons = lessons.reduce((acc, lesson) => {
//     const unit = lesson.unit || "General";
//     if (!acc[unit]) {
//       acc[unit] = [];
//     }
//     acc[unit].push(lesson);
//     return acc;
//   }, {});

//   const displayPrice = getDisplayPrice();

//   return (
//     <div className="course-preview-page">
//       {/* Header Section */}
//       <div className="preview-header">
//         <button onClick={() => navigate("/courses")} className="back-btn">
//           ← Back to Courses
//         </button>
//         <h1>{course.title} - Free Preview</h1>
//         <p className="preview-subtitle">
//           Explore the course content. Enroll to get full access to all lessons
//           and features.
//         </p>
//       </div>

//       {/* Course Info */}
//       <div className="course-info-section">
//         <div className="course-meta">
//           {course.teacher && (
//             <div className="instructor-info">
//               <strong>Instructor:</strong> {course.teacher.name}
//             </div>
//           )}
//           <div className="price-info">
//             <strong>Price:</strong> ${displayPrice}
//           </div>
//         </div>
//         <p className="course-description">
//           {course.description || "No description available."}
//         </p>
//       </div>

//       {/* Course Content Preview */}
//       <div className="course-content-section">
//         <h2>Course Content Preview</h2>

//         {Object.keys(groupedLessons).length === 0 ? (
//           <div className="no-lessons">
//             <p>No lessons available for preview yet.</p>
//           </div>
//         ) : (
//           Object.entries(groupedLessons).map(([unit, unitLessons]) => (
//             <div key={unit} className="unit-section">
//               <h3 className="unit-title">{unit}</h3>
//               <div className="lessons-list">
//                 {unitLessons.map((lesson, index) => (
//                   <div key={lesson.id} className="lesson-item">
//                     <div className="lesson-number">{index + 1}</div>
//                     <div className="lesson-info">
//                       <h4 className="lesson-title">{lesson.title}</h4>
//                       {lesson.contentType && (
//                         <span className="lesson-type">
//                           {lesson.contentType}
//                         </span>
//                       )}
//                     </div>
//                     <div className="lesson-preview">
//                       {lesson.contentType === "video" && lesson.video_url ? (
//                         <span className="preview-badge">
//                           🎥 Video Available
//                         </span>
//                       ) : (
//                         <span className="preview-badge">📖 Read Preview</span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Enrollment Section - Fixed at bottom */}
//       <div className="enrollment-section">
//         <div className="enrollment-card">
//           <div className="enrollment-info">
//             <h3>Ready to start learning?</h3>
//             <p>
//               Enroll now to get full access to all course materials, exercises,
//               and instructor support.
//             </p>
//             <div className="enrollment-features">
//               <div className="feature">✅ Full access to all lessons</div>
//               <div className="feature">✅ Downloadable resources</div>
//               <div className="feature">✅ Certificate of completion</div>
//               <div className="feature">✅ Instructor support</div>
//             </div>
//           </div>
//           <div className="enrollment-action">
//             <div className="price-display">${displayPrice}</div>
//             <button
//               onClick={handleEnroll}
//               disabled={processing || isEnrolled}
//               className="enroll-btn-large"
//             >
//               {processing
//                 ? "Processing..."
//                 : isEnrolled
//                 ? "Already Enrolled"
//                 : `ENROLL NOW - $${displayPrice}`}
//             </button>
//             {isEnrolled && (
//               <button
//                 onClick={() => navigate(`/courses/${courseId}/view-lessons`)}
//                 className="access-course-btn"
//               >
//                 Access Full Course
//               </button>
//             )}
//             <p className="security-note">🔒 Secure payment powered by Stripe</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoursePreviewPage;




// src/pages/CoursePreviewPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../hooks/usePayment";
import axiosInstance from "../utils/axiosInstance";
import "./CoursePreviewPage.css";

const CoursePreviewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createCheckout, processing } = usePayment();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError("No course ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await axiosInstance.get(`/courses/id/${courseId}`);
        if (courseResponse.data?.course) {
          setCourse(courseResponse.data.course);
        } else {
          throw new Error("Course not found");
        }

        // Fetch lessons for this course
        const lessonsResponse = await axiosInstance.get(`/lessons/course/${courseId}`);
        setLessons(lessonsResponse.data?.lessons || []);

        // Check enrollment status if user is logged in
        if (user) {
          try {
            const enrollmentResponse = await axiosInstance.get(`/enrollments/check/${courseId}`);
            setIsEnrolled(enrollmentResponse.data.enrolled || false);
          } catch (err) {
            console.error("Error checking enrollment:", err);
            setIsEnrolled(false);
          }
        }

      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course preview");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to enroll in this course.");
      navigate("/login", { state: { from: `/courses/${courseId}/preview` } });
      return;
    }

    if (isEnrolled) {
      toast.error("You are already enrolled in this course!");
      navigate(`/courses/${courseId}/view-lessons`);
      return;
    }

    try {
      await createCheckout(courseId);
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const getDisplayPrice = () => {
    if (!course?.price) return "0.00";
    return parseFloat(course.price).toFixed(2);
  };

  // Group lessons by units if they have unit information
  const groupLessonsByUnit = () => {
    const units = {};
    
    lessons.forEach(lesson => {
      // Assuming lessons have a unit_id or similar property for grouping
      const unitId = lesson.unit_id || 'default';
      if (!units[unitId]) {
        units[unitId] = {
          title: lesson.unit_title || 'Course Content',
          lessons: []
        };
      }
      units[unitId].lessons.push(lesson);
    });
    
    return Object.values(units);
  };

  if (loading) {
    return (
      <div className="course-preview-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading course preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-preview-page">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/courses")} className="btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-preview-page">
        <div className="error-container">
          <h2>Course Not Found</h2>
          <p>The requested course could not be found.</p>
          <button onClick={() => navigate("/courses")} className="btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = getDisplayPrice();
  const units = groupLessonsByUnit();

  return (
    <div className="course-preview-page">
      {/* Header Section */}
      <div className="preview-header">
        <button onClick={() => navigate("/courses")} className="back-btn">
          ← Back to Courses
        </button>
        <h1>{course.title}</h1>
        <p className="preview-subtitle">
          Explore the course content. Enroll to get full access to all lessons and features.
        </p>
      </div>

      {/* Course Info */}
      <div className="course-info-section">
        <div className="course-meta">
          {course.teacher && (
            <div className="instructor-info">
              <strong>Instructor:</strong> {course.teacher.name}
            </div>
          )}
          <div className="price-info">
            <strong>Full Course Price:</strong> ${displayPrice}
          </div>
        </div>
        <p className="course-description">
          {course.description || "No description available."}
        </p>
      </div>

      {/* Course Content Preview */}
      <div className="course-content-section">
        <h2>Course Curriculum Preview</h2>
        
        {lessons.length === 0 ? (
          <div className="no-lessons">
            <p>No lessons available for preview yet.</p>
          </div>
        ) : (
          <div className="curriculum-container">
            {units.map((unit, unitIndex) => (
              <div key={unitIndex} className="unit-section">
                <h3 className="unit-title">{unit.title}</h3>
                <div className="lessons-list">
                  {unit.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="lesson-item">
                      <div className="lesson-number">{unitIndex + 1}.{index + 1}</div>
                      <div className="lesson-info">
                        <h4 className="lesson-title">{lesson.title}</h4>
                        {lesson.contentType && (
                          <span className="lesson-type">{lesson.contentType}</span>
                        )}
                        {lesson.description && (
                          <p className="lesson-description">{lesson.description}</p>
                        )}
                      </div>
                      <div className="lesson-preview">
                        {lesson.contentType === 'video' && lesson.video_url ? (
                          <span className="preview-badge video-preview">🎥 Video Preview</span>
                        ) : lesson.contentType === 'text' ? (
                          <span className="preview-badge text-preview">📖 Text Preview</span>
                        ) : (
                          <span className="preview-badge">👀 Preview Available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollment Section - Fixed at bottom */}
      <div className="enrollment-section">
        <div className="enrollment-card">
          <div className="enrollment-info">
            <h3>Ready to start learning?</h3>
            <p>Enroll now to get full access to all course materials, exercises, and instructor support.</p>
            <div className="enrollment-features">
              <div className="feature">✅ Full access to all {lessons.length} lessons</div>
              <div className="feature">✅ Downloadable resources and exercises</div>
              <div className="feature">✅ Certificate of completion</div>
              <div className="feature">✅ Direct instructor support</div>
              <div className="feature">✅ Progress tracking</div>
              <div className="feature">✅ Lifetime access to course updates</div>
            </div>
          </div>
          <div className="enrollment-action">
            <div className="price-section">
              <div className="price-display">${displayPrice}</div>
              <div className="price-note">One-time payment • Lifetime access</div>
            </div>
            <button
              onClick={handleEnroll}
              disabled={processing || isEnrolled}
              className={`enroll-btn-large ${processing ? 'processing' : ''} ${isEnrolled ? 'enrolled' : ''}`}
            >
              {processing
                ? "Processing..."
                : isEnrolled
                ? "✓ Already Enrolled"
                : `ENROLL NOW - $${displayPrice}`}
            </button>
            {isEnrolled && (
              <button 
                onClick={() => navigate(`/courses/${courseId}/view-lessons`)}
                className="access-course-btn"
              >
                Access Full Course
              </button>
            )}
            <div className="security-guarantee">
              <p className="security-note">🔒 Secure payment powered by Stripe</p>
              <p className="guarantee-note">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewPage;