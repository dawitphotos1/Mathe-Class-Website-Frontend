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


// src/pages/StudentLessons.jsx (renamed from ManageLessons.jsx)
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "./ManageLessons.css";

const StudentLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  // Student can only view lessons, not edit/delete
  const fetchLessons = useCallback(async () => {
    try {
      const res = await axios.get(`/lessons/course/${courseId}/all`);
      setLessons(res.data.lessons || []);
    } catch (err) {
      toast.error("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [courseId, fetchLessons]);

  const handlePreview = (lesson) => {
    // Student preview logic (simpler)
    if (lesson.fileUrl || lesson.file_url) {
      setPreviewFile(lesson.fileUrl || lesson.file_url);
    } else if (lesson.content) {
      // Show text content in alert
      alert(lesson.content.substring(0, 500) + "...");
    }
  };

  return (
    <div className="manage-lessons">
      <h2>📚 Course Lessons</h2>
      
      {/* Student view - no edit/delete buttons */}
      {lessons.map((lesson) => (
        <div key={lesson.id} className="lesson-card">
          <h3>{lesson.title}</h3>
          <button onClick={() => handlePreview(lesson)}>
            👁️ Preview
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentLessons;