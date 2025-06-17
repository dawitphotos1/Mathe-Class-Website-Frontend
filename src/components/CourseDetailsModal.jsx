
// import React from "react";
// import "./CourseDetailsModal.css";

// const CourseDetailsModal = ({ course, onClose, onUnenroll }) => {
//   if (!course) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="close-btn" onClick={onClose}>
//           ×
//         </button>

//         <h3>{course.title}</h3>

//         <p>
//           <strong>Category:</strong> {course.category}
//         </p>
//         <p>
//           <strong>Difficulty:</strong> {course.difficulty}
//         </p>
//         <p>
//           <strong>Price:</strong> ${course.price}
//         </p>
//         <p>
//           <strong>Description:</strong> {course.description}
//         </p>
//         <p>
//           <strong>Enrolled At:</strong>{" "}
//           {new Date(course.enrolledAt).toLocaleDateString()}
//         </p>

//         <button
//           className="unenroll-btn"
//           onClick={() => onUnenroll(course.id)} // 🔹 Updated to trigger confirm modal
//         >
//           🚫 Unenroll from Course
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CourseDetailsModal;



import React from "react";
import "./CourseDetailsModal.css";

const CourseDetailsModal = ({ course, onClose, onUnenroll }) => {
  if (!course) return null;

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

        <button className="unenroll-btn" onClick={() => onUnenroll(course.id)}>
          🚫 Unenroll from Course
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsModal;

