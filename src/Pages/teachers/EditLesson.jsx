// //pages/teachers/EditLesson.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "./EditLesson.css";
// import { AiOutlineUpload } from "react-icons/ai";

// const EditLesson = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     content_type: "text",
//     video_url: "",
//     order_index: 0,
//     is_preview: false,
//     unit_id: null,
//   });

//   const [file, setFile] = useState(null);
//   const [activeTab, setActiveTab] = useState("text");

//   useEffect(() => {
//     const loadLesson = async () => {
//       try {
//         const res = await axiosInstance.get(`/lessons/${lessonId}`);
//         const lesson = res.data.lesson;

//         setForm({
//           title: lesson.title,
//           content: lesson.content || "",
//           content_type: lesson.content_type,
//           video_url: lesson.video_url || "",
//           order_index: lesson.order_index,
//           is_preview: lesson.is_preview,
//           unit_id: lesson.unit_id,
//         });

//         setActiveTab(lesson.content_type || "text");
//       } catch {
//         toast.error("Failed to load lesson");
//         navigate(-1);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadLesson();
//   }, [lessonId, navigate]);

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
//     if (file) formData.append("file", file);

//     try {
//       await axiosInstance.put(`/lessons/${lessonId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Lesson updated successfully");
//       navigate(-1);
//     } catch {
//       toast.error("Failed to update lesson");
//     }
//   };

//   if (loading)
//     return (
//       <div className="edit-lesson-page">
//         <p className="loading-text">Loading...</p>
//       </div>
//     );

//   return (
//     <div className="edit-lesson-page">
//       <div className="edit-lesson-card">
//         <h2>Edit Lesson</h2>

//         <form className="edit-lesson-form" onSubmit={handleSubmit}>
//           <label>Title</label>
//           <input
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             placeholder="Enter lesson title"
//             required
//           />

//           {/* ===== Tabs ===== */}
//           <div className="tab-header">
//             {["text", "video", "pdf"].map((type) => (
//               <button
//                 type="button"
//                 key={type}
//                 className={`tab-btn ${activeTab === type ? "active" : ""}`}
//                 onClick={() => {
//                   setActiveTab(type);
//                   setForm({ ...form, content_type: type });
//                 }}
//               >
//                 {type === "text" ? "Text" : type === "video" ? "Video" : "File"}
//               </button>
//             ))}
//           </div>

//           {/* ===== Tab Content ===== */}
//           <div className="tab-content">
//             {activeTab === "text" && (
//               <>
//                 <label>Content</label>
//                 <ReactQuill
//                   theme="snow"
//                   value={form.content}
//                   onChange={(value) => setForm({ ...form, content: value })}
//                 />
//               </>
//             )}

//             {activeTab === "video" && (
//               <>
//                 <label>Video URL</label>
//                 <input
//                   value={form.video_url}
//                   onChange={(e) =>
//                     setForm({ ...form, video_url: e.target.value })
//                   }
//                   placeholder="https://example.com/video"
//                 />
//               </>
//             )}

//             {activeTab === "pdf" && (
//               <>
//                 <label>Upload File</label>
//                 <div className="file-upload-wrapper">
//                   <label htmlFor="file-upload" className="file-upload-btn">
//                     <AiOutlineUpload className="upload-icon" />{" "}
//                     {file ? file.name : "Choose a file"}
//                   </label>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.png"
//                     onChange={handleFileChange}
//                     hidden
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           <label>Order Index</label>
//           <input
//             type="number"
//             value={form.order_index}
//             onChange={(e) => setForm({ ...form, order_index: e.target.value })}
//             min={0}
//           />

//           <label className="preview-checkbox">
//             <input
//               type="checkbox"
//               checked={form.is_preview}
//               onChange={(e) =>
//                 setForm({ ...form, is_preview: e.target.checked })
//               }
//             />
//             Make Preview
//           </label>

//           <button type="submit" className="save-btn">
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditLesson;







