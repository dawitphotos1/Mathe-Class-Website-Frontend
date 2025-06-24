
// ✅ Refactored CourseDetailsModal.jsx
import React from "react";
import ModalWrapper from "./ModalWrapper";

const CourseDetailsModal = ({ course, onClose, onUnenroll }) => {
  if (!course) return null;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{course.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{course.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span>📅 Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</span>
          <span>🏷️ Category: {course.category}</span>
        </div>
        <div className="text-right">
          <button
            onClick={() => onUnenroll(course.id)}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Unenroll
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CourseDetailsModal;

