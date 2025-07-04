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
//   const [category, setCategory] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [introVideo, setIntroVideo] = useState(null);
//   const [attachments, setAttachments] = useState([]);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("category", category);
//     if (thumbnail) formData.append("thumbnail", thumbnail);
//     if (introVideo) formData.append("introVideo", introVideo);
//     attachments.forEach((file) => formData.append("attachments", file));

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
//       console.error(err);
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
//         <h2>Create a New Course 📘</h2>
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
//             <option value="Statistics & Probability">
//               Statistics & Probability
//             </option>
//             <option value="Other">Other</option>
//           </select>

//           <label>
//             📷 Thumbnail Image:
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files[0];
//                 setThumbnail(file);
//                 const reader = new FileReader();
//                 reader.onloadend = () => setThumbnailPreview(reader.result);
//                 reader.readAsDataURL(file);
//               }}
//             />
//           </label>

//           {thumbnailPreview && (
//             <img
//               src={thumbnailPreview}
//               alt="Thumbnail Preview"
//               style={{
//                 maxWidth: "100%",
//                 marginTop: "1rem",
//                 borderRadius: "8px",
//               }}
//             />
//           )}

//           <label>
//             🎥 Intro Video:
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setIntroVideo(e.target.files[0])}
//             />
//           </label>

//           <label>
//             📎 Attachments (PDF, Word, PPT, ZIP, etc.):
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
//               multiple
//               onChange={(e) => setAttachments(Array.from(e.target.files))}
//             />
//           </label>

//           {attachments.length > 0 && (
//             <div className="file-preview">
//               <strong>📄 Files to upload:</strong>
//               <ul>
//                 {attachments.map((file, idx) => (
//                   <li key={idx}>• {file.name}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

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
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (introVideo) formData.append("introVideo", introVideo);
    attachments.forEach((file) => formData.append("attachments", file));

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
      console.error(err);
      let message = "❌ Failed to create course.";
      if (err.response?.data?.details?.includes("slug")) {
        message =
          "❌ A course with a similar title already exists. Please use a different name.";
      } else if (err.response?.data?.error) {
        message = err.response.data.error;
      }
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
        <h2>Create New Course</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
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
          </select>

          <label>Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
              setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {thumbnailPreview && (
            <div className="file-preview">
              <strong>Preview:</strong>
              <br />
              <img src={thumbnailPreview} alt="Preview" width="200" />
            </div>
          )}

          <label>Intro Video (Optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setIntroVideo(e.target.files[0])}
          />

          <label>Attachments (PDF, Docs, etc.)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setAttachments(Array.from(e.target.files))}
          />
          {attachments.length > 0 && (
            <div className="file-preview">
              <strong>Files:</strong>
              <ul>
                {attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" className="btn-submit">
            Create Course
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCourse;
