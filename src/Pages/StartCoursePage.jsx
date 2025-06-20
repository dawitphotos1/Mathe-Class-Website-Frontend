// // pages/StartCoursePage.jsx
// import React from "react";
// import { useParams } from "react-router-dom";

// const StartCoursePage = () => {
//   const { slug } = useParams();

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Welcome to the course: {slug}</h1>
//       {/* Later: fetch lessons for this course slug */}
//     </div>
//   );
// };

// export default StartCoursePage;




// pages/courses/StartCoursePage.jsx

import React from "react";
import { useParams } from "react-router-dom";

const StartCoursePage = () => {
  const { slug } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to the course: {slug}</h1>
      {/* Later: fetch lessons for this course slug */}
    </div>
  );
};

export default StartCoursePage;




