
// //pages/teachers/CreateCourseForm.jsx

// import axios from "axios";

// const handleSubmit = async (formData) => {
//   try {
//     const data = new FormData();

//     // ===== Text fields =====
//     data.append("title", formData.title);
//     data.append("slug", formData.slug);
//     data.append("description", formData.description);
//     data.append("price", formData.price);

//     // ===== Thumbnail =====
//     if (formData.thumbnail) {
//       data.append("thumbnail", formData.thumbnail);
//     }

//     // ===== Attachments (multiple files) =====
//     if (Array.isArray(formData.attachments)) {
//       formData.attachments.forEach((file) => {
//         data.append("attachments", file); // must match backend field name
//       });
//     }

//     // ===== Auth token =====
//     const token = localStorage.getItem("token");

//     // ===== API request =====
//     const response = await axios.post("/api/v1/courses/create", data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("✅ Course created successfully:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "❌ Course creation failed:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// export default handleSubmit;






// pages/teachers/CreateCourseForm.jsx

import axios from "axios";

/**
 * Submit create course form with multiple file upload support
 */
const handleSubmit = async (formData) => {
  try {
    const data = new FormData();

    /* ===============================
       Text fields
    =============================== */
    data.append("title", formData.title);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("price", formData.price);

    /* ===============================
       Thumbnail (single file)
    =============================== */
    if (formData.thumbnail instanceof File) {
      data.append("thumbnail", formData.thumbnail);
    }

    /* ===============================
       Attachments (MULTIPLE FILES)
       IMPORTANT: use attachments[]
    =============================== */
    if (Array.isArray(formData.attachments)) {
      formData.attachments.forEach((file) => {
        if (file instanceof File) {
          data.append("attachments[]", file);
        }
      });
    }

    /* ===============================
       Auth token
    =============================== */
    const token = localStorage.getItem("token");

    /* ===============================
       API request
       DO NOT set Content-Type manually
    =============================== */
    const response = await axios.post(
      "/api/v1/courses/create",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
