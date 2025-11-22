// src/pages/services/lessonService.js
import axiosInstance from "../utils/axiosInstance";

const lessonService = {
  createLesson: async (courseId, lessonData) => {
    const form = new FormData();

    Object.keys(lessonData).forEach((key) => {
      const value = lessonData[key];
      if (value === "" || value === null) return;

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
        default:
          form.append(key, value);
      }
    });

    form.append("course_id", courseId);
    if (lessonData.unitId) form.append("unit_id", lessonData.unitId);
    if (lessonData.file) form.append("file", lessonData.file);

    const res = await axiosInstance.post(
      `/lessons/courses/${courseId}/lessons`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data;
  },

  getLessonsByCourse: async (courseId) => {
    const res = await axiosInstance.get(`/lessons/courses/${courseId}/lessons`);
    return res.data;
  },

  getLessonsByUnit: async (unitId) => {
    const res = await axiosInstance.get(`/lessons/units/${unitId}/lessons`);
    return res.data;
  },

  deleteLesson: async (lessonId) => {
    const res = await axiosInstance.delete(`/lessons/${lessonId}`);
    return res.data;
  },
};

export default lessonService;
