
// src/pages/courses/StudentCourses.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // <-- use your axiosInstance
import "./StudentCourses.css"; // (optional) add styles as needed

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view your courses");
          return navigate("/login");
        }

        // axiosInstance is expected to add Authorization header internally
        const res = await axiosInstance.get("/api/v1/enrollments/my-courses");

        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("❌ Failed to load courses:", err);
        toast.error("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate]);

  if (loading) return <div className="loading">Loading your enrolled courses...</div>;

  return (
    <div className="student-courses">
      <h2>📘 My Enrolled Courses</h2>
      {courses.length === 0 ? (
        <p>You are not enrolled in any course yet.</p>
      ) : (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>💰 ${course.price}</p>
              <p>✅ Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentCourses;
