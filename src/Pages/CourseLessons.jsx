
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
import { useParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { API_BASE_URL } from "../config";

const CourseLessons = () => {
  const { courseId } = useParams();
  const { user } = useContext(ThemeContext);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let retries = 3;
    const fetchLessons = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view lessons");
        }
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/lessons/${courseId}/lessons`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLessons(response.data.lessons || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
        if (err.response?.status === 429 && retries > 0) {
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
  }, [courseId]);

  const handleTogglePreview = async (lessonId, currentPreview) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to toggle preview");
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
      setError(null);
    } catch (err) {
      console.error("Failed to toggle preview:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to toggle preview"
      );
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to delete lessons");
      }
      await axios.delete(`${API_BASE_URL}/api/v1/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
      setError(null);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to delete lesson"
      );
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
    <div
      style={{
        maxWidth: "672px",
        margin: "32px auto",
        padding: "24px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "24px",
          color: "#1F2937",
        }}
      >
        Lessons for Course {courseId}
      </h2>

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "16px",
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div
          style={{
            marginBottom: "16px",
            padding: "16px",
            backgroundColor: "#EFF6FF",
            color: "#1E40AF",
            borderRadius: "4px",
          }}
        >
          Loading lessons...
        </div>
      )}

      {!isLoading && lessons.length === 0 && (
        <p style={{ color: "#374151" }}>No lessons found.</p>
      )}

      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            border: "1px solid #D1D5DB",
            borderRadius: "4px",
            marginBottom: "8px",
          }}
        >
          <div>
            <h3
              style={{ fontSize: "18px", fontWeight: "500", color: "#1F2937" }}
            >
              {lesson.title} {lesson.isPreview && "(Preview)"}
              {lesson.contentType && `(${lesson.contentType})`}
            </h3>
            {lesson.contentType === "file" && lesson.contentUrl && (
              <a
                href={lesson.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => testFileUrl(lesson.contentUrl)}
                style={{
                  color: "#4F46E5",
                  textDecoration: "underline",
                  marginTop: "8px",
                  display: "inline-block",
                }}
              >
                View Lesson
              </a>
            )}
            {lesson.contentType === "video" && lesson.videoUrl && (
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4F46E5",
                  textDecoration: "underline",
                  marginTop: "8px",
                  display: "inline-block",
                }}
              >
                View Lesson
              </a>
            )}
            {lesson.contentType === "text" && lesson.content && (
              <p style={{ color: "#374151", marginTop: "8px" }}>
                {lesson.content.substring(0, 100)}...
              </p>
            )}
          </div>
          {user?.role === "teacher" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleTogglePreview(lesson.id, lesson.isPreview)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: lesson.isPreview ? "#D1FAE5" : "#E5E7EB",
                  color: lesson.isPreview ? "#065F46" : "#374151",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                disabled={isLoading}
              >
                {lesson.isPreview ? "Disable Preview" : "Enable Preview"}
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#FEE2E2",
                  color: "#B91C1C",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                disabled={isLoading}
              >
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseLessons;
