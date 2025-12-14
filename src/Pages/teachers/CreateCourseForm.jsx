// //pages/teachers/CreateCourseForm.jsx

// const handleSubmit = async (formData) => {
//   try {
//     const data = new FormData();

//     // Append text fields
//     data.append("title", formData.title);
//     data.append("slug", formData.slug);
//     data.append("description", formData.description);
//     data.append("price", formData.price);

//     // Append files
//     if (formData.thumbnail) {
//       data.append("thumbnail", formData.thumbnail);
//     }

//     if (formData.attachments && formData.attachments.length > 0) {
//       formData.attachments.forEach((file) => {
//         data.append("attachments", file);
//       });
//     }

//     const token = localStorage.getItem("token"); // or your token storage

//     const response = await axios.post("/api/v1/courses/create", data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("✅ Course created:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Course creation failed:", error);
//     throw error;
//   }
// };




//pages/teachers/CreateCourseForm.jsx

import axios from "axios";

const handleSubmit = async (formData) => {
  try {
    const data = new FormData();

    // ===== Text fields =====
    data.append("title", formData.title);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("price", formData.price);

    // ===== Thumbnail =====
    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    // ===== Attachments (multiple files) =====
    if (Array.isArray(formData.attachments)) {
      formData.attachments.forEach((file) => {
        data.append("attachments", file); // must match backend field name
      });
    }

    // ===== Auth token =====
    const token = localStorage.getItem("token");

    // ===== API request =====
    const response = await axios.post("/api/v1/courses/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Course created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Course creation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default handleSubmit;
