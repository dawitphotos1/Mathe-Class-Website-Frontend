
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../config";
// import { toast } from "react-toastify";

// const CourseLessons = () => {
//   const { courseId } = useParams();
//   const [lessons, setLessons] = useState([]);
//   const [completedLessons, setCompletedLessons] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(0); // %
//   useEffect(() => {
//     const fetchLessonsAndProgress = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const [lessonRes, progressRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/v1/lessons/${courseId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${API_BASE_URL}/api/v1/progress/${courseId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setLessons(lessonRes.data.lessons || []);
//         const completedIds = new Set(progressRes.data.completedLessonIds || []);
//         setCompletedLessons(completedIds);
//         // Progress calculation
//         if (lessonRes.data.lessons.length > 0) {
//           const pct = (completedIds.size / lessonRes.data.lessons.length) * 100;
//           setProgress(pct.toFixed(0));
//         }
//       } catch (err) {
//         console.error("Failed to fetch lessons or progress", err);
//         toast.error("Could not load lessons or progress.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLessonsAndProgress();
//   }, [courseId]);

//   const markComplete = async (lessonId) => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.post(
//         `${API_BASE_URL}/api/v1/progress/complete`,
//         { lessonId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       toast.success("Lesson marked as complete!");
//       setCompletedLessons((prev) => new Set(prev).add(lessonId));
//     } catch (err) {
//       console.error("Failed to mark lesson complete", err);
//       toast.error("Could not mark as complete.");
//     }
//   };

//   return (
//     <div className="student-lessons">
//       <h2>Your Lessons</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : lessons.length === 0 ? (
//         <p>No lessons found or access not approved yet.</p>
//       ) : (
//         <>
//           {/* Progress bar goes here */}
//           <div style={{ margin: "20px 0" }}>
//             <label>Progress: {progress}%</label>
//             <div
//               style={{
//                 background: "#eee",
//                 borderRadius: "5px",
//                 height: "20px",
//                 width: "100%",
//               }}
//             >
//               <div
//                 style={{
//                   width: `${progress}%`,
//                   background: "#28a745",
//                   height: "100%",
//                   borderRadius: "5px",
//                   transition: "width 0.4s ease-in-out",
//                 }}
//               ></div>
//             </div>
//           </div>

//           <ul>
//             {lessons.map((l) => (
//               <li key={l.id}>{/* lesson display */}</li>
//             ))}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// };

// export default CourseLessons;



import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import "./CourseLessons.css";

const CourseLessons = () => {
  const { courseId } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view lessons");
      navigate("/login");
      return;
    }

    let retries = 3;
    const fetchLessons = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/lessons/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLessons(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else if (err.response?.status === 429 && retries > 0) {
          retries--;
          console.log(`Retrying (${3 - retries}/3) after 429 error...`);
          setTimeout(fetchLessons, 2000 * (4 - retries));
        } else {
          setError(
            err.response?.data?.error || err.message || "Failed to load lessons"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [courseId, user, navigate, setUser]);

  const handleTogglePreview = async (lessonId, currentPreview) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/lessons/${lessonId}/toggle-preview`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLessons(
        lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, isPreview: response.data.isPreview }
            : lesson
        )
      );
      toast.success(
        `Preview ${response.data.isPreview ? "enabled" : "disabled"}`
      );
      setError(null);
    } catch (err) {
      console.error("Failed to toggle preview:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error || err.message || "Failed to toggle preview"
        );
        toast.error(err.response?.data?.error || "Failed to toggle preview");
      }
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await axios.delete(`${API_BASE_URL}/api/v1/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
      toast.success("Lesson deleted successfully");
      setError(null);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error || err.message || "Failed to delete lesson"
        );
        toast.error(err.response?.data?.error || "Failed to delete lesson");
      }
    }
  };

  const testFileUrl = (url) => {
    if (!url) return;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) {
          console.error(`File not accessible: ${url}, status: ${res.status}`);
          setError(
            `File not found at ${url}. Please check if the file was uploaded correctly.`
          );
        }
      })
      .catch((err) => {
        console.error(`Error checking file: ${url}`, err);
        setError(`Error accessing file: ${err.message}`);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Lessons for Course {courseId}</h2>
        {error && <p className="error">{error}</p>}
        {isLoading && <p className="info">Loading lessons...</p>}
        {!isLoading && lessons.length === 0 && <p>No lessons found.</p>}
        {lessons.map((lesson) => (
          <div key={lesson.id} className="lesson-item">
            <div>
              <h3>
                {lesson.title}{" "}
                {lesson.isPreview && (
                  <span className="preview-badge">(Preview)</span>
                )}
                {lesson.contentType && (
                  <span className="type-label">({lesson.contentType})</span>
                )}
              </h3>
              {lesson.contentType === "file" && lesson.contentUrl && (
                <a
                  href={lesson.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => testFileUrl(lesson.contentUrl)}
                  className="lesson-link"
                >
                  View Lesson
                </a>
              )}
              {lesson.contentType === "video" && lesson.videoUrl && (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lesson-link"
                >
                  View Lesson
                </a>
              )}
              {lesson.contentType === "text" && lesson.content && (
                <p>{lesson.content.substring(0, 100)}...</p>
              )}
            </div>
            {user?.role === "teacher" && (
              <div className="lesson-actions">
                <button
                  onClick={() =>
                    handleTogglePreview(lesson.id, lesson.isPreview)
                  }
                  className={
                    lesson.isPreview ? "btn-preview-active" : "btn-preview"
                  }
                  disabled={isLoading}
                >
                  {lesson.isPreview ? "Disable Preview" : "Enable Preview"}
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="btn-delete"
                  disabled={isLoading}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseLessons;