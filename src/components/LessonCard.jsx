// // src/components/LessonCard.jsx
// import React from "react";

// function LessonCard({ lesson, courseId }) {
//   const handleLessonClick = () => {
//     // Navigate to lesson detail page
//     window.location.href = `/courses/${courseId}/lessons/${lesson.id}`;
//   };

//   return (
//     <div className="lesson-card" onClick={handleLessonClick}>
//       <div className="lesson-header">
//         <h3>{lesson.title}</h3>
//         <span className={`lesson-badge ${lesson.content_type}`}>
//           {lesson.content_type}
//         </span>
//       </div>

//       <div className="lesson-content">
//         <p className="lesson-description">
//           {lesson.content?.substring(0, 100)}...
//         </p>

//         <div className="lesson-meta">
//           <span>Order: {lesson.order_index}</span>
//           {lesson.is_preview && <span className="preview-badge">Preview</span>}
//         </div>
//       </div>

//       <div className="lesson-footer">
//         <button className="view-lesson-btn">View Lesson</button>
//       </div>
//     </div>
//   );
// }

// export default LessonCard;






// src/components/LessonCard.jsx
import React from 'react';

function LessonCard({ lesson, courseId }) {
  const handleLessonClick = () => {
    // Navigate to lesson detail page
    window.location.href = `/courses/${courseId}/lessons/${lesson.id}`;
  };

  return (
    <div className="lesson-card" onClick={handleLessonClick}>
      <div className="lesson-header">
        <h3>{lesson.title}</h3>
        <span className={`lesson-badge ${lesson.content_type}`}>
          {lesson.content_type}
        </span>
      </div>
      
      <div className="lesson-content">
        <p className="lesson-description">
          {lesson.content?.substring(0, 100)}...
        </p>
        
        <div className="lesson-meta">
          <span>Order: {lesson.order_index}</span>
          {lesson.is_preview && <span className="preview-badge">Preview</span>}
        </div>
      </div>
      
      <div className="lesson-footer">
        <button className="view-lesson-btn">
          View Lesson
        </button>
      </div>
    </div>
  );
}

export default LessonCard;