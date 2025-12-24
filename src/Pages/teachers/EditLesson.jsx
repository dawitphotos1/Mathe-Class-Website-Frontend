// // pages/teachers/EditLesson.jsx

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { prepareFormData, validateFiles } from "../../utils/uploadUtils";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "./EditLesson.css";
// import { AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";

// const EditLesson = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     content_type: "text",
//     video_url: "",
//     order_index: 0,
//     is_preview: false,
//     unit_id: null,
//   });

//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [existingAttachments, setExistingAttachments] = useState([]);
//   const [activeTab, setActiveTab] = useState("text");

//   /* ---------------- load lesson ---------------- */

//   useEffect(() => {
//     const loadLesson = async () => {
//       try {
//         const res = await axiosInstance.get(`/lessons/${lessonId}`);
//         const lesson = res.data.lesson;

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

//         if (Array.isArray(lesson.attachments)) {
//           setExistingAttachments(lesson.attachments);
//         } else if (lesson.file_url || lesson.fileUrl) {
//           setExistingAttachments([
//             {
//               id: "legacy",
//               url: lesson.file_url || lesson.fileUrl,
//               name: (lesson.file_url || lesson.fileUrl).split("/").pop(),
//             },
//           ]);
//         }
//       } catch (err) {
//         toast.error("Failed to load lesson");
//         navigate(-1);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadLesson();
//   }, [lessonId, navigate]);

//   /* ---------------- file handling ---------------- */

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const { validFiles, errors } = validateFiles(files);

//     if (errors.length) {
//       toast.warning(`Some files rejected: ${errors.join(", ")}`);
//     }

//     if (!validFiles.length) return;

//     setSelectedFiles((prev) => [...prev, ...validFiles]);

//     const hasPdf = validFiles.some((f) => f.type === "application/pdf");
//     const hasVideo = validFiles.some((f) =>
//       f.type.startsWith("video/")
//     );

//     if (hasPdf) {
//       setForm((p) => ({ ...p, content_type: "pdf" }));
//       setActiveTab("pdf");
//     } else if (hasVideo) {
//       setForm((p) => ({ ...p, content_type: "video" }));
//       setActiveTab("video");
//     } else if (validFiles.length > 1) {
//       setForm((p) => ({ ...p, content_type: "mixed" }));
//       setActiveTab("mixed");
//     }
//   };

//   const removeFile = (index) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeExistingAttachment = async (attachmentId) => {
//     try {
//       await axiosInstance.delete(`/lessons/attachments/${attachmentId}`);
//       setExistingAttachments((prev) =>
//         prev.filter((a) => a.id !== attachmentId)
//       );
//       toast.success("Attachment deleted");
//     } catch {
//       toast.error("Failed to delete attachment");
//     }
//   };

//   /* ---------------- submit ---------------- */

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setUploadProgress(0);

//     try {
//       const data = prepareFormData(form, selectedFiles);

//       const response = await axiosInstance.put(
//         `/lessons/${lessonId}`,
//         data,
//         {
//           onUploadProgress: (evt) => {
//             if (!evt.total) return;
//             setUploadProgress(
//               Math.round((evt.loaded * 100) / evt.total)
//             );
//           },
//         }
//       );

//       if (!response.data?.success) {
//         throw new Error(response.data?.error);
//       }

//       toast.success("Lesson updated successfully!");
//       setTimeout(() => navigate(-1), 1000);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Update failed");
//     } finally {
//       setSaving(false);
//       setUploadProgress(0);
//     }
//   };

//   /* ---------------- render ---------------- */

//   if (loading) {
//     return (
//       <div className="edit-lesson-page">
//         <p className="loading-text">Loading lesson...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="edit-lesson-page">
//       <div className="edit-lesson-card">
//         <h2>Edit Lesson</h2>

//         {uploadProgress > 0 && uploadProgress < 100 && (
//           <div className="upload-progress">
//             <p>Uploading: {uploadProgress}%</p>
//             <progress value={uploadProgress} max="100" />
//           </div>
//         )}

//         <form className="edit-lesson-form" onSubmit={handleSubmit}>
//           <label>Title *</label>
//           <input
//             value={form.title}
//             onChange={(e) =>
//               setForm({ ...form, title: e.target.value })
//             }
//             required
//           />

//           <div className="tab-header">
//             {["text", "video", "pdf", "mixed"].map((t) => (
//               <button
//                 key={t}
//                 type="button"
//                 className={activeTab === t ? "active" : ""}
//                 onClick={() => {
//                   setActiveTab(t);
//                   setForm({ ...form, content_type: t });
//                 }}
//               >
//                 {t.toUpperCase()}
//               </button>
//             ))}
//           </div>

//           {activeTab === "text" && (
//             <ReactQuill
//               value={form.content}
//               onChange={(v) => setForm({ ...form, content: v })}
//             />
//           )}

