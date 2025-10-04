// // src/pages/courses/CourseDetail.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import "./CourseDetail.css";
// import { courseData, slugToIdMap } from "./courseData";
// import axios from "../../utils/axiosInstance";

// const CourseDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const course = courseData[id];
//   const [user, setUser] = useState(null);
//   const [enrollmentStatus, setEnrollmentStatus] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [apiLoading, setApiLoading] = useState(false);

//   const courseNumericId = slugToIdMap[id];

//   useEffect(() => {
//     // Get user from localStorage
//     const userData = JSON.parse(localStorage.getItem("user"));
//     setUser(userData);
    
//     if (userData && userData.role === "student" && courseNumericId) {
//       checkEnrollmentEligibility();
//     } else {
//       setLoading(false);
//     }
//   }, [courseNumericId]);

//   const checkEnrollmentEligibility = async () => {
//     try {
//       setApiLoading(true);
//       const response = await axios.get(`/enrollments/eligibility/${courseNumericId}`);
//       console.log("Enrollment eligibility response:", response.data); // Debug log
//       setEnrollmentStatus(response.data);
//     } catch (err) {
//       console.error("Error checking enrollment eligibility:", err);
//       // If API fails, set default status
//       setEnrollmentStatus({ 
//         canEnroll: false, 
//         reason: "Error checking enrollment status",
//         userApproved: false 
//       });
//     } finally {
//       setLoading(false);
//       setApiLoading(false);
//     }
//   };

//   const handleEnrollNow = async () => {
//     try {
//       setApiLoading(true);
//       // Create payment session
//       const response = await axios.post("/payments/create-checkout-session", {
//         courseId: courseNumericId
//       });
      
//       // Redirect to Stripe checkout
//       if (response.data.sessionId) {
//         window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
//       } else {
//         throw new Error("No session ID received");
//       }
//     } catch (err) {
//       console.error("Enrollment error:", err);
//       alert("Failed to start enrollment process. Please try again.");
//     } finally {
//       setApiLoading(false);
//     }
//   };

//   const handleViewCurriculum = () => {
//     // Navigate to curriculum page
//     navigate(`/courses/${id}/curriculum`);
//   };

//   const handleBackToCourses = () => {
//     navigate("/courses");
//   };

//   // Debug information
//   console.log("Current state:", {
//     user,
//     enrollmentStatus,
//     loading,
//     courseNumericId,
//     isStudent: user?.role === "student"
//   });

//   if (!course) {
//     return (
//       <div className="course-detail-container">
//         <div className="error-message">
//           <h2>❌ Course not found</h2>
//           <button onClick={handleBackToCourses} className="btn-back">
//             ← Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="course-detail-container">
//         <div className="loading-message">Loading course information...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="course-detail-container">
//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="course-description">{course.description}</p>
//         <p className="course-price">Price: ${course.price}</p>
//       </div>

//       <div className="course-content">
//         <h2 className="curriculum-title">Course Curriculum</h2>
//         {course.contents.map((section, index) => (
//           <div className="unit-card" key={index}>
//             <h3 className="unit-title">{section.unit}</h3>
//             <ul className="lesson-list">
//               {section.lessons.map((lesson, idx) => (
//                 <li key={idx} className="lesson-item">
//                   <span className="lesson-icon">📘</span>
//                   <span className="lesson-text">{lesson}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>

//       <div className="course-actions">
//         {/* View Curriculum Button - Always Visible */}
//         <button 
//           className="btn-view-curriculum"
//           onClick={handleViewCurriculum}
//           disabled={apiLoading}
//         >
//           {apiLoading ? "Loading..." : "View Curriculum"}
//         </button>

//         {/* Enrollment Section - FIXED LOGIC */}
//         {user && user.role === "student" ? (
//           enrollmentStatus?.canEnroll ? (
//             // Student is approved and can enroll - SHOW ENROLL NOW BUTTON
//             <button 
//               className="btn-enroll-now" 
//               onClick={handleEnrollNow}
//               disabled={apiLoading}
//             >
//               {apiLoading ? "Processing..." : `Enroll Now - $${course.price}`}
//             </button>
//           ) : enrollmentStatus?.userApproved === false ? (
//             // Student NOT approved
//             <div className="enrollment-status">
//               <p className="status-message">
//                 ⏳ Your account is pending approval. Please wait for admin approval to enroll in courses.
//               </p>
//             </div>
//           ) : enrollmentStatus?.enrollmentStatus === 'pending' ? (
//             // Enrollment pending approval
//             <div className="enrollment-status">
//               <p className="status-message">📝 Your enrollment is pending approval</p>
//             </div>
//           ) : enrollmentStatus?.enrollmentStatus === 'approved' ? (
//             // Already enrolled and approved
//             <div className="enrollment-status">
//               <p className="status-message">✅ You are enrolled in this course</p>
//               <Link to={`/course/${id}/viewer`} className="btn-start-learning">
//                 Start Learning
//               </Link>
//             </div>
//           ) : (
//             // Other cases - show the reason
//             <div className="enrollment-status">
//               <p className="status-message">{enrollmentStatus?.reason || "Unable to enroll at this time"}</p>
//             </div>
//           )
//         ) : (
//           // Not a student or not logged in
//           <div className="enrollment-status">
//             <p className="status-message">
//               {!user ? "🔐 Please login to enroll in this course" : "🎓 This course is for students only"}
//             </p>
//             {!user && (
//               <Link to="/login" className="btn-login">
//                 Login Now
//               </Link>
//             )}
//             <button onClick={handleBackToCourses} className="btn-back">
//               ← Back to Courses
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;






