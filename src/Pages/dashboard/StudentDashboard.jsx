

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import CourseCard from "../courses/CourseCard";
import "./StudentDashboard.css"; // ✅ Use this new file

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/v1/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="student-dashboard-container">
      <div className="student-dashboard-header">
        <h1>📚 Available Math Courses</h1>
        <p>Select a course to start learning!</p>
      </div>

      {loading ? (
        <p className="loading-text">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="no-courses">No courses available at the moment.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} showActions={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

