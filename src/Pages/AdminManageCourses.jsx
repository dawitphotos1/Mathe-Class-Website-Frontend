
// // src/Pages/AdminManageCourses.jsx
// import React from "react";

// const AdminManageCourses = () => {
//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
//       <p>This is the placeholder page for managing courses.</p>
//     </div>
//   );
// };

// export default AdminManageCourses;



import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const AdminManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to load courses.";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axiosInstance.delete(`/admin/courses/${courseId}`);
      toast.success("🗑️ Course deleted successfully");
      fetchCourses();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to delete course.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const containerClass = `p-6 rounded-lg shadow-md ${
    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const tableClass = `min-w-full border text-sm mt-4 ${
    isDark ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-800"
  }`;

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>

      {error && <p className="text-red-400">{error}</p>}

      {courses.length === 0 ? (
        <p className="text-gray-400">No courses available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Teacher</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr
                  key={c.id}
                  className={isDark ? "border-gray-700" : "border-gray-300"}
                >
                  <td className="px-4 py-2">{c.title}</td>
                  <td className="px-4 py-2">
                    {c.description?.slice(0, 60) || "No description"}...
                  </td>
                  <td className="px-4 py-2">
                    ${parseFloat(c.price || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{c.teacher?.name || "N/A"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => toast.info("Edit feature coming soon")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminManageCourses;

