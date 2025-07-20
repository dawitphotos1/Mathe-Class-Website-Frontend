// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";
// import ConfirmModal from "../../components/ConfirmModal";
// import "./MyTeachingCourses.css";

// const MyTeachingCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [lessons, setLessons] = useState({});
//   const [expandedCourseId, setExpandedCourseId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);

//   const [modal, setModal] = useState({
//     show: false,
//     title: "",
//     message: "",
//     onConfirm: () => {},
//   });

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("darkMode");
//     if (savedTheme) setDarkMode(JSON.parse(savedTheme));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//   }, [darkMode]);

//   useEffect(() => {
//     const fetchMyCourses = async () => {
//       try {
//         const res = await axios.get("/api/v1/courses", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const allCourses = Array.isArray(res.data) ? res.data : [];
//         const myCourses = allCourses.filter((c) => c.teacherId === user?.id);
//         setCourses(myCourses);
//       } catch (err) {
//         toast.error("Failed to fetch teaching courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyCourses();
//   }, [token, user]);

//   const toggleLessons = async (courseId) => {
//     if (expandedCourseId === courseId) {
//       setExpandedCourseId(null);
//       return;
//     }

//     try {
//       const res = await axios.get(`/api/v1/courses/${courseId}/lessons`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const fetchedLessons = Array.isArray(res.data.lessons)
//         ? res.data.lessons
//         : Array.isArray(res.data)
//         ? res.data
//         : [];

//       const safeLessons = fetchedLessons.map((l, index) => ({
//         ...l,
//         id: l.id || index + 1,
//       }));

//       setLessons((prev) => ({ ...prev, [courseId]: safeLessons }));
//       setExpandedCourseId(courseId);
//     } catch (err) {
//       toast.error("❌ Failed to load lessons");
//     }
//   };

//   const deleteLesson = async (lessonId, courseId) => {
//     setModal({
//       show: true,
//       title: "Delete Lesson",
//       message: "Are you sure you want to delete this lesson?",
//       onConfirm: async () => {
//         try {
//           await axios.delete(`/api/v1/lessons/${lessonId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           toast.success("✅ Lesson deleted");
//           toggleLessons(courseId);
//         } catch (err) {
//           toast.error("❌ Failed to delete lesson");
//         } finally {
//           setModal({ ...modal, show: false });
//         }
//       },
//     });
//   };

//   const deleteCourse = async (courseId) => {
//     setModal({
//       show: true,
//       title: "Delete Course",
//       message:
//         "Are you sure you want to permanently delete this course and all its lessons?",
//       onConfirm: async () => {
//         try {
//           await axios.delete(`/api/v1/courses/${courseId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           toast.success("✅ Course deleted");
//           setCourses((prev) => prev.filter((c) => c.id !== courseId));
//           setExpandedCourseId(null);
//         } catch (err) {
//           toast.error("❌ Failed to delete course");
//         } finally {
//           setModal({ ...modal, show: false });
//         }
//       },
//     });
//   };

//   const toggleTheme = () => setDarkMode((prev) => !prev);

//   const formatFileSize = (bytes) => {
//     if (!bytes) return "";
//     if (bytes < 1024) return `${bytes} B`;
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
//   };

//   return (
//     <div className={`my-teaching-courses ${darkMode ? "dark" : ""}`}>
//       <div className="theme-toggle">
//         <button onClick={toggleTheme}>
//           {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
//         </button>
//       </div>

//       <h2>📘 My Teaching Courses</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : courses.length === 0 ? (
//         <p>No courses found.</p>
//       ) : (
//         <div className="course-grid">
//           {courses.map((course) => (
//             <div key={course.id} className="course-card">
//               <h3>{course.title}</h3>
//               <p>{course.description || "No description provided."}</p>

