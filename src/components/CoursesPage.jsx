// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "../utils/axiosInstance"; // ✅ UPDATED

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("/courses"); // ✅ No need for full URL
//         setCourses(response.data);
//       } catch (err) {
//         setError("Failed to load courses");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   if (loading) return <div className="text-center py-10">Loading...</div>;
//   if (error)
//     return <div className="text-center py-10 text-red-500">{error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
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
//                 Price: ${course.price || "Free"}
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
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching courses from /courses endpoint...");

        // Use correct endpoint - just "/courses" since base URL already has /api/v1
        const response = await axiosInstance.get("/courses");
        console.log("✅ Courses response:", response.data);

        setCourses(response.data);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading)
    return <div className="text-center py-10">Loading courses...</div>;

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (courses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
        <div className="text-center py-10">
          <p className="text-gray-600">No courses available at the moment.</p>
          <p className="text-gray-500 text-sm mt-2">
            Please check back later or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border rounded-lg shadow-sm p-4 hover:shadow-md transition"
          >
            <Link to={`/courses/${course.id}`}>
              <h2 className="text-xl font-semibold text-blue-600">
                {course.title}
              </h2>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <p className="text-green-600 font-bold mt-2">
                Price: ${course.price || "Free"}
              </p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                View Course
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;