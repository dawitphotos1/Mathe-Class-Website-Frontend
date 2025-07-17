// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { API_BASE_URL } from "../config";

// const LessonList = () => {
//   const { courseId } = useParams();
//   const [lessons, setLessons] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch lessons
//   useEffect(() => {
//     const fetchLessons = async () => {
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("Please log in to view lessons");
//         }
//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/lessons/${courseId}/lessons`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setLessons(response.data.lessons || []);
//       } catch (err) {
//         console.error("Failed to fetch lessons:", err);
//         setError(
//           err.response?.data?.error || err.message || "Failed to load lessons"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchLessons();
//   }, [courseId]);

//   // Toggle preview status
//   const handleTogglePreview = async (lessonId, currentPreview) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Please log in to toggle preview");
//       }
//       const response = await axios.patch(
//         `${API_BASE_URL}/api/v1/lessons/${lessonId}/toggle-preview`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setLessons(
//         lessons.map((lesson) =>
//           lesson.id === lessonId
//             ? { ...lesson, isPreview: response.data.isPreview }
//             : lesson
//         )
//       );
//     } catch (err) {
//       console.error("Failed to toggle preview:", err);
//       setError(
//         err.response?.data?.error || err.message || "Failed to toggle preview"
//       );
//     }
//   };

//   // Delete lesson
//   const handleDelete = async (lessonId) => {
//     if (!window.confirm("Are you sure you want to delete this lesson?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Please log in to delete lessons");
//       }
//       await axios.delete(`${API_BASE_URL}/api/v1/lessons/${lessonId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
//     } catch (err) {
//       console.error("Failed to delete lesson:", err);
//       setError(
//         err.response?.data?.error || err.message || "Failed to delete lesson"
//       );
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "672px",
//         margin: "32px auto",
//         padding: "24px",
//         backgroundColor: "#fff",
//         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//         borderRadius: "8px",
//       }}
//     >
//       <h2
//         style={{
//           fontSize: "24px",
//           fontWeight: "bold",
//           marginBottom: "24px",
//           color: "#1F2937",
//         }}
//       >
//         Lessons for Course {courseId}
//       </h2>

//       {error && (
//         <div
//           style={{
//             marginBottom: "16px",
//             padding: "16px",
//             backgroundColor: "#FEE2E2",
//             color: "#B91C1C",
//             borderRadius: "4px",
//           }}
//         >
//           {error}
//         </div>
//       )}

//       {isLoading && (
//         <div
//           style={{
//             marginBottom: "16px",
//             padding: "16px",
//             backgroundColor: "#EFF6FF",
//             color: "#1E40AF",
//             borderRadius: "4px",
//           }}
//         >
//           Loading lessons...
//         </div>
//       )}

//       {!isLoading && lessons.length === 0 && (
//         <p style={{ color: "#374151" }}>No lessons found.</p>
//       )}

//       {lessons.map((lesson) => (
//         <div
//           key={lesson.id}
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "16px",
//             border: "1px solid #D1D5DB",
//             borderRadius: "4px",
//             marginBottom: "8px",
//           }}
//         >
//           <div>
//             <h3
//               style={{ fontSize: "18px", fontWeight: "500", color: "#1F2937" }}
//             >
//               {lesson.title} {lesson.isPreview && "(Preview)"}
//               {lesson.contentType && `(${lesson.contentType})`}
//             </h3>
//             {lesson.contentType === "file" && lesson.contentUrl && (
//               <a
//                 href={lesson.contentUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{
//                   color: "#4F46E5",
//                   textDecoration: "underline",
//                   marginTop: "8px",
//                   display: "inline-block",
//                 }}
//               >
//                 View Lesson
//               </a>
//             )}
//             {lesson.contentType === "video" && lesson.videoUrl && (
//               <a
//                 href={lesson.videoUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{
//                   color: "#4F46E5",
//                   textDecoration: "underline",
//                   marginTop: "8px",
//                   display: "inline-block",
//                 }}
//               >
//                 View Lesson
//               </a>
//             )}
//             {lesson.contentType === "text" && lesson.content && (
//               <p style={{ color: "#374151", marginTop: "8px" }}>
//                 {lesson.content.substring(0, 100)}...
//               </p>
//             )}
//           </div>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               onClick={() => handleTogglePreview(lesson.id, lesson.isPreview)}
//               style={{
//                 padding: "8px 16px",
//                 backgroundColor: lesson.isPreview ? "#D1FAE5" : "#E5E7EB",
//                 color: lesson.isPreview ? "#065F46" : "#374151",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               {lesson.isPreview ? "Disable Preview" : "Enable Preview"}
//             </button>
//             <button
//               onClick={() => handleDelete(lesson.id)}
//               style={{
//                 padding: "8px 16px",
//                 backgroundColor: "#FEE2E2",
//                 color: "#B91C1C",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               🗑 Delete
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LessonList;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const LessonList = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user data and cache it
  useEffect(() => {
    const fetchUser = async () => {
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view lessons");
        }
        const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(
          err.response?.data?.error || err.message || "Failed to load user data"
        );
      }
    };
    fetchUser();
  }, []);

  // Fetch lessons with retry on 429
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
          setTimeout(fetchLessons, 2000 * (4 - retries)); // Exponential backoff
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

  // Toggle preview status
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

  // Delete lesson
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

  // Test file URL
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

export default LessonList;