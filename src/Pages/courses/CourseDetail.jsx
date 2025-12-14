// // src/pages/courses/CourseDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import "./CourseDetail.css";

// const CourseDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const { user, isAuthenticated, checked } = useAuth();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [expandedUnit, setExpandedUnit] = useState(null);
//   const [isEnrolled, setIsEnrolled] = useState(false);

//   const fromPayment = location.state?.fromPayment || searchParams.get('fromPayment') === 'true';

//   useEffect(() => {
//     if (!slug) return;
//     fetchCourseDetails();
//   }, [slug]);

//   const fetchCourseDetails = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axiosInstance.get(`/courses/${slug}`);
//       const courseData = data.course || data;

//       if (!courseData) {
//         toast.error("Course not found");
//         return setCourse(null);
//       }

//       const formattedCourse = {
//         ...courseData,
//         lessons: Array.isArray(courseData.lessons) ? courseData.lessons : [],
//         price: Number(courseData.price || 0),
//       };

//       setCourse(formattedCourse);

//       if (checked && isAuthenticated && user) {
//         checkEnrollmentStatus(formattedCourse.id);
//       }
//     } catch (err) {
//       console.error("Error fetching course:", err);
//       toast.error("Failed to load course information");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkEnrollmentStatus = async (courseId) => {
//     try {
//       const response = await axiosInstance.get(`/enrollments/check/${courseId}`);
//       setIsEnrolled(response?.data?.enrolled || false);
//     } catch {
//       setIsEnrolled(false);
//     }
//   };

//   const handleEnroll = () => {
//     if (!course?.id) {
//       toast.error("Course ID missing");
//       return;
//     }

//     if (!checked) {
//       toast.info("Checking authentication...");
//       return;
//     }

//     if (!isAuthenticated) {
//       toast.warning("Please login to enroll");
//       navigate("/login", { state: { from: `/courses/${slug}` } });
//       return;
//     }

//     navigate(`/payment/${course.id}`);
//   };

//   const toggleUnit = (index) => {
//     setExpandedUnit(expandedUnit === index ? null : index);
//   };

//   if (loading) {
//     return (
//       <div className="course-detail-container">
//         <div className="loading-section">
//           <h2>Loading Course Details...</h2>
//         </div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="course-detail-container">
//         <div className="error-section">
//           <h2>Course Not Found</h2>
//           <button onClick={() => navigate("/courses")} className="btn-primary">
//             Browse All Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const displayPrice = Number(course.price || 0).toFixed(2);
//   const lessons = Array.isArray(course.lessons) ? course.lessons : [];
//   const isStudent = user?.role === "student";

//   return (
//     <div className="course-detail-container">
//       {fromPayment && (
//         <div className="payment-success-navigation">
//           <div className="success-banner">
//             <h3>🎉 Payment Successful!</h3>
//             <p>Your enrollment is pending admin approval.</p>
//           </div>
//           <div className="navigation-buttons">
//             <button onClick={() => navigate('/')} className="nav-btn home-btn">
//               ← Return to Home
//             </button>
//             <button onClick={() => navigate('/my-courses')} className="nav-btn courses-btn">
//               View My Courses
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="course-description">{course.description || "No description provided."}</p>
//         <div className="course-meta">
//           <span className="course-price">${displayPrice}</span>
//           {isAuthenticated && user && (
//             <span className={`user-badge role-${user.role}`}>
//               {user.role.toUpperCase()}
//               {isEnrolled && " • ENROLLED"}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="course-content">
//         <h2 className="curriculum-title">Course Curriculum</h2>
//         {lessons.length > 0 ? (
//           lessons.map((lesson, i) => (
//             <div
//               key={lesson.id || i}
//               className={`unit-card ${expandedUnit === i ? "expanded" : ""}`}
//             >
//               <div className="unit-header" onClick={() => toggleUnit(i)}>
//                 <h3 className="unit-title">{lesson.title || "Untitled Lesson"}</h3>
//                 <span className="unit-toggle">{expandedUnit === i ? "−" : "+"}</span>
//               </div>
//               {expandedUnit === i && (
//                 <div className="lesson-content">
//                   <p>{lesson.content || "Lesson details coming soon..."}</p>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No lessons available yet.</p>
//         )}
//       </div>

//       <div className="course-actions">
//         {isStudent ? (
//           <button
//             className="btn-enroll-now"
//             onClick={handleEnroll}
//             disabled={isEnrolled}
//           >
//             {isEnrolled
//               ? "Already Enrolled"
//               : displayPrice === "0.00"
//               ? "Enroll Now - FREE"
//               : `Enroll Now - $${displayPrice}`}
//           </button>
//         ) : (
//           <button className="btn-enroll-now" onClick={handleEnroll}>
//             {displayPrice === "0.00"
//               ? "Enroll Now - FREE"
//               : `Enroll Now - $${displayPrice}`}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;





