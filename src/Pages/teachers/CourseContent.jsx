
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
//   Snackbar,
//   IconButton,
//   Tooltip,
//   Grid,
//   Paper,
// } from "@mui/material";
// import {
//   Add,
//   Description,
//   Visibility,
//   Refresh,
//   Error as ErrorIcon,
//   FolderOpen,
//   MenuBook,
//   Dashboard,
// } from "@mui/icons-material";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import UnitAccordion from "./UnitAccordion";
// import LessonForm from "./LessonForm";
// import LessonPreview from "../../components/LessonPreview";

// const CourseContent = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showLessonForm, setShowLessonForm] = useState(false);
//   const [selectedUnit, setSelectedUnit] = useState(null);
//   const [previewLesson, setPreviewLesson] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [debugMode, setDebugMode] = useState(false);
//   const [apiStatus, setApiStatus] = useState({});
//   const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

//   useEffect(() => {
//     if (courseId) {
//       console.log(`📚 CourseContent mounted with courseId: ${courseId}`);
//       fetchCourseStructure();
//     } else {
//       console.error("❌ No courseId found in URL params");
//       setError("Course ID missing in URL");
//       navigate("/teacher-dashboard");
//     }
//   }, [courseId]);

//   const showNotification = (message, severity = "info") => {
//     setNotification({ open: true, message, severity });
//   };

//   const fetchCourseStructure = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       console.log(`🔄 Fetching course structure for courseId: ${courseId}`);
      
//       // Try multiple endpoint patterns since we're seeing 401/404 issues
//       const endpoints = [
//         `/courses/teacher/${courseId}/full`,
//         `/courses/${courseId}/full`,
//         `/teacher/courses/${courseId}`,
//       ];
      
