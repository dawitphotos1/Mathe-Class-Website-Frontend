// //pages/teachers/EditCourse.jsx

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from '../../utils/axiosInstance'; // Import your axiosInstance here
// import "./EditCourse.css";

// function EditCourse() {
//   const { slug } = useParams(); // now using slug
//   const navigate = useNavigate();

//   const [course, setCourse] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [attachmentUrls, setAttachmentUrls] = useState([]);

//   const [renaming, setRenaming] = useState({}); // { courseId, index }
//   const [editingName, setEditingName] = useState("");

//   const [loadingAttachmentAction, setLoadingAttachmentAction] = useState(false);
//   const [loadingCourseUpdate, setLoadingCourseUpdate] = useState(false);

//   useEffect(() => {
//     fetchCourse();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [slug]);

//   const fetchCourse = async () => {
//     try {
//       const res = await axiosInstance.get(`/api/v1/courses/${slug}`);
//       const courseData = res.data.course;
//       setCourse(courseData);
//       setTitle(courseData.title || "");
//       setDescription(courseData.description || "");
//       setThumbnailUrl(courseData.thumbnailUrl || "");
//       setAttachmentUrls(courseData.attachmentUrls || []);
//     } catch (err) {
//       toast.error("Failed to fetch course");
//       console.error(err);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setThumbnailFile(file);
//       const preview = URL.createObjectURL(file);
//       setThumbnailUrl(preview);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoadingCourseUpdate(true);
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       if (thumbnailFile) {
//         formData.append("thumbnail", thumbnailFile);
//       }

//       await axiosInstance.patch(`/api/v1/courses/${course.id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Course updated successfully!");
//       navigate("/my-teaching-courses");
//     } catch (err) {
//       toast.error("Failed to update course");
//       console.error(err);
//     } finally {
//       setLoadingCourseUpdate(false);
//     }
//   };

//   const handlePreviewPdf = (url) => {
//     window.open(url, "_blank");
//   };

//   const startRenaming = (courseId, index, fileName) => {
//     setRenaming({ courseId, index });
//     setEditingName(fileName.replace(/\.[^/.]+$/, "")); // Remove extension
//   };

//   const confirmRename = async () => {
//     if (!editingName.trim()) {
//       toast.error("Filename cannot be empty");
//       return;
//     }

//     setLoadingAttachmentAction(true);
//     try {
//       await axiosInstance.patch(
//         `/api/v1/courses/${renaming.courseId}/attachments/${renaming.index}/rename`,
//         { newName: editingName }
//       );
//       toast.success("File renamed!");
//       setRenaming({});
//       fetchCourse(); // Refresh attachments
//     } catch (err) {
//       toast.error("Rename failed");
//       console.error(err);
//     } finally {
//       setLoadingAttachmentAction(false);
//     }
//   };

//   const deleteAttachment = async (courseId, index) => {
//     if (!window.confirm("Are you sure you want to delete this attachment?")) {
//       return;
//     }

//     setLoadingAttachmentAction(true);
//     try {
//       await axiosInstance.patch(
//         `/api/v1/courses/${courseId}/attachments/${index}/delete`
//       );
//       toast.success("Attachment deleted");
//       fetchCourse(); // Refresh list
//     } catch (err) {
//       toast.error("Delete failed");
//       console.error(err);
//     } finally {
//       setLoadingAttachmentAction(false);
//     }
//   };

//   if (!course) return <div className="loading">Loading course...</div>;

//   return (
//     <div className="edit-course-container">
//       <h2>Edit Course</h2>
//       <form className="edit-course-form" onSubmit={handleSubmit}>
//         <div className="form-section">
//           <label>Title</label>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             disabled={loadingCourseUpdate}
//           />
//         </div>

//         <div className="form-section">
//           <label>Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             disabled={loadingCourseUpdate}
//           />
//         </div>

//         <div className="form-section">
//           <label>Thumbnail</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             disabled={loadingCourseUpdate}
//           />
//           {thumbnailUrl && (
//             <div className="file-preview">
//               <img src={thumbnailUrl} alt="Thumbnail Preview" />
//             </div>
//           )}
//         </div>

//         <div className="form-section">
//           <label>Attachments</label>
//           {attachmentUrls.length === 0 ? (
//             <p>No attachments.</p>
//           ) : (
//             <ul className="attachments-list">
//               {attachmentUrls.map((fileUrl, idx) => {
//                 const fileName = fileUrl.split("/").pop();

//                 return (
//                   <li key={fileUrl} className="attachment-actions">
//                     {renaming.courseId === course.id &&
//                     renaming.index === idx ? (
//                       <>
//                         <input
//                           value={editingName}
//                           onChange={(e) => setEditingName(e.target.value)}
//                           className="rename-input"
//                           disabled={loadingAttachmentAction}
//                           autoFocus
//                         />
//                         <button
//                           onClick={(e) => {
//                             e.preventDefault();
//                             confirmRename();
//                           }}
//                           disabled={loadingAttachmentAction}
//                         >
//                           💾 Save
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.preventDefault();
//                             setRenaming({});
//                           }}
//                           disabled={loadingAttachmentAction}
//                         >
//                           ❌ Cancel
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <span className="attachment-name">{fileName}</span>
//                         <button
//                           type="button"
//                           onClick={() => handlePreviewPdf(fileUrl)}
//                           disabled={loadingAttachmentAction}
//                         >
//                           📄 Preview
//                         </button>
//                         <a
//                           href={fileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           download
//                         >
//                           ⬇️ Download
//                         </a>
//                         <button
//                           type="button"
//                           onClick={() =>
//                             startRenaming(course.id, idx, fileName)
//                           }
//                           disabled={loadingAttachmentAction}
//                         >
//                           ✏️ Rename
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => deleteAttachment(course.id, idx)}
//                           className="danger"
//                           disabled={loadingAttachmentAction}
//                         >
//                           🗑️ Delete
//                         </button>
//                       </>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="save-button"
//           disabled={loadingCourseUpdate}
//         >
//           {loadingCourseUpdate ? "Saving..." : "💾 Save Changes"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default EditCourse;





// pages/teachers/EditCourse.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import {
  prepareFormData,
  validateFiles,
  formatFileSize,
} from "../../utils/uploadUtils";
import "./EditCourse.css";

function EditCourse() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [attachmentFiles, setAttachmentFiles] = useState([]); // new uploads
  const [existingAttachments, setExistingAttachments] = useState([]); // backend files

  const [renaming, setRenaming] = useState({ index: null, name: "" });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/courses/${slug}`);
      const courseData = res.data.course;

      setCourse(courseData);
      setFormData({
        title: courseData.title || "",
        description: courseData.description || "",
        price: courseData.price || "",
      });

      setThumbnailPreview(courseData.thumbnail || "");
      setExistingAttachments(courseData.attachments || []);
    } catch (err) {
      toast.error("Failed to fetch course");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const { validFiles, errors } = validateFiles(files);

    if (errors.length) {
      toast.warning(errors.join(", "));
    }

    if (validFiles.length) {
      setAttachmentFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = async (attachmentId) => {
    if (!window.confirm("Delete this attachment?")) return;

    try {
      await axiosInstance.delete(`/api/v1/attachments/${attachmentId}`);
      setExistingAttachments((prev) =>
        prev.filter((att) => att.id !== attachmentId)
      );
      toast.success("Attachment deleted");
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  const startRenaming = (index, currentName) => {
    setRenaming({ index, name: currentName });
  };

  const confirmRename = async () => {
    if (!renaming.name.trim()) {
      toast.error("Filename cannot be empty");
      return;
    }

    try {
      const attachment = existingAttachments[renaming.index];

      await axiosInstance.patch(`/api/v1/attachments/${attachment.id}`, {
        name: renaming.name,
      });

      const updated = [...existingAttachments];
      updated[renaming.index].name = renaming.name;
      setExistingAttachments(updated);

      setRenaming({ index: null, name: "" });
      toast.success("File renamed");
    } catch (err) {
      toast.error("Rename failed");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      const submitData = prepareFormData(formData, attachmentFiles);

      if (thumbnailFile) {
        submitData.append("thumbnail", thumbnailFile);
      }

      await axiosInstance.patch(
        `/api/v1/courses/${course.id}`,
        submitData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );

      toast.success("Course updated successfully");
      setAttachmentFiles([]);
      setThumbnailFile(null);
      fetchCourse();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!course) return <div className="loading">Loading course...</div>;

  return (
    <div className="edit-course-container">
      <h2>Edit Course: {course.title}</h2>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="upload-progress">
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-course-form">
        {/* Title */}
        <div className="form-section">
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>

        {/* Description */}
        <div className="form-section">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        {/* Thumbnail */}
        <div className="form-section">
          <label>Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            disabled={loading}
          />
          {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Preview" width="200" />
          )}
        </div>

        {/* New Attachments */}
        <div className="form-section">
          <label>Add Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleAttachmentChange}
            disabled={loading}
          />

          {attachmentFiles.length > 0 && (
            <ul className="file-list">
              {attachmentFiles.map((file, i) => (
                <li key={i}>
                  {file.name} ({formatFileSize(file.size)})
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Existing Attachments */}
        <div className="form-section">
          <label>Existing Attachments</label>
          {existingAttachments.map((att, index) => (
            <div key={att.id} className="attachment-item">
              {renaming.index === index ? (
                <>
                  <input
                    value={renaming.name}
                    onChange={(e) =>
                      setRenaming((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <button type="button" onClick={confirmRename}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenaming({ index: null, name: "" })}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{att.name}</span>
                  <span>{formatFileSize(att.size)}</span>
                  <a href={att.url} target="_blank" rel="noreferrer">
                    Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => startRenaming(index, att.name)}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExistingAttachment(att.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCourse;
