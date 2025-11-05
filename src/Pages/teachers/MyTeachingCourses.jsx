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
  });
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
            return {
              courseId: course.id,
              lessons: lessonsResponse.data?.lessons || [],
            };
          } catch (error) {
            console.error(
              `Error fetching lessons for course ${course.id}:`,
              error
            );
            return { courseId: course.id, lessons: [] };
          }
        });

        const lessonsResults = await Promise.all(lessonsPromises);
        const lessonsMap = {};
        lessonsResults.forEach((result) => {
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

  const handleCourseClick = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
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
      if (type === "course") {
        await axiosInstance.delete(`/courses/${course.id}`);
        setCourses((prev) => prev.filter((c) => c.id !== course.id));
        showSnackbar("Course deleted successfully", "success");
      } else if (type === "lesson") {
        await axiosInstance.delete(`/lessons/${lesson.id}`);
        setLessons((prev) => ({
          ...prev,
          [course.id]: prev[course.id].filter((l) => l.id !== lesson.id),
        }));
        showSnackbar("Lesson deleted successfully", "success");
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showSnackbar(`Failed to delete ${type}`, "error");
    } finally {
      setDeleteDialog({ open: false, course: null, lesson: null });
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
        return <ArticleIcon color="secondary" fontSize="small" />;
      default:
        return <ArticleIcon color="action" fontSize="small" />;
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
      <Card sx={{ mb: 4, p: 3 }} className="creation-options-card">
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
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 3,
                  borderColor: 'primary.main'
                }
              }}
              onClick={() => navigate('/create-course')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <RocketIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Simple Course Creation
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
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
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 3,
                  borderColor: 'secondary.main'
                }
              }}
              onClick={() => navigate('/create-course-advanced')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <BuildIcon color="secondary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Advanced Course Creation
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
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
              You haven't created any courses yet. Choose a creation method above to get started.
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
                    <Chip
                      label={formatPrice(course.price)}
                      color="primary"
                      variant="outlined"
                    />
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
                  </Box>

                  {/* Lessons Section */}
                  <Accordion
                    expanded={expandedCourse === course.id}
                    onChange={() => handleCourseClick(course.id)}
                    className="lessons-accordion"
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">
                        📦 Lessons ({lessons[course.id]?.length || 0})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {lessons[course.id]?.length > 0 ? (
                        <List dense>
                          {lessons[course.id].map((lesson) => (
                            <ListItem key={lesson.id} className="lesson-item">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {getLessonIcon(lesson.content_type)}
                                <ListItemText
                                  primary={lesson.title}
                                  secondary={
                                    <Box
                                      sx={{ display: "flex", gap: 1, mt: 0.5 }}
                                    >
                                      <Chip
                                        label={lesson.content_type || "text"}
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
                    >
                      Delete
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
          setDeleteDialog({ open: false, course: null, lesson: null })
        }
      >
        <DialogTitle>
          Delete {deleteDialog.type === "course" ? "Course" : "Lesson"}
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({ open: false, course: null, lesson: null })
            }
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
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