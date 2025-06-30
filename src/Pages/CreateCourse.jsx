// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { API_BASE_URL } from "../config";
// import "./CreateCourse.css";

// const CreateCourse = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);
//   const [introVideo, setIntroVideo] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("price", price);
//     formData.append("category", category);
//     if (thumbnail) formData.append("thumbnail", thumbnail);
//     if (introVideo) formData.append("introVideo", introVideo);

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(`${API_BASE_URL}/api/v1/courses`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("✅ Course created successfully!");
//       navigate("/dashboard");
//     } catch (err) {
//       const message =
//         err.response?.data?.error || "❌ Failed to create course.";
//       toast.error(message);
//     }
//   };

//   return (
//     <div className="create-course-container">
//       <motion.div
//         className="create-course-card"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h2>Create a New Lesson 📘</h2>
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <input
//             type="text"
//             placeholder="Course Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />

//           <textarea
//             placeholder="Course Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />

        
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             required
//           >
//             <option value="">Select Category</option>
//             <option value="Algebra 1">Algebra 1</option>
//             <option value="Algebra 2">Algebra 2</option>
//             <option value="Pre-Calculus">Pre-Calculus</option>
//             <option value="Calculus">Calculus</option>
//             <option value="Geometry & Trigonometry">
//               Geometry & Trigonometry
//             </option>
//             <option value="Statistics & Probability">Statistics & Probability</option>
//             <option value="Other">Other</option>
//           </select>

//           <label>
//             📷 Thumbnail Image:
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setThumbnail(e.target.files[0])}
//             />
//           </label>

//           <label>
//             🎥 Intro Video:
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setIntroVideo(e.target.files[0])}
//             />
//           </label>

//           <button type="submit" className="btn-submit">
//             Create Course
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default CreateCourse;




import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";
import "./CreateCourse.css";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (introVideo) formData.append("introVideo", introVideo);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/v1/courses`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Course created successfully!");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.error || "❌ Failed to create course.";
      toast.error(message);
    }
  };

  return (
    <div className="create-course-container">
      <motion.div
        className="create-course-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Create a New Lesson 📘</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Algebra 1">Algebra 1</option>
            <option value="Algebra 2">Algebra 2</option>
            <option value="Pre-Calculus">Pre-Calculus</option>
            <option value="Calculus">Calculus</option>
            <option value="Geometry & Trigonometry">
              Geometry & Trigonometry
            </option>
            <option value="Statistics & Probability">
              Statistics & Probability
            </option>
            <option value="Other">Other</option>
          </select>

          <label>
            📷 Thumbnail Image:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setThumbnail(file);
                const reader = new FileReader();
                reader.onloadend = () => setPreviewUrl(reader.result);
                reader.readAsDataURL(file);
              }}
            />
          </label>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                marginTop: "1rem",
                borderRadius: "8px",
              }}
            />
          )}

          <label>
            🎥 Intro Video:
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setIntroVideo(e.target.files[0])}
            />
          </label>

          <button type="submit" className="btn-submit">
            Create Course
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCourse;
