import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CourseUnitsPage = () => {
  const { courseId } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        setLoading(true);
        // Fetch course details
        const courseResponse = await axios.get(`/api/v1/courses/${courseId}`);
        setCourse(courseResponse.data);

        // Fetch lessons for the course
        const lessonsResponse = await axios.get(
          `/api/v1/courses/${courseId}/lessons`
        );
        const lessons = lessonsResponse.data;

        // Organize lessons into units
        const unitHeaders = lessons.filter((lesson) => lesson.isUnitHeader);
        const groupedUnits = unitHeaders.map((header) => ({
          id: header.id,
          title: header.unitTitle || header.title,
          lessons: lessons.filter(
            (lesson) => lesson.unitId === header.id && !lesson.isUnitHeader
          ),
        }));

        setUnits(groupedUnits);
      } catch (err) {
        setError("Failed to load course or lessons");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!course) return <div className="text-center py-10">Course not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <Link
        to="/courses"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Courses
      </Link>
      <h2 className="text-2xl font-semibold mb-4">Units and Lessons</h2>
      {units.length === 0 ? (
        <p className="text-gray-600">No units available for this course.</p>
      ) : (
        <div className="space-y-6">
          {units.map((unit) => (
            <div key={unit.id} className="border rounded-lg shadow-sm p-4">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                {unit.title}
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                {unit.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      to={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="text-gray-800 hover:text-blue-500"
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseUnitsPage;