import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditLesson.css";
import { AiOutlineUpload } from "react-icons/ai";

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    content_type: "text",
    video_url: "",
    order_index: 0,
    is_preview: false,
    unit_id: null,
  });

  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("text");

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonId}`);
        const lesson = res.data.lesson;

        setForm({
          title: lesson.title,
          content: lesson.content || "",
          content_type: lesson.content_type,
          video_url: lesson.video_url || "",
          order_index: lesson.order_index,
          is_preview: lesson.is_preview,
          unit_id: lesson.unit_id,
        });

        setActiveTab(lesson.content_type || "text");
      } catch (error) {
        console.error("Load lesson error:", error);
        toast.error("Failed to load lesson");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Also update content_type to 'pdf' if it's a PDF file
      if (selectedFile.type === "application/pdf") {
        setForm({ ...form, content_type: "pdf" });
        setActiveTab("pdf");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append all form fields
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    // Append file if selected
    if (file) {
      formData.append("file", file);
    }

    try {
      await axiosInstance.put(`/lessons/${lessonId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Lesson updated successfully");
      navigate(-1);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to update lesson");
    }
  };

  if (loading) {
    return (
      <div className="edit-lesson-page">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading lesson data...</p>
      </div>
    );
  }

  return (
    <div className="edit-lesson-page">
      <div className="edit-lesson-card">
        <h2>Edit Lesson</h2>

        <form className="edit-lesson-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter lesson title"
              required
              className="form-input"
            />
          </div>

          {/* ===== Content Type Tabs ===== */}
          <div className="form-group">
            <label>Content Type</label>
            <div className="tab-header">
              {["text", "video", "pdf"].map((type) => (
                <button
                  type="button"
                  key={type}
                  className={`tab-btn ${activeTab === type ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(type);
                    setForm({ ...form, content_type: type });
                    setFile(null); // Clear file when switching tabs
                  }}
                >
                  {type === "text"
                    ? "Text"
                    : type === "video"
                    ? "Video"
                    : "File"}
                </button>
              ))}
            </div>
          </div>

          {/* ===== Tab Content ===== */}
          <div className="tab-content">
            {activeTab === "text" && (
              <div className="form-group">
                <label>Content</label>
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(value) => setForm({ ...form, content: value })}
                  className="quill-editor"
                />
              </div>
            )}

            {activeTab === "video" && (
              <div className="form-group">
                <label>Video URL</label>
                <input
                  value={form.video_url}
                  onChange={(e) =>
                    setForm({ ...form, video_url: e.target.value })
                  }
                  placeholder="https://example.com/video.mp4"
                  className="form-input"
                />
                <p className="form-help">
                  Enter a direct video URL or YouTube/Vimeo link
                </p>
              </div>
            )}

            {activeTab === "pdf" && (
              <div className="form-group">
                <label>Upload File (PDF, DOC, PPT, Images)</label>
                <div className="file-upload-wrapper">
                  <label htmlFor="file-upload" className="file-upload-btn">
                    <AiOutlineUpload className="upload-icon" />
                    <span>{file ? file.name : "Choose a file"}</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4"
                    onChange={handleFileChange}
                    hidden
                  />
                  {file && (
                    <div className="file-info">
                      <p>File: {file.name}</p>
                      <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button
                        type="button"
                        className="clear-file-btn"
                        onClick={() => setFile(null)}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                {form.file_url && !file && (
                  <p className="current-file">
                    Current file:{" "}
                    <a
                      href={form.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {form.file_url.split("/").pop()}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Order Index</label>
            <input
              type="number"
              value={form.order_index}
              onChange={(e) =>
                setForm({ ...form, order_index: parseInt(e.target.value) || 0 })
              }
              min={0}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="preview-checkbox">
              <input
                type="checkbox"
                checked={form.is_preview}
                onChange={(e) =>
                  setForm({ ...form, is_preview: e.target.checked })
                }
              />
              <span>Make this a Free Preview Lesson</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLesson;