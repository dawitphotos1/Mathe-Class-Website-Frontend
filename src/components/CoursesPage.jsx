
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




// src/pages/CoursesPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import axiosInstance from "../utils/axiosInstance";
import "./CoursesPage.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching courses from /courses endpoint...");

        const response = await axiosInstance.get("/courses");
        console.log("✅ Full API response:", response.data);

        // FIX: Check the response structure and extract courses properly
        let coursesData = [];

        if (response.data.success && response.data.courses) {
          // Structure: { success: true, courses: [...] }
          coursesData = response.data.courses;
          console.log(
            "✅ Extracted courses from response.data.courses:",
            coursesData
          );
        } else if (Array.isArray(response.data)) {
          // Structure: direct array response
          coursesData = response.data;
          console.log(
            "✅ Extracted courses from direct array response:",
            coursesData
          );
        } else {
          // Try to find courses in other possible locations
          coursesData = response.data.data || response.data.items || [];
          console.log("⚠️ Using fallback courses extraction:", coursesData);
        }

        // Debug: Check the first course's price
        if (coursesData.length > 0) {
          console.log("💰 First course price check:", {
            title: coursesData[0].title,
            price: coursesData[0].price,
            priceType: typeof coursesData[0].price,
          });
        }

        setCourses(coursesData);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseDeleted = (deletedCourseId) => {
    setCourses(courses.filter(course => course.id !== deletedCourseId));
  };

  if (loading) {
    return (
      <div className="courses-page">
        <div className="courses-header">
          <h1>🎓 Explore Our Math Courses</h1>
          <p>Click "Free Preview" to see course content and unlock enrollment option</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page">
        <div className="error-container">
          <h2>❌ Error Loading Courses</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="courses-page">
        <div className="courses-header">
          <h1>🎓 Explore Our Math Courses</h1>
          <p>Click "Free Preview" to see course content and unlock enrollment option</p>
        </div>
        <div className="empty-container">
          <h2>📚 No Courses Available</h2>
          <p>No courses are available at the moment.</p>
          <p className="empty-subtitle">Please check back later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>🎓 Explore Our Math Courses</h1>
        <p>Click "Free Preview" to see course content and unlock enrollment option</p>
      </div>

      {/* Debug info - remove this after testing */}
      <div className="debug-info">
        <p>
          <strong>Debug:</strong> Showing {courses.length} courses. First course price: ${courses[0]?.price}
        </p>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onCourseDeleted={handleCourseDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;