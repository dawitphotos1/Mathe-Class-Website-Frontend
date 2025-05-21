
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
//           <Link to="/payment" className="btn btn-primary enroll-btn">
//             Enroll Now
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseViewer;



import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./CourseViewer.css";

const CourseViewer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/courses/${id}`,
          {
            headers,
            withCredentials: true,
          }
        );

        const { success, course } = response.data;

        if (!success || !course) {
          throw new Error("Invalid course response format");
        }

        setCourse(course);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course:", err.response?.data || err);
        setError(
          err.response?.data?.error || err.message || "Failed to load course"
        );
        setLoading(false);
        toast.error("Failed to load course details");
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to enroll.");
      return;
    }

    if (!course?.id) {
      toast.error("Course ID is missing.");
      console.error("Course data:", course);
      return;
    }

    try {
      console.log("Sending enrollment request with:", {
        courseId: course.id,
        token,
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        { courseId: course.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("No redirect URL returned from server.");
      }
    } catch (error) {
      console.error("Enrollment error:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Failed to initiate payment session"
      );
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="error">
        {error || "Course not found"}
        <Link to="/courses" className="btn btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    lessons,
    teacher,
    unitCount,
    lessonCount,
  } = course;

  return (
    <div className="course-viewer">
      <div className="container">
        <Link to="/courses" className="btn btn-outline back-btn">
          Back to Courses
        </Link>
        <header className="course-header">
          <h1>{title}</h1>
          <p className="course-description">{description}</p>
          <div className="course-meta">
            <span className="course-price">${price.toFixed(2)}</span>
            {teacher && (
              <span className="course-teacher">Taught by: {teacher.name}</span>
            )}
            <span className="course-stats">
              {unitCount || 0} Units, {lessonCount || 0} Lessons
            </span>
          </div>
        </header>

        <section className="lessons-section">
          <h2>Course Content</h2>
          {lessons && lessons.length > 0 ? (
            <ul className="lessons-list">
              {lessons
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((lesson) => (
                  <li
                    key={lesson.id}
                    className={`lesson-item ${
                      lesson.isUnitHeader ? "unit-header" : ""
                    }`}
                  >
                    <div className="lesson-title">
                      {lesson.isUnitHeader ? (
                        <h3>{lesson.title}</h3>
                      ) : (
                        <span>{lesson.title}</span>
                      )}
                    </div>
                    {lesson.isPreview && (
                      <span className="preview-badge">Preview</span>
                    )}
                    {lesson.contentType === "video" && lesson.contentUrl && (
                      <a
                        href={lesson.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lesson-link"
                      >
                        Watch Video
                      </a>
                    )}
                  </li>
                ))}
            </ul>
          ) : (
            <p>No lessons available for this course.</p>
          )}
        </section>

        <div className="course-actions">
          <button onClick={handleEnroll} className="btn btn-primary enroll-btn">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
