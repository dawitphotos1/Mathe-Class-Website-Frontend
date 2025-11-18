// // src/pages/teachers/ManageLessons.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
//   CircularProgress,
//   Chip,
//   Alert,
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   ArrowBack as ArrowBackIcon,
//   VideoLibrary as VideoIcon,
//   Article as ArticleIcon,
//   PictureAsPdf as PdfIcon,
//   TextSnippet as TextIcon,
// } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";

// const ManageLessons = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
  
//   const [course, setCourse] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCourseAndLessons();
//   }, [courseId]);

//   const fetchCourseAndLessons = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch course details
//       const courseResponse = await axiosInstance.get(`/courses/id/${courseId}`);
//       if (courseResponse.data?.success) {
//         setCourse(courseResponse.data.course);
//       }

//       // Fetch lessons
//       const lessonsResponse = await axiosInstance.get(`/courses/${courseId}/lessons`);
//       if (lessonsResponse.data?.success) {
//         setLessons(lessonsResponse.data.lessons || []);
//       }
//     } catch (error) {
//       console.error("Error fetching course and lessons:", error);
//       toast.error("Failed to load course data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditLesson = (lessonId) => {
//     navigate(`/lessons/${lessonId}/edit`);
//   };

//   const handleDeleteLesson = async (lessonId) => {
//     if (!window.confirm("Are you sure you want to delete this lesson?")) {
//       return;
//     }

//     try {
//       await axiosInstance.delete(`/lessons/${lessonId}`);
//       toast.success("Lesson deleted successfully");
//       setLessons(lessons.filter(lesson => lesson.id !== lessonId));
//     } catch (error) {
//       console.error("Error deleting lesson:", error);
//       toast.error("Failed to delete lesson");
//     }
//   };

//   const handleCreateLesson = () => {
//     navigate(`/courses/${courseId}/lessons/new`);
//   };

//   const getLessonIcon = (contentType) => {
//     switch (contentType) {
//       case "video":
//         return <VideoIcon color="primary" fontSize="small" />;
//       case "pdf":
//         return <PdfIcon color="secondary" fontSize="small" />;
//       case "text":
//         return <TextIcon color="action" fontSize="small" />;
//       default:
//         return <ArticleIcon color="action" fontSize="small" />;
//     }
//   };

//   const getContentTypeLabel = (contentType) => {
//     switch (contentType) {
//       case "video":
//         return "Video";
//       case "pdf":
//         return "PDF";
//       case "text":
//         return "Text";
//       default:
//         return contentType || "Content";
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
//         <IconButton onClick={() => navigate("/teacher-dashboard")}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Box>
//           <Typography variant="h4" gutterBottom>
//             📚 Manage Lessons
//           </Typography>
//           {course && (
//             <Typography variant="h6" color="textSecondary">
//               {course.title}
//             </Typography>
//           )}
//         </Box>
//       </Box>

//       {/* Actions */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <Typography variant="h6">
//               Lessons ({lessons.length})
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={handleCreateLesson}
//             >
//               Create New Lesson
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Lessons List */}
//       {lessons.length === 0 ? (
//         <Alert severity="info">
//           No lessons found. Create your first lesson to get started!
//         </Alert>
//       ) : (
//         <Card>
//           <CardContent>
//             <List>
//               {lessons.map((lesson) => (
//                 <ListItem key={lesson.id} divider>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
//                     {getLessonIcon(lesson.content_type)}
//                     <ListItemText
//                       primary={
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                           <Typography variant="body1" fontWeight="medium">
//                             {lesson.title}
//                           </Typography>
//                           {lesson.is_preview && (
//                             <Chip
//                               label="Free Preview"
//                               size="small"
//                               color="success"
//                               variant="outlined"
//                             />
//                           )}
//                         </Box>
//                       }
//                       secondary={
//                         <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
//                           <Chip
//                             label={getContentTypeLabel(lesson.content_type)}
//                             size="small"
//                             variant="outlined"
//                           />
//                           <Chip
//                             label={`Order: ${lesson.order_index}`}
//                             size="small"
//                             variant="outlined"
//                           />
//                         </Box>
//                       }
//                     />
//                   </Box>
//                   <ListItemSecondaryAction>
//                     <IconButton
//                       onClick={() => handleEditLesson(lesson.id)}
//                       sx={{ mr: 1 }}
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDeleteLesson(lesson.id)}
//                       color="error"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </ListItemSecondaryAction>
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default ManageLessons;




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import courseService from "../../services/courseService";
import lessonService from "../../services/lessonService";
import CourseContent from "../../components/Teacher/CourseContent";

const ManageLessons = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ USING THE COURSE SERVICE
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await courseService.getTeacherCourseFull(courseId);

      if (response.success) {
        setCourse(response.course);
        console.log("✅ Loaded course data:", response.course);
      } else {
        throw new Error(response.error || "Failed to load course");
      }
    } catch (error) {
      console.error("❌ Error fetching course:", error);
      setError(
        error.response?.data?.error || error.message || "Failed to load course"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading course content...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to="/teacher-dashboard"
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Course not found</Alert>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to="/teacher-dashboard"
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBack />}
            component={Link}
            to="/teacher-dashboard"
            sx={{ mb: 2 }}
          >
            Back to Courses
          </Button>
          <Typography variant="h3" component="h1" gutterBottom>
            Manage Lessons: {course.title}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Organize and manage your course content
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to={`/courses/${courseId}/lessons/new`}
        >
          Add New Lesson
        </Button>
      </Box>

      {/* Course Content */}
      <CourseContent course={course} onContentUpdate={fetchCourseData} />
    </Container>
  );
};

export default ManageLessons;