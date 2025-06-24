
// ✅ Modular Component: CourseProgressBar.jsx
import React from "react";

const CourseProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
        title={`Progress: ${progress}%`}
      ></div>
    </div>
  );
};

export default CourseProgressBar;