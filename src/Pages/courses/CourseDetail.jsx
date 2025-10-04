
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import "./CourseDetail.css";
// import { courseData, slugToIdMap } from "./courseData";

// const CourseDetail = () => {
//   const { id } = useParams();
//   const course = courseData[id];
//   const user = JSON.parse(localStorage.getItem("user"));

//   const isStudent = user?.role === "student";
//   const courseNumericId = slugToIdMap[id];

//   // ✅ Check enrollment from both user object and localStorage
//   const localEnrolled =
//     JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//   const isEnrolled =
//     user?.enrolledCourses?.includes(courseNumericId) ||
//     localEnrolled.includes(String(courseNumericId));

//   if (!course) return <div className="error">❌ Course not found.</div>;

//   return (
//     <div className="course-detail">
//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="course-description">{course.description}</p>
//       </div>

//       <div className="course-content">
//         {course.contents.map((section, index) => (
//           <div className="unit-card" key={index}>
//             <h2 className="unit-title">{section.unit}</h2>
//             <ul className="lesson-list">
//               {section.lessons.map((lesson, idx) => (
//                 <li key={idx} className="lesson-item">
//                   {lesson}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>

//       <div className="course-footer">
//         {isStudent && (
//           <>
//             {!isEnrolled ? (
//               <Link to={`/payment/${courseNumericId}`} className="btn-enroll">
//                 Enroll Now
//               </Link>
//             ) : (
//               <Link to={`/course/${id}/viewer`} className="btn-start">
//                 Start Learning
//               </Link>
//             )}
//           </>
//         )}
//         <Link to="/courses" className="btn-back">
//           ← Back to Courses
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;




// // src/Pages/courses/CourseDetail.jsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import "./CourseDetail.css";
// import { courseData, slugToIdMap } from "./courseData";

// const CourseDetail = () => {
//   const { id } = useParams();
//   const course = courseData[id];
//   const user = JSON.parse(localStorage.getItem("user"));

//   const isStudent = user?.role === "student";
//   const courseNumericId = slugToIdMap[id];

//   // ✅ Check enrollment from both user object and localStorage
//   const localEnrolled =
//     JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//   const isEnrolled =
//     user?.enrolledCourses?.includes(courseNumericId) ||
//     localEnrolled.includes(String(courseNumericId));

//   if (!course) return <div className="error">❌ Course not found.</div>;

//   return (
//     <div className="course-detail">
//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="course-description">{course.description}</p>
//       </div>

//       <div className="course-content">
//         {course.contents.map((section, index) => (
//           <div className="unit-card" key={index}>
//             <h2 className="unit-title">{section.unit}</h2>
//             <ul className="lesson-list">
//               {section.lessons.map((lesson, idx) => (
//                 <li key={idx} className="lesson-item">
//                   {lesson}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>

//       <div className="course-footer">
//         {isStudent ? (
//           isEnrolled ? (
//             <Link to={`/course/${id}/viewer`} className="btn-start-course">
//               Start Learning
//             </Link>
//           ) : (
//             <Link to={`/payment/${courseNumericId}`} className="btn-enroll">
//               Enroll Now
//             </Link>
//           )
//         ) : (
//           <Link to="/courses" className="btn-back">
//             ← Back to Courses
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;





// src/Pages/courses/CourseDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CourseDetail.css";
import { courseData, slugToIdMap } from "./courseData";
import axios from "../../utils/axiosInstance";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courseData[id];
  const user = JSON.parse(localStorage.getItem("user"));
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const isStudent = user?.role === "student";
  const courseNumericId = slugToIdMap[id];

  useEffect(() => {
    const checkEnrollmentEligibility = async () => {
      if (isStudent && courseNumericId) {
        try {
          const response = await axios.get(`/enrollments/eligibility/${courseNumericId}`);
          setEnrollmentStatus(response.data);
        } catch (err) {
          console.error("Error checking enrollment eligibility:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkEnrollmentEligibility();
  }, [isStudent, courseNumericId]);

  const handleEnrollNow = () => {
    navigate(`/payment/${courseNumericId}`);
  };

  const handleViewCurriculum = () => {
    // Navigate to curriculum page
    navigate(`/courses/${id}/curriculum`);
  };

  if (!course) return <div className="error">❌ Course not found.</div>;
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="course-detail">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <p className="course-price">Price: ${course.price || "Free"}</p>
      </div>

      <div className="course-content">
        {course.contents.map((section, index) => (
          <div className="unit-card" key={index}>
            <h2 className="unit-title">{section.unit}</h2>
            <ul className="lesson-list">
              {section.lessons.map((lesson, idx) => (
                <li key={idx} className="lesson-item">
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="course-footer">
        {/* View Curriculum Button - Always Visible */}
        <button 
          className="btn-view-curriculum"
          onClick={handleViewCurriculum}
        >
          View Curriculum
        </button>

        {/* Enrollment Section */}
        {isStudent ? (
          enrollmentStatus?.canEnroll ? (
            // Student is approved and can enroll
            <button className="btn-enroll" onClick={handleEnrollNow}>
              Enroll Now - ${course.price || "Free"}
            </button>
          ) : enrollmentStatus?.userApproved ? (
            // Student is approved but already enrolled or other status
            <div className="enrollment-status">
              <p>{enrollmentStatus.reason}</p>
              {enrollmentStatus.enrollmentStatus === 'pending' && (
                <p>Your enrollment is pending approval</p>
              )}
              {enrollmentStatus.enrollmentStatus === 'approved' && (
                <Link to={`/course/${id}/viewer`} className="btn-start-course">
                  Start Learning
                </Link>
              )}
            </div>
          ) : (
            // Student not approved
            <div className="enrollment-status">
              <p>Your account is pending approval. Please wait for admin approval to enroll in courses.</p>
            </div>
          )
        ) : (
          // Not a student
          <Link to="/courses" className="btn-back">
            ← Back to Courses
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;