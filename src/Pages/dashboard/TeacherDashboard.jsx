import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import CourseCard from "../courses/CourseCard";
import "../Dashboard.css";
import "../TeacherDashboard.css";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/courses?teacherId=${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "teacher") {
      fetchCourses();
    }
  }, [user]);

  const handleDelete = async (courseId) => {
    if (window.confirm("Permanently delete this course?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses((prev) => prev.filter((course) => course.id !== courseId));
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Courses</h1>
        <Link to="/create-course" className="btn btn-primary">
          Create New Course
        </Link>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            user={user}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
