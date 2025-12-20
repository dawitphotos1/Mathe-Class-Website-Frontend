// // pages/teachers/EditLesson.jsx - FIXED UPLOAD
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from '../../utils/axiosInstance';
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "./EditLesson.css";
// import { AiOutlineUpload } from "react-icons/ai";

// const EditLesson = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
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
//   const [existingFileUrl, setExistingFileUrl] = useState("");

//   useEffect(() => {
//     const loadLesson = async () => {
//       try {
//         const res = await axiosInstance.get(`/lessons/${lessonId}`);
//         const lesson = res.data.lesson;

//         console.log("📦 Lesson data loaded:", lesson);

//         // Initialize form with proper values
//         setForm({
//           title: lesson.title || "",
//           content: lesson.content || "",
//           content_type: lesson.content_type || "text",
//           video_url: lesson.video_url || "",
//           order_index: lesson.order_index || 0,
//           is_preview: lesson.is_preview || false,
//           unit_id: lesson.unit_id || null,
//         });

//         setActiveTab(lesson.content_type || "text");
        
//         // Save existing file URL if it exists
//         if (lesson.file_url || lesson.fileUrl) {
//           const fileUrl = lesson.file_url || lesson.fileUrl;
//           setExistingFileUrl(fileUrl);
//           console.log("📎 Existing file URL:", fileUrl);
          
//           // If there's an existing file and it's a PDF, ensure content_type is set
//           if (fileUrl.includes('.pdf') && (!lesson.content_type || lesson.content_type === 'text')) {
//             setForm(prev => ({ ...prev, content_type: 'pdf' }));
//             setActiveTab('pdf');
//           }
//         }

//       } catch (error) {
//         console.error("Load lesson error:", error);
//         toast.error("Failed to load lesson");
//         navigate(-1);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (lessonId) {
//       loadLesson();
//     }
//   }, [lessonId, navigate]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       console.log("📁 File selected:", selectedFile.name, "Type:", selectedFile.type);
//       setFile(selectedFile);
      
//       // Update content_type based on file type
//       let contentType = "file";
//       if (selectedFile.type === "application/pdf") {
//         contentType = "pdf";
//       } else if (selectedFile.type.includes("video")) {
//         contentType = "video";
//       }
      
//       setForm(prev => ({ ...prev, content_type: contentType }));
//       setActiveTab(contentType);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     const formData = new FormData();

//     // Append all form fields
//     Object.keys(form).forEach((key) => {
//       if (form[key] !== null && form[key] !== undefined) {
//         formData.append(key, form[key]);
//       }
//     });

//     // Append file if selected
//     if (file) {
//       formData.append("file", file);
//       console.log("📤 Uploading file:", file.name);
//     }

//     try {
//       const response = await axiosInstance.put(`/lessons/${lessonId}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("✅ Update response:", response.data);
//       toast.success("Lesson updated successfully!");
      
//       // Navigate back after a short delay
//       setTimeout(() => {
//         navigate(-1);
//       }, 1000);

//     } catch (error) {
//       console.error("❌ Update error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.error || "Failed to update lesson");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const clearFile = () => {
//     setFile(null);
//     // Reset to text content type when clearing file
//     setForm(prev => ({ ...prev, content_type: 'text' }));
//     setActiveTab("text");
//   };

//   if (loading) {
//     return (
//       <div className="edit-lesson-page">
//         <div className="loading-spinner"></div>
//         <p className="loading-text">Loading lesson data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="edit-lesson-page">
//       <div className="edit-lesson-card">
//         <h2>Edit Lesson</h2>

//         <form className="edit-lesson-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Title *</label>
//             <input
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//               placeholder="Enter lesson title"
//               required
//               className="form-input"
//             />
//           </div>

