// // src/pages/teachers/CreateLessonPage.jsx
// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Box, Typography, Container } from "@mui/material";
// import LessonForm from "./LessonForm";
// import { useTheme } from "../../context/ThemeContext";

// const CreateLessonPage = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const handleSuccess = (lesson) => {
//     console.log("✅ Lesson created successfully:", lesson);
//     // Navigate back to teaching courses or show success message
//     navigate("/teaching-courses");
//   };

//   const handleCancel = () => {
//     navigate("/teaching-courses");
//   };

//   return (
//     <Container
//       maxWidth="lg"
//       sx={{ py: 4 }}
//       className={isDark ? "dark-mode" : ""}
//     >
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Create New Lesson
//         </Typography>
//         <Typography variant="body1" color="textSecondary">
//           Add a new lesson to your course. You can upload PDFs, videos, or
//           create text-based content.
//         </Typography>
//       </Box>

//       <LessonForm
//         courseId={courseId}
//         onSuccess={handleSuccess}
//         onCancel={handleCancel}
//       />
//     </Container>
//   );
// };

// export default CreateLessonPage;





// src/pages/teachers/CreateLessonPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import LessonCreationForm from '../../components/LessonCreationForm';

const CreateLessonPage = () => {
  const { courseId } = useParams();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Create New Lesson
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Add engaging content to your course with text, PDFs, or videos
        </Typography>
      </Box>

      <LessonCreationForm />
    </Container>
  );
};

export default CreateLessonPage;