// src/pages/courses/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import LessonPreview from "../../components/LessonPreview";
import "./CourseDetail.css";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, checked } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [lessons, setLessons] = useState([]);

  const fromPayment = location.state?.fromPayment || searchParams.get('fromPayment') === 'true';

  useEffect(() => {
    if (!slug) return;
    fetchCourseDetails();
  }, [slug]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/courses/${slug}`);
      const courseData = data.course || data;

      if (!courseData) {
        toast.error("Course not found");
        return setCourse(null);
      }

      const formattedCourse = {
        ...courseData,
        lessons: Array.isArray(courseData.lessons) ? courseData.lessons : [],
        price: Number(courseData.price || 0),
      };

      setCourse(formattedCourse);
      setLessons(formattedCourse.lessons);

      if (checked && isAuthenticated && user) {
        checkEnrollmentStatus(formattedCourse.id);
      }
    } catch (err) {
      console.error("Error fetching course:", err);
      toast.error("Failed to load course information");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseId) => {
    try {
      const response = await axiosInstance.get(`/enrollments/check/${courseId}`);
      setIsEnrolled(response?.data?.enrolled || false);
    } catch {
      setIsEnrolled(false);
    }
  };

  const handleEnroll = () => {
    if (!course?.id) {
      toast.error("Course ID missing");
      return;
    }

    if (!checked) {
      toast.info("Checking authentication...");
      return;
    }

    if (!isAuthenticated) {
      toast.warning("Please login to enroll");
      navigate("/login", { state: { from: `/courses/${slug}` } });
      return;
    }

    navigate(`/payment/${course.id}`);
  };

  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handlePreviewLesson = (lesson) => {
    setPreviewLesson(lesson);
    setShowPreview(true);
  };

  const getContentIcon = (contentType) => {
    const type = contentType || "text";
    switch (type.toLowerCase()) {
      case "video":
        return <VideoLibraryIcon className="content-icon" style={{ color: "#e53935" }} />;
      case "pdf":
        return <PictureAsPdfIcon className="content-icon" style={{ color: "#d81b60" }} />;
      default:
        return <TextFieldsIcon className="content-icon" style={{ color: "#1e88e5" }} />;
    }
  };

  const getContentPreview = (lesson) => {
    const contentType = lesson.contentType || lesson.content_type || "text";
    const textContent = lesson.textContent || lesson.content || "";
    
    switch (contentType.toLowerCase()) {
      case "text":
        return textContent.length > 150 
          ? `${textContent.substring(0, 150)}...` 
          : textContent || "Text lesson content";
      case "pdf":
        return "PDF Document - Click 'Preview' to view the file";
      case "video":
        return "Video Lesson - Click 'Preview' to watch the video";
      default:
        return "Lesson content";
    }
  };

  const isLessonPreviewable = (lesson) => {
    const userRole = user?.role;
    const isPreviewLesson = lesson.isPreview || lesson.is_preview;
    
    // Non-authenticated users can only preview free preview lessons
    if (!user) {
      return isPreviewLesson;
    }
    
    // Students can preview if enrolled OR if it's a free preview lesson
    if (userRole === "student") {
      return isEnrolled || isPreviewLesson;
    }
    
    // Teachers and admins can preview all lessons
    if (userRole === "teacher" || userRole === "admin") {
      return true;
    }
    
    return false;
  };

  const getLessonStatus = (lesson) => {
    if (lesson.isPreview || lesson.is_preview) {
      return "free-preview";
    }
    if (isEnrolled) {
      return "enrolled";
    }
    return "locked";
  };

  if (loading) {
    return (
      <div className="course-detail-container">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <h2>Loading Course Details...</h2>
          <p>Please wait while we fetch the course information</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="error-section">
          <h2>Course Not Found</h2>
          <p>The course you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/courses")} className="btn-primary">
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = Number(course.price || 0).toFixed(2);
  const isStudent = user?.role === "student";
  const hasLessons = lessons.length > 0;

  return (
    <div className="course-detail-container">
      {fromPayment && (
        <div className="payment-success-navigation">
          <div className="success-banner">
            <h3>🎉 Payment Successful!</h3>
            <p>Your enrollment is pending admin approval. You'll be notified once approved.</p>
          </div>
          <div className="navigation-buttons">
            <button onClick={() => navigate('/')} className="nav-btn home-btn">
              ← Return to Home
            </button>
            <button onClick={() => navigate('/my-courses')} className="nav-btn courses-btn">
              View My Courses
            </button>
          </div>
        </div>
      )}

      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description || "No description provided."}</p>
        <div className="course-meta">
          <span className="course-price">${displayPrice}</span>
          {isAuthenticated && user && (
            <span className={`user-badge role-${user.role}`}>
              {user.role.toUpperCase()}
              {isEnrolled && " • ENROLLED"}
            </span>
          )}
        </div>
      </div>

      <div className="course-content">
        <h2 className="curriculum-title">
          Course Curriculum
          <span className="lesson-count">({lessons.length} lessons)</span>
        </h2>
        
        {hasLessons ? (
          <div className="lessons-container">
            {lessons.map((lesson, index) => {
              const lessonId = lesson.id || `lesson-${index}`;
              const isExpanded = expandedLessons[lessonId];
              const canPreview = isLessonPreviewable(lesson);
              const lessonStatus = getLessonStatus(lesson);
              
              return (
                <div 
                  key={lessonId} 
                  className={`lesson-card ${lessonStatus} ${isExpanded ? 'expanded' : ''}`}
                >
                  <div className="lesson-header" onClick={() => toggleLesson(lessonId)}>
                    <div className="lesson-info">
                      <div className="lesson-number">{index + 1}</div>
                      <div className="lesson-title-section">
                        {getContentIcon(lesson.contentType || lesson.content_type)}
                        <h3 className="lesson-title">{lesson.title || "Untitled Lesson"}</h3>
                        {lesson.isPreview || lesson.is_preview ? (
                          <span className="preview-badge">Free Preview</span>
                        ) : isEnrolled ? (
                          <span className="enrolled-badge">
                            <CheckCircleIcon style={{ fontSize: 16, marginRight: 4 }} />
                            Available
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="lesson-actions">
                      {canPreview && (
                        <button
                          className="preview-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewLesson(lesson);
                          }}
                        >
                          <VisibilityIcon style={{ marginRight: 6, fontSize: 18 }} />
                          Preview
                        </button>
                      )}
                      <span className="lesson-toggle">
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </span>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="lesson-content">
                      <div className="content-preview">
                        <p>{getContentPreview(lesson)}</p>
                        
                        {(lesson.contentType === "pdf" || lesson.contentType === "video") && canPreview && (
                          <div className="action-buttons">
                            <button
                              className="full-preview-btn"
                              onClick={() => handlePreviewLesson(lesson)}
                            >
                              <VisibilityIcon style={{ marginRight: 8 }} />
                              Open Full Preview
                            </button>
                          </div>
                        )}
                        
                        <div className="lesson-meta">
                          <span className="meta-item">
                            Type: {lesson.contentType || lesson.content_type || "text"}
                          </span>
                          <span className="meta-item">
                            Order: {lesson.orderIndex || lesson.order_index || 0}
                          </span>
                          {lesson.fileUrl && (
                            <span className="meta-item">
                              Has Attachment
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-lessons">
            <p>No lessons available for this course yet.</p>
            {user?.role === "teacher" && (
              <button 
                className="btn-primary"
                onClick={() => navigate(`/teacher-dashboard/courses/${course.id}/manage`)}
              >
                Add Lessons as Teacher
              </button>
            )}
          </div>
        )}
      </div>

      <div className="course-actions">
        <div className="enrollment-section">
          {isStudent ? (
            <button
              className="btn-enroll-now"
              onClick={handleEnroll}
              disabled={isEnrolled}
            >
              {isEnrolled
                ? "✓ Already Enrolled"
                : displayPrice === "0.00"
                ? "Enroll Now - FREE"
                : `Enroll Now - $${displayPrice}`}
            </button>
          ) : (
            <button className="btn-enroll-now" onClick={handleEnroll}>
              {displayPrice === "0.00"
                ? "Enroll Now - FREE"
                : `Enroll Now - $${displayPrice}`}
            </button>
          )}
          
          <div className="enrollment-info">
            {isEnrolled ? (
              <p className="info-text">You are enrolled in this course. Start learning!</p>
            ) : (
              <p className="info-text">
                {displayPrice === "0.00" 
                  ? "This course is completely free. Enroll now to get started!" 
                  : `Enroll to get full access to all ${lessons.length} lessons and resources.`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Preview Dialog */}
      {showPreview && (
        <LessonPreview
          open={showPreview}
          onClose={() => setShowPreview(false)}
          lesson={previewLesson}
        />
      )}
    </div>
  );
};

export default CourseDetail;