//       let response = null;
//       let usedEndpoint = '';
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Trying endpoint: ${endpoint}`);
//           const result = await axiosInstance.get(endpoint);
//           if (result.data) {
//             response = result;
//             usedEndpoint = endpoint;
//             console.log(`✅ Success with endpoint: ${endpoint}`);
//             break;
//           }
//         } catch (endpointError) {
//           console.log(`❌ Failed with ${endpoint}:`, endpointError.message);
//           continue;
//         }
//       }
      
//       if (!response) {
//         throw new Error("All course endpoints failed");
//       }
      
//       setApiStatus({
//         endpoint: usedEndpoint,
//         status: response.status,
//         timestamp: new Date().toISOString(),
//       });
      
//       const data = response.data;
      
//       if (!data.success && !data.course) {
//         throw new Error(data.error || "Invalid course data structure");
//       }
      
//       const courseData = data.course || data;
//       console.log("✅ Course data loaded:", {
//         id: courseData.id,
//         title: courseData.title,
//         units: courseData.units?.length || 0,
//         lessons: courseData.lessons?.length || 0,
//       });
      
//       // Ensure units and lessons are arrays
//       if (!Array.isArray(courseData.units)) {
//         courseData.units = [];
//       }
      
//       setCourse(courseData);
//       showNotification("Course content loaded successfully", "success");
      
//     } catch (error) {
//       console.error("❌ Error fetching course structure:", error);
      
//       let errorMessage = "Failed to load course content";
      
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.error("Response error:", error.response.status, error.response.data);
        
//         if (error.response.status === 401) {
//           errorMessage = "Authentication failed. Please log in again.";
//           showNotification(errorMessage, "error");
//           // Redirect to login after a delay
//           setTimeout(() => {
//             localStorage.removeItem("token");
//             navigate("/login", { state: { from: `/teacher/courses/${courseId}` } });
//           }, 2000);
//         } else if (error.response.status === 404) {
//           errorMessage = "Course not found. It may have been deleted or you don't have access.";
//         } else if (error.response.status === 403) {
//           errorMessage = "You don't have permission to access this course.";
//         } else if (error.response.status === 500) {
//           errorMessage = "Server error. Please try again later.";
//         }
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.error("No response received:", error.request);
//         errorMessage = "Network error. Please check your internet connection.";
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.error("Request setup error:", error.message);
//         errorMessage = error.message || "Failed to load course content";
//       }
      
//       setError(errorMessage);
//       showNotification(errorMessage, "error");
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLesson = (unit = null) => {
//     console.log(`➕ Creating lesson for ${unit ? `unit ${unit.id}` : 'course'}`);
//     setSelectedUnit(unit);
//     setShowLessonForm(true);
//   };

//   const handleLessonCreated = () => {
//     console.log("✅ Lesson created successfully");
//     setShowLessonForm(false);
//     setSelectedUnit(null);
//     showNotification("Lesson created successfully", "success");
//     fetchCourseStructure();
//   };

//   const handleLessonFormCancel = () => {
//     console.log("❌ Lesson creation cancelled");
//     setShowLessonForm(false);
//     setSelectedUnit(null);
//   };

//   const handlePreviewLesson = (lesson) => {
//     console.log("👁️ Previewing lesson:", lesson.id, lesson.title);
//     setPreviewLesson(lesson);
//     setShowPreview(true);
//   };

//   const handleRefresh = () => {
//     console.log("🔄 Manually refreshing course data");
//     fetchCourseStructure();
//     showNotification("Refreshing course data...", "info");
//   };

//   const handleDebugToggle = () => {
//     setDebugMode(!debugMode);
//     console.log(`🔧 Debug mode ${!debugMode ? 'enabled' : 'disabled'}`);
//   };

//   const handleBackToDashboard = () => {
//     navigate("/teacher-dashboard");
//   };

//   // Debug information display
//   const renderDebugInfo = () => {
//     if (!debugMode) return null;
    
//     return (
//       <Paper sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
//         <Typography variant="h6" gutterBottom>
//           Debug Information
//         </Typography>
//         <Grid container spacing={1}>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="body2">
//               <strong>Course ID:</strong> {courseId}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="body2">
//               <strong>API Status:</strong> {apiStatus.status || 'N/A'}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="body2">
//               <strong>API Endpoint:</strong> {apiStatus.endpoint || 'N/A'}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="body2">
//               <strong>Token Present:</strong> {localStorage.getItem("token") ? "Yes" : "No"}
//             </Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="body2">
//               <strong>Course Data:</strong> {course ? "Loaded" : "Not Loaded"}
//             </Typography>
//           </Grid>
//         </Grid>
//         <Box sx={{ mt: 2 }}>
//           <Button variant="outlined" size="small" onClick={handleDebugToggle}>
//             Hide Debug Info
//           </Button>
//         </Box>
//       </Paper>
//     );
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', p: 3 }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ mt: 3 }}>
//           Loading Course Content...
//         </Typography>
//         <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//           Course ID: {courseId}
//         </Typography>
//         <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
//           Please wait while we fetch your course data
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Button 
//           startIcon={<Dashboard />}
//           onClick={handleBackToDashboard}
//           sx={{ mb: 2 }}
//         >
//           Back to Dashboard
//         </Button>
        
//         <Alert 
//           severity="error" 
//           sx={{ mb: 2 }}
//           icon={<ErrorIcon />}
//         >
//           <Typography variant="h6" gutterBottom>
//             Failed to Load Course Content
//           </Typography>
//           <Typography variant="body2">
//             {error}
//           </Typography>
//         </Alert>
        
//         <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
//           <Button 
//             variant="contained" 
//             startIcon={<Refresh />}
//             onClick={handleRefresh}
//           >
//             Retry
//           </Button>
//           <Button 
//             variant="outlined"
//             onClick={handleDebugToggle}
//           >
//             {debugMode ? "Hide" : "Show"} Debug Info
//           </Button>
//         </Box>
        
//         {renderDebugInfo()}
//       </Box>
//     );
//   }

//   if (!course) {
//     return (
//       <Alert severity="warning" sx={{ m: 3 }}>
//         <Typography variant="h6">Course Not Found</Typography>
//         <Typography variant="body2">
//           The course you're trying to access doesn't exist or you don't have permission to view it.
//         </Typography>
//         <Button 
//           variant="outlined" 
//           onClick={handleBackToDashboard}
//           sx={{ mt: 1 }}
//         >
//           Return to Dashboard
//         </Button>
//       </Alert>
//     );
//   }

//   const units = course.units || [];
//   const totalLessons = units.reduce((total, unit) => total + (unit.lessons?.length || 0), 0);

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 } }}>
//       {/* Header with actions */}
//       <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
//         <CardContent>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
//             <Box>
//               <Typography variant="h4" gutterBottom>
//                 {course.title}
//               </Typography>
//               <Typography variant="body1" color="textSecondary" paragraph>
//                 {course.description || "No description available"}
//               </Typography>
//             </Box>
            
//             <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, md: 0 } }}>
//               <Tooltip title="Refresh Data">
//                 <IconButton onClick={handleRefresh} color="primary">
//                   <Refresh />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Debug Info">
//                 <IconButton onClick={handleDebugToggle} color={debugMode ? "secondary" : "default"}>
//                   <MenuBook />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>

//           {/* Stats */}
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={6} sm={3}>
//               <Paper sx={{ p: 2, textAlign: 'center' }}>
//                 <Typography variant="h5">{units.length}</Typography>
//                 <Typography variant="body2" color="textSecondary">Units</Typography>
//               </Paper>
//             </Grid>
//             <Grid item xs={6} sm={3}>
//               <Paper sx={{ p: 2, textAlign: 'center' }}>
//                 <Typography variant="h5">{totalLessons}</Typography>
//                 <Typography variant="body2" color="textSecondary">Lessons</Typography>
//               </Paper>
//             </Grid>
//           </Grid>

//           {/* Primary Actions */}
//           <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//             <Button 
//               variant="contained" 
//               startIcon={<Add />} 
//               onClick={() => handleCreateLesson()}
//             >
//               Add New Lesson
//             </Button>
            
//             {units.length === 0 && (
//               <Button 
//                 variant="outlined" 
//                 startIcon={<FolderOpen />}
//                 onClick={() => handleCreateLesson()}
//               >
//                 Create First Lesson
//               </Button>
//             )}
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Debug Info */}
//       {renderDebugInfo()}

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
//         <Card sx={{ textAlign: 'center', py: 6, border: '2px dashed #e0e0e0' }}>
//           <CardContent>
//             <Description sx={{ fontSize: 60, color: "text.secondary", mb: 2, opacity: 0.5 }} />
//             <Typography variant="h5" color="textSecondary" gutterBottom>
//               No Content Yet
//             </Typography>
//             <Typography variant="body1" color="textSecondary" paragraph>
//               Start by creating your first lesson
//             </Typography>
//             <Button 
//               variant="contained" 
//               size="large" 
//               startIcon={<Add />} 
//               onClick={() => handleCreateLesson()}
//               sx={{ mt: 2 }}
//             >
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
//                     handlePreviewLesson(lesson);
//                   }}
//                   sx={{ ml: 1 }}
//                 >
//                   Preview
//                 </Button>
//               )}
//             />
//           ))}
//         </Box>
//       )}

//       {/* Standalone Lessons Section */}
//       {units.length > 0 && (
//         <Box mt={4}>
//           <Card sx={{ borderLeft: '4px solid #2196f3' }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Typography variant="body2" color="textSecondary" paragraph>
//                 Create a lesson without assigning it to a unit, or manage existing standalone lessons.
//               </Typography>
//               <Button
//                 variant="outlined"
//                 startIcon={<Add />}
//                 onClick={() => handleCreateLesson()}
//               >
//                 Add Standalone Lesson
//               </Button>
//             </CardContent>
//           </Card>
//         </Box>
//       )}

//       {/* Lesson Preview Dialog */}
//       <LessonPreview
//         open={showPreview}
//         onClose={() => setShowPreview(false)}
//         lesson={previewLesson}
//       />

//       {/* Notification Snackbar */}
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={() => setNotification({ ...notification, open: false })}
//         message={notification.message}
//         severity={notification.severity}
//       />
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
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Snackbar,
  IconButton,
  Tooltip,
  Grid,
  Paper,
} from "@mui/material";
import {
  Add,
  Description,
  Visibility,
  Refresh,
  Error as ErrorIcon,
  FolderOpen,
  MenuBook,
  Dashboard,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import UnitAccordion from "./UnitAccordion";
import LessonForm from "./LessonForm";
import PdfPreviewButton from "../../components/PdfPreviewButton"; // Changed from LessonPreview

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    if (courseId) {
      console.log(`📚 CourseContent mounted with courseId: ${courseId}`);
      fetchCourseStructure();
    } else {
      console.error("❌ No courseId found in URL params");
      setError("Course ID missing in URL");
      navigate("/teacher-dashboard");
    }
  }, [courseId]);

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const fetchCourseStructure = async () => {
    try {
      setLoading(true);
      setError("");
      console.log(`🔄 Fetching course structure for courseId: ${courseId}`);
      
      // Try multiple endpoint patterns since we're seeing 401/404 issues
      const endpoints = [
        `/courses/teacher/${courseId}/full`,
        `/courses/${courseId}/full`,
        `/teacher/courses/${courseId}`,
      ];
      
      let response = null;
      let usedEndpoint = '';
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint}`);
          const result = await axiosInstance.get(endpoint);
          if (result.data) {
            response = result;
            usedEndpoint = endpoint;
            console.log(`✅ Success with endpoint: ${endpoint}`);
            break;
          }
        } catch (endpointError) {
          console.log(`❌ Failed with ${endpoint}:`, endpointError.message);
          continue;
        }
      }
      
      if (!response) {
        throw new Error("All course endpoints failed");
      }
      
      setApiStatus({
        endpoint: usedEndpoint,
        status: response.status,
        timestamp: new Date().toISOString(),
      });
      
      const data = response.data;
      
      if (!data.success && !data.course) {
        throw new Error(data.error || "Invalid course data structure");
      }
      
      const courseData = data.course || data;
      console.log("✅ Course data loaded:", {
        id: courseData.id,
        title: courseData.title,
        units: courseData.units?.length || 0,
        lessons: courseData.lessons?.length || 0,
      });
      
      // Ensure units and lessons are arrays
      if (!Array.isArray(courseData.units)) {
        courseData.units = [];
      }
      
      setCourse(courseData);
      showNotification("Course content loaded successfully", "success");
      
    } catch (error) {
      console.error("❌ Error fetching course structure:", error);
      
      let errorMessage = "Failed to load course content";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error:", error.response.status, error.response.data);
        
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
          showNotification(errorMessage, "error");
          // Redirect to login after a delay
          setTimeout(() => {
            localStorage.removeItem("token");
            navigate("/login", { state: { from: `/teacher/courses/${courseId}` } });
          }, 2000);
        } else if (error.response.status === 404) {
          errorMessage = "Course not found. It may have been deleted or you don't have access.";
        } else if (error.response.status === 403) {
          errorMessage = "You don't have permission to access this course.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
        errorMessage = error.message || "Failed to load course content";
      }
      
      setError(errorMessage);
      showNotification(errorMessage, "error");
      
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = (unit = null) => {
    console.log(`➕ Creating lesson for ${unit ? `unit ${unit.id}` : 'course'}`);
    setSelectedUnit(unit);
    setShowLessonForm(true);
  };

  const handleLessonCreated = () => {
    console.log("✅ Lesson created successfully");
    setShowLessonForm(false);
    setSelectedUnit(null);
    showNotification("Lesson created successfully", "success");
    fetchCourseStructure();
  };

  const handleLessonFormCancel = () => {
    console.log("❌ Lesson creation cancelled");
    setShowLessonForm(false);
    setSelectedUnit(null);
  };

  const handleRefresh = () => {
    console.log("🔄 Manually refreshing course data");
    fetchCourseStructure();
    showNotification("Refreshing course data...", "info");
  };

  const handleDebugToggle = () => {
    setDebugMode(!debugMode);
    console.log(`🔧 Debug mode ${!debugMode ? 'enabled' : 'disabled'}`);
  };

  const handleBackToDashboard = () => {
    navigate("/teacher-dashboard");
  };

  // Debug information display
  const renderDebugInfo = () => {
    if (!debugMode) return null;
    
    return (
      <Paper sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
        <Typography variant="h6" gutterBottom>
          Debug Information
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Course ID:</strong> {courseId}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>API Status:</strong> {apiStatus.status || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>API Endpoint:</strong> {apiStatus.endpoint || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Token Present:</strong> {localStorage.getItem("token") ? "Yes" : "No"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>Course Data:</strong> {course ? "Loaded" : "Not Loaded"}
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" size="small" onClick={handleDebugToggle}>
            Hide Debug Info
          </Button>
        </Box>
      </Paper>
    );
  };

  // Helper function to normalize lesson data for PdfPreviewButton
const normalizeLesson = (lesson) => {
  console.log("📝 Normalizing lesson data:", lesson);
  return {
    id: lesson.id,
    title: lesson.title || "Untitled Lesson",
    fileUrl: lesson.fileUrl || lesson.file_url || null,
    contentType: lesson.contentType || lesson.content_type,
  };
};

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', p: 3 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading Course Content...
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Course ID: {courseId}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          Please wait while we fetch your course data
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button 
          startIcon={<Dashboard />}
          onClick={handleBackToDashboard}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          icon={<ErrorIcon />}
        >
          <Typography variant="h6" gutterBottom>
            Failed to Load Course Content
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Retry
          </Button>
          <Button 
            variant="outlined"
            onClick={handleDebugToggle}
          >
            {debugMode ? "Hide" : "Show"} Debug Info
          </Button>
        </Box>
        
        {renderDebugInfo()}
      </Box>
    );
  }

  if (!course) {
    return (
      <Alert severity="warning" sx={{ m: 3 }}>
        <Typography variant="h6">Course Not Found</Typography>
        <Typography variant="body2">
          The course you're trying to access doesn't exist or you don't have permission to view it.
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleBackToDashboard}
          sx={{ mt: 1 }}
        >
          Return to Dashboard
        </Button>
      </Alert>
    );
  }

  const units = course.units || [];
  const totalLessons = units.reduce((total, unit) => total + (unit.lessons?.length || 0), 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header with actions */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {course.description || "No description available"}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, md: 0 } }}>
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Debug Info">
                <IconButton onClick={handleDebugToggle} color={debugMode ? "secondary" : "default"}>
                  <MenuBook />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5">{units.length}</Typography>
                <Typography variant="body2" color="textSecondary">Units</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5">{totalLessons}</Typography>
                <Typography variant="body2" color="textSecondary">Lessons</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Primary Actions */}
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => handleCreateLesson()}
            >
              Add New Lesson
            </Button>
            
            {units.length === 0 && (
              <Button 
                variant="outlined" 
                startIcon={<FolderOpen />}
                onClick={() => handleCreateLesson()}
              >
                Create First Lesson
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Debug Info */}
      {renderDebugInfo()}

      {/* Lesson Form */}
      {showLessonForm && (
        <LessonForm
          courseId={course.id}
          unitId={selectedUnit?.id}
          onSuccess={handleLessonCreated}
          onCancel={handleLessonFormCancel}
        />
      )}

      {/* Units */}
      {units.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, border: '2px dashed #e0e0e0' }}>
          <CardContent>
            <Description sx={{ fontSize: 60, color: "text.secondary", mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" color="textSecondary" gutterBottom>
              No Content Yet
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Start by creating your first lesson
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<Add />} 
              onClick={() => handleCreateLesson()}
              sx={{ mt: 2 }}
            >
              Create First Lesson
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {units.map((unit) => (
            <UnitAccordion
              key={unit.id}
              unit={unit}
              onAddLesson={() => handleCreateLesson(unit)}
              onLessonUpdate={fetchCourseStructure}
              previewButton={(lesson) => {
                const normalizedLesson = normalizeLesson(lesson);
                // Only show PDF preview button if it's a PDF lesson
                if (normalizedLesson.fileUrl && (normalizedLesson.contentType === 'pdf' || normalizedLesson.contentType === 'file')) {
                  return (
                    <PdfPreviewButton
                      lesson={normalizedLesson}
                      variant="teacher"
                      size="small"
                      style={{ marginLeft: '8px', marginRight: '8px' }}
                    />
                  );
                } else {
                  // For non-PDF lessons, show a disabled preview button
                  return (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled
                      style={{ marginLeft: '8px', marginRight: '8px', opacity: 0.7 }}
                    >
                      Preview Not Available
                    </Button>
                  );
                }
              }}
            />
          ))}
        </Box>
      )}

      {/* Standalone Lessons Section */}
      {units.length > 0 && (
        <Box mt={4}>
          <Card sx={{ borderLeft: '4px solid #2196f3' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Create a lesson without assigning it to a unit, or manage existing standalone lessons.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => handleCreateLesson()}
              >
                Add Standalone Lesson
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
        severity={notification.severity}
      />
    </Box>
  );
};

export default CourseContent;