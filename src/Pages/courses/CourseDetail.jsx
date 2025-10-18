
// // src/Pages/courses/CourseDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";
// import { courseData, slugToIdMap } from "./courseData";
// import "./CourseDetail.css";

// const CourseDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();

//   const [course, setCourse] = useState(null);
//   const [expandedUnit, setExpandedUnit] = useState(null);

//   useEffect(() => {
//     const selectedCourse = courseData[slug];

//     if (!selectedCourse) {
//       toast.error("Course not found.");
//       navigate("/courses");
//       return;
//     }

//     const courseId = slugToIdMap[slug];
    
//     if (!courseId) {
//       console.error("❌ No course ID mapping found for slug:", slug);
//       toast.error("Course configuration error. Please contact support.");
//       return;
//     }

//     const courseWithId = {
//       ...selectedCourse,
//       id: courseId
//     };

//     console.log("✅ Course with ID:", courseWithId);
//     setCourse(courseWithId);
//   }, [slug, navigate]);

//   // Check user role
//   const isStudent = user && user.role === 'student';

//   const toggleUnit = (index) => {
//     setExpandedUnit(expandedUnit === index ? null : index);
//   };

//   const handleEnroll = () => {
//     if (!course.id) {
//       toast.error("Course ID is missing. Cannot proceed with enrollment.");
//       console.error("Course ID is undefined:", course);
//       return;
//     }
    
//     if (!isAuthenticated) {
//       navigate('/login', { 
//         state: { 
//           from: `/courses/${slug}`,
//           message: "Please login to enroll in this course"
//         } 
//       });
//       return;
//     }

//     console.log("🚀 Navigating to payment with course ID:", course.id);
//     navigate(`/payment/${course.id}`);
//   };

//   const handleViewContent = () => {
//     // For teachers/admins, navigate to course content directly
//     if (user?.role === 'teacher') {
//       navigate('/teacher/courses');
//     } else if (user?.role === 'admin') {
//       navigate('/admin/courses');
//     } else {
//       navigate('/dashboard');
//     }
//   };

//   if (!course) {
//     return (
//       <div className="course-detail-container">
//         <div className="error-message">❌ Course not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="course-detail-container">
//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="course-description">{course.description}</p>
//         <div className="course-meta">
//           <span className="course-price">${course.price}</span>
//           {isAuthenticated && (
//             <span className={`user-badge role-${user.role}`}>
//               {user.role.toUpperCase()}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Course Curriculum */}
//       <div className="course-content">
//         <h2 className="curriculum-title">Course Curriculum</h2>

//         {course.contents.map((section, index) => (
//           <div
//             key={index}
//             className={`unit-card ${expandedUnit === index ? "expanded" : ""}`}
//           >
//             <div
//               className="unit-header"
//               onClick={() => toggleUnit(index)}
//             >
//               <h3 className="unit-title">
//                 {section.unit}
//                 <span className="unit-toggle">
//                   {expandedUnit === index ? "−" : "+"}
//                 </span>
//               </h3>
//             </div>

//             {expandedUnit === index && (
//               <ul className="lesson-list">
//                 {section.lessons.map((lesson, idx) => (
//                   <li key={idx} className="lesson-item">
//                     <span className="lesson-icon">📘</span>
//                     <span className="lesson-text">{lesson}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Enrollment Section - Role Based */}
//       <div className="course-actions">
//         {isStudent ? (
//           // Show enrollment button for students
//           <button
//             className="btn-enroll-now"
//             onClick={handleEnroll}
//           >
//             Enroll Now - ${course.price}
//           </button>
//         ) : isAuthenticated ? (
//           // Show access message for teachers and admins
//           <div className="non-student-access">
//             <div className="access-info">
//               <h4>
//                 {user.role === 'teacher' ? '👨‍🏫 Teacher Access' : '👑 Admin Access'}
//               </h4>
//               <p>
//                 {user.role === 'teacher' 
//                   ? 'You have full access to course content as a teacher.'
//                   : 'You have administrative access to all courses.'
//                 }
//               </p>
//               <button
//                 className="btn-view-content"
//                 onClick={handleViewContent}
//               >
//                 {user.role === 'teacher' ? 'Manage Courses' : 'View All Courses'}
//               </button>
//             </div>
//           </div>
//         ) : (
//           // Show enrollment button for non-authenticated users (will redirect to login)
//           <>
//             <button
//               className="btn-enroll-now"
//               onClick={handleEnroll}
//             >
//               Enroll Now - ${course.price}
//             </button>
//             <button
//               className="btn-login-text"
//               onClick={() => navigate("/login")}
//             >
//               Already have an account? Login here
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;




