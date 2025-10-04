
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




// routes/courses.js
import express from "express";
import {
  createCourse,
  getCourses,
  getPublicCourseBySlug,
  getLessonsByCourse,
  deleteCourse,
  getCourseById, // ✅ NEW: Import the new function
} from "../controllers/courseController.js";
import authenticateToken from "../middleware/authenticateToken.js";
import checkTeacherOrAdmin from "../middleware/checkTeacherOrAdmin.js";

const router = express.Router();

/* ========================================================
   🟢 PUBLIC ROUTES — accessible without login
======================================================== */

// View all courses (public)
router.get("/", getCourses);

// View a specific course by slug (public)
router.get("/:slug", getPublicCourseBySlug);

// ✅ NEW: Get course by ID (public) - FIXES THE ISSUE
router.get("/id/:id", getCourseById);

// View lessons by course (public)
router.get("/:courseId/lessons", getLessonsByCourse);

/* ========================================================
   🔐 PROTECTED ROUTES — restricted to teachers/admins
======================================================== */

// Create a new course (requires teacher/admin)
router.post("/", authenticateToken, checkTeacherOrAdmin, createCourse);

// Delete a course (requires teacher/admin)
router.delete("/:id", authenticateToken, checkTeacherOrAdmin, deleteCourse);

export default router;