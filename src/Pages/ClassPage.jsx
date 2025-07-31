// // frontend/pages/ClassPage.jsx

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../api/axios";
// import "./ClassPage.css";

// const BASE_URL = import.meta.env.VITE_BASE_URL || "";

// const ClassPage = () => {
//   const { slug } = useParams();
//   const [course, setCourse] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const res = await api.get("/enrollments/my-courses", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         const match = res.data.courses.find((c) => c.slug === slug);
//         if (!match) throw new Error("Course not found or not enrolled");
//         setCourse(match);
//         setLessons(match.lessons || []);
//       } catch (err) {
//         console.error("Error loading course:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [slug]);

//   if (loading) return <div className="class-loading">Loading...</div>;
//   if (!course) return <div className="class-error">Course not found.</div>;

//   return (
//     <div className="class-page">
//       <h2>{course.title}</h2>
//       <p className="class-description">{course.description}</p>

//       <div className="lesson-list">
//         {lessons.length === 0 ? (
//           <p>No lessons yet.</p>
//         ) : (
//           lessons.map((lesson) => (
//             <div key={lesson.id} className="lesson-item">
//               <h4>{lesson.title}</h4>
//               {lesson.contentType === "text" && <p>{lesson.textContent}</p>}
//               {lesson.contentType === "video" && lesson.videoUrl && (
//                 <video
//                   controls
//                   src={lesson.videoUrl}
//                   className="lesson-video"
//                 />
//               )}
//               {lesson.contentType === "file" && lesson.contentUrl && (
//                 <a
//                   href={`${BASE_URL}${lesson.contentUrl}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="lesson-download"
//                 >
//                   Download Attachment
//                 </a>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClassPage;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "./ClassPage.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "";

const ClassPage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openLessonId, setOpenLessonId] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get("/enrollments/my-courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const match = res.data.courses.find((c) => c.slug === slug);
        if (!match) throw new Error("Course not found or not enrolled");
        setCourse(match);
        setLessons(match.lessons || []);
      } catch (err) {
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const toggleLesson = (id) => {
    setOpenLessonId(openLessonId === id ? null : id);
  };

  if (loading) return <div className="class-loading">Loading...</div>;
  if (!course) return <div className="class-error">Course not found.</div>;

  return (
    <div className="class-page">
      <h2 className="course-title">{course.title}</h2>
      <p className="class-description">{course.description}</p>

      <div className="lesson-list">
        {lessons.length === 0 ? (
          <p>No lessons yet.</p>
        ) : (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`lesson-item ${
                openLessonId === lesson.id ? "open" : ""
              }`}
            >
              <div
                className="lesson-header"
                onClick={() => toggleLesson(lesson.id)}
              >
                <img
                  src="/thumbnail-icon.png"
                  alt="Thumbnail"
                  className="lesson-thumbnail"
                />
                <h4>{lesson.title}</h4>
                <span className="toggle-icon">
                  {openLessonId === lesson.id ? "▲" : "▼"}
                </span>
              </div>

              {openLessonId === lesson.id && (
                <div className="lesson-content">
                  {lesson.contentType === "text" && (
                    <p className="text-content">{lesson.textContent}</p>
                  )}
                  {lesson.contentType === "video" && lesson.videoUrl && (
                    <video
                      controls
                      src={lesson.videoUrl}
                      className="lesson-video"
                    />
                  )}
                  {lesson.contentType === "file" && lesson.contentUrl && (
                    <a
                      href={`${BASE_URL}${lesson.contentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lesson-download"
                    >
                      Download Attachment
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassPage;

