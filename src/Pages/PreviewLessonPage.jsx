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



// src/pages/PreviewLessonPage.jsx - UPDATED
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
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
  Chip,
  Card,
  CardContent,
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
  Dashboard,
  MenuBook,
} from "@mui/icons-material";
import "./PreviewLessonPage.css";

const PreviewLessonPage = () => {
  const { lessonId, courseId: urlCourseId } = useParams(); // Renamed to urlCourseId
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [isUserTeacher, setIsUserTeacher] = useState(false);
  const [isCourseOwner, setIsCourseOwner] = useState(false);
  const [enrollmentChecking, setEnrollmentChecking] = useState(false);

  // Get courseId from multiple possible sources
  const getCourseId = () => {
    // Priority: 1. From course object, 2. From URL, 3. From lesson
    if (course?.id) return course.id;
    if (urlCourseId) return urlCourseId;
    if (lesson?.course_id) return lesson.course_id;
    return null;
  };

  const currentCourseId = getCourseId();

  // Check if user is enrolled or is teacher
  useEffect(() => {
    const checkUserAccess = async () => {
      if (!user || !currentCourseId) return;

      try {
        setEnrollmentChecking(true);

        // Check if user is enrolled
        if (user.role === "student") {
          try {
            const enrollmentRes = await axiosInstance.get(
              `/enrollments/check/${currentCourseId}`
            );
            setIsUserEnrolled(enrollmentRes.data.enrolled || false);
          } catch (err) {
            console.error("Error checking enrollment:", err);
            setIsUserEnrolled(false);
          }
        }

        // Check if user is teacher
        setIsUserTeacher(user.role === "teacher" || user.role === "admin");

        // Check if user owns this course
        if (course && course.teacher_id) {
          setIsCourseOwner(user.id === course.teacher_id);
        }

      } catch (err) {
        console.error("Error checking user access:", err);
      } finally {
        setEnrollmentChecking(false);
      }
    };

    checkUserAccess();
  }, [user, currentCourseId, course]);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(`🔍 Preview Mode:`, {
          urlCourseId,
          lessonId,
          locationState: location.state,
          userRole: user?.role,
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
        if (lessonId) {
          console.log(`📖 Fetching lesson ${lessonId}...`);
          const response = await axiosInstance.get(`/lessons/${lessonId}`);

          if (response.data.success && response.data.lesson) {
            const lessonData = response.data.lesson;
            setLesson(lessonData);
            console.log("✅ Lesson loaded:", lessonData);

            // If we have a courseId from the lesson, fetch course details
            if (lessonData.course_id) {
              try {
                const courseResponse = await axiosInstance.get(`/courses/id/${lessonData.course_id}`);
                if (courseResponse.data.success && courseResponse.data.course) {
                  setCourse(courseResponse.data.course);
                  console.log("✅ Course loaded from lesson:", courseResponse.data.course);
                }
              } catch (courseError) {
                console.error("Error fetching course from lesson:", courseError);
              }
            }
          } else {
            throw new Error(response.data.error || "Lesson not found");
          }
        }

        // CASE 3: We have a courseId from URL - fetch preview lesson
        if (urlCourseId && !lesson) {
          console.log(`🏫 Fetching preview for course ${urlCourseId}...`);

          // Step 1: Get course details
          try {
            const courseResponse = await axiosInstance.get(`/courses/id/${urlCourseId}`);
            if (courseResponse.data.success && courseResponse.data.course) {
              const courseData = courseResponse.data.course;
              setCourse(courseData);
              console.log("✅ Course loaded:", courseData);

              // Check if current user is the course owner
              if (user && courseData.teacher_id) {
                setIsCourseOwner(user.id === courseData.teacher_id);
              }
            }
          } catch (courseError) {
            console.error("Error fetching course:", courseError);
          }

          // Step 2: Try to find a preview lesson
          let previewLesson = null;

          // Try public preview endpoint first
          try {
            console.log("🔍 Trying /courses/:id/preview-lesson endpoint...");
            const previewResponse = await axiosInstance.get(
              `/courses/${urlCourseId}/preview-lesson`
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
                `/courses/${urlCourseId}/lessons`
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
            console.warn("No preview content available for this course");
          }
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
  }, [lessonId, urlCourseId, location.state, user]);

  // Determine if we should show enrollment messaging
  const shouldShowEnrollmentMessaging = () => {
    // Don't show enrollment messaging for:
    // 1. Enrolled students
    // 2. Teachers/admins
    // 3. Course owners
    if (!user) return true; // Show for non-logged in users
    
    if (isUserEnrolled) return false;
    if (user.role === "teacher" || user.role === "admin") return false;
    if (isCourseOwner) return false;
    
    return true; // Show for non-enrolled students
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  const handleAccessCourse = () => {
    const courseIdToUse = currentCourseId;
    
    if (!courseIdToUse) {
      console.error("Course ID is missing:", { currentCourseId, course, lesson });
      toast.error("Course information missing. Please try again.");
      return;
    }

    console.log("Access Course clicked:", {
      courseId: courseIdToUse,
      userRole: user?.role,
      isEnrolled: isUserEnrolled,
      isCourseOwner: isCourseOwner,
    });

    if (isUserEnrolled) {
      // Enrolled student: Navigate to course viewer
      navigate(`/courses/${courseIdToUse}/view-lessons`);
    } else if (isCourseOwner || isUserTeacher) {
      // Teacher or course owner: Navigate to appropriate view
      if (isCourseOwner) {
        // Teacher owns the course - go to course management
        navigate(`/courses/${courseIdToUse}/manage-lessons`);
      } else {
        // Teacher doesn't own this course - go to teacher view
        navigate(`/teacher/courses/${courseIdToUse}/view`);
      }
    } else {
      // Not enrolled, not a teacher - navigate to enrollment
      navigate(`/payment/${courseIdToUse}`);
    }
  };

  // Rest of the component remains the same...
  // [Keep all other functions: handleOpenPdfDialog, handleDownloadPdf, etc.]

  const renderLessonContent = () => {
    // [Keep the existing renderLessonContent function]
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
                📄 {shouldShowEnrollmentMessaging() ? "PDF Preview Available" : "Course Material"}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {shouldShowEnrollmentMessaging() 
                  ? "Click below to view the course material preview"
                  : "Access the full course material below"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={handleOpenPdfDialog}
                size="large"
              >
                {shouldShowEnrollmentMessaging() ? "View PDF Preview" : "Open Material"}
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
              {lesson.is_preview ? "Preview: " : ""}{lesson.title}
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

  // Render header based on user role
  const renderHeader = () => {
    if (shouldShowEnrollmentMessaging()) {
      return (
        <Paper sx={{ p: 3, backgroundColor: "#e3f2fd", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            🎬 Free Preview
          </Typography>
          <Typography variant="body1" paragraph>
            This is a preview of the course content. Enroll for full access!
          </Typography>
        </Paper>
      );
    } else {
      return (
        <Paper sx={{ p: 3, backgroundColor: "#e8f5e9", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            📚 Course Material
          </Typography>
          <Typography variant="body1" paragraph>
            {isUserEnrolled 
              ? "You have full access to this course." 
              : isCourseOwner
              ? "You are the instructor for this course."
              : "You have access to this material."}
          </Typography>
        </Paper>
      );
    }
  };

  // Render action buttons based on user role
  const renderActionButtons = () => {
    if (shouldShowEnrollmentMessaging()) {
      return (
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
            onClick={() => navigate(`/payment/${currentCourseId}`)}
            sx={{ flexGrow: 1 }}
            size="large"
            disabled={!currentCourseId}
          >
            Enroll Now for Full Access
          </Button>
        </Box>
      );
    } else {
      let buttonText = "View Course";
      let buttonIcon = <MenuBook />;
      
      if (isUserEnrolled) {
        buttonText = "Access Full Course";
        buttonIcon = <MenuBook />;
      } else if (isCourseOwner) {
        buttonText = "Manage Course";
        buttonIcon = <Dashboard />;
      } else if (isUserTeacher) {
        buttonText = "View Course Details";
        buttonIcon = <Description />;
      }
      
      return (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={handleBackToCourses}
            startIcon={<School />}
          >
            Back to Courses
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAccessCourse}
            sx={{ flexGrow: 1 }}
            size="large"
            startIcon={buttonIcon}
            disabled={!currentCourseId || enrollmentChecking}
          >
            {enrollmentChecking ? "Checking Access..." : buttonText}
          </Button>
        </Box>
      );
    }
  };

  // Rest of the component remains the same...
  // [Keep renderUserStatus, renderPdfDialog, and all other functions]

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading {shouldShowEnrollmentMessaging() ? "preview" : "material"}...
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

        <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {shouldShowEnrollmentMessaging() ? "Preview" : "Content"} Unavailable
          </Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBackToCourses}
        sx={{ mb: 2 }}
      >
        Back to Courses
      </Button>

      {renderHeader()}

      {course && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {course.title}
            </Typography>
            {course.teacher && (
              <Typography variant="body2" color="textSecondary">
                Instructor: <strong>{course.teacher.name}</strong>
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Box sx={{ mb: 4 }}>{renderLessonContent()}</Box>

      {shouldShowEnrollmentMessaging() ? (
        <Paper sx={{ p: 4, backgroundColor: "#fff8e1", mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#e65100" }}>
            ⚠️ Preview Limitations
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" paragraph>
              • Only one lesson is available for preview
            </Typography>
            <Typography variant="body2" paragraph>
              • Full course includes all lessons and exercises
            </Typography>
            <Typography variant="body2" paragraph>
              • Enroll for complete access and teacher support
            </Typography>
          </Box>

          {renderActionButtons()}
        </Paper>
      ) : (
        <Paper sx={{ p: 4, backgroundColor: "#f1f8e9", mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#2e7d32" }}>
            ✅ Full Access Granted
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" paragraph>
              • You have full access to all course materials
            </Typography>
            <Typography variant="body2" paragraph>
              • Access all lessons, exercises, and resources
            </Typography>
            <Typography variant="body2" paragraph>
              • {isCourseOwner ? "Manage your course content" : "Get teacher support when needed"}
            </Typography>
          </Box>

          {renderActionButtons()}
        </Paper>
      )}

      {/* Debug Info (for development) */}
      {process.env.NODE_ENV === "development" && (
        <Paper sx={{ p: 2, mt: 3, backgroundColor: "#f5f5f5" }}>
          <Typography variant="caption" component="div">
            <strong>Debug Info:</strong> 
            Course ID: {currentCourseId} | 
            User Role: {user?.role || "Not logged in"} | 
            Show Enrollment: {shouldShowEnrollmentMessaging() ? "Yes" : "No"} | 
            Enrolled: {isUserEnrolled ? "Yes" : "No"} | 
            Course Owner: {isCourseOwner ? "Yes" : "No"} |
            Lesson ID: {lessonId}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default PreviewLessonPage;