//           {/* ===== Content Type Tabs ===== */}
//           <div className="form-group">
//             <label>Content Type</label>
//             <div className="tab-header">
//               {["text", "video", "pdf"].map((type) => (
//                 <button
//                   type="button"
//                   key={type}
//                   className={`tab-btn ${activeTab === type ? "active" : ""}`}
//                   onClick={() => {
//                     setActiveTab(type);
//                     setForm({ ...form, content_type: type });
//                     if (type !== "pdf") {
//                       setFile(null);
//                     }
//                   }}
//                 >
//                   {type === "text"
//                     ? "Text"
//                     : type === "video"
//                     ? "Video"
//                     : "File"}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ===== Tab Content ===== */}
//           <div className="tab-content">
//             {activeTab === "text" && (
//               <div className="form-group">
//                 <label>Content</label>
//                 <ReactQuill
//                   theme="snow"
//                   value={form.content}
//                   onChange={(value) => setForm({ ...form, content: value })}
//                   className="quill-editor"
//                 />
//               </div>
//             )}

//             {activeTab === "video" && (
//               <div className="form-group">
//                 <label>Video URL</label>
//                 <input
//                   value={form.video_url}
//                   onChange={(e) =>
//                     setForm({ ...form, video_url: e.target.value })
//                   }
//                   placeholder="https://example.com/video.mp4"
//                   className="form-input"
//                 />
//                 <p className="form-help">
//                   Enter a direct video URL or YouTube/Vimeo link
//                 </p>
//               </div>
//             )}