//           {activeTab === "video" && (
//             <input
//               placeholder="Video URL"
//               value={form.video_url}
//               onChange={(e) =>
//                 setForm({ ...form, video_url: e.target.value })
//               }
//             />
//           )}

//           {(activeTab === "pdf" || activeTab === "mixed") && (
//             <>
//               <label className="file-upload-btn">
//                 <AiOutlineUpload />
//                 {selectedFiles.length
//                   ? `${selectedFiles.length} file(s) selected`
//                   : "Choose files"}
//                 <input
//                   type="file"
//                   hidden
//                   multiple
//                   onChange={handleFileChange}
//                 />
//               </label>

//               {selectedFiles.map((f, i) => (
//                 <div key={i} className="file-item">
//                   {f.name}
//                   <button
//                     type="button"
//                     onClick={() => removeFile(i)}
//                   >
//                     <AiOutlineDelete />
//                   </button>
//                 </div>
//               ))}

//               {existingAttachments.map((a) => (
//                 <div key={a.id} className="attachment-item">
//                   <a
//                     href={a.url || a.fileUrl || a.filePath}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     {a.name ||
//                       a.fileName ||
//                       a.filePath?.split("/").pop()}
//                   </a>
//                   {a.id !== "legacy" && (
//                     <button
//                       type="button"
//                       onClick={() =>
//                         removeExistingAttachment(a.id)
//                       }
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </>
//           )}

//           <label>
//             <input
//               type="checkbox"
//               checked={form.is_preview}
//               onChange={(e) =>
//                 setForm({ ...form, is_preview: e.target.checked })
//               }
//             />
//             Preview lesson
//           </label>

//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               disabled={saving}
//             >
//               Cancel
//             </button>
//             <button type="submit" disabled={saving}>
//               {saving ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditLesson;





// src/pages/teachers/EditLesson.jsx - ADD COURSEID PARAM HANDLING
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
  const { lessonId, courseId } = useParams(); // ✅ Now also gets courseId
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

  // ✅ Add console logging for debugging
  useEffect(() => {
    console.log("✏️ EditLesson component loaded:", {
      lessonId,
      courseId,
      path: `/teacher/courses/${courseId}/lessons/${lessonId}/edit`
    });
  }, [lessonId, courseId]);

  /* ---------------- load lesson ---------------- */

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonId}`);
        const lesson = res.data.lesson;

        console.log("📥 Lesson loaded:", {
          title: lesson.title,
          contentType: lesson.content_type,
          hasFile: !!lesson.file_url || !!lesson.fileUrl,
          courseIdFromLesson: lesson.course_id
        });

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
        console.error("❌ Failed to load lesson:", err);
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

      console.log("💾 Saving lesson update:", {
        lessonId,
        courseId,
        contentType: form.content_type
      });

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
      
      // ✅ Navigate back to the course or manage lessons page
      if (courseId) {
        setTimeout(() => navigate(`/courses/${courseId}/manage-lessons`), 1000);
      } else {
        setTimeout(() => navigate(-1), 1000);
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
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
        
        {/* ✅ Show course context if available */}
        {courseId && (
          <div className="course-context" style={{ 
            marginBottom: "1rem", 
            padding: "0.5rem", 
            background: "#f0f8ff",
            borderRadius: "4px"
          }}>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              <strong>Course ID:</strong> {courseId}
            </p>
          </div>
        )}

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
            placeholder="Lesson title"
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
            <div className="quill-editor-container">
              <ReactQuill
                value={form.content}
                onChange={(v) => setForm({ ...form, content: v })}
                theme="snow"
                placeholder="Enter lesson content here..."
              />
            </div>
          )}

          {activeTab === "video" && (
            <div className="video-input">
              <label>Video URL</label>
              <input
                placeholder="https://example.com/video.mp4 or YouTube embed URL"
                value={form.video_url}
                onChange={(e) =>
                  setForm({ ...form, video_url: e.target.value })
                }
              />
              <small className="helper-text">
                Enter a direct video URL or embed link
              </small>
            </div>
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
                  accept=".pdf,.doc,.docx,.txt,.mp4,.mov,.avi"
                />
              </label>

              <small className="helper-text">
                Accepted: PDF, Word docs, text files, videos (MP4, MOV, AVI)
              </small>

              {selectedFiles.map((f, i) => (
                <div key={i} className="file-item">
                  <span className="file-name">{f.name}</span>
                  <span className="file-size">
                    ({(f.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="remove-btn"
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
                    className="attachment-link"
                  >
                    📎 {a.name ||
                      a.fileName ||
                      a.filePath?.split("/").pop()}
                  </a>
                  {a.id !== "legacy" && (
                    <button
                      type="button"
                      onClick={() =>
                        removeExistingAttachment(a.id)
                      }
                      className="delete-attachment-btn"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.is_preview}
                onChange={(e) =>
                  setForm({ ...form, is_preview: e.target.checked })
                }
              />
              <span>Mark as preview lesson (free for students to view)</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="save-btn"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLesson;