// src/components/LessonErrorHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const LessonErrorHandler = ({ error, lessonId, courseId }) => {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (error) {
      console.error('Lesson Error:', error);
      
      if (error.response?.status === 404) {
        toast.error('Lesson not found. It may have been deleted.');
        
        // Redirect back to course management
        if (courseId) {
          setTimeout(() => navigate(`/courses/${courseId}/manage-lessons`), 2000);
        }
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to edit this lesson.');
        setTimeout(() => navigate(-1), 2000);
      } else {
        toast.error('Failed to load lesson. Please try again.');
      }
    }
  }, [error, navigate, courseId]);

  return null;
};

export default LessonErrorHandler;