// // src/pages/teachers/CourseContent.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Chip,
// } from "@mui/material";
// import { Add, Description, Visibility } from "@mui/icons-material";
// import { useParams, useNavigate } from "react-router-dom";
// import courseService from "../../services/courseService";
// import UnitAccordion from "./UnitAccordion";
// import LessonForm from "./LessonForm";

// const CourseContent = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showLessonForm, setShowLessonForm] = useState(false);
//   const [selectedUnit, setSelectedUnit] = useState(null);

//   useEffect(() => {
//     if (courseId) fetchCourseStructure();
//   }, [courseId]);

//   const fetchCourseStructure = async () => {
//     try {
//       setLoading(true);
//       const response = await courseService.getTeacherCourseFull(courseId);

//       if (!response.success) throw new Error(response.error);

//       setCourse(response.course);
//     } catch (error) {
//       setError(error.message || "Failed to load course content");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLesson = (unit = null) => {
//     setSelectedUnit(unit);
//     setShowLessonForm(true);
//   };

//   const handleLessonCreated = () => {
//     setShowLessonForm(false);
//     setSelectedUnit(null);
//     fetchCourseStructure();
//   };

//   const handleLessonFormCancel = () => {
//     setShowLessonForm(false);
//     setSelectedUnit(null);
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return <Alert severity="error">{error}</Alert>;
//   }

//   if (!course) {
//     return <Alert severity="warning">Course not found</Alert>;
//   }

//   const units = course.units || [];

//   return (
//     <Box>
//       {/* Course Header */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h4">{course.title}</Typography>
//           <Typography variant="body1" color="textSecondary">
//             {course.description}
//           </Typography>

//           <Box display="flex" gap={1} mt={1}>
//             <Chip label={`${units.length} Units`} variant="outlined" size="small" />
//             <Chip
//               label={`${units.reduce(
//                 (total, unit) => total + (unit.lessons?.length || 0),
//                 0
//               )} Lessons`}
//               variant="outlined"
//               size="small"
//             />
//           </Box>

//           <Button variant="contained" startIcon={<Add />} onClick={() => handleCreateLesson()} sx={{ mt: 2 }}>
//             Add Lesson
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Lesson Form */}
//       {showLessonForm && (
//         <LessonForm
//           courseId={course.id}
//           unitId={selectedUnit?.id}
//           onSuccess={handleLessonCreated}
//           onCancel={handleLessonFormCancel}
//         />
//       )}

