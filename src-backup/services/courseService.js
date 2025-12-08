//service/courseService.js
import axiosInstance from "../utils/axiosInstance";

const courseService = {
  // ✅ Create a new course
  createCourse: async (courseData) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.keys(courseData).forEach((key) => {
        if (
          courseData[key] !== null &&
          courseData[key] !== undefined &&
          courseData[key] !== ""
        ) {
          if (key === "thumbnail" && courseData[key] instanceof File) {
            formData.append("thumbnail", courseData[key]);
          } else if (key === "attachments" && Array.isArray(courseData[key])) {
            courseData[key].forEach((file) => {
              formData.append("attachments", file);
            });
          } else {
            formData.append(key, courseData[key]);
          }
        }
      });

      console.log("📤 Creating course with data:", courseData);

      const response = await axiosInstance.post("/courses/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error creating course:", error);
      throw error;
    }
  },

  // ✅ Create course with units and lessons
  createCourseWithUnits: async (courseData) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.keys(courseData).forEach((key) => {
        if (
          courseData[key] !== null &&
          courseData[key] !== undefined &&
          courseData[key] !== ""
        ) {
          if (key === "thumbnail" && courseData[key] instanceof File) {
            formData.append("thumbnail", courseData[key]);
          } else if (key === "units" && Array.isArray(courseData[key])) {
            // Stringify units array for form data
            formData.append(key, JSON.stringify(courseData[key]));
          } else {
            formData.append(key, courseData[key]);
          }
        }
      });

      console.log("📤 Creating course with units:", courseData);

      const response = await axiosInstance.post(
        "/courses/create-with-units",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error creating course with units:", error);
      throw error;
    }
  },

  // ✅ Get all courses (public)
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get("/courses");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      throw error;
    }
  },

  // ✅ Get course by ID (public)
  getCourseById: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/courses/id/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching course by ID:", error);
      throw error;
    }
  },

  // ✅ Get course by slug (public)
  getCourseBySlug: async (slug) => {
    try {
      const response = await axiosInstance.get(`/courses/${slug}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching course by slug:", error);
      throw error;
    }
  },

  // ✅ Get teacher's courses
  getTeacherCourses: async () => {
    try {
      const response = await axiosInstance.get("/courses/teacher/my-courses");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching teacher courses:", error);
      throw error;
    }
  },

  // ✅ Get teacher's courses with detailed structure
  getTeacherCoursesDetailed: async () => {
    try {
      const response = await axiosInstance.get(
        "/courses/teacher/my-courses-detailed"
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching teacher courses detailed:", error);
      throw error;
    }
  },

  // ✅ Get single course with full structure for teacher
  getTeacherCourseFull: async (courseId) => {
    try {
      const response = await axiosInstance.get(
        `/courses/teacher/${courseId}/full`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching teacher course full:", error);
      throw error;
    }
  },

  // ✅ Get all courses with full structure for teacher dashboard
  getAllTeacherCoursesFullStructure: async () => {
    try {
      const response = await axiosInstance.get(
        "/courses/teacher/full-structure"
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching all teacher courses structure:", error);
      throw error;
    }
  },

  // ✅ Update course
  updateCourse: async (courseId, courseData) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.keys(courseData).forEach((key) => {
        if (
          courseData[key] !== null &&
          courseData[key] !== undefined &&
          courseData[key] !== ""
        ) {
          if (key === "thumbnail" && courseData[key] instanceof File) {
            formData.append("thumbnail", courseData[key]);
          } else if (key === "attachments" && Array.isArray(courseData[key])) {
            courseData[key].forEach((file) => {
              formData.append("attachments", file);
            });
          } else {
            formData.append(key, courseData[key]);
          }
        }
      });

      console.log("🔄 Updating course:", { courseId, ...courseData });

      const response = await axiosInstance.put(
        `/courses/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error updating course:", error);
      throw error;
    }
  },

  // ✅ Delete course
  deleteCourse: async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting course:", error);
      throw error;
    }
  },

  // ✅ Get course lessons
  getCourseLessons: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/lessons`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching course lessons:", error);
      throw error;
    }
  },

  // ✅ Get enrolled course by slug (requires authentication)
  getEnrolledCourseBySlug: async (slug) => {
    try {
      const response = await axiosInstance.get(
        `/courses/enrolled/slug/${slug}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching enrolled course:", error);
      throw error;
    }
  },

  // ✅ Get all courses (admin only)
  getAllCoursesAdmin: async () => {
    try {
      const response = await axiosInstance.get("/courses/all");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching all courses (admin):", error);
      throw error;
    }
  },
};

export default courseService;