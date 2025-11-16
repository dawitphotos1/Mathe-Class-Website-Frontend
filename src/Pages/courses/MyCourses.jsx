// src/pages/courses/MyCourses.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./MyCourses.css";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await axiosInstance.get("/enrollments/my-courses");
      
      if (response.data.success) {
        setCourses(response.data.courses || []);
      } else {
        toast.error("Failed to load your courses");
      }
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      toast.error("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}/view`);
  };

  const handleContinueLearning = (courseId) => {
    navigate(`/courses/${courseId}/view-lessons`);
  };

  if (loading) {
    return (
      <div className="my-courses-loading">
        <div className="loading-spinner"></div>
        <p>Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="my-courses">
      <div className="my-courses-header">
        <h1>My Enrolled Courses</h1>
        <p>Continue your learning journey</p>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <h2>No courses enrolled yet</h2>
          <p>Browse our courses to start learning!</p>
          <button onClick={() => navigate("/courses")} className="btn-browse">
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="enrolled-courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="enrolled-course-card">
              <div className="course-header">
                <h3>{course.title}</h3>
                <span className="status-badge">{course.approval_status}</span>
              </div>
              
              <div className="course-info">
                <p className="course-description">
                  {course.description || "No description available"}
                </p>
                <div className="course-meta">
                  <span className="enrolled-date">
                    Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="course-actions">
                {course.approval_status === "approved" ? (
                  <button
                    onClick={() => handleContinueLearning(course.id)}
                    className="btn-continue"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button className="btn-pending" disabled>
                    Pending Approval
                  </button>
                )}
                <button
                  onClick={() => handleViewCourse(course.id)}
                  className="btn-view"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;