//               <div className="course-actions">
//                 <Link to={`/courses/${course.id}/manage-lessons`}>
//                   <button className="btn-manage">🛠 Manage Lessons</button>
//                 </Link>
//                 <Link to={`/courses/${course.id}/lessons/new`}>
//                   <button className="btn-create">➕ Create Lesson</button>
//                 </Link>
//                 <button onClick={() => toggleLessons(course.id)}>
//                   {expandedCourseId === course.id
//                     ? "➖ Hide Lessons"
//                     : "📂 View Lessons"}
//                 </button>
//                 <button
//                   className="btn-delete"
//                   onClick={() => deleteCourse(course.id)}
//                 >
//                   🗑 Delete Course
//                 </button>
//               </div>

//               {expandedCourseId === course.id && (
//                 <motion.div
//                   className="lesson-list"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {lessons[course.id]?.length === 0 ? (
//                     <p>No lessons yet.</p>
//                   ) : (
//                     <motion.ul layout>
//                       {lessons[course.id].map((lesson) => (
//                         <motion.li
//                           layout
//                           key={lesson.id}
//                           className="lesson-item"
//                           whileHover={{ scale: 1.02 }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <div className="lesson-header">
//                               <strong>{lesson.title}</strong>
//                               {lesson.isPreview && (
//                                 <span className="preview-badge">Preview</span>
//                               )}
//                               <span className="type-label">
//                                 ({lesson.contentType})
//                               </span>
//                             </div>

//                             {lesson.contentType === "file" &&
//                               lesson.contentUrl &&
//                               (() => {
//                                 const fileUrl = `http://localhost:5000${lesson.contentUrl}`;
//                                 const fileName = lesson.contentUrl
//                                   .split("/")
//                                   .pop();
//                                 const fileExtension = fileName
//                                   .split(".")
//                                   .pop()
//                                   .toLowerCase();
//                                 const previewableTypes = [
//                                   "pdf",
//                                   "png",
//                                   "jpg",
//                                   "jpeg",
//                                   "gif",
//                                   "webp",
//                                 ];
//                                 const isPreviewable =
//                                   previewableTypes.includes(fileExtension);

//                                 const iconMap = {
//                                   pdf: "📄",
//                                   jpg: "🖼️",
//                                   jpeg: "🖼️",
//                                   png: "🖼️",
//                                   gif: "🖼️",
//                                   webp: "🖼️",
//                                   zip: "🗜️",
//                                   mp4: "🎞️",
//                                   docx: "📃",
//                                   pptx: "📊",
//                                   xlsx: "📈",
//                                   default: "📁",
//                                 };

//                                 const fileIcon =
//                                   iconMap[fileExtension] || iconMap.default;
//                                 const userRole = user?.role || "teacher";

//                                 return (
//                                   <div className="lesson-file-box">
//                                     <span className="file-icon">
//                                       {fileIcon}
//                                     </span>
//                                     <span className="file-name">
//                                       {fileName}
//                                     </span>
//                                     <span className="file-size">
//                                       {formatFileSize(lesson.fileSize)}
//                                     </span>
//                                     {userRole === "teacher" &&
//                                       (isPreviewable ? (
//                                         <a
//                                           href={fileUrl}
//                                           target="_blank"
//                                           rel="noopener noreferrer"
//                                           className="btn-file"
//                                         >
//                                           🔍 Preview
//                                         </a>
//                                       ) : (
//                                         <a
//                                           href={fileUrl}
//                                           download
//                                           className="btn-file"
//                                         >
//                                           ⬇️ Download
//                                         </a>
//                                       ))}
//                                   </div>
//                                 );
//                               })()}

//                             {lesson.contentType === "video" &&
//                               lesson.videoUrl && (
//                                 <video
//                                   controls
//                                   width="100%"
//                                   style={{
//                                     marginTop: "10px",
//                                     borderRadius: "8px",
//                                   }}
//                                 >
//                                   <source
//                                     src={lesson.videoUrl}
//                                     type="video/mp4"
//                                   />
//                                   Your browser does not support the video tag.
//                                 </video>
//                               )}

//                             {lesson.contentType === "link" &&
//                               lesson.linkUrl && (
//                                 <div style={{ marginTop: "10px" }}>
//                                   🌐{" "}
//                                   <a
//                                     href={lesson.linkUrl}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     {lesson.linkUrl}
//                                   </a>
//                                 </div>
//                               )}