//             {activeTab === "pdf" && (
//               <div className="form-group">
//                 <label>Upload File (PDF, DOC, PPT, Images)</label>
//                 <div className="file-upload-wrapper">
//                   <label htmlFor="file-upload" className="file-upload-btn">
//                     <AiOutlineUpload className="upload-icon" />
//                     <span>{file ? file.name : "Choose a file"}</span>
//                   </label>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mp3,.zip"
//                     onChange={handleFileChange}
//                     hidden
//                   />
//                   {(file || existingFileUrl) && (
//                     <div className="file-info">
//                       <p>
//                         File: {file ? file.name : existingFileUrl.split("/").pop()}
//                       </p>
//                       {file && (
//                         <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
//                       )}
//                       <button
//                         type="button"
//                         className="clear-file-btn"
//                         onClick={clearFile}
//                       >
//                         Clear File
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 {existingFileUrl && !file && (
//                   <div className="current-file">
//                     <p>Current file:</p>
//                     <a
//                       href={existingFileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="file-link"
//                     >
//                       {existingFileUrl.split("/").pop()}
//                     </a>
//                     <p className="form-help">
//                       Upload a new file to replace the current one
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="form-group">
//             <label>Order Index</label>
//             <input
//               type="number"
//               value={form.order_index}
//               onChange={(e) =>
//                 setForm({ ...form, order_index: parseInt(e.target.value) || 0 })
//               }
//               min={0}
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label className="preview-checkbox">
//               <input
//                 type="checkbox"
//                 checked={form.is_preview}
//                 onChange={(e) =>
//                   setForm({ ...form, is_preview: e.target.checked })
//                 }
//               />
//               <span>Make this a Free Preview Lesson</span>
//             </label>
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="cancel-btn"
//               onClick={() => navigate(-1)}
//               disabled={saving}
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               className="save-btn"
//               disabled={saving}
//             >
//               {saving ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditLesson;








// pages/teachers/EditLesson.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { prepareFormData, validateFiles } from "../../utils/uploadUtils";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditLesson.css";
import { AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    content: "",
    content_type: "text",
    video_url: "",
    order_index: 0,
    is_preview: false,
    unit_id: null,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [activeTab, setActiveTab] = useState("text");

  /* ---------------- load lesson ---------------- */

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonId}`);
        const lesson = res.data.lesson;

        setForm({
          title: lesson.title || "",
          content: lesson.content || "",
          content_type: lesson.content_type || "text",
          video_url: lesson.video_url || "",
          order_index: lesson.order_index || 0,
          is_preview: lesson.is_preview || false,
          unit_id: lesson.unit_id || null,
        });

        setActiveTab(lesson.content_type || "text");

        if (Array.isArray(lesson.attachments)) {
          setExistingAttachments(lesson.attachments);
        } else if (lesson.file_url || lesson.fileUrl) {
          setExistingAttachments([
            {
              id: "legacy",
              url: lesson.file_url || lesson.fileUrl,
              name: (lesson.file_url || lesson.fileUrl).split("/").pop(),
            },
          ]);
        }
      } catch (err) {
        toast.error("Failed to load lesson");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, navigate]);

  /* ---------------- file handling ---------------- */

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const { validFiles, errors } = validateFiles(files);

    if (errors.length) {
      toast.warning(`Some files rejected: ${errors.join(", ")}`);
    }

    if (!validFiles.length) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    const hasPdf = validFiles.some((f) => f.type === "application/pdf");
    const hasVideo = validFiles.some((f) =>
      f.type.startsWith("video/")
    );

    if (hasPdf) {
      setForm((p) => ({ ...p, content_type: "pdf" }));
      setActiveTab("pdf");
    } else if (hasVideo) {
      setForm((p) => ({ ...p, content_type: "video" }));
      setActiveTab("video");
    } else if (validFiles.length > 1) {
      setForm((p) => ({ ...p, content_type: "mixed" }));
      setActiveTab("mixed");
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = async (attachmentId) => {
    try {
      await axiosInstance.delete(`/lessons/attachments/${attachmentId}`);
      setExistingAttachments((prev) =>
        prev.filter((a) => a.id !== attachmentId)
      );
      toast.success("Attachment deleted");
    } catch {
      toast.error("Failed to delete attachment");
    }
  };

  /* ---------------- submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploadProgress(0);

    try {
      const data = prepareFormData(form, selectedFiles);

      const response = await axiosInstance.put(
        `/lessons/${lessonId}`,
        data,
        {
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            setUploadProgress(
              Math.round((evt.loaded * 100) / evt.total)
            );
          },
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.error);
      }

      toast.success("Lesson updated successfully!");
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  /* ---------------- render ---------------- */

  if (loading) {
    return (
      <div className="edit-lesson-page">
        <p className="loading-text">Loading lesson...</p>
      </div>
    );
  }

  return (
    <div className="edit-lesson-page">
      <div className="edit-lesson-card">
        <h2>Edit Lesson</h2>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress">
            <p>Uploading: {uploadProgress}%</p>
            <progress value={uploadProgress} max="100" />
          </div>
        )}

        <form className="edit-lesson-form" onSubmit={handleSubmit}>
          <label>Title *</label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <div className="tab-header">
            {["text", "video", "pdf", "mixed"].map((t) => (
              <button
                key={t}
                type="button"
                className={activeTab === t ? "active" : ""}
                onClick={() => {
                  setActiveTab(t);
                  setForm({ ...form, content_type: t });
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === "text" && (
            <ReactQuill
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
            />
          )}

          {activeTab === "video" && (
            <input
              placeholder="Video URL"
              value={form.video_url}
              onChange={(e) =>
                setForm({ ...form, video_url: e.target.value })
              }
            />
          )}

          {(activeTab === "pdf" || activeTab === "mixed") && (
            <>
              <label className="file-upload-btn">
                <AiOutlineUpload />
                {selectedFiles.length
                  ? `${selectedFiles.length} file(s) selected`
                  : "Choose files"}
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </label>

              {selectedFiles.map((f, i) => (
                <div key={i} className="file-item">
                  {f.name}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              ))}

              {existingAttachments.map((a) => (
                <div key={a.id} className="attachment-item">
                  <a
                    href={a.url || a.fileUrl || a.filePath}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {a.name ||
                      a.fileName ||
                      a.filePath?.split("/").pop()}
                  </a>
                  {a.id !== "legacy" && (
                    <button
                      type="button"
                      onClick={() =>
                        removeExistingAttachment(a.id)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          <label>
            <input
              type="checkbox"
              checked={form.is_preview}
              onChange={(e) =>
                setForm({ ...form, is_preview: e.target.checked })
              }
            />
            Preview lesson
          </label>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLesson;
