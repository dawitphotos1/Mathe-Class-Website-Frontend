// src/pages/teachers/MyTeachingCourses.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
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

  // ✅ OPTIMIZED: Fetch all course data in batch requests
  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);

      // Fetch courses
      const coursesResponse = await axiosInstance.get(
        "/courses/teacher/my-courses"
      );

      if (coursesResponse.data?.success) {
        const coursesData = coursesResponse.data.courses || [];
        setCourses(coursesData);

        // ✅ FIXED: Use batch endpoints instead of individual calls
        const coursesWithLessons = await Promise.all(
          coursesData.map(async (course) => {
            try {
              // Use the course structure endpoint to get everything at once
              const structureResponse = await axiosInstance.get(
                `/courses/teacher/${course.id}/full`
              );

              return {
                courseId: course.id,
                lessons:
                  structureResponse.data?.course?.units?.flatMap(
                    (unit) => unit.lessons || []
                  ) || [],
              };
            } catch (error) {
              console.error(
                `Error fetching structure for course ${course.id}:`,
                error
              );
              return { courseId: course.id, lessons: [] };
            }
          })
        );

        // Build lessons map
        const lessonsMap = {};
        coursesWithLessons.forEach((result) => {
          lessonsMap[result.courseId] = result.lessons;
        });

        setLessons(lessonsMap);
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

  // ✅ OPTIMIZED: Preview lesson handler
  const handlePreviewLesson = async (lesson, course) => {
    try {
      // Use the dedicated preview endpoint
      const previewUrl = `/api/v1/files/preview-lesson/${lesson.id}`;
      const fullPreviewUrl = `${window.location.origin}${previewUrl}`;

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

      // Redirect to actual preview
      setTimeout(() => {
        try {
          previewWindow.location.href = fullPreviewUrl;
        } catch (error) {
          console.error("Error redirecting preview window:", error);
          previewWindow.close();
          showSnackbar("Failed to open preview", "error");
        }
      }, 1000);
    } catch (error) {
      console.error("Preview error:", error);
      showSnackbar("Failed to open preview", "error");
    }
  };

  const handleCourseClick = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // ✅ FIXED: Navigation functions with proper routes
  const handleEditCourse = (courseId) => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleManageLessons = (courseId) => {
    navigate(`/courses/${courseId}/manage-lessons`);
  };

  const handleCreateLesson = (courseId) => {
    navigate(`/courses/${courseId}/lessons/new`);
  };

  const handleEditLesson = (courseId, lessonId) => {
    navigate(`/lessons/${lessonId}/edit`);
  };

  const handleDeleteCourse = (course) => {
    setDeleteDialog({
      open: true,
      course,
      lesson: null,
      type: "course",
    });
  };

  const handleDeleteLesson = (lesson, courseId) => {
    setDeleteDialog({
      open: true,
      course: { id: courseId },
      lesson,
      type: "lesson",
    });
  };

  const confirmDelete = async () => {
    const { course, lesson, type } = deleteDialog;

    try {
      setDeleting(true);

      if (type === "course") {
        const response = await axiosInstance.delete(`/courses/${course.id}`);

        if (response.data?.success) {
          setCourses((prev) => prev.filter((c) => c.id !== course.id));
          showSnackbar("Course deleted successfully", "success");
        } else {
          throw new Error(response.data?.error || "Failed to delete course");
        }
      } else {
        const response = await axiosInstance.delete(`/lessons/${lesson.id}`);

        if (response.data?.success) {
          // Remove lesson from state
          setLessons((prev) => ({
            ...prev,
            [course.id]: prev[course.id].filter((l) => l.id !== lesson.id),
          }));
          showSnackbar("Lesson deleted successfully", "success");
        } else {
          throw new Error(response.data?.error || "Failed to delete lesson");
        }
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      const errorMessage =
        error.response?.data?.message ||
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
                          {lessons[course.id].map((lesson) => (
                            <ListItem
                              key={lesson.id}
                              className="lesson-item main-lesson"
                            >
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
                                      <Button
                                        size="small"
                                        className="preview-button"
                                        startIcon={<PreviewIcon />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePreviewLesson(lesson, course);
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
                                    </Box>
                                  }
                                />
                              </Box>
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() =>
                                    handleEditLesson(course.id, lesson.id)
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
                                    handleDeleteLesson(lesson, course.id)
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
              ? "This will also delete all lessons in this course. This action cannot be undone."
              : "This action cannot be undone."}
          </Typography>
          {deleteDialog.type === "course" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Warning: This will permanently delete the course and all its
              content!
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