//                             {lesson.contentType === "quiz" &&
//                               lesson.quizTitle && (
//                                 <div
//                                   style={{
//                                     marginTop: "10px",
//                                     fontStyle: "italic",
//                                   }}
//                                 >
//                                   🧠 Quiz: {lesson.quizTitle}
//                                 </div>
//                               )}
//                           </div>

//                           <button
//                             className="btn-delete"
//                             onClick={() => deleteLesson(lesson.id, course.id)}
//                           >
//                             🗑 Delete
//                           </button>
//                         </motion.li>
//                       ))}
//                     </motion.ul>
//                   )}
//                 </motion.div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       <ConfirmModal
//         show={modal.show}
//         title={modal.title}
//         message={modal.message}
//         onConfirm={modal.onConfirm}
//         onCancel={() => setModal({ ...modal, show: false })}
//       />
//     </div>
//   );
// };

// export default MyTeachingCourses;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";
import api from "../../api/axios"; // ✅ Use custom axios instance
import "./MyTeachingCourses.css";

const MyTeachingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState({});
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const trackLessonView = async (lessonId) => {
    try {
      await api.post(`/lessons/${lessonId}/track-view`);
    } catch (err) {
      console.warn("View tracking failed", err);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await api.get("/courses");
      const myCourses = Array.isArray(res.data)
        ? res.data.filter((c) => c.teacherId === user?.id)
        : [];
      setCourses(myCourses);
    } catch (err) {
      toast.error("❌ Failed to fetch teaching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, [user]);

  const toggleLessons = async (courseId) => {
    if (expandedCourseId === courseId) return setExpandedCourseId(null);

    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      const fetchedLessons = Array.isArray(res.data.lessons)
        ? res.data.lessons
        : res.data;
      const safeLessons = fetchedLessons.map((l, index) => ({
        ...l,
        id: l.id || index + 1,
      }));
      setLessons((prev) => ({ ...prev, [courseId]: safeLessons }));
      setExpandedCourseId(courseId);
    } catch (err) {
      toast.error("❌ Failed to load lessons");
    }
  };

  const deleteLesson = async (lessonId, courseId) => {
    setModal({
      show: true,
      title: "Delete Lesson",
      message: "Are you sure you want to delete this lesson?",
      onConfirm: async () => {
        try {
          await api.delete(`/lessons/${lessonId}`);
          toast.success("✅ Lesson deleted");
          toggleLessons(courseId);
        } catch (err) {
          toast.error("❌ Failed to delete lesson");
        } finally {
          setModal({ ...modal, show: false });
        }
      },
    });
  };

  const deleteCourse = async (courseId) => {
    setModal({
      show: true,
      title: "Delete Course",
      message:
        "Are you sure you want to permanently delete this course and all its lessons?",
      onConfirm: async () => {
        try {
          await api.delete(`/courses/${courseId}`);
          toast.success("✅ Course deleted");
          setCourses((prev) => prev.filter((c) => c.id !== courseId));
          setExpandedCourseId(null);
        } catch (err) {
          toast.error("❌ Failed to delete course");
        } finally {
          setModal({ ...modal, show: false });
        }
      },
    });
  };

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div className={`my-teaching-courses ${darkMode ? "dark" : ""}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <h2>📘 My Teaching Courses</h2>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description || "No description provided."}</p>
              <div className="course-actions">
                <Link to={`/courses/${course.id}/manage-lessons`}>
                  <button className="btn-manage">🛠 Manage Lessons</button>
                </Link>
                <Link to={`/courses/${course.id}/lessons/new`}>
                  <button className="btn-create">➕ Create Lesson</button>
                </Link>
                <button onClick={() => toggleLessons(course.id)}>
                  {expandedCourseId === course.id
                    ? "➖ Hide Lessons"
                    : "📂 View Lessons"}
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteCourse(course.id)}
                >
                  🗑 Delete Course
                </button>
              </div>

              {expandedCourseId === course.id && (
                <motion.div
                  className="lesson-list"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {lessons[course.id]?.length === 0 ? (
                    <p>No lessons yet.</p>
                  ) : (
                    <motion.ul layout>
                      {lessons[course.id].map((lesson) => (
                        <motion.li
                          layout
                          key={lesson.id}
                          className="lesson-item"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div style={{ flex: 1 }}>
                            <div className="lesson-header">
                              <strong>{lesson.title}</strong>
                              {lesson.isPreview && (
                                <span className="preview-badge">Preview</span>
                              )}
                              <span className="type-label">
                                ({lesson.contentType})
                              </span>
                            </div>

                            {lesson.contentType === "file" &&
                              lesson.contentUrl &&
                              (() => {
                                const backendBaseUrl =
                                  process.env.REACT_APP_API_URL ||
                                  "http://localhost:5000";
                                const fileUrl = `${backendBaseUrl}${lesson.contentUrl}`;
                                const fileName = lesson.contentUrl
                                  .split("/")
                                  .pop();
                                const fileExtension = fileName
                                  .split(".")
                                  .pop()
                                  .toLowerCase();
                                const previewableTypes = [
                                  "pdf",
                                  "png",
                                  "jpg",
                                  "jpeg",
                                  "gif",
                                  "webp",
                                ];
                                const isPreviewable =
                                  previewableTypes.includes(fileExtension);
                                const iconMap = {
                                  pdf: "📄",
                                  jpg: "🖼️",
                                  jpeg: "🖼️",
                                  png: "🖼️",
                                  gif: "🖼️",
                                  webp: "🖼️",
                                  zip: "🗜️",
                                  mp4: "🎞️",
                                  docx: "📃",
                                  pptx: "📊",
                                  xlsx: "📈",
                                  default: "📁",
                                };
                                const fileIcon =
                                  iconMap[fileExtension] || iconMap.default;

                                return (
                                  <div className="lesson-file-box">
                                    <span className="file-icon">
                                      {fileIcon}
                                    </span>
                                    <span className="file-name">
                                      {fileName}
                                    </span>
                                    <span className="file-size">
                                      {formatFileSize(lesson.fileSize)}
                                    </span>
                                    {user?.role === "teacher" &&
                                      (isPreviewable ? (
                                        <a
                                          href={fileUrl}
                                          onClick={() =>
                                            trackLessonView(lesson.id)
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn-file"
                                        >
                                          🔍 Preview
                                        </a>
                                      ) : (
                                        <a
                                          href={fileUrl}
                                          onClick={() =>
                                            trackLessonView(lesson.id)
                                          }
                                          download
                                          className="btn-file"
                                        >
                                          ⬇️ Download
                                        </a>
                                      ))}
                                  </div>
                                );
                              })()}

                            {lesson.contentType === "video" &&
                              lesson.videoUrl && (
                                <video
                                  controls
                                  width="100%"
                                  style={{
                                    marginTop: "10px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <source
                                    src={lesson.videoUrl}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              )}

                            {lesson.contentType === "link" &&
                              lesson.linkUrl && (
                                <div style={{ marginTop: "10px" }}>
                                  🌐{" "}
                                  <a
                                    href={lesson.linkUrl}
                                    onClick={() => trackLessonView(lesson.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {lesson.linkUrl}
                                  </a>
                                </div>
                              )}

                            {lesson.contentType === "quiz" &&
                              lesson.quizTitle && (
                                <div
                                  style={{
                                    marginTop: "10px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  🧠 Quiz: {lesson.quizTitle}
                                </div>
                              )}

                            {lesson.contentType === "embed" &&
                              lesson.embedUrl && (
                                <div className="embed-container">
                                  <iframe
                                    src={lesson.embedUrl}
                                    title="Embedded"
                                    frameBorder="0"
                                    allowFullScreen
                                    style={{
                                      width: "100%",
                                      height: "480px",
                                      borderRadius: "8px",
                                    }}
                                  ></iframe>
                                </div>
                              )}
                          </div>
                          {user?.role === "teacher" && (
                            <button
                              className="btn-delete"
                              onClick={() => deleteLesson(lesson.id, course.id)}
                            >
                              🗑 Delete
                            </button>
                          )}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
};

export default MyTeachingCourses;
