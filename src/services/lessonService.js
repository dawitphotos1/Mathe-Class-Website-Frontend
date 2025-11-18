// import axiosInstance from "../utils/axiosInstance";

// const lessonService = {
//   // ✅ Create a new lesson
//   createLesson: async (courseId, lessonData) => {
//     try {
//       const formData = new FormData();

//       // Append all form fields
//       Object.keys(lessonData).forEach((key) => {
//         if (
//           lessonData[key] !== null &&
//           lessonData[key] !== undefined &&
//           lessonData[key] !== ""
//         ) {
//           if (key === "file" && lessonData[key] instanceof File) {
//             formData.append("file", lessonData[key]);
//           } else if (key === "video" && lessonData[key] instanceof File) {
//             formData.append("video", lessonData[key]);
//           } else if (key === "pdf" && lessonData[key] instanceof File) {
//             formData.append("pdf", lessonData[key]);
//           } else {
//             formData.append(key, lessonData[key]);
//           }
//         }
//       });

//       console.log("📤 Creating lesson with data:", {
//         courseId,
//         ...lessonData,
//         hasFile: !!lessonData.file,
//         hasVideo: !!lessonData.video,
//         hasPdf: !!lessonData.pdf,
//       });

//       const response = await axiosInstance.post(
//         `/lessons/courses/${courseId}/lessons`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error("❌ Error creating lesson:", error);
//       throw error;
//     }
//   },

//   // ✅ Get lessons by course
//   getLessonsByCourse: async (courseId) => {
//     try {
//       const response = await axiosInstance.get(
//         `/lessons/courses/${courseId}/lessons`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("❌ Error fetching lessons by course:", error);
//       throw error;
//     }
//   },

//   // ✅ Get lessons by unit
//   getLessonsByUnit: async (unitId) => {
//     try {
//       const response = await axiosInstance.get(
//         `/lessons/units/${unitId}/lessons`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("❌ Error fetching lessons by unit:", error);
//       throw error;
//     }
//   },

//   // ✅ Get single lesson by ID
//   getLessonById: async (lessonId) => {
//     try {
//       const response = await axiosInstance.get(`/lessons/${lessonId}`);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Error fetching lesson:", error);
//       throw error;
//     }
//   },

//   // ✅ Update lesson
//   updateLesson: async (lessonId, lessonData) => {
//     try {
//       const formData = new FormData();

//       // Append all form fields
//       Object.keys(lessonData).forEach((key) => {
//         if (
//           lessonData[key] !== null &&
//           lessonData[key] !== undefined &&
//           lessonData[key] !== ""
//         ) {
//           if (key === "file" && lessonData[key] instanceof File) {
//             formData.append("file", lessonData[key]);
//           } else if (key === "video" && lessonData[key] instanceof File) {
//             formData.append("video", lessonData[key]);
//           } else if (key === "pdf" && lessonData[key] instanceof File) {
//             formData.append("pdf", lessonData[key]);
//           } else {
//             formData.append(key, lessonData[key]);
//           }
//         }
//       });

//       console.log("🔄 Updating lesson:", { lessonId, ...lessonData });

//       const response = await axiosInstance.put(
//         `/lessons/${lessonId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error("❌ Error updating lesson:", error);
//       throw error;
//     }
//   },

//   // ✅ Delete lesson
//   deleteLesson: async (lessonId) => {
//     try {
//       const response = await axiosInstance.delete(`/lessons/${lessonId}`);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Error deleting lesson:", error);
//       throw error;
//     }
//   },

//   // ✅ Get course structure with units and lessons (for teacher dashboard)
//   getCourseStructure: async (courseId) => {
//     try {
//       const response = await axiosInstance.get(
//         `/courses/teacher/${courseId}/full`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("❌ Error fetching course structure:", error);
//       throw error;
//     }
//   },

//   // ✅ Get all courses with full structure for teacher
//   getAllTeacherCoursesStructure: async () => {
//     try {
//       const response = await axiosInstance.get(
//         "/courses/teacher/full-structure"
//       );
//       return response.data;
//     } catch (error) {
//       console.error("❌ Error fetching teacher courses structure:", error);
//       throw error;
//     }
//   },

//   // ✅ Debug endpoints
//   debugGetLesson: async (lessonId) => {
//     try {
//       const response = await axiosInstance.get(`/lessons/debug/${lessonId}`);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Debug error:", error);
//       throw error;
//     }
//   },

//   debugCheckFile: async (filename) => {
//     try {
//       const response = await axiosInstance.get(
//         `/lessons/debug/file/${filename}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("❌ Debug file check error:", error);
//       throw error;
//     }
//   },

//   debugFileUrl: async (lessonId) => {
//     try {
//       const response = await axiosInstance.get(
//         `/lessons/debug/url/${lessonId}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("❌ Debug URL error:", error);
//       throw error;
//     }
//   },
// };

// export default lessonService;



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
