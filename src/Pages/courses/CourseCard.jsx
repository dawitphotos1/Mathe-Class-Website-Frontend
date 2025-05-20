// // import React from "react";
// // import { Link } from "react-router-dom";
// // import axios from "axios";
// // import { API_BASE_URL } from "../../config";
// // import { toast } from "react-toastify";
// // import "./CourseCard.css";

// // const CourseCard = ({ course, user }) => {
// //   const handleDelete = async () => {
// //     if (
// //       window.confirm("Are you sure you want to permanently delete this course?")
// //     ) {
// //       try {
// //         const token = localStorage.getItem("token");
// //         await axios.delete(`${API_BASE_URL}/api/v1/courses/${course.id}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         toast.success("Course deleted successfully");
// //         window.location.reload();
// //       } catch (err) {
// //         toast.error(err.response?.data?.error || "Failed to delete course");
// //       }
// //     }
// //   };

// //   const handleEnroll = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const res = await axios.post(
// //         `${API_BASE_URL}/api/v1/courses/enroll/${course.id}`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       toast.success(res.data.message);
// //     } catch (err) {
// //       toast.error(err.response?.data?.error || "Failed to enroll");
// //     }
// //   };

// //   return (
// //     <div className="course-card">
// //       <img
// //         src={course.thumbnail || "/default-course.jpg"}
// //         alt={course.title}
// //         className="course-thumbnail"
// //       />
// //       <div className="course-content">
// //         <h3 className="course-title">{course.title}</h3>
// //         <p className="course-description">{course.description}</p>
// //         <div className="course-meta">
// //           <span className={`difficulty-badge ${course.difficulty}`}>
// //             {course.difficulty}
// //           </span>
// //           <span className="price">${course.price}</span>
// //         </div>
// //         <div className="action-buttons">
// //           {/* 👇 THIS LINK MUST MATCH App.jsx ROUTE */}
// //           <Link to={`/courses/${course.id}`} className="btn btn-primary">
// //             View Course
// //           </Link>
// //           {user?.role === "student" && (
// //             <button className="btn btn-primary" onClick={handleEnroll}>
// //               Enroll
// //             </button>
// //           )}
// //           {user?.id === course.teacherId && (
// //             <button className="btn btn-outline" onClick={handleDelete}>
// //               Delete
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CourseCard;



// import React from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../../config";
// import { toast } from "react-toastify";
// import "./CourseCard.css";

// const CourseCard = ({ course, user }) => {
//   const handleDelete = async () => {
//     if (
//       window.confirm("Are you sure you want to permanently delete this course?")
//     ) {
//       try {
//         const token = localStorage.getItem("token");
//         await axios.delete(`${API_BASE_URL}/api/v1/courses/${course.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         toast.success("Course deleted successfully");
//         window.location.reload();
//       } catch (err) {
//         toast.error(err.response?.data?.error || "Failed to delete course");
//       }
//     }
//   };

//   const handleEnroll = async () => {
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       toast.error("Please log in to enroll.");
//       return;
//     }
  
//     // ✅ Add this to debug what you're sending:
//     console.log("Enrolling with:", {
//       courseId: course.id,
//       courseTitle: course.title,
//       coursePrice: course.price,
//     });
  
//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
//         {
//           courseId: course.id,
//           courseTitle: course.title,
//           coursePrice: course.price,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
  
//       window.location.href = res.data.url;
//     } catch (err) {
//       console.error("Stripe error:", err.response || err);
//       toast.error(err.response?.data?.error || "Failed to initiate payment.");
//     }
//   };
  

//       const res = await axios.post(
//         `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
//         {
//           courseId: course.id,
//           courseTitle: course.title,
//           coursePrice: course.price,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // ✅ Redirect to Stripe checkout
//       window.location.href = res.data.url;
//     } catch (err) {
//       console.error("Stripe error:", err.response || err);
//       toast.error(err.response?.data?.error || "Failed to initiate payment.");
//     }
//   };

//   return (
//     <div className="course-card">
//       <img
//         src={course.thumbnail || "/default-course.jpg"}
//         alt={course.title}
//         className="course-thumbnail"
//       />
//       <div className="course-content">
//         <h3 className="course-title">{course.title}</h3>
//         <p className="course-description">{course.description}</p>
//         <div className="course-meta">
//           <span className={`difficulty-badge ${course.difficulty}`}>
//             {course.difficulty}
//           </span>
//           <span className="price">${course.price}</span>
//         </div>
//         <div className="action-buttons">
//           {/* 👇 THIS LINK MUST MATCH App.jsx ROUTE */}
//           <Link to={`/courses/${course.id}`} className="btn btn-primary">
//             View Course
//           </Link>

//           {user?.role === "student" && (
//             <button className="btn btn-primary" onClick={handleEnroll}>
//               Enroll Now
//             </button>
//           )}

//           {user?.id === course.teacherId && (
//             <button className="btn btn-outline" onClick={handleDelete}>
//               Delete
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseCard;


// ✅ CourseCard.jsx (FINAL FIXED VERSION)
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./CourseCard.css";

const CourseCard = ({ course, user }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this course?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/api/v1/courses/${course.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Course deleted successfully");
        window.location.reload();
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to delete course");
      }
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please log in to enroll.");

    // Validate course data
    if (!course?.id || !course?.title || course.price == null) {
      console.error("Invalid course data:", course);
      return toast.error("Missing course data. Please try again later.");
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        {
          courseId: course.id,
          courseTitle: course.title,
          coursePrice: parseFloat(course.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Stripe error:", err.response || err);
      toast.error(err.response?.data?.error || "Failed to initiate payment.");
    }
  };

  return (
    <div className="course-card">
      <img
        src={course.thumbnail || "/default-course.jpg"}
        alt={course.title}
        className="course-thumbnail"
      />
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="course-meta">
          <span className={`difficulty-badge ${course.difficulty}`}>
            {course.difficulty || "Unknown"}
          </span>
          <span className="price">${course.price}</span>
        </div>
        <div className="action-buttons">
          <Link to={`/courses/${course.id}`} className="btn btn-primary">
            View Course
          </Link>

          {user?.role === "student" && (
            <button className="btn btn-primary" onClick={handleEnroll}>
              Enroll Now
            </button>
          )}

          {user?.id === course.teacherId && (
            <button className="btn btn-outline" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
