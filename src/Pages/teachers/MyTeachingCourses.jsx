// //src/pages/teachers/MyTeachingCourses.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import ConfirmModal from "../../components/ConfirmModal";
// import "./MyTeachingCourses.css";

// const normalizeUrl = (url) => url?.replace(/^\/uploads/i, "/Uploads");

// const MyTeachingCourses = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [courses, setCourses] = useState([]);
//   const [courseLessons, setCourseLessons] = useState({});
//   const [expandedUnits, setExpandedUnits] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [modal, setModal] = useState({ show: false });
//   const [pdfPreview, setPdfPreview] = useState(null);
//   const [renaming, setRenaming] = useState({});
//   const [editingName, setEditingName] = useState({});

//   // Dark mode preference
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("darkMode");
//     if (savedTheme) setDarkMode(JSON.parse(savedTheme));
//   }, []);
//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode((prev) => !prev);

//   // Fetch lessons per course
//   const fetchLessonsForCourse = async (courseId) => {
//     try {
//       const res = await axiosInstance.get(`/courses/${courseId}/lessons`);
//       if (Array.isArray(res.data.lessons)) {
//         return [{ unitName: "Ungrouped Lessons", lessons: res.data.lessons }];
//       }
//       return [];
//     } catch (err) {
//       console.error(`❌ Failed to fetch lessons for course ${courseId}:`, err);
//       return [];
//     }
//   };

//   // Fetch all teacher courses
//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get("/courses");
//       if (res.data.success && Array.isArray(res.data.courses)) {
//         setCourses(res.data.courses);

//         const lessonsMap = {};
//         for (const course of res.data.courses) {
//           const units = await fetchLessonsForCourse(course.id);
//           lessonsMap[course.id] = units;
//         }
//         setCourseLessons(lessonsMap);

//         const expandedMap = {};
//         Object.keys(lessonsMap).forEach((courseId) => {
//           lessonsMap[courseId].forEach((unit) => {
//             expandedMap[`${courseId}-${unit.unitName}`] = true;
//           });
//         });
//         setExpandedUnits(expandedMap);
//       } else {
//         setCourses([]);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching courses:", err);
//       toast.error("❌ Failed to fetch courses");
//       setCourses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//     const handleFocus = () => fetchCourses();
//     window.addEventListener("focus", handleFocus);

//     if (location.state?.refresh) {
//       fetchCourses();
//       window.history.replaceState({}, document.title);
//     }

//     return () => window.removeEventListener("focus", handleFocus);
//   }, []);

//   const deleteCourse = (courseId) => {
//     setModal({
//       show: true,
//       title: "Delete Course",
//       message: "Are you sure you want to delete this course and its lessons?",
//       onConfirm: async () => {
//         try {
//           await axiosInstance.delete(`/courses/${courseId}`);
//           toast.success("✅ Course deleted");
//           setCourses((prev) => prev.filter((c) => c.id !== courseId));
//         } catch {
//           toast.error("❌ Failed to delete course");
//         } finally {
//           setModal({ show: false });
//         }
//       },
//     });
//   };

//   const deleteLesson = (lessonId) => {
//     setModal({
//       show: true,
//       title: "Delete Lesson",
//       message: "Are you sure you want to delete this lesson?",
//       onConfirm: async () => {
//         try {
//           await axiosInstance.delete(`/lessons/${lessonId}`);
//           toast.success("✅ Lesson deleted");
//           fetchCourses();
//         } catch {
//           toast.error("❌ Failed to delete lesson");
//         } finally {
//           setModal({ show: false });
//         }
//       },
//     });
//   };

//   const toggleUnit = (courseId, unitName) => {
//     setExpandedUnits((prev) => ({
//       ...prev,
//       [`${courseId}-${unitName}`]: !prev[`${courseId}-${unitName}`],
//     }));
//   };

//   return (
//     <div className={`my-teaching-courses ${darkMode ? "dark" : ""}`}>
//       <div className="theme-toggle">
//         <button onClick={toggleTheme}>
//           {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
//         </button>
//       </div>

//       <h2>📘 My Teaching Courses</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : courses.length === 0 ? (
//         <p>No courses found.</p>
//       ) : (
//         <div className="course-grid">
//           {courses.map((course) => (
//             <div key={course.id} className="course-card">
//               <h3>{course.title}</h3>
//               <p>{course.description || "No description available."}</p>

//               {/* Lessons */}
//               {courseLessons[course.id]?.length > 0 ? (
//                 <div className="lesson-list">
//                   {courseLessons[course.id].map((unit) => {
//                     const key = `${course.id}-${unit.unitName}`;
//                     return (
//                       <div key={key} className="unit-section">
//                         <h4
//                           onClick={() => toggleUnit(course.id, unit.unitName)}
//                           style={{ cursor: "pointer" }}
//                         >
//                           📦 {unit.unitName} {expandedUnits[key] ? "🔽" : "▶️"}
//                         </h4>
//                         {expandedUnits[key] &&
//                           unit.lessons.map((lesson) => (
//                             <div key={lesson.id} className="lesson-item">
//                               <strong>{lesson.title}</strong> —{" "}
//                               {lesson.contentType}
//                               <button
//                                 onClick={() =>
//                                   navigate(
//                                     `/courses/${course.id}/lessons/${lesson.id}/edit`
//                                   )
//                                 }
//                               >
//                                 📝 Edit
//                               </button>
//                               <button onClick={() => deleteLesson(lesson.id)}>
//                                 🗑️ Delete
//                               </button>
//                             </div>
//                           ))}
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <p style={{ fontStyle: "italic" }}>📭 No lessons yet.</p>
//               )}

//               <div className="course-actions">
//                 <Link to={`/courses/${course.id}/manage-lessons`}>
//                   <button>🛠 Manage Lessons</button>
//                 </Link>
//                 <Link to={`/courses/${course.id}/lessons/new`}>
//                   <button>➕ Create Lesson</button>
//                 </Link>
//                 <Link to={`/courses/${course.id}/edit`}>
//                   <button>✏️ Edit Course</button>
//                 </Link>
//                 <button onClick={() => deleteCourse(course.id)}>
//                   🗑️ Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {modal.show && (
//         <ConfirmModal
//           title={modal.title}
//           message={modal.message}
//           onConfirm={modal.onConfirm}
//           onCancel={() => setModal({ show: false })}
//         />
//       )}
//     </div>
//   );
// };

// export default MyTeachingCourses;






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
  Folder as FolderIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
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

      {courses.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No courses found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              You haven't created any courses yet.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/create-course"
              startIcon={<AddIcon />}
            >
              Create Your First Course
            </Button>
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

                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
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

      {/* Create Course Button */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          component={Link}
          to="/create-course"
          startIcon={<AddIcon />}
          size="large"
        >
          Create New Course
        </Button>
      </Box>

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