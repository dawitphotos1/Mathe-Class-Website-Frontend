
// src/pages/teachers/CourseContent.jsx - COMPLETE FIXED VERSION
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
  Refresh,
  Error as ErrorIcon,
  FolderOpen,
  MenuBook,
  Dashboard,
  BugReport,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';
import UnitAccordion from "./UnitAccordion";
import LessonForm from "./LessonForm";
import PdfPreviewButton from "../../components/PdfPreviewButton";

// Debug import
console.log('🔧 CourseContent - UnitAccordion import:', UnitAccordion);
console.log('🔧 CourseContent - typeof UnitAccordion:', typeof UnitAccordion);

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
    console.log('🔧 CourseContent mounted with courseId:', courseId);
    if (courseId) {
      fetchCourseStructure();
    } else {
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
      console.log('🔄 Fetching course structure for courseId:', courseId);
      
      const response = await axiosInstance.get(`/courses/teacher/${courseId}/full`);
      
      setApiStatus({
        endpoint: `/courses/teacher/${courseId}/full`,
        status: response.status,
        timestamp: new Date().toISOString(),
      });
      
      const data = response.data;
      const courseData = data.course || data;
      
      if (!Array.isArray(courseData.units)) {
        courseData.units = [];
      }
      
      console.log('✅ Course data loaded, units:', courseData.units?.length || 0);
      setCourse(courseData);
      showNotification("Course content loaded", "success");
      
    } catch (error) {
      console.error("❌ Error fetching course structure:", error);
      let errorMessage = "Failed to load course content";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed";
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      } else if (error.response?.status === 404) {
        errorMessage = "Course not found";
      }
      
      setError(errorMessage);
      showNotification(errorMessage, "error");
      
    } finally {
      setLoading(false);
    }
  };

  const normalizeLesson = (lesson) => {
    const fileUrl = 
      lesson.fileUrl || 
      lesson.file_url || 
      lesson.file ||
      (lesson.uploads && lesson.uploads.fileUrl) ||
      null;
    
    const contentType = 
      lesson.contentType || 
      lesson.content_type || 
      (fileUrl ? (fileUrl.includes('.pdf') ? 'pdf' : 'file') : 'text');
    
    return {
      id: lesson.id,
      title: lesson.title || "Untitled Lesson",
      fileUrl: fileUrl,
      contentType: contentType.toLowerCase(),
      content_type: contentType.toLowerCase(),
      file_url: fileUrl,
    };
  };

  const handleCreateLesson = (unit = null) => {
    setSelectedUnit(unit);
    setShowLessonForm(true);
  };

  const handleLessonCreated = () => {
    setShowLessonForm(false);
    setSelectedUnit(null);
    showNotification("Lesson created", "success");
    fetchCourseStructure();
  };

  const handleLessonFormCancel = () => {
    setShowLessonForm(false);
    setSelectedUnit(null);
  };

  const handleRefresh = () => {
    fetchCourseStructure();
    showNotification("Refreshing...", "info");
  };

  const handleDebugToggle = () => {
    setDebugMode(!debugMode);
  };

  const handleBackToDashboard = () => {
    navigate("/teacher-dashboard");
  };

  const renderDebugInfo = () => {
    if (!debugMode) return null;
    
    return (
      <Paper sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
        <Typography variant="h6" gutterBottom>
          🔧 Debug Information
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
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>Course Data:</strong> {course ? "Loaded" : "Not Loaded"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>UnitAccordion Component:</strong> {typeof UnitAccordion}
            </Typography>
          </Grid>
        </Grid>
        
        {course?.units?.[0]?.lessons?.[0] && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f4fd', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              📖 Sample Lesson Data (First lesson in first unit):
            </Typography>
            <Typography variant="body2" component="div" sx={{ 
              fontSize: '12px', 
              overflow: 'auto', 
              maxHeight: '200px',
              backgroundColor: '#f8f9fa',
              p: 1,
              borderRadius: 1,
              fontFamily: 'monospace'
            }}>
              {JSON.stringify(course.units[0].lessons[0], null, 2)}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={handleDebugToggle}>
            Hide Debug Info
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => {
              console.log("📊 Course data:", course);
              console.log("🔍 UnitAccordion:", UnitAccordion);
            }}
            startIcon={<BugReport />}
          >
            Log Data to Console
          </Button>
        </Box>
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', p: 3 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading Course Content...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<Dashboard />} onClick={handleBackToDashboard} sx={{ mb: 2 }}>
          Back to Dashboard
        </Button>
        
        <Alert severity="error" sx={{ mb: 2 }} icon={<ErrorIcon />}>
          <Typography variant="h6" gutterBottom>
            Failed to Load Course Content
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<Refresh />} onClick={handleRefresh}>
            Retry
          </Button>
          <Button variant="outlined" onClick={handleDebugToggle}>
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
        <Button variant="outlined" onClick={handleBackToDashboard} sx={{ mt: 1 }}>
          Return to Dashboard
        </Button>
      </Alert>
    );
  }

  const units = course.units || [];
  const totalLessons = units.reduce((total, unit) => total + (unit.lessons?.length || 0), 0);

  console.log('🔧 CourseContent rendering, units:', units.length);

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

      {/* Units - This is where UnitAccordion is rendered */}
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
                
                const isPdf = normalizedLesson.fileUrl && 
                  (normalizedLesson.contentType === 'pdf' || 
                   normalizedLesson.contentType === 'file' ||
                   (normalizedLesson.fileUrl && normalizedLesson.fileUrl.includes('.pdf')));
                
                if (isPdf) {
                  return (
                    <PdfPreviewButton
                      lesson={normalizedLesson}
                      variant="teacher"
                      size="small"
                      style={{ 
                        marginLeft: '8px', 
                        marginRight: '8px',
                        minWidth: '120px'
                      }}
                    />
                  );
                } else {
                  return (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled
                      sx={{ 
                        marginLeft: '8px', 
                        marginRight: '8px', 
                        opacity: 0.7,
                        minWidth: '120px'
                      }}
                      title={normalizedLesson.fileUrl ? "Preview not available for this file type" : "No file attached"}
                    >
                      {normalizedLesson.fileUrl ? "No Preview" : "No File"}
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
      >
        <Alert 
          severity={notification.severity} 
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// ✅ MUST HAVE THIS EXPORT - YOU WERE MISSING THIS!
export default CourseContent;