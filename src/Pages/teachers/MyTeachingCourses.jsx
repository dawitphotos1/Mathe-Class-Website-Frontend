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

//   // ✅ Declare modal state early
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
//         console.error(err);
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
//       if (err.response?.status === 429) {
//         toast.error("⚠️ Server is overloaded. Please try again shortly.");
//       } else if (err.response?.status === 404) {
//         toast.error("🚫 Lessons not found for this course.");
//       } else {
//         toast.error("❌ Failed to load lessons");
//       }
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
//                           <div>
//                             <strong>{lesson.title}</strong>
//                             {lesson.isPreview && (
//                               <span className="preview-badge">Preview</span>
//                             )}
//                             <span className="type-label">
//                               ({lesson.contentType})
//                             </span>
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

//       {/* ✅ Place ConfirmModal inside the return */}
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



import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";
import "./MyTeachingCourses.css";

const MyTeachingCourses = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
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

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your teaching courses", {
        toastId: "auth-error",
      });
      navigate("/login");
      return;
    }

    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const res = await axios.get(`${API_BASE_URL}/api/v1/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allCourses = Array.isArray(res.data) ? res.data : [];
        const myCourses = allCourses.filter((c) => c.teacherId === user?.id);
        setCourses(myCourses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          toast.error("Session expired. Please log in again.", {
            toastId: "session-expired",
          });
          navigate("/login");
        } else {
          toast.error(
            err.response?.data?.error || "Failed to fetch teaching courses",
            {
              toastId: "fetch-courses-error",
            }
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user, navigate, setUser]);

  const toggleLessons = async (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/lessons/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedLessons = Array.isArray(res.data) ? res.data : [];
      const safeLessons = fetchedLessons.map((l, index) => ({
        ...l,
        id: l.id || index + 1,
      }));

      setLessons((prev) => ({ ...prev, [courseId]: safeLessons }));
      setExpandedCourseId(courseId);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        toast.error("Session expired. Please log in again.", {
          toastId: "session-expired-lessons",
        });
        navigate("/login");
      } else if (err.response?.status === 429) {
        toast.error("⚠️ Server is overloaded. Please try again shortly.", {
          toastId: "rate-limit-error",
        });
      } else if (err.response?.status === 404) {
        toast.error("🚫 Lessons not found for this course.", {
          toastId: "lessons-not-found",
        });
      } else {
        toast.error(err.response?.data?.error || "❌ Failed to load lessons", {
          toastId: "fetch-lessons-error",
        });
      }
    }
  };

  const deleteLesson = async (lessonId, courseId) => {
    setModal({
      show: true,
      title: "Delete Lesson",
      message: "Are you sure you want to delete this lesson?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }
          await axios.delete(`${API_BASE_URL}/api/v1/lessons/${lessonId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("✅ Lesson deleted", {
            toastId: "delete-lesson-success",
          });
          toggleLessons(courseId);
        } catch (err) {
          console.error("Failed to delete lesson:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            toast.error("Session expired. Please log in again.", {
              toastId: "session-expired-delete",
            });
            navigate("/login");
          } else {
            toast.error(
              err.response?.data?.error || "❌ Failed to delete lesson",
              {
                toastId: "delete-lesson-error",
              }
            );
          }
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
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }
          await axios.delete(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("✅ Course deleted", {
            toastId: "delete-course-success",
          });
          setCourses((prev) => prev.filter((c) => c.id !== courseId));
          setExpandedCourseId(null);
        } catch (err) {
          console.error("Failed to delete course:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            toast.error("Session expired. Please log in again.", {
              toastId: "session-expired-course",
            });
            navigate("/login");
          } else {
            toast.error(
              err.response?.data?.error || "❌ Failed to delete course",
              {
                toastId: "delete-course-error",
              }
            );
          }
        } finally {
          setModal({ ...modal, show: false });
        }
      },
    });
  };

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div className={`auth-container ${darkMode ? "dark" : ""}`}>
      <div className="auth-form">
        <div className="theme-toggle">
          <button onClick={toggleTheme} className="btn-primary">
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        <h2>My Teaching Courses 📘</h2>
        {loading && <p className="info">Loading...</p>}
        {!loading && courses.length === 0 && <p>No courses found.</p>}
        {!loading && courses.length > 0 && (
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description || "No description provided."}</p>
                <div className="course-actions">
                  <Link to={`/courses/${course.id}/manage-lessons`}>
                    <button className="btn-primary">🛠 Manage Lessons</button>
                  </Link>
                  <Link to={`/courses/${course.id}/lessons/new`}>
                    <button className="btn-primary">➕ Create Lesson</button>
                  </Link>
                  <button
                    onClick={() => toggleLessons(course.id)}
                    className="btn-primary"
                  >
                    {expandedCourseId === course.id
                      ? "➖ Hide Lessons"
                      : "📂 View Lessons"}
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="btn-delete"
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
                            <div>
                              <strong>{lesson.title}</strong>
                              {lesson.isPreview && (
                                <span className="preview-badge">Preview</span>
                              )}
                              <span className="type-label">
                                ({lesson.contentType})
                              </span>
                            </div>
                            <button
                              className="btn-delete"
                              onClick={() => deleteLesson(lesson.id, course.id)}
                            >
                              🗑 Delete
                            </button>
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
    </div>
  );
};

export default MyTeachingCourses;