// src/pages/courses/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [slug]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      
      console.log(`🔄 Fetching course details for slug: ${slug}`);
      
      const { data } = await axiosInstance.get(`/courses/${slug}`);
      
      if (data.success && data.course) {
        console.log("✅ Course details loaded:", data.course);
        
        // Ensure price is properly formatted
        const formattedCourse = {
          ...data.course,
          price: parseFloat(data.course.price) || 0
        };
        
        setCourse(formattedCourse);
        
        // Check enrollment status if user is authenticated
        if (isAuthenticated && user) {
          checkEnrollmentStatus(formattedCourse.id);
        }
      } else {
        throw new Error("Course not found");
      }
    } catch (err) {
      console.error("❌ Error fetching course:", err);
      toast.error("Failed to load course information");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseId) => {
    try {
      const response = await axiosInstance.get(`/enrollments/check/${courseId}`);
      setIsEnrolled(response.data.enrolled || false);
    } catch (error) {
      console.error("Error checking enrollment:", error);
      setIsEnrolled(false);
    }
  };

  const toggleUnit = (index) => {
    setExpandedUnit(expandedUnit === index ? null : index);
  };

  const handleEnroll = () => {
    if (!course || !course.id) {
      toast.error("Course ID is missing. Cannot proceed with enrollment.");
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/courses/${slug}`,
          message: "Please login to enroll in this course"
        } 
      });
      return;
    }

    console.log("🚀 Navigating to payment with course ID:", course.id);
    navigate(`/payment/${course.id}`);
  };

  const handleViewContent = () => {
    if (user?.role === 'teacher') {
      navigate('/dashboard');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    } else if (isEnrolled) {
      navigate(`/courses/${course.id}/view-lessons`);
    } else {
      navigate('/my-courses');
    }
  };

  if (loading) {
    return (
      <div className="course-detail-container">
        <div className="loading-section">
          <h2>Loading Course Details...</h2>
          <p>Please wait while we load the course information.</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="error-section">
          <h2>Course Not Found</h2>
          <p>The requested course could not be found.</p>
          <button onClick={() => navigate("/courses")} className="btn-primary">
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = parseFloat(course.price || 0).toFixed(2);
  const isStudent = user && user.role === 'student';

  return (
    <div className="course-detail-container">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <div className="course-meta">
          <span className="course-price">${displayPrice}</span>
          {isAuthenticated && (
            <span className={`user-badge role-${user.role}`}>
              {user.role.toUpperCase()}
              {isEnrolled && " • ENROLLED"}
            </span>
          )}
        </div>
      </div>

      {/* Course Curriculum */}
      <div className="course-content">
        <h2 className="curriculum-title">Course Curriculum</h2>

        {course.lessons && course.lessons.length > 0 ? (
          course.lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`unit-card ${expandedUnit === index ? "expanded" : ""}`}
            >
              <div
                className="unit-header"
                onClick={() => toggleUnit(index)}
              >
                <h3 className="unit-title">
                  {lesson.title}
                  <span className="unit-toggle">
                    {expandedUnit === index ? "−" : "+"}
                  </span>
                </h3>
              </div>

              {expandedUnit === index && (
                <div className="lesson-content">
                  <p>{lesson.content || "Lesson content coming soon..."}</p>
                  {lesson.video_url && (
                    <div className="video-preview">
                      <small>Video available</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-lessons">
            <p>Course lessons will be available soon. Check back later!</p>
          </div>
        )}
      </div>

      {/* Enrollment Section */}
      <div className="course-actions">
        {isStudent ? (
          <button
            className="btn-enroll-now"
            onClick={handleEnroll}
            disabled={isEnrolled}
          >
            {isEnrolled ? "Already Enrolled" : `Enroll Now - $${displayPrice}`}
          </button>
        ) : isAuthenticated ? (
          <div className="non-student-access">
            <div className="access-info">
              <h4>
                {user.role === 'teacher' ? '👨‍🏫 Teacher Access' : '👑 Admin Access'}
              </h4>
              <p>
                {user.role === 'teacher' 
                  ? 'You have full access to course content as a teacher.'
                  : 'You have administrative access to all courses.'
                }
              </p>
              <button
                className="btn-view-content"
                onClick={handleViewContent}
              >
                {user.role === 'teacher' ? 'Manage Courses' : 'View Dashboard'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              className="btn-enroll-now"
              onClick={handleEnroll}
            >
              Enroll Now - $${displayPrice}
            </button>
            <button
              className="btn-login-text"
              onClick={() => navigate("/login")}
            >
              Already have an account? Login here
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;