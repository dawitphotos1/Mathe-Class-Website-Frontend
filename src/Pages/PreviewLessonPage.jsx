// // src/pages/PreviewLessonPage.jsx

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance";
// import "./PreviewLessonPage.css";

// const PreviewLessonPage = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [lesson, setLesson] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchPreviewLesson();
//   }, [lessonId]);

//   const fetchPreviewLesson = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // If lesson data was passed via state, use it
//       if (location.state?.lesson) {
//         setLesson(location.state.lesson);
//         setLoading(false);
//         return;
//       }

//       // Otherwise fetch from API
//       console.log(`Fetching lesson ${lessonId} for preview...`);
//       const response = await axiosInstance.get(`/lessons/${lessonId}`);

//       if (response.data.success) {
//         setLesson(response.data.lesson);
//       } else {
//         setError(response.data.error || "Failed to load preview");
//       }
//     } catch (error) {
//       console.error("Error loading preview:", error);
//       setError("Unable to load the preview lesson. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToCourses = () => {
//     navigate("/courses");
//   };

//   const handleEnrollNow = () => {
//     if (lesson?.course?.id) {
//       navigate(`/payment/${lesson.course.id}`);
//     } else {
//       navigate("/courses");
//     }
//   };

//   const renderLessonContent = () => {
//     if (!lesson) return null;

//     switch (lesson.content_type) {
//       case "video":
//         return (
//           <div className="video-container">
//             {lesson.video_url ? (
//               <video controls className="lesson-video">
//                 <source src={lesson.video_url} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             ) : (
//               <div className="no-content">
//                 No video available for this lesson.
//               </div>
//             )}
//           </div>
//         );

//       case "pdf":
//         return (
//           <div className="pdf-container">
//             {lesson.file_url ? (
//               <iframe
//                 src={lesson.file_url}
//                 title={lesson.title}
//                 className="lesson-pdf"
//               />
//             ) : (
//               <div className="no-content">
//                 No PDF available for this lesson.
//               </div>
//             )}
//           </div>
//         );

//       case "text":
//       default:
//         return (
//           <div className="text-content">
//             {lesson.content ? (
//               <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
//             ) : (
//               <div className="no-content">
//                 No content available for this lesson.
//               </div>
//             )}
//           </div>
//         );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="preview-container">
//         <div className="loading">
//           <div className="spinner"></div>
//           <p>Loading preview...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="preview-container">
//         <div className="error-message">
//           <h2>⚠️ Preview Unavailable</h2>
//           <p>{error}</p>
//           <button onClick={handleBackToCourses} className="btn-back">
//             Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!lesson) {
//     return (
//       <div className="preview-container">
//         <div className="error-message">
//           <h2>No Preview Found</h2>
//           <p>This lesson preview is not available.</p>
//           <button onClick={handleBackToCourses} className="btn-back">
//             Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="preview-container">
//       <div className="preview-header">
//         <button onClick={handleBackToCourses} className="btn-back">
//           ← Back to Courses
//         </button>
//         <h1>🎬 Free Preview</h1>
//         <p className="preview-note">
//           This is a preview of the course content. Enroll for full access!
//         </p>
//       </div>

//       <div className="preview-content">
//         <div className="lesson-header">
//           <h2>{lesson.title}</h2>
//           {lesson.course && (
//             <p className="course-info">
//               From: <strong>{lesson.course.title}</strong>
//             </p>
//           )}
//           {lesson.content_type && (
//             <span className="content-type-badge">
//               {lesson.content_type.toUpperCase()}
//             </span>
//           )}
//           {lesson.is_preview && (
//             <span className="preview-badge">FREE PREVIEW</span>
//           )}
//         </div>

//         <div className="lesson-content">{renderLessonContent()}</div>

//         <div className="lesson-footer">
//           <div className="preview-limitations">
//             <h3>⚠️ Preview Limitations</h3>
//             <ul>
//               <li>Only one lesson is available for preview</li>
//               <li>Full course includes all lessons and exercises</li>
//               <li>Enroll for complete access and teacher support</li>
//             </ul>
//           </div>

