// // src/pages/PreviewLesson.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { CircularProgress, Box, Typography, Button } from "@mui/material";

// const PreviewLesson = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();

//   const [lesson, setLesson] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await axiosInstance.get(`/lessons/${lessonId}`);
//         if (res.data?.success && res.data.lesson) {
//           setLesson(res.data.lesson);
//         } else {
//           setError(res.data?.error || "Failed to load lesson");
//         }
//       } catch (err) {
//         console.error("Preview load error:", err);
//         setError(err.response?.data?.error || err.message || "Failed to load lesson");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (lessonId) load();
//   }, [lessonId]);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography variant="h6" color="error" gutterBottom>
//           {error}
//         </Typography>
//         <Button variant="contained" onClick={() => navigate(-1)}>
//           Back
//         </Button>
//       </Box>
//     );
//   }

//   if (!lesson) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography>No lesson data available.</Typography>
//         <Button variant="contained" onClick={() => navigate(-1)}>
//           Back
//         </Button>
//       </Box>
//     );
//   }

//   const { title, content_type, content, video_url, file_url } = lesson;

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h4" sx={{ mb: 2 }}>
//         {title}
//       </Typography>

//       {content_type === "pdf" && file_url && (
//         <Box sx={{ height: "80vh" }}>
//           <iframe title="PDF Preview" src={file_url} style={{ width: "100%", height: "100%", border: "none" }} />
//         </Box>
//       )}

//       {content_type === "video" && video_url && (
//         <Box sx={{ mb: 2 }}>
//           {video_url.includes("youtube.com") || video_url.includes("youtu.be") ? (
//             <Box sx={{ position: "relative", pb: "56.25%", height: 0 }}>
//               <iframe
//                 title="Video Preview"
//                 src={video_url}
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
//               />
//             </Box>
//           ) : (
//             <video controls style={{ width: "100%" }}>
//               <source src={video_url} />
//               Your browser does not support the video tag.
//             </video>
//           )}
//         </Box>
//       )}

//       {content_type === "text" && (
//         <Box sx={{ mt: 1 }}>
//           <div dangerouslySetInnerHTML={{ __html: content || "<i>No text content for this lesson.</i>" }} />
//         </Box>
//       )}

//       {!["pdf", "video", "text"].includes(content_type) && (
//         <Box sx={{ mt: 2 }}>
//           <Typography>Content type: {content_type}</Typography>
//           {file_url && (
//             <Box sx={{ height: "80vh", mt: 1 }}>
//               <iframe title="File Preview" src={file_url} style={{ width: "100%", height: "100%", border: "none" }} />
//             </Box>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default PreviewLesson;






// src/pages/teachers/PreviewLesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonId}/preview`);
        if (res.data?.success) setLesson(res.data.lesson);
      } catch (err) {
        console.error("Preview load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (!lesson)
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Lesson not found
        </Typography>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {lesson.title}
      </Typography>

      {lesson.content_type === "text" && (
        <Box dangerouslySetInnerHTML={{ __html: lesson.content }} />
      )}

      {lesson.content_type === "video" && lesson.video_url && (
        <video width="100%" controls>
          <source src={lesson.video_url} />
        </video>
      )}

      {lesson.content_type === "pdf" && lesson.file_url && (
        <iframe
          src={lesson.file_url}
          style={{ width: "100%", height: "80vh", border: "none" }}
        />
      )}
    </Box>
  );
};

export default PreviewLesson;
