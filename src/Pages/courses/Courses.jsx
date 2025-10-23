
// // src/Pages/courses/Courses.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
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

// const Courses = ({ user }) => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axiosInstance.get("/courses");
//         const data = res.data.courses || res.data;
//         setCourses(data);
//       } catch (err) {
//         toast.error("Failed to load courses");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handleViewCurriculum = (slug) => navigate(`/courses/${slug}`);

//   if (loading) {
//     return (
//       <div className="courses">
//         <h1>Available Courses</h1>
//         <div className="course-list">
//           {[1, 2, 3].map((i) => (
//             <CourseSkeleton key={i} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!courses.length)
//     return <div className="error">No courses available</div>;

//   return (
//     <div className="courses">
//       <h1>Available Courses</h1>
//       <div className="course-list">
//         {courses.map((course) => (
//           <div key={course.id} className="course-item">
//             <h2>{course.title}</h2>
//             <p>{course.description}</p>
//             <p>Price: ${parseFloat(course.price || 0).toFixed(2)}</p>
//             <button
//               className="btn-view-course"
//               onClick={() => navigate(`/courses/${course.slug}`)}
//             >
//               View Curriculum
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Courses;





// src/Pages/courses/Courses.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import CourseCurriculum from "../../components/CourseCurriculum"; // Add this import
import "./Courses.css";

const CourseSkeleton = () => (
  <div className="course-item skeleton">
    <div className="skeleton-title"></div>
    <div className="skeleton-text short"></div>
    <div className="skeleton-text long"></div>
    <div className="skeleton-btn"></div>
  </div>
);

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null); // Add this state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/courses");
        const data = res.data.courses || res.data;
        setCourses(data);
      } catch (err) {
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleViewCurriculum = (slug) => {
    setSelectedCourseSlug(slug); // Update this function
  };

  if (loading) {
    return (
      <div className="courses">
        <h1>Available Courses</h1>
        <div className="course-list">
          {[1, 2, 3].map((i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!courses.length)
    return <div className="error">No courses available</div>;

  return (
    <div className="courses">
      <h1>Available Courses</h1>
      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Price: ${parseFloat(course.price || 0).toFixed(2)}</p>
            
            {/* Updated buttons */}
            <div className="course-actions">
              <button
                className="btn-view-course"
                onClick={() => navigate(`/courses/${course.slug}`)}
              >
                View Details
              </button>
              
              <button
                className="btn-view-curriculum"
                onClick={() => handleViewCurriculum(course.slug)}
              >
                View Curriculum
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Curriculum Modal */}
      {selectedCourseSlug && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Course Curriculum</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedCourseSlug(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <CourseCurriculum courseSlug={selectedCourseSlug} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;