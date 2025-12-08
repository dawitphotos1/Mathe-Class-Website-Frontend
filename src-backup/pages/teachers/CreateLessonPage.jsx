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