//           <div className="preview-actions">
//             <button onClick={handleBackToCourses} className="btn-secondary">
//               Browse More Courses
//             </button>
//             <button onClick={handleEnrollNow} className="btn-primary">
//               Enroll Now for Full Access
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PreviewLessonPage;






// src/pages/PreviewLessonPage.jsx - UPDATED VERSION (Handles both lessonId and courseId)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack,
  PictureAsPdf,
  VideoLibrary,
  Description,
  Close,
  Download,
  OpenInNew,
  School,
  Error as ErrorIcon,
} from "@mui/icons-material";
import "./PreviewLessonPage.css";

const PreviewLessonPage = () => {
  const { lessonId, courseId } = useParams(); // Now accepts both params
  const navigate = useNavigate();
  const location = useLocation();

  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Determine if we're in "lesson preview" mode or "course preview" mode
  const isCoursePreviewMode = !!courseId && !lessonId;
  const isLessonPreviewMode = !!lessonId;

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(`🔍 Preview Mode:`, {
          courseId,
          lessonId,
          isCoursePreviewMode,
          isLessonPreviewMode,
          state: location.state,
        });

        // CASE 1: If lesson data was passed via state, use it
        if (location.state?.lesson) {
          console.log("📦 Using lesson from state:", location.state.lesson);
          setLesson(location.state.lesson);
          if (location.state.course) {
            setCourse(location.state.course);
          }
          setLoading(false);
          return;
        }

        // CASE 2: We have a lessonId - fetch specific lesson
        if (isLessonPreviewMode) {
          console.log(`📖 Fetching lesson ${lessonId}...`);
          const response = await axiosInstance.get(`/lessons/${lessonId}`);

          if (response.data.success && response.data.lesson) {
            setLesson(response.data.lesson);
            console.log("✅ Lesson loaded:", response.data.lesson);
          } else {
            throw new Error(response.data.error || "Lesson not found");
          }
        }

        // CASE 3: We have a courseId - need to find a preview lesson for this course
        if (isCoursePreviewMode) {
          console.log(`🏫 Fetching preview for course ${courseId}...`);

          // Step 1: Get course details
          const courseResponse = await axiosInstance.get(`/courses/id/${courseId}`);
          if (courseResponse.data.success && courseResponse.data.course) {
            setCourse(courseResponse.data.course);
            console.log("✅ Course loaded:", courseResponse.data.course);
          }

          // Step 2: Try to find a preview lesson
          let previewLesson = null;

          // Try public preview endpoint first
          try {
            console.log("🔍 Trying /courses/:id/preview-lesson endpoint...");
            const previewResponse = await axiosInstance.get(
              `/courses/${courseId}/preview-lesson`
            );
            if (previewResponse.data.success && previewResponse.data.lesson) {
              previewLesson = previewResponse.data.lesson;
              console.log("✅ Found preview via /preview-lesson endpoint");
            }
          } catch (previewError) {
            console.log("⚠️ /preview-lesson endpoint failed, trying alternatives...");
          }

          // If no preview found, try to get all lessons and find a preview
          if (!previewLesson) {
            try {
              console.log("🔍 Trying /courses/:id/lessons endpoint...");
              const lessonsResponse = await axiosInstance.get(
                `/courses/${courseId}/lessons`
              );
              if (lessonsResponse.data.success && lessonsResponse.data.lessons) {
                // Look for a preview lesson
                previewLesson = lessonsResponse.data.lessons.find(
                  (l) => l.is_preview
                );
                if (previewLesson) {
                  console.log("✅ Found preview in lessons array");
                } else if (lessonsResponse.data.lessons.length > 0) {
                  // Use first lesson as fallback
                  previewLesson = lessonsResponse.data.lessons[0];
                  console.log("📋 Using first lesson as fallback preview");
                }
              }
            } catch (lessonsError) {
              console.log("⚠️ /lessons endpoint failed:", lessonsError.message);
            }
          }

          if (previewLesson) {
            setLesson(previewLesson);
            console.log("🎯 Preview lesson set:", previewLesson);
          } else {
            throw new Error("No preview content available for this course");
          }
        }

        // If we still don't have a lesson, throw error
        if (!lesson && !isLessonPreviewMode) {
          throw new Error("Could not load preview content");
        }

      } catch (error) {
        console.error("❌ Error loading preview:", error);
        setError(
          error.message ||
          "Unable to load the preview. Please try again or contact support."
        );
        toast.error("Failed to load preview content");
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [lessonId, courseId, isCoursePreviewMode, isLessonPreviewMode, location.state]);

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  const handleEnrollNow = () => {
    const targetCourseId = course?.id || (lesson?.course?.id) || courseId;
    if (targetCourseId) {
      navigate(`/payment/${targetCourseId}`);
    } else {
      toast.error("Cannot enroll: Course information missing");
      navigate("/courses");
    }
  };

  const handleOpenPdfDialog = () => {
    if (lesson?.file_url || lesson?.fileUrl) {
      const fileUrl = lesson.file_url || lesson.fileUrl;
      // Use Google Docs Viewer for better compatibility
      const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
        fileUrl
      )}&embedded=true`;
      setPreviewUrl(googleViewerUrl);
      setPdfDialogOpen(true);
    } else {
      toast.warning("No PDF available for this lesson");
    }
  };

  const handleDownloadPdf = () => {
    if (lesson?.file_url || lesson?.fileUrl) {
      const fileUrl = lesson.file_url || lesson.fileUrl;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${lesson.title.replace(/[^a-z0-9]/gi, "_") || "preview"}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (lesson?.file_url || lesson?.fileUrl) {
      const fileUrl = lesson.file_url || lesson.fileUrl;
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const renderLessonContent = () => {
    if (!lesson) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Description sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Preview content not available
          </Typography>
        </Box>
      );
    }

    const contentType = lesson.content_type || lesson.contentType || "text";
    const fileUrl = lesson.file_url || lesson.fileUrl;
    const videoUrl = lesson.video_url || lesson.videoUrl;

    switch (contentType.toLowerCase()) {
      case "video":
        return (
          <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              🎬 Video Preview
            </Typography>
            {videoUrl ? (
              <Box
                component="video"
                controls
                src={videoUrl}
                sx={{
                  width: "100%",
                  maxHeight: "500px",
                  borderRadius: 1,
                  backgroundColor: "#000",
                }}
              />
            ) : (
              <Alert severity="info">
                <Typography>Video content not available for preview</Typography>
              </Alert>
            )}
          </Box>
        );

      case "pdf":
      case "file":
        return (
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Box sx={{ mb: 3 }}>
              <PictureAsPdf
                sx={{
                  fontSize: 80,
                  color: "#f44336",
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                📄 PDF Preview Available
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Click below to view the course material preview
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={handleOpenPdfDialog}
                size="large"
              >
                View PDF Preview
              </Button>
              <Button
                variant="outlined"
                startIcon={<OpenInNew />}
                onClick={handleOpenInNewTab}
                size="large"
              >
                Open in New Tab
              </Button>
            </Box>

            <Typography variant="caption" color="textSecondary" sx={{ mt: 3, display: "block" }}>
              Previewing: {lesson.title}
            </Typography>
          </Box>
        );

      case "text":
      default:
        return (
          <Paper sx={{ p: 4, maxHeight: "500px", overflow: "auto" }}>
            <Typography variant="h5" gutterBottom>
              {lesson.title}
            </Typography>
            {lesson.content ? (
              <Box
                component="div"
                sx={{
                  "& h1, & h2, & h3": { mt: 2, mb: 1 },
                  "& p": { mb: 2 },
                  "& ul, & ol": { pl: 3, mb: 2 },
                }}
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            ) : (
              <Alert severity="info">
                <Typography>Text content not available for preview</Typography>
              </Alert>
            )}
          </Paper>
        );
    }
  };

  // PDF Preview Dialog
  const renderPdfDialog = () => (
    <Dialog
      open={pdfDialogOpen}
      onClose={() => setPdfDialogOpen(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "70vh",
          maxHeight: "85vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" noWrap>
            📄 {lesson?.title || "PDF Preview"}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {course?.title || "Course Preview"} • Free Preview
          </Typography>
        </Box>
        <IconButton
          onClick={() => setPdfDialogOpen(false)}
          size="small"
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, position: "relative", height: "60vh" }}>
        {previewUrl && (
          <iframe
            src={previewUrl}
            title={`PDF Preview - ${lesson?.title || "Course Material"}`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            sandbox="allow-same-origin allow-scripts allow-popups"
            allow="fullscreen"
            referrerPolicy="no-referrer"
          />
        )}
      </DialogContent>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="caption" color="textSecondary">
          Preview powered by Google Docs Viewer
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<Download />}
            onClick={handleDownloadPdf}
            variant="contained"
            color="primary"
            size="small"
          >
            Download
          </Button>
          <Button
            onClick={() => setPdfDialogOpen(false)}
            variant="outlined"
            size="small"
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading preview...
        </Typography>
        <LinearProgress sx={{ mt: 2, width: "50%", mx: "auto" }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToCourses}
          sx={{ mb: 3 }}
        >
          Back to Courses
        </Button>

        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Preview Unavailable
          </Typography>
          <Typography>{error}</Typography>
        </Alert>

        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Try These Alternatives:
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleBackToCourses}
              startIcon={<School />}
            >
              Browse Other Courses
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToCourses}
          sx={{ mb: 2 }}
        >
          Back to Courses
        </Button>

        <Paper sx={{ p: 3, backgroundColor: "#e3f2fd", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            🎬 Free Preview
          </Typography>
          <Typography variant="body1" paragraph>
            This is a preview of the course content. Enroll for full access!
          </Typography>

          {course && (
            <Typography variant="body2" color="textSecondary">
              Course: <strong>{course.title}</strong>
              {course.teacher && ` • Instructor: ${course.teacher.name}`}
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Preview Content */}
      <Box sx={{ mb: 4 }}>{renderLessonContent()}</Box>

      {/* Preview Limitations */}
      <Paper sx={{ p: 4, backgroundColor: "#fff8e1", mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#e65100" }}>
          ⚠️ Preview Limitations
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" paragraph sx={{ display: "flex", alignItems: "center" }}>
            • Only one lesson is available for preview
          </Typography>
          <Typography variant="body2" paragraph sx={{ display: "flex", alignItems: "center" }}>
            • Full course includes all lessons and exercises
          </Typography>
          <Typography variant="body2" paragraph sx={{ display: "flex", alignItems: "center" }}>
            • Enroll for complete access and teacher support
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={handleBackToCourses}
            startIcon={<School />}
          >
            Browse More Courses
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleEnrollNow}
            sx={{ flexGrow: 1 }}
            size="large"
          >
            Enroll Now for Full Access
          </Button>
        </Box>
      </Paper>

      {/* Debug Info (for development) */}
      {process.env.NODE_ENV === "development" && (
        <Paper sx={{ p: 2, mt: 3, backgroundColor: "#f5f5f5" }}>
          <Typography variant="caption" component="div">
            <strong>Debug Info:</strong> Mode: {isCoursePreviewMode ? "Course Preview" : "Lesson Preview"} | 
            Lesson ID: {lesson?.id || "N/A"} | 
            Course ID: {course?.id || courseId || "N/A"} | 
            Content Type: {lesson?.content_type || "N/A"}
          </Typography>
        </Paper>
      )}

      {/* PDF Dialog */}
      {renderPdfDialog()}
    </Container>
  );
};

export default PreviewLessonPage;