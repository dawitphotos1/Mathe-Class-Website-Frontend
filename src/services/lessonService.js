
// src/services/lessonService.js
import axiosInstance from "../utils/axiosInstance";

const lessonService = {
  // CREATE LESSON with multiple files
  createLesson: async (courseId, lessonData) => {
    const form = new FormData();

    // Append standard fields
    Object.keys(lessonData).forEach((key) => {
      const value = lessonData[key];
      if (value === "" || value === null || value === undefined) return;

      switch (key) {
        case "contentType":
          form.append("content_type", value);
          break;
        case "orderIndex":
          form.append("order_index", value);
          break;
        case "videoUrl":
          form.append("video_url", value);
          break;
        case "isPreview":
          form.append("is_preview", value);
          break;
        case "files":
          // Handled separately
          break;
        default:
          form.append(key, value);
      }
    });

    if (lessonData.unitId) form.append("unit_id", lessonData.unitId);

    // Append multiple files
    if (lessonData.files && Array.isArray(lessonData.files)) {
      lessonData.files.forEach((file) => {
        form.append("attachments[]", file);
      });
      console.log("📤 Appending files:", lessonData.files.map(f => f.name));
    }

    // No need to manually set Content-Type; axios handles it
    const res = await axiosInstance.post(`/courses/${courseId}/lessons`, form);
    return res.data;
  },

  // UPDATE LESSON with multiple files
  updateLesson: async (lessonId, lessonData) => {
    const form = new FormData();

    // Append fields
    Object.keys(lessonData).forEach((key) => {
      const value = lessonData[key];
      if (value === "" || value === null || value === undefined) return;
      form.append(key, value);
    });

    // Append multiple files
    if (lessonData.files && Array.isArray(lessonData.files)) {
      lessonData.files.forEach((file) => {
        form.append("attachments[]", file);
      });
      console.log("📤 Appending files:", lessonData.files.map(f => f.name));
    }

    const res = await axiosInstance.put(`/lessons/${lessonId}`, form);
    return res.data;
  },

  // DELETE ATTACHMENT
  deleteAttachment: async (attachmentId) => {
    const res = await axiosInstance.delete(`/lessons/attachments/${attachmentId}`);
    return res.data;
  },

  // Get attachments for a lesson
  getLessonAttachments: async (lessonId) => {
    try {
      const res = await axiosInstance.get(`/lessons/${lessonId}/attachments`);
      return res.data;
    } catch (error) {
      console.log("No attachments endpoint, returning empty array");
      return { attachments: [] };
    }
  },

  // Get all lessons for a course
  getLessonsByCourse: async (courseId) => {
    const res = await axiosInstance.get(`/courses/${courseId}/lessons`);
    return res.data;
  },

  // Get all lessons for a unit
  getLessonsByUnit: async (unitId) => {
    const res = await axiosInstance.get(`/units/${unitId}/lessons`);
    return res.data;
  },

  // DELETE LESSON
  deleteLesson: async (lessonId) => {
    const res = await axiosInstance.delete(`/lessons/${lessonId}`);
    return res.data;
  },
};

export default lessonService;
