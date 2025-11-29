
// // src/pages/teachers/PreviewLesson.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { Box, Typography, CircularProgress, Button } from "@mui/material";

// const PreviewLesson = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();
//   const [lesson, setLesson] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await axiosInstance.get(`/lessons/${lessonId}/preview`);
//         if (res.data?.success) setLesson(res.data.lesson);
//       } catch (err) {
//         console.error("Preview load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [lessonId]);

//   if (loading)
//     return (
//       <Box sx={{ p: 4, textAlign: "center" }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (!lesson)
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography variant="h6" color="error">
//           Lesson not found
//         </Typography>
//         <Button onClick={() => navigate(-1)}>Back</Button>
//       </Box>
//     );

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         {lesson.title}
//       </Typography>

//       {lesson.content_type === "text" && (
//         <Box dangerouslySetInnerHTML={{ __html: lesson.content }} />
//       )}

//       {lesson.content_type === "video" && lesson.video_url && (
//         <video width="100%" controls>
//           <source src={lesson.video_url} />
//         </video>
//       )}

//       {lesson.content_type === "pdf" && lesson.file_url && (
//         <iframe
//           src={lesson.file_url}
//           style={{ width: "100%", height: "80vh", border: "none" }}
//         />
//       )}
//     </Box>
//   );
// };

// export default PreviewLesson;



// src/pages/PreviewLesson.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const PreviewLesson = () => {
  const { lessonId } = useParams();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/lessons/${lessonId}`);

      if (!res.data?.success) {
        throw new Error(res.data?.error || "Failed to load lesson");
      }

      setLesson(res.data.lesson);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Unable to load lesson preview"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!lesson) return null;

    // ======================
    // TEXT / HTML LESSON
    // ======================
    if (lesson.content_type === "text") {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Lesson Content
            </Typography>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          </CardContent>
        </Card>
      );
    }

    // ======================
    // VIDEO LESSON
    // ======================
    if (lesson.content_type === "video" && lesson.video_url) {
      return (
        <Box sx={{ mt: 3 }}>
          <video
            src={lesson.video_url}
            controls
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>
      );
    }

    // ======================
    // PDF LESSON
    // ======================
    if (lesson.content_type === "pdf" && lesson.file_url) {
      return (
        <Box sx={{ mt: 3, height: "85vh" }}>
          <iframe
            src={lesson.file_url}
            title="PDF Preview"
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />
        </Box>
      );
    }

    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        This lesson has no previewable content.
      </Alert>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{ textAlign: "center", mt: 10, display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading lesson preview...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        {error}
      </Alert>
    );
  }

  if (!lesson) {
    return (
      <Alert severity="warning" sx={{ mt: 5 }}>
        Lesson not found
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {lesson.title}
      </Typography>

      <Typography variant="body2" color="textSecondary">
        Course: {lesson.course?.title || "Unknown"}
      </Typography>

      {lesson.is_preview && (
        <Alert severity="success" sx={{ mt: 2 }}>
          ✔ This lesson is available as free preview
        </Alert>
      )}

      {/* Render the actual content */}
      {renderContent()}
    </Box>
  );
};

export default PreviewLesson;
