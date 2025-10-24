
// //components/CoursePage.jsx
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         console.log("🔄 Fetching courses from /courses endpoint...");

//         const response = await axiosInstance.get("/courses");
//         console.log("✅ Full API response:", response.data);

//         // FIX: Check the response structure and extract courses properly
//         let coursesData = [];

//         if (response.data.success && response.data.courses) {
//           // Structure: { success: true, courses: [...] }
//           coursesData = response.data.courses;
//           console.log(
//             "✅ Extracted courses from response.data.courses:",
//             coursesData
//           );
//         } else if (Array.isArray(response.data)) {
//           // Structure: direct array response
//           coursesData = response.data;
//           console.log(
//             "✅ Extracted courses from direct array response:",
//             coursesData
//           );
//         } else {
//           // Try to find courses in other possible locations
//           coursesData = response.data.data || response.data.items || [];
//           console.log("⚠️ Using fallback courses extraction:", coursesData);
//         }

//         // Debug: Check the first course's price
//         if (coursesData.length > 0) {
//           console.log("💰 First course price check:", {
//             title: coursesData[0].title,
//             price: coursesData[0].price,
//             priceType: typeof coursesData[0].price,
//           });
//         }

//         setCourses(coursesData);
//       } catch (err) {
//         console.error("❌ Error fetching courses:", err);
//         setError("Failed to load courses. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   if (loading)
//     return <div className="text-center py-10">Loading courses...</div>;

//   if (error)
//     return <div className="text-center py-10 text-red-500">{error}</div>;

//   if (courses.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
//         <div className="text-center py-10">
//           <p className="text-gray-600">No courses available at the moment.</p>
//           <p className="text-gray-500 text-sm mt-2">
//             Please check back later or contact support.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

//       {/* Debug info - remove this after testing */}
//       <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
//         <p className="text-sm text-yellow-800">
//           <strong>Debug:</strong> Showing {courses.length} courses. First course
//           price: ${courses[0]?.price}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {courses.map((course) => (
//           <div
//             key={course.id}
//             className="border rounded-lg shadow-sm p-4 hover:shadow-md transition"
//           >
//             <Link to={`/courses/${course.id}`}>
//               <h2 className="text-xl font-semibold text-blue-600">
//                 {course.title}
//               </h2>
//               <p className="text-gray-600 mt-2">{course.description}</p>
//               <p className="text-green-600 font-bold mt-2">
//                 Price: $
//                 {course.price ? parseFloat(course.price).toFixed(2) : "0.00"}
//               </p>
//               <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                 View Course
//               </button>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/axios";
import "./CoursesPage.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFreePreview = (courseSlug) => {
    navigate(`/courses/${courseSlug}/preview`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Our Courses</h1>
        <p>
          Browse our comprehensive math curriculum and preview course content
        </p>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image-container">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="course-image"
                />
              ) : (
                <div className="course-image-placeholder">
                  <span>{course.title}</span>
                </div>
              )}
            </div>

            <div className="course-content">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">
                {course.description ||
                  "Comprehensive math course with expert instruction"}
              </p>

              <div className="course-meta">
                <div className="course-teacher">
                  <span>
                    Instructor: {course.teacher?.name || "Math Instructor"}
                  </span>
                </div>
                <div className="course-price">{formatPrice(course.price)}</div>
              </div>

              <div className="course-actions">
                <button
                  className="btn-preview"
                  onClick={() => handleFreePreview(course.slug)}
                >
                  Free Preview
                </button>
                {/* Enroll button removed from main listing as requested */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;