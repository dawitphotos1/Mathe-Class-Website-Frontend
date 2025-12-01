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





import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import "./PreviewLessonPage.css";

const PreviewLessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPreviewLesson();
  }, [lessonId]);

  const fetchPreviewLesson = async () => {
    try {
      setLoading(true);
      setError("");

      // If lesson data was passed via state, use it
      if (location.state?.lesson) {
        setLesson(location.state.lesson);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      const response = await axiosInstance.get(
        `/files/preview-lesson/${lessonId}`
      );

      if (response.data.success) {
        setLesson(response.data.lesson);
      } else {
        setError(response.data.error || "Failed to load preview");
      }
    } catch (error) {
      console.error("Error loading preview:", error);
      setError("Unable to load the preview lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  const handleEnrollNow = () => {
    if (lesson?.course?.id) {
      navigate(`/payment/${lesson.course.id}`);
    } else {
      navigate("/courses");
    }
  };

  const renderLessonContent = () => {
    if (!lesson) return null;

    switch (lesson.content_type) {
      case "video":
        return (
          <div className="video-container">
            {lesson.video_url ? (
              <video controls className="lesson-video">
                <source src={lesson.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="no-content">
                No video available for this lesson.
              </div>
            )}
          </div>
        );

      case "pdf":
        return (
          <div className="pdf-container">
            {lesson.file_url ? (
              <iframe
                src={lesson.file_url}
                title={lesson.title}
                className="lesson-pdf"
              />
            ) : (
              <div className="no-content">
                No PDF available for this lesson.
              </div>
            )}
          </div>
        );

      case "text":
      default:
        return (
          <div className="text-content">
            {lesson.content ? (
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            ) : (
              <div className="no-content">
                No content available for this lesson.
              </div>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="preview-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-container">
        <div className="error-message">
          <h2>⚠️ Preview Unavailable</h2>
          <p>{error}</p>
          <button onClick={handleBackToCourses} className="btn-back">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="preview-container">
        <div className="error-message">
          <h2>No Preview Found</h2>
          <p>This lesson preview is not available.</p>
          <button onClick={handleBackToCourses} className="btn-back">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <button onClick={handleBackToCourses} className="btn-back">
          ← Back to Courses
        </button>
        <h1>🎬 Free Preview</h1>
        <p className="preview-note">
          This is a preview of the course content. Enroll for full access!
        </p>
      </div>

      <div className="preview-content">
        <div className="lesson-header">
          <h2>{lesson.title}</h2>
          {lesson.course && (
            <p className="course-info">
              From: <strong>{lesson.course.title}</strong>
            </p>
          )}
          {lesson.content_type && (
            <span className="content-type-badge">
              {lesson.content_type.toUpperCase()}
            </span>
          )}
          {lesson.is_preview && (
            <span className="preview-badge">FREE PREVIEW</span>
          )}
        </div>

        <div className="lesson-content">{renderLessonContent()}</div>

        <div className="lesson-footer">
          <div className="preview-limitations">
            <h3>⚠️ Preview Limitations</h3>
            <ul>
              <li>Only one lesson is available for preview</li>
              <li>Full course includes all lessons and exercises</li>
              <li>Enroll for complete access and teacher support</li>
            </ul>
          </div>

          <div className="preview-actions">
            <button onClick={handleBackToCourses} className="btn-secondary">
              Browse More Courses
            </button>
            <button onClick={handleEnrollNow} className="btn-primary">
              Enroll Now for Full Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewLessonPage;