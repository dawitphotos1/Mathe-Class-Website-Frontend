// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../../config";
// import "./Courses.css";

// const Courses = ({ user }) => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Handle McAfee extension error
//     window.onerror = (message, source) => {
//       if (source.includes("mcafee")) {
//         toast.warn(
//           "A browser extension (McAfee) may be causing issues. Please disable it and try again."
//         );
//       }
//     };

//     // Fetch courses
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/api/v1/courses/all`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setCourses(response.data.courses || []);
//       } catch (err) {
//         console.error("Fetch courses error:", {
//           message: err.message,
//           status: err.response?.status,
//           data: err.response?.data,
//         });
//         toast.error(err.response?.data?.error || "Failed to fetch courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleViewCourse = async (slug) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/v1/courses/slug/${slug}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const { course, isEnrolled } = response.data;
//       navigate(`/course/${slug}`, { state: { course, isEnrolled } });
//     } catch (err) {
//       console.error("Fetch course error:", {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(err.response?.data?.error || "Failed to fetch course");
//     }
//   };

//   return (
//     <div className="courses-container">
//       <h2>Available Courses</h2>
//       {loading ? (
//         <p>Loading courses...</p>
//       ) : courses.length === 0 ? (
//         <p>No courses available.</p>
//       ) : (
//         <div className="courses-list">
//           {courses.map((course) => (
//             <div key={course.id} className="course-card">
//               <h3>{course.title}</h3>
//               <p>{course.description}</p>
//               <p>Subject: {course.subject}</p>
//               <p>Price: ${course.price}</p>
//               <button
//                 className="btn-primary"
//                 onClick={() => handleViewCourse(course.slug)}
//               >
//                 View Course
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Courses;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./Courses.css";

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle McAfee extension error
    window.onerror = (message, source) => {
      if (source.includes("mcafee")) {
        toast.warn(
          "A browser extension (McAfee) may be causing issues. Please disable it and try again."
        );
      }
    };

    // Fetch courses
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/courses/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("Fetch courses error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        toast.error(err.response?.data?.error || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewCourse = async (slug) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/courses/slug/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { course, isEnrolled } = response.data;
      navigate(`/course/${slug}`, { state: { course, isEnrolled } });
    } catch (err) {
      console.error("Fetch course error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(err.response?.data?.error || "Failed to fetch course");
    }
  };

  return (
    <div className="courses-container">
      <h2>Available Courses</h2>
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className="courses-list">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Subject: {course.subject}</p>
              <p>Price: ${course.price}</p>
              <button
                className="btn-primary"
                onClick={() => handleViewCourse(course.slug)}
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;