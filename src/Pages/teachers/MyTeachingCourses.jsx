
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";
// import ConfirmModal from "../../components/ConfirmModal";
// import api from "../../api/axios";
// import "./MyTeachingCourses.css";

// const MyTeachingCourses = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [expandedCourseId, setExpandedCourseId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [modal, setModal] = useState({ show: false });
//   const [pdfPreview, setPdfPreview] = useState(null);

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

//   const fetchMyCourses = async () => {
//     try {
//       const res = await api.get("/courses");
//       const myCourses = Array.isArray(res.data)
//         ? res.data.filter((c) => c.teacherId === user?.id)
//         : [];
//       setCourses(myCourses);
//     } catch (err) {
//       console.error("❌ fetchMyCourses error:", err);
//       toast.error("❌ Failed to fetch courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchMyCourses();
//   }, [user]);

//   const deleteCourse = async (courseId) => {
//     setModal({
//       show: true,
//       title: "Delete Course",
//       message:
//         "Are you sure you want to permanently delete this course and all its lessons?",
//       onConfirm: async () => {
//         try {
//           const token = localStorage.getItem("token");
//           await api.delete(`/courses/${courseId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           toast.success("✅ Course deleted");
//           setCourses((prev) => prev.filter((c) => c.id !== courseId));
//           setExpandedCourseId(null);
//         } catch (err) {
//           console.error("❌ Course deletion error:", err);
//           toast.error("❌ Failed to delete course");
//         } finally {
//           setModal({ ...modal, show: false });
//         }
//       },
//     });
//   };

//   const toggleTheme = () => setDarkMode((prev) => !prev);

//   const handlePreviewPdf = (url) => {
//     setPdfPreview(url);
//   };

//   const handleClosePdfPreview = () => {
//     setPdfPreview(null);
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

//               {course.attachmentUrls?.length > 0 && (
//                 <div className="attachment-list">
//                   <strong>📎 Attachments:</strong>
//                   {course.attachmentUrls.map((url, idx) => {
//                     const fileName = url.split("/").pop();
//                     const isPdf = url.toLowerCase().endsWith(".pdf");

//                     return (
//                       <div key={idx} className="attachment-item">
//                         <span>{fileName}</span>
//                         <button onClick={() => handlePreviewPdf(url)}>
//                           📄 Preview
//                         </button>
//                         <a
//                           href={url}
//                           download
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           ⬇️ Download
//                         </a>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               <div className="course-actions">
//                 <Link to={`/courses/${course.id}/manage-lessons`}>
//                   <button className="btn-manage">🛠 Manage Lessons</button>
//                 </Link>
//                 <Link to={`/courses/${course.id}/lessons/new`}>
//                   <button className="btn-create">➕ Create Lesson</button>
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
//               title="PDF Preview"
//               width="100%"
//               height="600px"
//             />
//           </div>
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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";
import api from "../../api/axios";
import "./MyTeachingCourses.css";

const BASE_URL = "https://mathe-class-website-backend-1.onrender.com";

const MyTeachingCourses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState({ show: false });
  const [pdfPreview, setPdfPreview] = useState(null);

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

  const fetchMyCourses = async () => {
    try {
      const res = await api.get("/courses");
      const myCourses = Array.isArray(res.data)
        ? res.data.filter((c) => c.teacherId === user?.id)
        : [];
      setCourses(myCourses);
    } catch (err) {
      console.error("❌ fetchMyCourses error:", err);
      toast.error("❌ Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyCourses();
  }, [user]);

  const deleteCourse = async (courseId) => {
    setModal({
      show: true,
      title: "Delete Course",
      message:
        "Are you sure you want to permanently delete this course and all its lessons?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await api.delete(`/courses/${courseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success("✅ Course deleted");
          setCourses((prev) => prev.filter((c) => c.id !== courseId));
          setExpandedCourseId(null);
        } catch (err) {
          console.error("❌ Course deletion error:", err);
          toast.error("❌ Failed to delete course");
        } finally {
          setModal({ ...modal, show: false });
        }
      },
    });
  };

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handlePreviewPdf = (url) => {
    setPdfPreview(url);
  };

  const handleClosePdfPreview = () => {
    setPdfPreview(null);
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
              <p>{course.description || "No description provided."}</p>

              {course.attachmentUrls?.length > 0 && (
                <div className="attachment-list">
                  <strong>📎 Attachments:</strong>
                  {course.attachmentUrls.map((url, idx) => {
                    const fileName = url.split("/").pop();
                    const fullUrl = `${BASE_URL}${url}`;

                    return (
                      <div key={idx} className="attachment-item">
                        <span>{fileName}</span>
                        <button onClick={() => handlePreviewPdf(fullUrl)}>
                          📄 Preview
                        </button>
                        <a
                          href={fullUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ⬇️ Download
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="course-actions">
                <Link to={`/courses/${course.id}/manage-lessons`}>
                  <button className="btn-manage">🛠 Manage Lessons</button>
                </Link>
                <Link to={`/courses/${course.id}/lessons/new`}>
                  <button className="btn-create">➕ Create Lesson</button>
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
              title="PDF Preview"
              width="100%"
              height="600px"
            />
          </div>
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
