
// // ✅ CreateLesson.jsx with BONUS options (file upload, progress bar, validation)

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "./CreateLesson.css";

// const CreateLesson = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     contentType: "text",
//     videoUrl: "",
//     contentUrl: "",
//     isUnitHeader: false,
//     isPreview: false,
//     unitId: null,
//     orderIndex: 0,
//   });

//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(null);

//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         const res = await axios.get(`/api/v1/courses/${courseId}/lessons`);
//         const unitHeaders = res.data.units?.map((u) => ({
//           id: u.unitName,
//           title: u.unitName,
//         })) || [];
//         setUnits(unitHeaders);
//       } catch (err) {
//         toast.error("Failed to load units");
//       }
//     };

//     fetchUnits();
//   }, [courseId]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const type = formData.contentType;
//     const form = new FormData();
//     form.append("file", file);
//     setUploading(true);
//     setUploadProgress(0);

//     try {
//       const res = await axios.post("/api/v1/upload", form, {
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percent);
//         },
//       });

//       if (type === "video") {
//         setFormData((prev) => ({ ...prev, videoUrl: res.data.url }));
//       } else {
//         setFormData((prev) => ({ ...prev, contentUrl: res.data.url }));
//       }

//       toast.success("File uploaded");
//     } catch (err) {
//       toast.error("Upload failed");
//     } finally {
//       setUploading(false);
//       setUploadProgress(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please log in first");
//         navigate("/login");
//         return;
//       }

//       const payload = {
//         ...formData,
//         courseId: parseInt(courseId),
//         orderIndex: parseInt(formData.orderIndex),
//         unitId: formData.unitId || null,
//       };

//       await axios.post(`/api/v1/courses/${courseId}/lessons`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Lesson created!");
//       navigate(`/courses/${courseId}/manage`);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Error creating lesson");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="create-lesson-container">
//       <h2>Create New Lesson</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Title *</label>
//           <input type="text" name="title" value={formData.title} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Content Type *</label>
//           <select name="contentType" value={formData.contentType} onChange={handleChange} required>
//             <option value="text">Text</option>
//             <option value="video">Video</option>
//             <option value="document">Document</option>
//           </select>
//         </div>

//         {formData.contentType === "text" && (
//           <div className="form-group">
//             <label>Content *</label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               rows="10"
//               required
//               placeholder="Enter lesson text (supports HTML)"
//             />
//           </div>
//         )}

//         {(formData.contentType === "video" || formData.contentType === "document") && (
//           <div className="form-group">
//             <label>Upload {formData.contentType === "video" ? "Video" : "File"} *</label>
//             <input
//               type="file"
//               accept={formData.contentType === "video" ? "video/*" : ".pdf,.doc,.docx,.zip"}
//               onChange={handleFileUpload}
//             />
//             {uploading && (
//               <div className="upload-progress">
//                 <p>Uploading... {uploadProgress}%</p>
//                 <progress value={uploadProgress} max="100" />
//               </div>
//             )}
//           </div>
//         )}

//         <div className="form-group checkbox">
//           <label>
//             <input
//               type="checkbox"
//               name="isUnitHeader"
//               checked={formData.isUnitHeader}
//               onChange={handleChange}
//             />
//             Is Unit Header?
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
//             Is Preview Lesson?
//           </label>
//         </div>

//         {!formData.isUnitHeader && units.length > 0 && (
//           <div className="form-group">
//             <label>Assign to Unit</label>
//             <select name="unitId" value={formData.unitId || ""} onChange={handleChange}>
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
//           <label>Order Index *</label>
//           <input
//             type="number"
//             name="orderIndex"
//             value={formData.orderIndex}
//             onChange={handleChange}
//             min="0"
//             required
//           />
//         </div>

//         <div className="form-actions">
//           <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
//             Cancel
//           </button>
//           <button type="submit" className="submit-btn" disabled={loading}>
//             {loading ? "Creating..." : "Create Lesson"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateLesson;



import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import FileUploader from "./FileUploader";
import "./CreateLesson.css";

const CreateLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dropRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    contentType: "document",
    fileUrl: "",
    isUnitHeader: false,
    isPreview: false,
    unitId: "",
    orderIndex: 0,
  });

  const [units, setUnits] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.get(`/api/v1/courses/${courseId}/lessons`);
        const headersOnly = Array.isArray(res.data)
          ? res.data.filter((l) => l.isUnitHeader)
          : [];

        setUnits(
          headersOnly.map((unit) => ({ id: unit.id, title: unit.title }))
        );
      } catch {
        toast.error("Failed to load units");
      }
    };

    fetchUnits();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    setUploadProgress(0);
    setPreviewFile(URL.createObjectURL(file));

    try {
      const res = await axios.post("/api/v1/upload", form, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        },
      });

      setFormData((prev) => ({ ...prev, fileUrl: res.data.url }));
      toast.success("File uploaded successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };
  <FileUploader
    accept=".pdf,.doc,.docx,.ppt,.pptx,video/*"
    onUploadSuccess={(url) =>
      setFormData((prev) => ({ ...prev, fileUrl: url }))
    }
  />;
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    if (!formData.fileUrl) {
      toast.error("Please upload a file");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first");
        navigate("/login");
        return;
      }

      const payload = {
        ...formData,
        courseId: parseInt(courseId),
        unitId: formData.unitId || null,
        orderIndex: parseInt(formData.orderIndex),
      };

      await axios.post("/api/v1/lessons", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      toast.success("🎉 Lesson created successfully");
      navigate(`/courses/${courseId}/manage-lessons`);
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
          ref={dropRef}
          className="form-group dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <label htmlFor="file">
            📄 Drag & Drop File Here or Click to Browse
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,video/*"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
          {uploading && (
            <div>
              Uploading... {uploadProgress}%
              <progress value={uploadProgress} max="100" />
            </div>
          )}
          {previewFile && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Preview:</strong>
              </p>
              {previewFile.includes("video") ? (
                <video width="100%" controls>
                  <source src={previewFile} />
                </video>
              ) : (
                <iframe
                  title="Preview"
                  src={previewFile}
                  style={{
                    width: "100%",
                    height: "400px",
                    border: "1px solid #ccc",
                  }}
                />
              )}
            </div>
          )}
        </div>

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
              value={formData.unitId || ""}
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
            {loading ? "Creating..." : "✅ Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLesson;