// // src/components/CourseCurriculum.jsx
// import React from "react";
// import { courseData } from "../data/courseData"; // Adjust path as needed
// import "./CourseCurriculum.css";

// const CourseCurriculum = ({ courseSlug }) => {
//   const course = courseData[courseSlug];

//   if (!course) {
//     return <div className="curriculum-error">Course curriculum not found.</div>;
//   }

//   return (
//     <div className="course-curriculum">
//       <div className="curriculum-header">
//         <h2>{course.title} - Curriculum</h2>
//         <p className="course-description">{course.description}</p>
//       </div>

//       <div className="units-container">
//         {course.contents.map((unit, unitIndex) => (
//           <div key={unitIndex} className="unit-card">
//             <h3 className="unit-title">{unit.unit}</h3>
//             <div className="lessons-list">
//               {unit.lessons.map((lesson, lessonIndex) => (
//                 <div key={lessonIndex} className="lesson-item">
//                   <div className="lesson-content">
//                     <span className="lesson-icon">📚</span>
//                     <span className="lesson-title">{lesson}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CourseCurriculum;




// src/components/CourseCurriculum.jsx
import React from 'react';
import { courseData } from '../courses/courseData'; // Adjust path as needed
import './CourseCurriculum.css';

const CourseCurriculum = ({ courseSlug }) => {
  const course = courseData[courseSlug];
  
  if (!course) {
    return <div className="curriculum-error">Course curriculum not found.</div>;
  }

  return (
    <div className="course-curriculum">
      <div className="curriculum-header">
        <h2>{course.title} - Curriculum</h2>
        <p className="course-description">{course.description}</p>
      </div>
      
      <div className="units-container">
        {course.contents.map((unit, unitIndex) => (
          <div key={unitIndex} className="unit-card">
            <h3 className="unit-title">{unit.unit}</h3>
            <div className="lessons-list">
              {unit.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="lesson-item">
                  <div className="lesson-content">
                    <span className="lesson-icon">📚</span>
                    <span className="lesson-title">{lesson}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCurriculum;