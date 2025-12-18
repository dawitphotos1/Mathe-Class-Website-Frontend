// //ManageLessons.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
// import axios from "../utils/axiosInstance"; // updated import
// import { toast } from "react-toastify";
// import "./ManageLessons.css";

// const ManageLessons = () => {
//   const { courseId } = useParams();
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [previewText, setPreviewText] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const fetchLessons = useCallback(async () => {
//     try {
//       const res = await axios.get(`/lessons/${courseId}/lessons`);
//       setLessons(res.data.lessons || []);
//     } catch (err) {
//       toast.error("Failed to fetch lessons");
//     } finally {
//       setLoading(false);
//     }
//   }, [courseId]);

//   useEffect(() => {
//     if (location.state?.refresh) {
//       fetchLessons();
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state, fetchLessons]);

//   useEffect(() => {
//     fetchLessons();
//   }, [courseId, fetchLessons]);

//   const handleDelete = async (lessonId) => {
//     if (!window.confirm("Are you sure you want to delete this lesson?")) return;
//     try {
//       await axios.delete(`/lessons/${lessonId}`);
//       setLessons((prev) => prev.filter((l) => l.id !== lessonId));
//       toast.success("Lesson deleted");
//     } catch (err) {
//       toast.error("Failed to delete lesson");
//     }
//   };

//   const handlePreview = (lesson) => {
//     if (lesson.contentType === "video" && lesson.videoUrl) {
//       window.open(lesson.videoUrl, "_blank");
//     } else if (lesson.contentType === "file" && lesson.contentUrl) {
//       // Assuming axiosInstance baseURL handles backend host, prepend only if needed
//       window.open(
//         lesson.contentUrl.startsWith("http")
//           ? lesson.contentUrl
//           : lesson.contentUrl,
//         "_blank"
//       );
//     } else if (lesson.contentType === "text" && lesson.content) {
//       setPreviewText(lesson.content);
//     }
//   };

//   return (
//     <div className="manage-lessons">
//       <h2>📚 Manage Lessons</h2>
//       <Link to={`/courses/${courseId}/lessons/new`} className="create-btn">
//         ➕ Create New Lesson
//       </Link>

//       {loading ? (
//         <p>Loading lessons...</p>
//       ) : lessons.length === 0 ? (
//         <p>No lessons found.</p>
//       ) : (
//         <ul className="lesson-list">
//           {lessons.map((lesson) => (
//             <li
//               key={lesson.id}
//               className={lesson.isUnitHeader ? "unit-header" : "lesson-item"}
//             >
//               <strong>{lesson.title}</strong>
//               {!lesson.isUnitHeader && (
//                 <>
//                   <span className="badge">{lesson.contentType}</span>
//                   <div className="actions">
//                     <button onClick={() => handlePreview(lesson)}>
//                       👁️ Preview
//                     </button>
//                     <button
//                       className="edit-btn"
//                       onClick={() =>
//                         navigate(
//                           `/courses/${courseId}/lessons/${lesson.id}/edit`
//                         )
//                       }
//                     >
//                       ✏️ Edit
//                     </button>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDelete(lesson.id)}
//                     >
//                       🗑️ Delete
//                     </button>
//                   </div>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}

//       {previewText && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button className="close-btn" onClick={() => setPreviewText(null)}>
//               ❌ Close
//             </button>
//             <div
//               className="text-preview"
//               dangerouslySetInnerHTML={{ __html: previewText }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageLessons;



// src/pages/ManageLessons.jsx - COMPLETE FIXED VERSION WITH MULTIPLE ATTACHMENTS
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "./ManageLessons.css";

const ManageLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewText, setPreviewText] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchLessons = useCallback(async () => {
    try {
      const res = await axios.get(`/lessons/course/${courseId}/all`);
      console.log("📚 Fetched lessons:", res.data);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      toast.error("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchLessons();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, fetchLessons]);

  useEffect(() => {
    fetchLessons();
  }, [courseId, fetchLessons]);

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("Lesson deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete lesson");
    }
  };

  const handlePreview = (lesson) => {
    console.log("🔍 Preview lesson:", lesson);
    
    // Check for multiple attachments
    if (lesson.attachments && Array.isArray(lesson.attachments) && lesson.attachments.length > 0) {
      // Show first attachment preview
      const firstAttachment = lesson.attachments[0];
      if (firstAttachment.filePath || firstAttachment.fileUrl || firstAttachment.url) {
        const fileUrl = firstAttachment.filePath || firstAttachment.fileUrl || firstAttachment.url;
        setPreviewFile(fileUrl);
        return;
      }
    } 
    // Check for single file URL
    else if (lesson.fileUrl || lesson.file_url) {
      setPreviewFile(lesson.fileUrl || lesson.file_url);
      return;
    }
    // Check for video URL
    else if (lesson.contentType === "video" && lesson.videoUrl) {
      setPreviewFile(lesson.videoUrl);
      return;
    }
    // Check for text content
    else if (lesson.contentType === "text" && (lesson.content || lesson.textContent)) {
      setPreviewText(lesson.content || lesson.textContent);
      return;
    }
    else {
      toast.info("No preview available for this lesson");
    }
  };

  const renderFilePreview = () => {
    if (!previewFile) return null;
    
    const fileType = previewFile.toLowerCase();
    
    if (fileType.includes('.pdf') || fileType.includes('/pdfs/')) {
      return (
        <iframe
          src={previewFile}
          title="PDF Preview"
          style={{ width: '100%', height: '600px', border: 'none' }}
        />
      );
    } else if (fileType.includes('.mp4') || fileType.includes('.mov') || fileType.includes('video')) {
      return (
        <video controls style={{ width: '100%', maxHeight: '600px' }}>
          <source src={previewFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType.includes('.jpg') || fileType.includes('.jpeg') || fileType.includes('.png') || fileType.includes('image')) {
      return (
        <img 
          src={previewFile} 
          alt="Preview" 
          style={{ maxWidth: '100%', maxHeight: '600px' }} 
        />
      );
    } else {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>File preview not available for this format.</p>
          <a href={previewFile} target="_blank" rel="noopener noreferrer">
            Open File in New Tab
          </a>
        </div>
      );
    }
  };

  return (
    <div className="manage-lessons">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📚 Manage Lessons</h2>
        <Link to={`/courses/${courseId}/lessons/new`} className="create-btn">
          ➕ Create New Lesson
        </Link>
      </div>

      {loading ? (
        <p>Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No lessons found for this course.</p>
          <Link to={`/courses/${courseId}/lessons/new`} className="create-btn">
            Create Your First Lesson
          </Link>
        </div>
      ) : (
        <div className="lesson-list-container">
          <table className="lesson-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Attachments</th>
                <th>Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id} className={lesson.isUnitHeader ? "unit-header-row" : "lesson-row"}>
                  <td>
                    <strong>{lesson.title}</strong>
                    {lesson.isPreview && (
                      <span className="preview-badge">👁️ Preview</span>
                    )}
                  </td>
                  <td>
                    <span className="content-type-badge">
                      {lesson.contentType || lesson.content_type || 'text'}
                    </span>
                  </td>
                  <td>
                    {lesson.attachments && Array.isArray(lesson.attachments) && lesson.attachments.length > 0 ? (
                      <div className="attachments-count">
                        <span className="attachment-badge">📎 {lesson.attachments.length}</span>
                        <div className="attachments-list">
                          {lesson.attachments.slice(0, 3).map((att, idx) => (
                            <small key={idx} title={att.name || att.fileName}>
                              {att.name || att.fileName || 'File'}
                            </small>
                          ))}
                          {lesson.attachments.length > 3 && (
                            <small>+{lesson.attachments.length - 3} more</small>
                          )}
                        </div>
                      </div>
                    ) : lesson.fileUrl || lesson.file_url ? (
                      <span className="attachment-badge">📄 1 file</span>
                    ) : (
                      <span className="no-attachments">No attachments</span>
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={() => handlePreview(lesson)}
                      className="preview-btn"
                      disabled={!lesson.fileUrl && !lesson.file_url && !lesson.attachments && !lesson.content}
                    >
                      👁️ Preview
                    </button>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(
                            `/courses/${courseId}/lessons/${lesson.id}/edit`
                          )
                        }
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(lesson.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal for Text Content */}
      {previewText && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Lesson Preview</h3>
              <button className="close-btn" onClick={() => setPreviewText(null)}>
                ❌ Close
              </button>
            </div>
            <div
              className="text-preview"
              dangerouslySetInnerHTML={{ __html: previewText }}
            />
          </div>
        </div>
      )}

      {/* Preview Modal for Files */}
      {previewFile && (
        <div className="modal-overlay">
          <div className="modal-content file-preview-modal">
            <div className="modal-header">
              <h3>File Preview</h3>
              <div>
                <a 
                  href={previewFile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="open-tab-btn"
                >
                  🔗 Open in New Tab
                </a>
                <button className="close-btn" onClick={() => setPreviewFile(null)}>
                  ❌ Close
                </button>
              </div>
            </div>
            <div className="file-preview-container">
              {renderFilePreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLessons;

