// // src/pages/PreviewLesson.jsx

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Button,
// } from "@mui/material";
// import axiosInstance from "../utils/axiosInstance";

// const PreviewLesson = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();

//   const [lesson, setLesson] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadLesson();
//   }, [lessonId]);

//   const loadLesson = async () => {
//     try {
//       const res = await axiosInstance.get(`/lessons/${lessonId}`);

//       if (res.data?.success) {
//         setLesson(res.data.lesson);
//       } else {
//         setError("Lesson not found");
//       }
//     } catch (err) {
//       setError("Unable to load lesson");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <Box sx={{ textAlign: "center", mt: 10 }}>
//         <CircularProgress />
//         <Typography sx={{ mt: 2 }}>Loading preview...</Typography>
//       </Box>
//     );

//   if (error)
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error">{error}</Alert>
//         <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate(-1)}>
//           Go Back
//         </Button>
//       </Box>
//     );

//   if (!lesson) return <Alert severity="warning">Lesson not found</Alert>;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4">{lesson.title}</Typography>

//       {/* TEXT */}
//       {lesson.content_type === "text" && (
//         <Card sx={{ mt: 2 }}>
//           <CardContent>
//             <Typography dangerouslySetInnerHTML={{ __html: lesson.content }} />
//           </CardContent>
//         </Card>
//       )}

//       {/* VIDEO */}
//       {lesson.content_type === "video" && (
//         <video
//           src={lesson.video_url}
//           controls
//           style={{ width: "100%", marginTop: 20 }}
//         />
//       )}

//       {/* PDF */}
//       {lesson.content_type === "pdf" && (
//         <iframe
//           src={lesson.file_url}
//           style={{
//             width: "100%",
//             height: "85vh",
//             border: "1px solid #ddd",
//             marginTop: 20,
//           }}
//           title="PDF Preview"
//         />
//       )}
//     </Box>
//   );
// };

// export default PreviewLesson;





// src/pages/PreviewLesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Button } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // prefer public preview endpoint, but fall back to /lessons/:id
        let res = await axiosInstance.get(`/lessons/${lessonId}`).catch(() => null);

        if (!res || !res.data?.success) {
          // Try preview-specific endpoint on server
          res = await axiosInstance.get(`/lessons/${lessonId}/preview`).catch(() => null);
        }

        // If still nothing, attempt to fetch via preview-lesson endpoints (some servers return lesson object directly)
        if ((!res || !res.data?.success) && !res?.data?.lesson) {
          res = await axiosInstance.get(`/courses/preview-lesson/${lessonId}`).catch(() => null);
        }

        if (res && (res.data?.success || res.data?.lesson)) {
          const l = res.data.lesson || res.data;
          setLesson(l);
        } else {
          setError("Lesson not found or preview not available");
        }
      } catch (err) {
        console.error("Preview load error:", err);
        setError("Unable to load preview");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [lessonId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading preview...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  if (!lesson) {
    return <Alert severity="warning" sx={{ mt: 5 }}>Lesson not found</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>{lesson.title}</Typography>
      {lesson.is_preview && <Alert severity="success">This lesson is a free preview</Alert>}

      {/* TEXT */}
      {lesson.content_type === "text" && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </CardContent>
        </Card>
      )}

      {/* VIDEO */}
      {lesson.content_type === "video" && lesson.video_url && (
        <Box sx={{ mt: 3 }}>
          <video src={lesson.video_url} controls style={{ width: "100%", borderRadius: 8 }} />
        </Box>
      )}

      {/* PDF */}
      {lesson.content_type === "pdf" && lesson.file_url && (
        <Box sx={{ mt: 3, height: "85vh" }}>
          <iframe
            title="PDF Preview"
            src={lesson.file_url}
            style={{ width: "100%", height: "100%", border: "1px solid #ddd", borderRadius: 8 }}
          />
        </Box>
      )}

      {/* No previewable content */}
      {!["text", "video", "pdf"].includes(lesson.content_type) && (
        <Alert severity="info" sx={{ mt: 2 }}>This lesson has no previewable content.</Alert>
      )}
    </Box>
  );
};

export default PreviewLesson;