// src/pages/courses/CourseDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CourseDetail.css";
import { courseData, slugToIdMap } from "./courseData";
import axios from "../../utils/axiosInstance";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courseData[id];
  const [user, setUser] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  const courseNumericId = slugToIdMap[id];

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    
    if (userData && userData.role === "student" && courseNumericId) {
      checkEnrollmentEligibility();
    } else {
      setLoading(false);
    }
  }, [courseNumericId]);

  const checkEnrollmentEligibility = async () => {
    try {
      setApiLoading(true);
      const response = await axios.get(`/enrollments/eligibility/${courseNumericId}`);
      console.log("Enrollment eligibility response:", response.data);
      setEnrollmentStatus(response.data);
    } catch (err) {
      console.error("Error checking enrollment eligibility:", err);
      setEnrollmentStatus({ 
        canEnroll: false, 
        reason: "Error checking enrollment status",
        userApproved: false 
      });
    } finally {
      setLoading(false);
      setApiLoading(false);
    }
  };

  const handleEnrollNow = () => {
    // Navigate to payment page with course ID
    navigate(`/payment/${courseNumericId}`);
  };

  const handleViewCurriculum = () => {
    navigate(`/courses/${id}/curriculum`);
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // Debug information
  console.log("Current state:", {
    user,
    enrollmentStatus,
    loading,
    courseNumericId,
    isStudent: user?.role === "student"
  });

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="error-message">
          <h2>❌ Course not found</h2>
          <button onClick={handleBackToCourses} className="btn-back">
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="course-detail-container">
        <div className="loading-message">Loading course information...</div>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <p className="course-price">Price: ${course.price}</p>
      </div>

      <div className="course-content">
        <h2 className="curriculum-title">Course Curriculum</h2>
        {course.contents.map((section, index) => (
          <div className="unit-card" key={index}>
            <h3 className="unit-title">{section.unit}</h3>
            <ul className="lesson-list">
              {section.lessons.map((lesson, idx) => (
                <li key={idx} className="lesson-item">
                  <span className="lesson-icon">📘</span>
                  <span className="lesson-text">{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="course-actions">
        {/* View Curriculum Button - Always Visible */}
        <button 
          className="btn-view-curriculum"
          onClick={handleViewCurriculum}
          disabled={apiLoading}
        >
          {apiLoading ? "Loading..." : "View Curriculum"}
        </button>

        {/* ENROLL NOW BUTTON - Show for ALL students (approved or not) */}
        {user && user.role === "student" ? (
          // Student is logged in - show ENROLL NOW button
          <button 
            className="btn-enroll-now" 
            onClick={handleEnrollNow}
            disabled={apiLoading}
          >
            {apiLoading ? "Processing..." : `Enroll Now - $${course.price}`}
          </button>
        ) : (
          // Not logged in or not a student
          <div className="enrollment-options">
            {!user ? (
              // Not logged in - show both login and enroll options
              <>
                <button 
                  className="btn-enroll-now" 
                  onClick={handleEnrollNow}
                >
                  Enroll Now - ${course.price}
                </button>
                <p className="login-prompt">
                  Already have an account?{" "}
                  <button onClick={handleLogin} className="btn-login-text">
                    Login here
                  </button>
                </p>
              </>
            ) : (
              // Logged in but not a student
              <div className="enrollment-status">
                <p className="status-message">
                  🎓 This course is for students only
                </p>
                <button onClick={handleBackToCourses} className="btn-back">
                  ← Back to Courses
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show status messages for enrolled students */}
        {user && user.role === "student" && enrollmentStatus && (
          <div className="enrollment-status">
            {enrollmentStatus.enrollmentStatus === 'pending' && (
              <p className="status-message">📝 Your enrollment is pending approval</p>
            )}
            {enrollmentStatus.enrollmentStatus === 'approved' && (
              <p className="status-message">✅ You are enrolled in this course</p>
            )}
            {enrollmentStatus.userApproved === false && (
              <p className="status-message">
                ⏳ Your account is pending admin approval
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;