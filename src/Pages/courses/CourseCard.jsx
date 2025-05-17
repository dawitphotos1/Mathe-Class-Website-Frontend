import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./CourseCard.css";

const CourseCard = ({ course, user }) => {
  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to permanently delete this course?")
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/api/v1/courses/${course.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Course deleted successfully");
        window.location.reload();
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to delete course");
      }
    }
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/courses/enroll/${course.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to enroll");
    }
  };

  return (
    <div className="course-card">
      <img
        src={course.thumbnail || "/default-course.jpg"}
        alt={course.title}
        className="course-thumbnail"
      />
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="course-meta">
          <span className={`difficulty-badge ${course.difficulty}`}>
            {course.difficulty}
          </span>
          <span className="price">${course.price}</span>
        </div>
        <div className="action-buttons">
          {/* 👇 THIS LINK MUST MATCH App.jsx ROUTE */}
          <Link to={`/courses/${course.id}`} className="btn btn-primary">
            View Course
          </Link>
          {user?.role === "student" && (
            <button className="btn btn-primary" onClick={handleEnroll}>
              Enroll
            </button>
          )}
          {user?.id === course.teacherId && (
            <button className="btn btn-outline" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

