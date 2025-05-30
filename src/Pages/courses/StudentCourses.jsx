import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/enrollments/my-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses(res.data.courses);
      } catch (err) {
        console.error("❌ Error loading student courses:", err);
        toast.error("Failed to load your enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) return <div>Loading your courses...</div>;

  if (courses.length === 0) return <div>You have no enrolled courses yet.</div>;

  return (
    <div className="student-courses">
      <h2>📚 My Enrolled Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>
              <strong>Price:</strong> ${course.price}
            </p>
            <p>
              <strong>Enrolled At:</strong>{" "}
              {new Date(course.enrolledAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentCourses;
