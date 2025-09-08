
import React from "react";
import { Link } from "react-router-dom";
import "./CourseDetailsModal.css";

const CourseDetailsModal = ({ course, onClose, onUnenroll }) => {
  if (!course) return null;

  const user = JSON.parse(localStorage.getItem("user"));
  const isTeacher = user?.role === "teacher";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h3>{course.title}</h3>
        <p>
          <strong>Category:</strong> {course.category}
        </p>
        <p>
          <strong>Difficulty:</strong> {course.difficulty}
        </p>
        <p>
          <strong>Price:</strong> ${course.price}
        </p>
        <p>
          <strong>Description:</strong> {course.description}
        </p>
        <p>
          <strong>Enrolled At:</strong>{" "}
          {new Date(course.enrolledAt).toLocaleDateString()}
        </p>

        {isTeacher ? (
          <Link
            to={`/courses/${course.id}/manage-lessons`}
            className="manage-lessons-link"
          >
            📚 Manage Lessons
          </Link>
        ) : (
          <button
            className="unenroll-btn"
            onClick={() => onUnenroll(course.id)}
          >
            🚫 Unenroll from Course
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsModal;