//       {/* Units */}
//       {units.length === 0 ? (
//         <Card>
//           <CardContent sx={{ textAlign: "center", py: 4 }}>
//             <Description sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
//             <Typography variant="h6">No Content Yet</Typography>
//             <Button variant="contained" startIcon={<Add />} onClick={() => handleCreateLesson()} sx={{ mt: 2 }}>
//               Create First Lesson
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <Box>
//           {units.map((unit) => (
//             <UnitAccordion
//               key={unit.id}
//               unit={unit}
//               onAddLesson={() => handleCreateLesson(unit)}
//               onLessonUpdate={fetchCourseStructure}
//               previewButton={(lesson) => (
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<Visibility />}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/lessons/${lesson.id}/preview`);
//                   }}
//                 >
//                   Preview
//                 </Button>
//               )}
//             />
//           ))}
//         </Box>
//       )}

//       {/* Standalone Lessons */}
//       <Box mt={4}>
//         <Typography variant="h6">Additional Lessons</Typography>

//         <Button
//           variant="outlined"
//           startIcon={<Add />}
//           onClick={() => handleCreateLesson()}
//           sx={{ mt: 1 }}
//         >
//           Add Standalone Lesson
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CourseContent;




// src/pages/teachers/CourseContent.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VideoLibrary as VideoIcon,
  PictureAsPdf as PdfIcon,
  TextFields as TextIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import LessonPreview from "../../components/LessonPreview";
import { toast } from "react-toastify";

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [units, setUnits] = useState([]);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [dialogMode, setDialogMode] = useState("create"); // 'create' or 'edit'
  
  // Form state
  const [form, setForm] = useState({
    title: "",
    content: "",
    content_type: "text",
    file_url: "",
    video_url: "",
    unit_id: "",
    order_index: 0,
    is_preview: false,
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseRes = await axiosInstance.get(`/courses/${courseId}`);
      setCourse(courseRes.data.course || courseRes.data);
      
      // Fetch lessons for this course
      const lessonsRes = await axiosInstance.get(`/lessons/course/${courseId}/all`);
      setLessons(lessonsRes.data.lessons || []);
      
      // Fetch units for this course
      const unitsRes = await axiosInstance.get(`/units/course/${courseId}`);
      setUnits(unitsRes.data.units || []);
      
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error("Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setForm({
      title: "",
      content: "",
      content_type: "text",
      file_url: "",
      video_url: "",
      unit_id: "",
      order_index: lessons.length,
      is_preview: false,
    });
    setDialogMode("create");
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (lesson) => {
    setForm({
      title: lesson.title,
      content: lesson.textContent || lesson.content || "",
      content_type: lesson.contentType || lesson.content_type || "text",
      file_url: lesson.fileUrl || lesson.file_url || "",
      video_url: lesson.videoUrl || lesson.video_url || "",
      unit_id: lesson.unitId || lesson.unit_id || "",
      order_index: lesson.orderIndex || lesson.order_index || 0,
      is_preview: lesson.isPreview || lesson.is_preview || false,
    });
    setDialogMode("edit");
    setSelectedLesson(lesson);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLesson(null);
  };

  const handlePreview = (lesson) => {
    setSelectedLesson(lesson);
    setOpenPreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (dialogMode === "create") {
        await axiosInstance.post(`/lessons/course/${courseId}/lessons`, form);
        toast.success("Lesson created successfully");
      } else {
        await axiosInstance.put(`/lessons/${selectedLesson.id}`, form);
        toast.success("Lesson updated successfully");
      }
      
      handleCloseDialog();
      fetchCourseData(); // Refresh data
      
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error(error.response?.data?.error || "Failed to save lesson");
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    
    try {
      await axiosInstance.delete(`/lessons/${lessonId}`);
      toast.success("Lesson deleted successfully");
      fetchCourseData(); // Refresh data
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    }
  };

  const handleReorder = async (lessonId, direction) => {
    try {
      // Find the lesson
      const lessonIndex = lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex === -1) return;
      
      const targetIndex = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
      if (targetIndex < 0 || targetIndex >= lessons.length) return;
      
      // Swap order_index
      const updatedLessons = [...lessons];
      const temp = updatedLessons[lessonIndex].orderIndex || updatedLessons[lessonIndex].order_index;
      updatedLessons[lessonIndex].orderIndex = updatedLessons[targetIndex].orderIndex || updatedLessons[targetIndex].order_index;
      updatedLessons[targetIndex].orderIndex = temp;
      
      // Update in database
      await axiosInstance.put(`/lessons/${lessonId}`, {
        order_index: updatedLessons[lessonIndex].orderIndex
      });
      
      await axiosInstance.put(`/lessons/${updatedLessons[targetIndex].id}`, {
        order_index: updatedLessons[targetIndex].orderIndex
      });
      
      setLessons(updatedLessons.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));
      toast.success("Lesson order updated");
      
    } catch (error) {
      console.error("Error reordering lesson:", error);
      toast.error("Failed to update lesson order");
    }
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <VideoIcon color="error" />;
      case "pdf":
        return <PdfIcon color="secondary" />;
      default:
        return <TextIcon color="primary" />;
    }
  };

  const groupLessonsByUnit = () => {
    const grouped = {};
    
    // Add unassigned lessons
    grouped.unassigned = lessons.filter(lesson => !lesson.unitId && !lesson.unit_id);
    
    // Group by unit
    units.forEach(unit => {
      grouped[unit.id] = lessons.filter(lesson => 
        lesson.unitId === unit.id || lesson.unit_id === unit.id
      );
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const groupedLessons = groupLessonsByUnit();

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {course?.title || "Course Content"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage lessons and units for this course
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Add New Lesson
        </Button>
      </Box>

      {/* Lessons List */}
      <Box>
        {/* Unassigned Lessons */}
        {groupedLessons.unassigned && groupedLessons.unassigned.length > 0 && (
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Unassigned Lessons
            </Typography>
            <Card variant="outlined">
              <List>
                {groupedLessons.unassigned.map((lesson, index) => (
                  <React.Fragment key={lesson.id}>
                    <ListItem>
                      <Box display="flex" alignItems="center" mr={2}>
                        {getContentIcon(lesson.contentType || lesson.content_type)}
                      </Box>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="body1">
                              {lesson.title}
                            </Typography>
                            {lesson.isPreview || lesson.is_preview ? (
                              <Chip
                                label="Preview"
                                color="success"
                                size="small"
                                sx={{ ml: 2 }}
                              />
                            ) : null}
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            Order: {lesson.orderIndex || lesson.order_index || 0} • 
                            Type: {lesson.contentType || lesson.content_type || "text"}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(lesson)}
                          title="Preview"
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(lesson)}
                          title="Edit"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(lesson.id)}
                          title="Delete"
                          sx={{ mr: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleReorder(lesson.id, "up")}
                          title="Move Up"
                          disabled={index === 0}
                          sx={{ mr: 1 }}
                        >
                          <ArrowUpIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleReorder(lesson.id, "down")}
                          title="Move Down"
                          disabled={index === groupedLessons.unassigned.length - 1}
                        >
                          <ArrowDownIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < groupedLessons.unassigned.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Box>
        )}

        {/* Lessons by Unit */}
        {units.map(unit => (
          groupedLessons[unit.id] && groupedLessons[unit.id].length > 0 && (
            <Box key={unit.id} mb={4}>
              <Typography variant="h6" gutterBottom>
                {unit.title}
              </Typography>
              <Card variant="outlined">
                <List>
                  {groupedLessons[unit.id].map((lesson, index) => (
                    <React.Fragment key={lesson.id}>
                      <ListItem>
                        <Box display="flex" alignItems="center" mr={2}>
                          {getContentIcon(lesson.contentType || lesson.content_type)}
                        </Box>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <Typography variant="body1">
                                {lesson.title}
                              </Typography>
                              {lesson.isPreview || lesson.is_preview ? (
                                <Chip
                                  label="Preview"
                                  color="success"
                                  size="small"
                                  sx={{ ml: 2 }}
                                />
                              ) : null}
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              Order: {lesson.orderIndex || lesson.order_index || 0} • 
                              Type: {lesson.contentType || lesson.content_type || "text"}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handlePreview(lesson)}
                            title="Preview"
                            sx={{ mr: 1 }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditDialog(lesson)}
                            title="Edit"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(lesson.id)}
                            title="Delete"
                            sx={{ mr: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleReorder(lesson.id, "up")}
                            title="Move Up"
                            disabled={index === 0}
                            sx={{ mr: 1 }}
                          >
                            <ArrowUpIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleReorder(lesson.id, "down")}
                            title="Move Down"
                            disabled={index === groupedLessons[unit.id].length - 1}
                          >
                            <ArrowDownIcon />
                        </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < groupedLessons[unit.id].length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            </Box>
          )
        ))}

        {lessons.length === 0 && (
          <Alert severity="info">
            No lessons found. Click "Add New Lesson" to create your first lesson.
          </Alert>
        )}
      </Box>

      {/* Create/Edit Lesson Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === "create" ? "Create New Lesson" : "Edit Lesson"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              margin="normal"
              required
            />
            
            <TextField
              select
              fullWidth
              label="Content Type"
              value={form.content_type}
              onChange={(e) => setForm({ ...form, content_type: e.target.value })}
              margin="normal"
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="pdf">PDF/File</MenuItem>
            </TextField>
            
            {form.content_type === "text" && (
              <TextField
                fullWidth
                label="Content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                margin="normal"
                multiline
                rows={4}
              />
            )}
            
            {form.content_type === "video" && (
              <TextField
                fullWidth
                label="Video URL"
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                margin="normal"
                placeholder="https://example.com/video.mp4"
              />
            )}
            
            {form.content_type === "pdf" && (
              <TextField
                fullWidth
                label="File URL"
                value={form.file_url}
                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                margin="normal"
                placeholder="URL to PDF or file"
              />
            )}
            
            <TextField
              select
              fullWidth
              label="Unit (Optional)"
              value={form.unit_id}
              onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
              margin="normal"
            >
              <MenuItem value="">None (Unassigned)</MenuItem>
              {units.map(unit => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.title}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              type="number"
              label="Order Index"
              value={form.order_index}
              onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
              margin="normal"
              InputProps={{ inputProps: { min: 0 } }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.is_preview}
                  onChange={(e) => setForm({ ...form, is_preview: e.target.checked })}
                />
              }
              label="Make this a free preview lesson"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {dialogMode === "create" ? "Create" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Lesson Preview Dialog */}
      <LessonPreview
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        lesson={selectedLesson}
      />
    </Box>
  );
};

export default CourseContent;