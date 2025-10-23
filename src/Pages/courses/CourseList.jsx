
// // src/Pages/courses/CourseList.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import "./CourseList.css";

// const CourseList = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState([]);

//   // Safely parse user data
//   const user = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("user"));
//     } catch {
//       return null;
//     }
//   })();

//   const enrolledCourses = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("enrolledCourses")) || [];
//     } catch {
//       return [];
//     }
//   })();

//   const fallbackCourses = [
//     { slug: "algebra-1", title: "Algebra 1", description: "Introduction to Algebra", price: 1200 },
//     { slug: "algebra-2", title: "Algebra 2", description: "Advanced Algebra Concepts", price: 1200 },
//     { slug: "pre-calculus", title: "Pre-Calculus", description: "Preparation for Calculus", price: 1200 },
//     { slug: "calculus", title: "Calculus", description: "Differential and Integral Calculus", price: 1250 },
//     { slug: "geometry-trigonometry", title: "Geometry & Trigonometry", description: "Shapes and Angles", price: 1250 },
//     { slug: "statistics-probability", title: "Statistics & Probability", description: "Data Analysis and Probability", price: 1250 },
//   ];

//   const courseImages = {
//     "Algebra 1": "/math-logos/algebra1.jpeg",
//     "Algebra 2": "/math-logos/algebra2.png",
//     "Pre-Calculus": "/math-logos/Pre-calculus.jpeg",
//     Calculus: "/math-logos/Calculus.jpeg",
//     "Geometry & Trigonometry": "/math-logos/geometry.jpeg",
//     "Statistics & Probability": "/math-logos/statistic.png",
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axiosInstance.get("/courses"); // ✅ Ensure this is a PUBLIC endpoint
//         if (res.data?.length > 0) {
//           setCourses(res.data);
//         } else {
//           setCourses(fallbackCourses);
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch courses, using fallback", err);
//         setCourses(fallbackCourses);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleCourseClick = (slug, id) => {
//     const courseIdStr = String(id);
//     if (user?.role === "student") {
//       if (enrolledCourses.includes(courseIdStr)) {
//         navigate(`/course/${slug}/viewer`);
//       } else {
//         navigate(`/course/${slug}`); // Not enrolled yet
//       }
//     } else {
//       navigate(`/course/${slug}`); // Guest or other roles
//     }
//   };

//   const formatPrice = (price) =>
//     price == null || isNaN(price) ? "N/A" : Number(price).toFixed(2);

//   return (
//     <div className="course-list">
//       <h2>Available Courses</h2>
//       <div className="courses-grid">
//         {courses.map((course) => (
//           <div key={course.id || course.slug} className="course-card">
//             <img
//               src={courseImages[course.title] || "/math-logos/default-course.jpg"}
//               alt={course.title}
//               className="course-image"
//             />
//             <div className="course-info">
//               <h3>{course.title}</h3>
//               <p>{course.description || "No description available."}</p>
//               <p className="course-price">
//                 Price: ${formatPrice(course.price)}
//               </p>

//               <button
//                 className="btn btn-primary"
//                 onClick={() => handleCourseClick(course.slug, course.id)}
//               >
//                 {user?.role === "student"
//                   ? enrolledCourses.includes(String(course.id))
//                     ? "Start Learning"
//                     : "View Curriculum"
//                   : "View Curriculum"}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CourseList;

//IT IS ALREADY COPY

//----------------------------------------------------------------------------




// src/Pages/courses/CourseList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import CourseCurriculum from "../../components/CourseCurriculum"; // Add this import
import "./CourseList.css";

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null); // Add this state

  // Safely parse user data
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const enrolledCourses = (() => {
    try {
      return JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    } catch {
      return [];
    }
  })();

  const fallbackCourses = [
    { slug: "algebra-1", title: "Algebra 1", description: "Introduction to Algebra", price: 1200 },
    { slug: "algebra-2", title: "Algebra 2", description: "Advanced Algebra Concepts", price: 1200 },
    { slug: "pre-calculus", title: "Pre-Calculus", description: "Preparation for Calculus", price: 1200 },
    { slug: "calculus", title: "Calculus", description: "Differential and Integral Calculus", price: 1250 },
    { slug: "geometry-trigonometry", title: "Geometry & Trigonometry", description: "Shapes and Angles", price: 1250 },
    { slug: "statistics-probability", title: "Statistics & Probability", description: "Data Analysis and Probability", price: 1250 },
  ];

  const courseImages = {
    "Algebra 1": "/math-logos/algebra1.jpeg",
    "Algebra 2": "/math-logos/algebra2.png",
    "Pre-Calculus": "/math-logos/Pre-calculus.jpeg",
    Calculus: "/math-logos/Calculus.jpeg",
    "Geometry & Trigonometry": "/math-logos/geometry.jpeg",
    "Statistics & Probability": "/math-logos/statistic.png",
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/courses"); // ✅ Ensure this is a PUBLIC endpoint
        if (res.data?.length > 0) {
          setCourses(res.data);
        } else {
          setCourses(fallbackCourses);
        }
      } catch (err) {
        console.error("❌ Failed to fetch courses, using fallback", err);
        setCourses(fallbackCourses);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (slug, id) => {
    const courseIdStr = String(id);
    if (user?.role === "student") {
      if (enrolledCourses.includes(courseIdStr)) {
        navigate(`/course/${slug}/viewer`);
      } else {
        navigate(`/course/${slug}`); // Not enrolled yet
      }
    } else {
      navigate(`/course/${slug}`); // Guest or other roles
    }
  };

  // Add this new function for View Curriculum
  const handleViewCurriculum = (slug) => {
    setSelectedCourseSlug(slug);
  };

  const formatPrice = (price) =>
    price == null || isNaN(price) ? "N/A" : Number(price).toFixed(2);

  return (
    <div className="course-list">
      <h2>Available Courses</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id || course.slug} className="course-card">
            <img
              src={courseImages[course.title] || "/math-logos/default-course.jpg"}
              alt={course.title}
              className="course-image"
            />
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>{course.description || "No description available."}</p>
              <p className="course-price">
                Price: ${formatPrice(course.price)}
              </p>

              {/* Updated buttons section */}
              <div className="course-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleCourseClick(course.slug, course.id)}
                >
                  {user?.role === "student"
                    ? enrolledCourses.includes(String(course.id))
                      ? "Start Learning"
                      : "Enroll Now"
                    : "View Details"}
                </button>
                
                {/* Add View Curriculum button */}
                <button
                  className="btn btn-secondary"
                  onClick={() => handleViewCurriculum(course.slug)}
                >
                  View Curriculum
                </button>
              </div>
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

export default CourseList;