// src/pages/teachers/MyTeachingCourses.jsx - FINAL WORKING VERSION
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
  TextField,
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
  TextSnippet as TextIcon,
  PictureAsPdf as PdfIcon,
  BugReport as BugIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from '../../utils/axiosInstance';
import PdfPreviewButton from "../../components/PdfPreviewButton";
import "./MyTeachingCourses.css";

const MyTeachingCourses = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State management
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
  const [editDialog, setEditDialog] = useState({
    open: false,
    course: null,
    loading: false,
  });
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showDebug, setShowDebug] = useState(false);

  // Fetch teacher's courses
  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);
      const coursesResponse = await axiosInstance.get("/courses/teacher/my-courses");

      if (coursesResponse.data?.success) {
        const coursesData = coursesResponse.data.courses || [];
        setCourses(coursesData);

        // Fetch lessons for each course
        const coursesWithLessons = await Promise.all(
          coursesData.map(async (course) => {
            try {
              const structureResponse = await axiosInstance.get(
                `/courses/teacher/${course.id}/full`
              );

              return {
                courseId: course.id,
                lessons: structureResponse.data?.course?.units?.flatMap(
                  (unit) => unit.lessons || []
                ) || [],
              };
            } catch (error) {
              console.error(`Error fetching structure for course ${course.id}:`, error);
              return { courseId: course.id, lessons: [] };
            }
          })
        );

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

  const normalizeLesson = (lesson) => {
    return {
      id: lesson.id,
      title: lesson.title ?? lesson.name ?? "Lesson",
      fileUrl: lesson.fileUrl ?? lesson.file_url ?? lesson.file ?? null,
      contentType: lesson.contentType ?? lesson.content_type ?? lesson.type ?? "text",
      isPreview: lesson.is_preview ?? lesson.isPreview ?? false,
    };
  };

  // Course actions
  const handleCourseClick = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleEditCourse = (course) => {
    setEditDialog({
      open: true,
      course: {
        id: course.id,
        title: course.title || "",
        description: course.description || "",
        price: course.price || 0,
      },
      loading: false,
    });
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

  // Save course edits - FIXED to use the correct endpoint
  const handleSaveCourse = async () => {
    try {
      setEditDialog(prev => ({ ...prev, loading: true }));

      const response = await axiosInstance.patch(
        `/courses/${editDialog.course.id}`,
        {
          title: editDialog.course.title,
          description: editDialog.course.description,
          price: parseFloat(editDialog.course.price),
        }
      );

      if (response.data?.success) {
        showSnackbar("Course updated successfully", "success");
        
        // Update local state
        setCourses(prev => prev.map(c => 
          c.id === editDialog.course.id 
            ? { ...c, ...response.data.course } 
            : c
        ));
        
        setEditDialog({ open: false, course: null, loading: false });
        fetchTeacherCourses(); // Refresh to get updated data
      } else {
        throw new Error(response.data?.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      
      // Provide helpful error messages
      let errorMessage = "Failed to update course";
      if (error.response?.status === 404) {
        errorMessage = "Course not found. It may have been deleted.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to edit this course";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      showSnackbar(errorMessage, "error");
      setEditDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Delete confirmation
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

  // Helper functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const getLessonIcon = (contentType) => {
    const ct = (contentType || "").toLowerCase();
    if (ct === "video") return <VideoIcon color="primary" fontSize="small" />;
    if (ct === "pdf" || ct === "file") return <PdfIcon color="secondary" fontSize="small" />;
    if (ct === "text") return <TextIcon color="action" fontSize="small" />;
    return <ArticleIcon color="action" fontSize="small" />;
  };

  const getContentTypeLabel = (contentType) => {
    const ct = (contentType || "").toLowerCase();
    if (ct === "video") return "Video";
    if (ct === "pdf") return "PDF";
    if (ct === "text") return "Text";
    if (ct === "image") return "Image";
    return contentType || "Content";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  // Debug function
  const testApiEndpoints = async () => {
    if (courses.length === 0) {
      showSnackbar("No courses to test", "warning");
      return;
    }
    
    const courseId = courses[0].id;
    console.log(`🔍 Testing API endpoints for course ID: ${courseId}`);
    
    const endpoints = [
      { name: "Update Course", url: `/courses/${courseId}`, method: "PATCH" },
      { name: "Get Course Details", url: `/courses/${courseId}`, method: "GET" },
      { name: "Teacher Full View", url: `/courses/teacher/${courseId}/full`, method: "GET" },
    ];

    const results = [];
    for (const endpoint of endpoints) {
      try {
        let response;
        if (endpoint.method === "GET") {
          response = await axiosInstance.get(endpoint.url);
        } else {
          response = await axiosInstance.patch(endpoint.url, {
            title: "Test Update",
            price: 100
          });
        }
        
        results.push({
          endpoint: `${endpoint.method} ${endpoint.url}`,
          status: "✅ Success",
          data: response.data?.success ? "Has success: true" : "No success flag"
        });
      } catch (error) {
        results.push({
          endpoint: `${endpoint.method} ${endpoint.url}`,
          status: `❌ Failed (${error.response?.status || "No response"})`,
          error: error.message
        });
      }
    }
    
    console.table(results);
    showSnackbar("API test completed. Check console.", "info");
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2, color: isDark ? "white" : "text.secondary" }}>
          Loading your courses...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={`teacher-dashboard ${isDark ? "dark-mode" : ""}`}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          📘 My Teaching Courses
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {showDebug && (
            <Button
              variant="outlined"
              onClick={testApiEndpoints}
              size="small"
              startIcon={<BugIcon />}
            >
              Test API
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<BugIcon />}
            onClick={() => setShowDebug(!showDebug)}
            size="small"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={fetchTeacherCourses}
            size="small"
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Debug Info */}
      {showDebug && (
        <Card className="debug-card" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="warning.main">
              🐛 Debug Information
            </Typography>
            <Typography variant="body2">
              Courses: {courses.length} | Total Lessons: {Object.values(lessons).reduce((sum, ls) => sum + (ls?.length || 0), 0)}
            </Typography>
            {courses.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Sample Course ID: {courses[0].id} | Slug: {courses[0].slug}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Course Creation Options */}
      <Card className="creation-options-card" sx={{ mb: 3 }}>
        <CardContent>
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
                onClick={() => navigate("/create-course")}
              >
                <Box className="creation-option-header">
                  <RocketIcon className="floating" />
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
                  <Button variant="contained" startIcon={<RocketIcon />} sx={{ mt: 2 }}>
                    Get Started
                  </Button>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                className="creation-option advanced"
                onClick={() => navigate("/create-course-advanced")}
              >
                <Box className="creation-option-header">
                  <BuildIcon className="floating" />
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
                  <Button variant="outlined" color="secondary" startIcon={<BuildIcon />} sx={{ mt: 2 }}>
                    Create Complete Course
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
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
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" paragraph>
                        {course.description || "No description available."}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                      <Chip label={formatPrice(course.price)} color="primary" variant="outlined" />
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        <Chip label={`${course.unit_count || 0} Units`} size="small" variant="outlined" />
                        <Chip label={`${lessons[course.id]?.length || 0} Lessons`} size="small" variant="outlined" />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    <Chip label={`Slug: ${course.slug}`} size="small" variant="outlined" />
                    <Chip label={`ID: ${course.id}`} size="small" variant="outlined" />
                    <Chip label={`Created: ${new Date(course.created_at).toLocaleDateString()}`} size="small" variant="outlined" />
                  </Box>

                  {/* Lessons Section */}
                  <Accordion
                    expanded={expandedCourse === course.id}
                    onChange={() => handleCourseClick(course.id)}
                    className="lessons-accordion"
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">
                        📦 Course Content ({lessons[course.id]?.length || 0} Lessons)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {lessons[course.id]?.length > 0 ? (
                        <List dense className="lessons-list">
                          {lessons[course.id].map((lesson) => {
                            const normalizedLesson = normalizeLesson(lesson);
                            const contentType = normalizedLesson.contentType?.toLowerCase();
                            const isPdf = contentType === "pdf" || contentType === "file";

                            return (
                              <ListItem key={lesson.id} className="lesson-item">
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                                  {getLessonIcon(contentType)}
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                        <Typography variant="body1" fontWeight="medium">
                                          {lesson.title}
                                        </Typography>
                                        {isPdf && normalizedLesson.fileUrl && (
                                          <PdfPreviewButton
                                            lesson={normalizedLesson}
                                            variant="teacher"
                                            size="small"
                                          />
                                        )}
                                        {lesson.is_preview && (
                                          <Chip label="Free Preview" size="small" color="success" variant="filled" />
                                        )}
                                      </Box>
                                    }
                                    secondary={
                                      <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                                        <Chip label={getContentTypeLabel(contentType)} size="small" variant="outlined" />
                                        <Chip label={`Order: ${lesson.order_index ?? lesson.orderIndex ?? 0}`} size="small" variant="outlined" />
                                        {normalizedLesson.fileUrl && (
                                          <Chip label="Has Attachment" size="small" color="info" variant="outlined" />
                                        )}
                                      </Box>
                                    }
                                  />
                                </Box>
                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    onClick={() => handleEditLesson(course.id, lesson.id)}
                                    size="small"
                                    sx={{ mr: 1 }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    edge="end"
                                    onClick={() => handleDeleteLesson(lesson, course.id)}
                                    size="small"
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                          No lessons yet. Create your first lesson!
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </CardContent>

                <CardActions className="course-actions">
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button size="small" startIcon={<SettingsIcon />} onClick={() => handleManageLessons(course.id)} variant="outlined">
                        Manage Lessons
                      </Button>
                      <Button size="small" startIcon={<AddIcon />} onClick={() => handleCreateLesson(course.id)} variant="outlined">
                        Create Lesson
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditCourse(course)} variant="outlined">
                        Edit Course
                      </Button>
                      <Button size="small" startIcon={<DeleteIcon />} onClick={() => handleDeleteCourse(course)} variant="outlined" color="error">
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Course Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, course: null, loading: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          {editDialog.course && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={editDialog.course.title}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  course: { ...prev.course, title: e.target.value }
                }))}
                margin="normal"
                required
                disabled={editDialog.loading}
              />
              
              <TextField
                fullWidth
                label="Description"
                value={editDialog.course.description}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  course: { ...prev.course, description: e.target.value }
                }))}
                margin="normal"
                multiline
                rows={3}
                disabled={editDialog.loading}
              />
              
              <TextField
                fullWidth
                label="Price ($)"
                type="number"
                value={editDialog.course.price}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  course: { ...prev.course, price: e.target.value }
                }))}
                margin="normal"
                required
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                disabled={editDialog.loading}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialog({ open: false, course: null, loading: false })}
            disabled={editDialog.loading}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCourse}
            variant="contained"
            disabled={editDialog.loading || !editDialog.course?.title}
            startIcon={editDialog.loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {editDialog.loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, course: null, lesson: null, type: null })}
      >
        <DialogTitle>
          Delete {deleteDialog.type === "course" ? "Course" : "Lesson"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {deleteDialog.type === "course" ? deleteDialog.course?.title : deleteDialog.lesson?.title}
            </strong>
            ?
          </Typography>
          {deleteDialog.type === "course" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This will permanently delete the course and all its content!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, course: null, lesson: null, type: null })} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Custom Refresh Icon component
const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

export default MyTeachingCourses;