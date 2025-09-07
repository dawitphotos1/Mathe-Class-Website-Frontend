import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/courses");
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

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
