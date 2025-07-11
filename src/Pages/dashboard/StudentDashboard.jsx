
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import CourseCard from "../courses/CourseCard";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/users/my-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          console.error("Failed to fetch enrolled courses.");
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="student-dashboard-container">
      <div className="student-dashboard-header">
        <h1>🎓 My Enrolled Courses</h1>
        <p>Continue learning your approved courses below.</p>
      </div>

      {loading ? (
        <p className="loading-text">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="no-courses">You're not enrolled in any courses yet.</p>
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
