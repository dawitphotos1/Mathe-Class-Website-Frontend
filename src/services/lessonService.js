// services/lessonService.js - UPDATED
import axiosInstance from '../utils/axiosInstance';
import uploadService from './uploadService';

const lessonService = {
  // Create lesson with multiple files
  createLesson: async (courseId, lessonData) => {
    return await uploadService.createLessonWithFiles(courseId, lessonData);
  },
  
  // Update lesson with multiple files
  updateLesson: async (lessonId, lessonData) => {
    return await uploadService.uploadLessonFiles(lessonId, lessonData);
  },
  
  // Get lesson with all files
  getLesson: async (lessonId) => {
    return await uploadService.getLessonWithFiles(lessonId);
  },
  
  // Get preview lesson for course
  getPreviewLesson: async (courseId) => {
    return await uploadService.getPreviewLesson(courseId);
  },
  
  // Delete lesson
  deleteLesson: async (lessonId) => {
    try {
      const response = await axiosInstance.delete(`/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Delete lesson error:', error);
      throw error;
    }
  },
  
  // Get lessons by course
  getLessonsByCourse: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/lessons/course/${courseId}/all`);
      return response.data;
    } catch (error) {
      console.error('❌ Get lessons by course error:', error);
      throw error;
    }
  },
  
  // Get lessons by unit
  getLessonsByUnit: async (unitId) => {
    try {
      const response = await axiosInstance.get(`/lessons/unit/${unitId}/all`);
      return response.data;
    } catch (error) {
      console.error('❌ Get lessons by unit error:', error);
      throw error;
    }
  },
  
  // Mark/unmark lesson as preview
  markAsPreview: async (lessonId, action = 'mark') => {
    try {
      const response = await axiosInstance.put(
        `/lessons/${lessonId}/mark-preview`,
        { action }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Mark as preview error:', error);
      throw error;
    }
  },
  
  // Delete specific file from lesson
  deleteFile: async (lessonId, fileType, fileIndex) => {
    return await uploadService.deleteLessonFile(lessonId, fileType, fileIndex);
  },
};

export default lessonService;