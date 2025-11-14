// src/pages/teachers/MyTeachingCourses.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Collapse,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Rocket as RocketIcon,
  Build as BuildIcon,
  Visibility as PreviewIcon,
  TextSnippet as TextIcon,
  PictureAsPdf as PdfIcon,
  Theaters as VideoFileIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon2,
} from "@mui/icons-material";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../utils/axiosInstance";
import "./MyTeachingCourses.css";

const MyTeachingCourses = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState({});
  const [subLessons, setSubLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    course: null,
    lesson: null,
    type: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch teacher's courses
  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/courses/teacher/my-courses");

      if (response.data?.success) {
        setCourses(response.data.courses || []);

        // Fetch lessons for each course
        const lessonsPromises = response.data.courses.map(async (course) => {
          try {
            const lessonsResponse = await axiosInstance.get(
              `/courses/${course.id}/lessons`
            );
            const lessonsData = lessonsResponse.data?.lessons || [];

            // Fetch sub-lessons for each lesson
            const subLessonPromises = lessonsData.map(async (lesson) => {
              try {
                const subLessonsResponse = await axiosInstance.get(
                  `/lessons/${lesson.id}/sublessons`
                );
                return {
                  lessonId: lesson.id,
                  subLessons: subLessonsResponse.data?.sublessons || [],
                };
              } catch (error) {
                console.error(
                  `Error fetching sub-lessons for lesson ${lesson.id}:`,
                  error
                );
                return { lessonId: lesson.id, subLessons: [] };
              }
            });

            const subLessonsResults = await Promise.all(subLessonPromises);
            const subLessonsMap = {};
            subLessonsResults.forEach((result) => {
              subLessonsMap[result.lessonId] = result.subLessons;
            });

            return {
              courseId: course.id,
              lessons: lessonsData,
              subLessons: subLessonsMap,
            };
          } catch (error) {
            console.error(
              `Error fetching lessons for course ${course.id}:`,
              error
            );
            return { courseId: course.id, lessons: [], subLessons: {} };
          }
        });

        const lessonsResults = await Promise.all(lessonsPromises);
        const lessonsMap = {};
        const subLessonsMap = {};

        lessonsResults.forEach((result) => {
          lessonsMap[result.courseId] = result.lessons;
          subLessonsMap[result.courseId] = result.subLessons;
        });

        setLessons(lessonsMap);
        setSubLessons(subLessonsMap);
      } else {
        setCourses([]);
        showSnackbar("No courses found", "info");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showSnackbar("Failed to load courses", "error");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  // ✅ FIXED: ENHANCED PREVIEW LESSON HANDLER WITH PROPER ERROR HANDLING
  const handlePreviewLesson = async (lesson, course, isSubLesson = false) => {
    console.log("🔍 Preview lesson clicked:", {
      id: lesson.id,
      title: lesson.title,
      content_type: lesson.content_type,
      file_url: lesson.file_url,
      video_url: lesson.video_url,
      isSubLesson: isSubLesson,
      course: course.title,
    });

    try {
      // First, test access using the debug endpoint with proper authentication
      console.log("🧪 Testing lesson access...");
      const debugResponse = await axiosInstance.get(
        `/files/debug-lesson/${lesson.id}`
      );

      if (debugResponse.data?.success) {
        console.log("✅ Debug info:", debugResponse.data);

        // Check if user has access
        if (!debugResponse.data.access.has_access) {
          showSnackbar(
            "You don't have permission to preview this lesson",
            "error"
          );
          return;
        }

        // Check if file exists for PDF lessons
        if (
          lesson.content_type === "pdf" &&
          !debugResponse.data.file_info.exists
        ) {
          showSnackbar("PDF file not found on server", "error");
          return;
        }

        // Create a new window/tab for the preview
        const previewWindow = window.open("", "_blank");

        if (!previewWindow) {
          showSnackbar(
            "Please allow popups for preview functionality",
            "warning"
          );
          return;
        }

        // Show loading message
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Loading Preview...</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .loading {
                text-align: center;
                color: white;
              }
              .spinner {
                border: 4px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top: 4px solid white;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="loading">
              <div class="spinner"></div>
              <h2>Loading Preview...</h2>
              <p>Opening: ${lesson.title}</p>
            </div>
          </body>
          </html>
        `);

        // Use the dedicated preview endpoint with proper authentication
        const previewUrl = `/api/v1/files/preview-lesson/${lesson.id}`;
        const fullPreviewUrl = `${window.location.origin}${previewUrl}`;

        console.log("🚀 Opening preview URL:", fullPreviewUrl);

        // Wait a moment then redirect to the actual preview
        setTimeout(() => {
          try {
            previewWindow.location.href = fullPreviewUrl;
          } catch (error) {
            console.error("❌ Error redirecting preview window:", error);
            previewWindow.close();
            showSnackbar("Failed to open preview", "error");
          }
        }, 1000);
      } else {
        throw new Error("Debug endpoint returned unsuccessful response");
      }
    } catch (error) {
      console.error("❌ Preview error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Handle specific error cases without logging out
      if (error.response?.status === 401) {
        showSnackbar("Please login again to preview content", "error");
        return;
      } else if (error.response?.status === 403) {
        showSnackbar(
          "You don't have permission to preview this lesson",
          "error"
        );
        return;
      } else if (error.response?.status === 404) {
        showSnackbar("Lesson content not found on server", "error");
        return;
      }

      // Fallback to direct file access for PDFs
      if (lesson.content_type === "pdf" && lesson.file_url) {
        console.log(
          "📄 Fallback: Attempting direct PDF access:",
          lesson.file_url
        );

        // Ensure the file_url is absolute
        let fileUrl = lesson.file_url;
        if (fileUrl.startsWith("/")) {
          fileUrl = `${window.location.origin}${fileUrl}`;
        }

        const previewWindow = window.open("", "_blank");
        previewWindow.location.href = fileUrl;
      } else if (lesson.content_type === "video" && lesson.video_url) {
        console.log("🎥 Fallback: Opening video directly:", lesson.video_url);

        let videoUrl = lesson.video_url;
        if (videoUrl.startsWith("/")) {
          videoUrl = `${window.location.origin}${videoUrl}`;
        }

        window.open(videoUrl, "_blank");
      } else {
        // For text content or when all else fails, show inline preview
        console.log("📝 Fallback: Showing inline text preview");

        const previewWindow = window.open("", "_blank");
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Preview: ${lesson.title}</title>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                padding: 30px; 
                max-width: 1000px; 
                margin: 0 auto; 
                line-height: 1.6;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
              }
              .preview-container {
                background: white;
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                border: 1px solid rgba(255,255,255,0.2);
              }
              .header { 
                border-bottom: 3px solid #667eea; 
                padding-bottom: 20px; 
                margin-bottom: 30px; 
                text-align: center;
              }
              .header h1 {
                color: #2d3748;
                margin: 0;
                font-size: 2.5em;
              }
              .content { 
                white-space: pre-wrap;
                background: #f8f9fa;
                padding: 30px;
                border-radius: 10px;
                border-left: 5px solid #667eea;
                font-size: 1.1em;
                color: #2d3748;
              }
              .info {
                background: #e3f2fd;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                border-left: 5px solid #2196f3;
              }
              .info p {
                margin: 8px 0;
                color: #1565c0;
                font-weight: 500;
              }
              .fallback-warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="preview-container">
              <div class="header">
                <h1>${lesson.title}</h1>
              </div>
              <div class="fallback-warning">
                <strong>Note:</strong> This is a fallback preview. Some features may not be available.
              </div>
              <div class="info">
                <p><strong>Course:</strong> ${course.title}</p>
                <p><strong>Content Type:</strong> ${lesson.content_type}</p>
                <p><strong>Type:</strong> ${
                  isSubLesson ? "Sub-Lesson" : "Lesson"
                }</p>
                <p><strong>Preview Generated:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <div class="content">
                ${lesson.content || "No content available for preview."}
              </div>
            </div>
          </body>
          </html>
        `);
        previewWindow.document.close();
      }
    }
  };

  const handleCourseClick = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleLessonClick = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  const handleEditCourse = (courseId) => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleManageLessons = (courseId) => {
    navigate(`/courses/${courseId}/manage-lessons`);
  };

  const handleCreateLesson = (courseId) => {
    navigate(`/courses/${courseId}/lessons/new`);
  };

  const handleEditLesson = (courseId, lessonId, isSubLesson = false) => {
    if (isSubLesson) {
      navigate(`/sublessons/${lessonId}/edit`);
    } else {
      navigate(`/lessons/${lessonId}/edit`);
    }
  };

  const handleDeleteCourse = (course) => {
    setDeleteDialog({
      open: true,
      course,
      lesson: null,
      type: "course",
    });
  };

  const handleDeleteLesson = (lesson, courseId, isSubLesson = false) => {
    setDeleteDialog({
      open: true,
      course: { id: courseId },
      lesson: { ...lesson, isSubLesson },
      type: isSubLesson ? "sublesson" : "lesson",
    });
  };

  const confirmDelete = async () => {
    const { course, lesson, type } = deleteDialog;

    try {
      setDeleting(true);

      if (type === "course") {
        console.log("🗑️ Deleting course:", course.id);
        const response = await axiosInstance.delete(`/courses/${course.id}`);

        if (response.data?.success) {
          setCourses((prev) => prev.filter((c) => c.id !== course.id));
          showSnackbar("Course deleted successfully", "success");
        } else {
          throw new Error(response.data?.error || "Failed to delete course");
        }
      } else if (type === "lesson" || type === "sublesson") {
        const endpoint =
          type === "sublesson"
            ? `/sublessons/${lesson.id}`
            : `/lessons/${lesson.id}`;
        console.log(`🗑️ Deleting ${type}:`, lesson.id);

        const response = await axiosInstance.delete(endpoint);

        if (response.data?.success) {
          if (type === "lesson") {
            // Remove lesson from state
            setLessons((prev) => ({
              ...prev,
              [course.id]: prev[course.id].filter((l) => l.id !== lesson.id),
            }));
          } else {
            // Remove sub-lesson from state
            setSubLessons((prev) => ({
              ...prev,
              [course.id]: {
                ...prev[course.id],
                [lesson.parent_lesson_id]:
                  prev[course.id]?.[lesson.parent_lesson_id]?.filter(
                    (sl) => sl.id !== lesson.id
                  ) || [],
              },
            }));
          }
          showSnackbar(
            `${
              type === "sublesson" ? "Sub-lesson" : "Lesson"
            } deleted successfully`,
            "success"
          );
        } else {
          throw new Error(response.data?.error || `Failed to delete ${type}`);
        }
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        `Failed to delete ${type}`;
      showSnackbar(errorMessage, "error");
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, course: null, lesson: null, type: null });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getLessonIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <VideoIcon color="primary" fontSize="small" />;
      case "pdf":
        return <PdfIcon color="secondary" fontSize="small" />;
      case "text":
        return <TextIcon color="action" fontSize="small" />;
      default:
        return <ArticleIcon color="action" fontSize="small" />;
    }
  };

  const getContentTypeLabel = (contentType) => {
    switch (contentType) {
      case "video":
        return "Video";
      case "pdf":
        return "PDF";
      case "text":
        return "Text";
      default:
        return contentType || "Content";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: 3 }}
      className={`teacher-dashboard ${isDark ? "dark-mode" : ""}`}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        📘 My Teaching Courses
      </Typography>

      {/* Course Creation Options */}
      <Card className="creation-options-card">
        <Typography variant="h5" gutterBottom>
          Create New Course
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Choose your preferred method for creating a new course
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              className="creation-option simple"
              sx={{
                p: 2,
                height: "100%",
                cursor: "pointer",
              }}
              onClick={() => navigate("/create-course")}
            >
              <Box className="creation-option-header">
                <RocketIcon className="floating" />
                <Typography variant="h6" gutterBottom>
                  Simple Course Creation
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Quick setup with basic course information
                </Typography>
                <ul className="feature-list">
                  <li>Basic course information</li>
                  <li>File uploads</li>
                  <li>Fast setup</li>
                  <li>Add structure later</li>
                </ul>
                <Button
                  variant="contained"
                  startIcon={<RocketIcon />}
                  sx={{ mt: 2 }}
                >
                  Get Started
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              className="creation-option advanced"
              sx={{
                p: 2,
                height: "100%",
                cursor: "pointer",
              }}
              onClick={() => navigate("/create-course-advanced")}
            >
              <Box className="creation-option-header">
                <BuildIcon className="floating" />
                <Typography variant="h6" gutterBottom>
                  Advanced Course Creation
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Complete course structure with custom URLs
                </Typography>
                <ul className="feature-list">
                  <li>Custom slugs for everything</li>
                  <li>Multi-step creation</li>
                  <li>Units and lessons setup</li>
                  <li>Complete URL control</li>
                </ul>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<BuildIcon />}
                  sx={{ mt: 2 }}
                >
                  Create Complete Course
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Card>

      {/* Existing Courses */}
      {courses.length === 0 ? (
        <Card className="empty-state">
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No courses found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              You haven't created any courses yet. Choose a creation method
              above to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} key={course.id}>
              <Card className="course-card">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        paragraph
                      >
                        {course.description || "No description available."}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={formatPrice(course.price)}
                        color="primary"
                        variant="outlined"
                      />
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        <Chip
                          label={`${course.unit_count || 0} Units`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`${lessons[course.id]?.length || 0} Lessons`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    <Chip
                      label={`Slug: ${course.slug}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`ID: ${course.id}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`Created: ${new Date(
                        course.created_at
                      ).toLocaleDateString()}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Lessons Section */}
                  <Accordion
                    expanded={expandedCourse === course.id}
                    onChange={() => handleCourseClick(course.id)}
                    className="lessons-accordion"
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">
                        📦 Course Content ({lessons[course.id]?.length || 0}{" "}
                        Lessons)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {lessons[course.id]?.length > 0 ? (
                        <List dense className="lessons-list">
                          {lessons[course.id].map((lesson) => {
                            const lessonSubLessons =
                              subLessons[course.id]?.[lesson.id] || [];
                            const hasSubLessons = lessonSubLessons.length > 0;
                            const isExpanded = expandedLessons[lesson.id];

                            return (
                              <Box key={lesson.id}>
                                {/* Main Lesson Item */}
                                <ListItem className="lesson-item main-lesson">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      width: "100%",
                                    }}
                                  >
                                    {getLessonIcon(lesson.content_type)}
                                    <ListItemText
                                      primary={
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          <Typography
                                            variant="body1"
                                            fontWeight="medium"
                                          >
                                            {lesson.title}
                                          </Typography>
                                          {/* ✅ PREVIEW BUTTON FOR EVERY LESSON */}
                                          <Button
                                            size="small"
                                            className="preview-button"
                                            startIcon={<PreviewIcon />}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handlePreviewLesson(
                                                lesson,
                                                course,
                                                false
                                              );
                                            }}
                                            sx={{ ml: 1 }}
                                          >
                                            Preview Lesson
                                          </Button>
                                          {lesson.is_preview && (
                                            <Chip
                                              label="Free Preview"
                                              size="small"
                                              color="success"
                                              variant="filled"
                                            />
                                          )}
                                        </Box>
                                      }
                                      secondary={
                                        <Box
                                          sx={{
                                            display: "flex",
                                            gap: 1,
                                            mt: 0.5,
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          <Chip
                                            label={getContentTypeLabel(
                                              lesson.content_type
                                            )}
                                            size="small"
                                            variant="outlined"
                                          />
                                          <Chip
                                            label={`Order: ${lesson.order_index}`}
                                            size="small"
                                            variant="outlined"
                                          />
                                          {hasSubLessons && (
                                            <Chip
                                              label={`${lessonSubLessons.length} Sub-lessons`}
                                              size="small"
                                              color="info"
                                              variant="outlined"
                                            />
                                          )}
                                        </Box>
                                      }
                                    />
                                  </Box>
                                  <ListItemSecondaryAction>
                                    {hasSubLessons && (
                                      <IconButton
                                        onClick={() =>
                                          handleLessonClick(lesson.id)
                                        }
                                        size="small"
                                        sx={{ mr: 1 }}
                                      >
                                        {isExpanded ? (
                                          <ExpandLessIcon />
                                        ) : (
                                          <ExpandMoreIcon2 />
                                        )}
                                      </IconButton>
                                    )}
                                    <IconButton
                                      edge="end"
                                      aria-label="edit"
                                      onClick={() =>
                                        handleEditLesson(
                                          course.id,
                                          lesson.id,
                                          false
                                        )
                                      }
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      onClick={() =>
                                        handleDeleteLesson(
                                          lesson,
                                          course.id,
                                          false
                                        )
                                      }
                                      size="small"
                                      color="error"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>

                                {/* Sub-lessons Section */}
                                {hasSubLessons && (
                                  <Collapse
                                    in={isExpanded}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <List
                                      component="div"
                                      disablePadding
                                      className="sublessons-list"
                                    >
                                      {lessonSubLessons.map((subLesson) => (
                                        <ListItem
                                          key={subLesson.id}
                                          className="lesson-item sublesson-item"
                                          sx={{ pl: 4 }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                              width: "100%",
                                            }}
                                          >
                                            {getLessonIcon(
                                              subLesson.content_type
                                            )}
                                            <ListItemText
                                              primary={
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    flexWrap: "wrap",
                                                  }}
                                                >
                                                  <Typography variant="body2">
                                                    {subLesson.title}
                                                  </Typography>
                                                  {/* ✅ PREVIEW BUTTON FOR EVERY SUB-LESSON */}
                                                  <Button
                                                    size="small"
                                                    className="preview-button"
                                                    startIcon={<PreviewIcon />}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handlePreviewLesson(
                                                        subLesson,
                                                        course,
                                                        true
                                                      );
                                                    }}
                                                    sx={{ ml: 1 }}
                                                  >
                                                    Preview Sub-lesson
                                                  </Button>
                                                  {subLesson.is_preview && (
                                                    <Chip
                                                      label="Free Preview"
                                                      size="small"
                                                      color="success"
                                                      variant="filled"
                                                    />
                                                  )}
                                                </Box>
                                              }
                                              secondary={
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    mt: 0.5,
                                                    flexWrap: "wrap",
                                                  }}
                                                >
                                                  <Chip
                                                    label={getContentTypeLabel(
                                                      subLesson.content_type
                                                    )}
                                                    size="small"
                                                    variant="outlined"
                                                  />
                                                  <Chip
                                                    label={`Sub-order: ${subLesson.order_index}`}
                                                    size="small"
                                                    variant="outlined"
                                                  />
                                                  <Chip
                                                    label="Sub-lesson"
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                  />
                                                </Box>
                                              }
                                            />
                                          </Box>
                                          <ListItemSecondaryAction>
                                            <IconButton
                                              edge="end"
                                              aria-label="edit"
                                              onClick={() =>
                                                handleEditLesson(
                                                  course.id,
                                                  subLesson.id,
                                                  true
                                                )
                                              }
                                              size="small"
                                              sx={{ mr: 1 }}
                                            >
                                              <EditIcon />
                                            </IconButton>
                                            <IconButton
                                              edge="end"
                                              aria-label="delete"
                                              onClick={() =>
                                                handleDeleteLesson(
                                                  subLesson,
                                                  course.id,
                                                  true
                                                )
                                              }
                                              size="small"
                                              color="error"
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </ListItemSecondaryAction>
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Collapse>
                                )}
                              </Box>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ textAlign: "center", py: 2 }}
                        >
                          No lessons yet. Create your first lesson!
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </CardContent>

                <CardActions className="course-actions">
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      startIcon={<SettingsIcon />}
                      onClick={() => handleManageLessons(course.id)}
                      variant="outlined"
                    >
                      Manage Lessons
                    </Button>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleCreateLesson(course.id)}
                      variant="outlined"
                    >
                      Create Lesson
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditCourse(course.id)}
                      variant="outlined"
                    >
                      Edit Course
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteCourse(course)}
                      variant="outlined"
                      color="error"
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() =>
          setDeleteDialog({
            open: false,
            course: null,
            lesson: null,
            type: null,
          })
        }
      >
        <DialogTitle>
          Delete{" "}
          {deleteDialog.type === "course"
            ? "Course"
            : deleteDialog.type === "sublesson"
            ? "Sub-lesson"
            : "Lesson"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {deleteDialog.type === "course"
                ? deleteDialog.course?.title
                : deleteDialog.lesson?.title}
            </strong>
            ?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {deleteDialog.type === "course"
              ? "This will also delete all lessons and sub-lessons in this course. This action cannot be undone."
              : deleteDialog.type === "lesson"
              ? "This will also delete all sub-lessons in this lesson. This action cannot be undone."
              : "This action cannot be undone."}
          </Typography>
          {deleteDialog.type === "course" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Warning: This will permanently delete the course and all its
              content!
            </Alert>
          )}
          {deleteDialog.type === "lesson" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Warning: This will also delete all sub-lessons in this lesson!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({
                open: false,
                course: null,
                lesson: null,
                type: null,
              })
            }
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyTeachingCourses;
