// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import api from "../../api/axios";
// import ConfirmModal from "../../components/ConfirmModal";
// import "./MyTeachingCourses.css";

// const BASE_URL = "https://mathe-class-website-backend-1.onrender.com";

// const MyTeachingCourses = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [courseLessons, setCourseLessons] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [modal, setModal] = useState({ show: false });
//   const [pdfPreview, setPdfPreview] = useState(null);
//   const [renaming, setRenaming] = useState({});
//   const [editingName, setEditingName] = useState({});

//   useEffect(() => {
//     try {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       if (!storedUser) throw new Error("No user found");
//       setUser(storedUser);
//     } catch {
//       toast.error("❌ Please log in first.");
//       navigate("/login");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("darkMode");
//     if (savedTheme) setDarkMode(JSON.parse(savedTheme));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode((prev) => !prev);

//   const fetchLessonsForCourse = async (courseId) => {
//     try {
//       const res = await api.get(`/lessons/${courseId}/lessons`);
//       return res.data.lessons || [];
//     } catch (err) {
//       console.error(`❌ Failed to fetch lessons for course ${courseId}:`, err);
//       return [];
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const res = await api.get("/courses");
//       const myCourses = Array.isArray(res.data)
//         ? res.data.filter((c) => c.teacherId === user?.id)
//         : [];
//       setCourses(myCourses);

//       const lessonsMap = {};
//       for (const course of myCourses) {
//         const lessons = await fetchLessonsForCourse(course.id);
//         lessonsMap[course.id] = lessons;
//       }
//       setCourseLessons(lessonsMap);
//     } catch (err) {
//       toast.error("❌ Failed to fetch courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchCourses();
//   }, [user]);

//   const deleteCourse = async (courseId) => {
//     setModal({
//       show: true,
//       title: "Delete Course",
//       message:
//         "Are you sure you want to delete this course and all its lessons?",
//       onConfirm: async () => {
//         try {
//           await api.delete(`/courses/${courseId}`);
//           toast.success("✅ Course deleted");
//           setCourses((prev) => prev.filter((c) => c.id !== courseId));
//         } catch {
//           toast.error("❌ Failed to delete course");
//         } finally {
//           setModal({ show: false });
//         }
//       },
//     });
//   };

//   const handlePreviewPdf = (url) => {
//     setPdfPreview(url);
//   };

//   const handleClosePdfPreview = () => {
//     setPdfPreview(null);
//   };

//   const startRenaming = (courseId, index, oldName) => {
//     setRenaming({ courseId, index });
//     const nameWithoutExt = oldName.replace(/\.[^/.]+$/, "");
//     setEditingName({ name: nameWithoutExt });
//   };

//   const confirmRename = async () => {
//     const { courseId, index } = renaming;
//     const { name } = editingName;

//     if (!name.trim()) return toast.warning("Please enter a valid name");

//     try {
//       const res = await api.patch(
//         `/courses/${courseId}/attachments/${index}/rename`,
//         {
//           newName: name.trim(),
//         }
//       );
//       toast.success("✅ File renamed");

//       setCourses((prev) =>
//         prev.map((course) =>
//           course.id === courseId
//             ? {
//                 ...course,
//                 attachmentUrls: course.attachmentUrls.map((url, idx) =>
//                   idx === Number(index) ? res.data.updatedUrl : url
//                 ),
//               }
//             : course
//         )
//       );
//       setRenaming({});
//       setEditingName({});
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to rename file");
//     }
//   };

//   const deleteAttachment = async (courseId, index) => {
//     setModal({
//       show: true,
//       title: "Delete Attachment",
//       message: "Are you sure you want to delete this attachment?",
//       onConfirm: async () => {
//         try {
//           const res = await api.patch(`/courses/${courseId}`, {
//             removeAttachmentIndex: index,
//           });
//           toast.success("✅ Attachment deleted");

