
// import React, { useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import confetti from "canvas-confetti";
// import { useLessonForm } from "../hooks/useLessonForm";
// import axios from "../utils/axios";
// import "./CreateLesson.css";

// const CreateLesson = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const dropRef = useRef();
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const {
//     formData,
//     setFormData,
//     units,
//     uploading,
//     uploadProgress,
//     loading,
//     setLoading,
//     handleChange,
//   } = useLessonForm(courseId);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, file }));
//       const isPreviewable =
//         file.type.startsWith("image/") || file.type.startsWith("video/");
//       if (isPreviewable) {
//         setPreviewUrl(URL.createObjectURL(file));
//       } else {
//         setPreviewUrl(null);
//       }
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, file }));
//       const isPreviewable =
//         file.type.startsWith("image/") || file.type.startsWith("video/");
//       if (isPreviewable) {
//         setPreviewUrl(URL.createObjectURL(file));
//       } else {
//         setPreviewUrl(null);
//       }
//     }
//   };

//   const handleDragOver = (e) => e.preventDefault();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!formData.title.trim()) {
//       toast.error("Title is required");
//       setLoading(false);
//       return;
//     }

//     if (!formData.file) {
//       toast.error("Please upload a file");
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please log in");
//         navigate("/login");
//         return;
//       }

//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("contentType", "file");
//       data.append("file", formData.file);
//       data.append("isUnitHeader", formData.isUnitHeader);
//       data.append("isPreview", formData.isPreview);
//       data.append("orderIndex", formData.orderIndex || 0);
//       if (formData.unitId) data.append("unitId", formData.unitId);

//       await axios.post(`/lessons/${courseId}/lessons`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
//       toast.success("🎉 Lesson created successfully");
//       navigate("/my-teaching-courses", { state: { refresh: true } });
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Lesson creation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="create-lesson-container">
//       <h2>Create a New Lesson</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="title">📖 Title *</label>
//           <input
//             name="title"
//             id="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Enter lesson title"
//             required
//           />
//         </div>

//         <div
//           className="file-drop-zone"
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           ref={dropRef}
//         >
//           <p>📤 Drag & drop a file here, or click to browse</p>
//           <input
//             type="file"
//             accept=".pdf,.doc,.docx,.ppt,.pptx,image/*,video/*"
//             onChange={handleFileChange}
//             className="file-input-hidden"
//           />
//         </div>

//         {formData.file && (
//           <p className="file-name">✅ Selected: {formData.file.name}</p>
//         )}

//         {previewUrl && formData.file?.type.startsWith("image/") && (
//           <img src={previewUrl} alt="Preview" className="file-preview" />
//         )}

//         {previewUrl && formData.file?.type.startsWith("video/") && (
//           <video src={previewUrl} controls className="file-preview" />
//         )}

//         <div className="form-group checkbox">
//           <label>
//             <input
//               type="checkbox"
//               name="isUnitHeader"
//               checked={formData.isUnitHeader}
//               onChange={handleChange}
//             />
//             Mark as Unit Header
//           </label>
//         </div>

//         <div className="form-group checkbox">
//           <label>
//             <input
//               type="checkbox"
//               name="isPreview"
//               checked={formData.isPreview}
//               onChange={handleChange}
//             />
//             Enable Free Preview
//           </label>
//         </div>

//         {!formData.isUnitHeader && units.length > 0 && (
//           <div className="form-group">
//             <label htmlFor="unitId">📚 Assign to Unit</label>
//             <select
//               name="unitId"
//               id="unitId"
//               value={formData.unitId}
//               onChange={handleChange}
//             >
//               <option value="">-- Select Unit --</option>
//               {units.map((unit) => (
//                 <option key={unit.id} value={unit.id}>
//                   {unit.title}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <div className="form-group">
//           <label htmlFor="orderIndex">⏳ Order Index *</label>
//           <input
//             type="number"
//             name="orderIndex"
//             id="orderIndex"
//             value={formData.orderIndex}
//             onChange={handleChange}
//             min="0"
//           />
//         </div>

//         <div className="form-actions">
//           <button
//             type="button"
//             className="cancel-btn"
//             onClick={() => navigate(-1)}
//           >
//             ❌ Cancel
//           </button>
//           <button type="submit" className="submit-btn" disabled={loading}>
//             {loading ? "⏳ Creating..." : "✅ Create Lesson"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateLesson;




import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import { useLessonForm } from "../hooks/useLessonForm";
import axios from "../utils/axiosInstance"; // <-- updated import here
import "./CreateLesson.css";

const CreateLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dropRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    formData,
    setFormData,
    units,
    uploading,
    uploadProgress,
    loading,
    setLoading,
    handleChange,
  } = useLessonForm(courseId);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      const isPreviewable =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      setPreviewUrl(isPreviewable ? URL.createObjectURL(file) : null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      const isPreviewable =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      setPreviewUrl(isPreviewable ? URL.createObjectURL(file) : null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    if (!formData.file) {
      toast.error("Please upload a file");
      setLoading(false);
      return;
    }

    try {
      // No manual token or headers — axiosInstance handles it
      const data = new FormData();
      data.append("title", formData.title);
      data.append("contentType", "file");
      data.append("file", formData.file);
      data.append("isUnitHeader", formData.isUnitHeader);
      data.append("isPreview", formData.isPreview);
      data.append("orderIndex", formData.orderIndex || 0);
      if (formData.unitId) data.append("unitId", formData.unitId);

      await axios.post(`/lessons/${courseId}/lessons`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      toast.success("🎉 Lesson created successfully");
      navigate("/my-teaching-courses", { state: { refresh: true } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Lesson creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-lesson-container">
      <h2>Create a New Lesson</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">📖 Title *</label>
          <input
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter lesson title"
            required
          />
        </div>

        <div
          className="file-drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          ref={dropRef}
        >
          <p>📤 Drag & drop a file here, or click to browse</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,image/*,video/*"
            onChange={handleFileChange}
            className="file-input-hidden"
          />
        </div>

        {formData.file && (
          <p className="file-name">✅ Selected: {formData.file.name}</p>
        )}

        {previewUrl && formData.file?.type.startsWith("image/") && (
          <img src={previewUrl} alt="Preview" className="file-preview" />
        )}

        {previewUrl && formData.file?.type.startsWith("video/") && (
          <video src={previewUrl} controls className="file-preview" />
        )}

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isUnitHeader"
              checked={formData.isUnitHeader}
              onChange={handleChange}
            />
            Mark as Unit Header
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isPreview"
              checked={formData.isPreview}
              onChange={handleChange}
            />
            Enable Free Preview
          </label>
        </div>

        {!formData.isUnitHeader && units.length > 0 && (
          <div className="form-group">
            <label htmlFor="unitId">📚 Assign to Unit</label>
            <select
              name="unitId"
              id="unitId"
              value={formData.unitId}
              onChange={handleChange}
            >
              <option value="">-- Select Unit --</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="orderIndex">⏳ Order Index *</label>
          <input
            type="number"
            name="orderIndex"
            id="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            ❌ Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "⏳ Creating..." : "✅ Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLesson;
