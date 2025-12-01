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
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const response = await axiosInstance.get(`/lessons/${lessonId}`);
      if (response.data.success) {
        setLesson(response.data.lesson);
      } else {
        toast.error("Failed to load lesson");
        navigate("/courses");
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      toast.error("Unable to load lesson");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container">
        <div className="error">Lesson not found</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{lesson.title}</h1>
      <div className="lesson-content">
        {lesson.content_type === "video" && lesson.video_url && (
          <video controls className="lesson-video">
            <source src={lesson.video_url} type="video/mp4" />
          </video>
        )}
        {lesson.content_type === "text" && (
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        )}
        {lesson.content_type === "pdf" && lesson.file_url && (
          <iframe src={lesson.file_url} className="lesson-pdf" title="PDF" />
        )}
      </div>
      <button onClick={() => navigate(-1)} className="btn-back">
        Go Back
      </button>
    </div>
  );
};

export default PreviewLesson;