//           setCourses((prev) =>
//             prev.map((course) =>
//               course.id === courseId
//                 ? { ...course, attachmentUrls: res.data.attachmentUrls }
//                 : course
//             )
//           );
//         } catch {
//           toast.error("❌ Failed to delete attachment");
//         } finally {
//           setModal({ show: false });
//         }
//       },
//     });
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
//               <p>{course.description || "No description available."}</p>

//               {course.attachmentUrls?.length > 0 && (
//                 <div className="attachment-list">
//                   <strong>📎 Attachments:</strong>
//                   {course.attachmentUrls.map((url, idx) => {
//                     const fileName = url.split("/").pop();
//                     const fileUrl = `${BASE_URL}${url}`;

//                     return (
//                       <div key={idx} className="attachment-item">
//                         {renaming.courseId === course.id &&
//                         renaming.index === idx ? (
//                           <>
//                             <input
//                               value={editingName.name}
//                               onChange={(e) =>
//                                 setEditingName((prev) => ({
//                                   ...prev,
//                                   name: e.target.value,
//                                 }))
//                               }
//                               className="rename-input"
//                             />
//                             <button onClick={confirmRename}>💾 Save</button>
//                             <button onClick={() => setRenaming({})}>
//                               ❌ Cancel
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <span>{fileName}</span>
//                             <button onClick={() => handlePreviewPdf(fileUrl)}>
//                               📄 Preview
//                             </button>
//                             <a
//                               href={fileUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               download
//                             >
//                               ⬇️ Download
//                             </a>
//                             <button
//                               onClick={() =>
//                                 startRenaming(course.id, idx, fileName)
//                               }
//                             >
//                               ✏️ Rename
//                             </button>
//                             <button
//                               onClick={() => deleteAttachment(course.id, idx)}
//                             >
//                               🗑️ Delete
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {courseLessons[course.id]?.length > 0 && (
//                 <div className="lesson-list">
//                   <strong>📚 Lessons:</strong>
//                   <ul>
//                     {courseLessons[course.id].map((lesson) => (
//                       <li key={lesson.id}>
//                         <strong>{lesson.title}</strong> — {lesson.contentType}
//                         {lesson.contentType === "file" && lesson.contentUrl && (
//                           <>
//                             {" "}
//                             —{" "}
//                             <a
//                               href={`${BASE_URL}${lesson.contentUrl}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               📄 View PDF
//                             </a>
//                           </>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               <div className="course-actions">
//                 <Link to={`/courses/${course.id}/manage-lessons`}>
//                   <button className="btn-manage">🛠 Manage Lessons</button>
//                 </Link>
//                 <Link to={`/courses/${course.id}/lessons/new`}>
//                   <button className="btn-create">➕ Create Lesson</button>
//                 </Link>
//                 <Link to={`/courses/${course.id}/edit`}>
//                   <button className="btn-edit">✏️ Edit Course</button>
//                 </Link>
//                 <button
//                   className="btn-delete"
//                   onClick={() => deleteCourse(course.id)}
//                 >
//                   🗑 Delete Course
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {pdfPreview && (
//         <div className="pdf-modal">
//           <div className="pdf-modal-content">
//             <button className="pdf-close" onClick={handleClosePdfPreview}>
//               ❌ Close
//             </button>
//             <iframe
//               src={pdfPreview}
//               width="100%"
//               height="600px"
//               title="PDF Preview"
//             />
//           </div>
//         </div>
//       )}

//       <ConfirmModal
//         show={modal.show}
//         title={modal.title}
//         message={modal.message}
//         onConfirm={modal.onConfirm}
//         onCancel={() => setModal({ show: false })}
//       />
//     </div>
//   );
// };

// export default MyTeachingCourses;



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ConfirmModal from "../../components/ConfirmModal";
import "./MyTeachingCourses.css";

const BASE_URL = "https://mathe-class-website-backend-1.onrender.com";

const normalizeUrl = (url) => url?.replace(/^\/uploads/i, "/Uploads");

const MyTeachingCourses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseLessons, setCourseLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState({ show: false });
  const [pdfPreview, setPdfPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [renaming, setRenaming] = useState({});
  const [editingName, setEditingName] = useState({});

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) throw new Error("No user found");
      setUser(storedUser);
    } catch {
      toast.error("❌ Please log in first.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const fetchLessonsForCourse = async (courseId) => {
    try {
      const res = await api.get(`/lessons/${courseId}/lessons`);
      return res.data.lessons || [];
    } catch (err) {
      console.error(`❌ Failed to fetch lessons for course ${courseId}:`, err);
      return [];
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      const myCourses = Array.isArray(res.data)
        ? res.data.filter((c) => c.teacherId === user?.id)
        : [];
      setCourses(myCourses);

      const lessonsMap = {};
      for (const course of myCourses) {
        const lessons = await fetchLessonsForCourse(course.id);
        lessonsMap[course.id] = lessons;
      }
      setCourseLessons(lessonsMap);
    } catch (err) {
      toast.error("❌ Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCourses();
  }, [user]);

  const deleteCourse = async (courseId) => {
    setModal({
      show: true,
      title: "Delete Course",
      message:
        "Are you sure you want to delete this course and all its lessons?",
      onConfirm: async () => {
        try {
          await api.delete(`/courses/${courseId}`);
          toast.success("✅ Course deleted");
          setCourses((prev) => prev.filter((c) => c.id !== courseId));
        } catch {
          toast.error("❌ Failed to delete course");
        } finally {
          setModal({ show: false });
        }
      },
    });
  };

  const handleDeleteLesson = async (lessonId, courseId) => {
    setModal({
      show: true,
      title: "Delete Lesson",
      message: "Are you sure you want to delete this lesson?",
      onConfirm: async () => {
        try {
          await api.delete(`/lessons/${lessonId}`);
          toast.success("✅ Lesson deleted");
          setCourseLessons((prev) => {
            const updated = { ...prev };
            updated[courseId] = updated[courseId].filter(
              (l) => l.id !== lessonId
            );
            return updated;
          });
        } catch {
          toast.error("❌ Failed to delete lesson");
        } finally {
          setModal({ show: false });
        }
      },
    });
  };

  const handlePreviewPdf = (url) => setPdfPreview(url);
  const handleClosePdfPreview = () => setPdfPreview(null);
  const handlePreviewImage = (url) => setImagePreview(url);
  const handleCloseImagePreview = () => setImagePreview(null);

  const startRenaming = (courseId, index, oldName) => {
    setRenaming({ courseId, index });
    const nameWithoutExt = oldName.replace(/\.[^/.]+$/, "");
    setEditingName({ name: nameWithoutExt });
  };

  const confirmRename = async () => {
    const { courseId, index } = renaming;
    const { name } = editingName;

    if (!name.trim()) return toast.warning("Please enter a valid name");

    try {
      const res = await api.patch(
        `/courses/${courseId}/attachments/${index}/rename`,
        {
          newName: name.trim(),
        }
      );
      toast.success("✅ File renamed");

      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? {
                ...course,
                attachmentUrls: course.attachmentUrls.map((url, idx) =>
                  idx === Number(index) ? res.data.updatedUrl : url
                ),
              }
            : course
        )
      );
      setRenaming({});
      setEditingName({});
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to rename file");
    }
  };

  const deleteAttachment = async (courseId, index) => {
    setModal({
      show: true,
      title: "Delete Attachment",
      message: "Are you sure you want to delete this attachment?",
      onConfirm: async () => {
        try {
          const res = await api.patch(`/courses/${courseId}`, {
            removeAttachmentIndex: index,
          });
          toast.success("✅ Attachment deleted");

          setCourses((prev) =>
            prev.map((course) =>
              course.id === courseId
                ? { ...course, attachmentUrls: res.data.attachmentUrls }
                : course
            )
          );
        } catch {
          toast.error("❌ Failed to delete attachment");
        } finally {
          setModal({ show: false });
        }
      },
    });
  };

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
              <p>{course.description || "No description available."}</p>

              {course.attachmentUrls?.length > 0 && (
                <div className="attachment-list">
                  <strong>📎 Attachments:</strong>
                  {course.attachmentUrls.map((url, idx) => {
                    const fileName = url.split("/").pop();
                    const fileUrl = `${BASE_URL}${normalizeUrl(url)}`;
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                      fileName
                    );
                    const isPdf = /\.pdf$/i.test(fileName);
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);

                    return (
                      <div key={idx} className="attachment-item">
                        {renaming.courseId === course.id &&
                        renaming.index === idx ? (
                          <>
                            <input
                              value={editingName.name}
                              onChange={(e) =>
                                setEditingName((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="rename-input"
                            />
                            <button onClick={confirmRename}>💾 Save</button>
                            <button onClick={() => setRenaming({})}>
                              ❌ Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{fileName}</span>
                            {isPdf && (
                              <button onClick={() => handlePreviewPdf(fileUrl)}>
                                📄 Preview
                              </button>
                            )}
                            {isImage && (
                              <button
                                onClick={() => handlePreviewImage(fileUrl)}
                              >
                                🖼️ Preview
                              </button>
                            )}
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              ⬇️ Download
                            </a>
                            <button
                              onClick={() =>
                                startRenaming(course.id, idx, fileName)
                              }
                            >
                              ✏️ Rename
                            </button>
                            <button
                              onClick={() => deleteAttachment(course.id, idx)}
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Lessons */}
              {courseLessons[course.id]?.length > 0 && (
                <div className="lesson-list">
                  <strong>📚 Lessons:</strong>
                  <ul>
                    {courseLessons[course.id].map((lesson) => {
                      const fileUrl = `${BASE_URL}${normalizeUrl(
                        lesson.contentUrl
                      )}`;
                      return (
                        <li key={lesson.id}>
                          <strong>{lesson.title}</strong> — {lesson.contentType}
                          {lesson.contentType === "file" &&
                            lesson.contentUrl && (
                              <>
                                {lesson.contentUrl.match(/\.pdf$/i) ? (
                                  <>
                                    —{" "}
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      📄 View PDF
                                    </a>
                                  </>
                                ) : lesson.contentUrl.match(
                                    /\.(jpg|jpeg|png|gif|webp)$/i
                                  ) ? (
                                  <>
                                    —{" "}
                                    <button
                                      onClick={() =>
                                        handlePreviewImage(fileUrl)
                                      }
                                    >
                                      🖼️ Preview
                                    </button>
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download
                                    >
                                      ⬇️ Download
                                    </a>
                                  </>
                                ) : lesson.contentUrl.match(
                                    /\.(mp4|webm)$/i
                                  ) ? (
                                  <video controls width="200">
                                    <source src={fileUrl} type="video/mp4" />
                                  </video>
                                ) : (
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    📁 View File
                                  </a>
                                )}
                              </>
                            )}
                          <button
                            onClick={() =>
                              navigate(`/lessons/${lesson.id}/edit`)
                            }
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteLesson(lesson.id, course.id)
                            }
                          >
                            🗑️ Delete
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="course-actions">
                <Link to={`/courses/${course.id}/manage-lessons`}>
                  <button className="btn-manage">🛠 Manage Lessons</button>
                </Link>
                <Link to={`/courses/${course.id}/lessons/new`}>
                  <button className="btn-create">➕ Create Lesson</button>
                </Link>
                <Link to={`/courses/${course.id}/edit`}>
                  <button className="btn-edit">✏️ Edit Course</button>
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => deleteCourse(course.id)}
                >
                  🗑 Delete Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pdfPreview && (
        <div className="pdf-modal">
          <div className="pdf-modal-content">
            <button className="pdf-close" onClick={handleClosePdfPreview}>
              ❌ Close
            </button>
            <iframe
              src={pdfPreview}
              width="100%"
              height="600px"
              title="PDF Preview"
            />
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="pdf-modal">
          <div className="pdf-modal-content">
            <button className="pdf-close" onClick={handleCloseImagePreview}>
              ❌ Close
            </button>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ show: false })}
      />
    </div>
  );
};

export default MyTeachingCourses;