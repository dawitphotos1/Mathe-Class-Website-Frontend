
// src/pages/PreviewLessonPage.jsx - UPDATED WITH BETTER COURSE ID HANDLING
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import PdfViewer from "../components/PdfViewer";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  School,
  Download,
  OpenInNew,
  VideoLibrary,
  Description,
  MenuBook,
} from "@mui/icons-material";
import "./PreviewLessonPage.css";

const PreviewLessonPage = () => {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("🔍 Preview Page Loaded:", {
      lessonId,
      courseId,
      userRole: user?.role,
      locationState: location.state,
      path: location.pathname,
    });
  }, [lessonId, courseId, user, location]);

  useEffect(() => {
    if (lessonId) {
      fetchPreviewLesson();
    } else {
      setError("No lesson ID provided");
      setLoading(false);
    }
  }, [lessonId]);

  const fetchPreviewLesson = async () => {
    try {
      setLoading(true);
      setError("");

      // Determine which API endpoint to use
      let apiUrl = "";
      
      if (lessonId) {
        // Direct lesson preview (from Courses.jsx "Free Preview" button)
        apiUrl = `/lessons/public-preview/${lessonId}`;
        console.log(`📥 Fetching direct lesson preview: ${lessonId}`);
      } else if (courseId) {
        // Course-level preview (from course page)
        apiUrl = `/courses/${courseId}/preview-lesson`;
        console.log(`📥 Fetching course preview for course ID: ${courseId}`);
      } else {
        throw new Error("No valid identifier provided");
      }

      const response = await axiosInstance.get(apiUrl);

      if (response.data.success) {
        const { lesson: lessonData, course: courseData } = response.data;
        
        console.log("📦 Preview Data Received:", {
          lessonTitle: lessonData?.title,
          lessonId: lessonData?.id,
          fileUrl: lessonData?.fileUrl,
          contentType: lessonData?.contentType,
          courseTitle: courseData?.title,
          courseId: courseData?.id,
          courseTeacherId: courseData?.teacher_id,
        });

        setLesson(lessonData);
        setCourse(courseData);
        
        // Set teacher mode
        if (user?.role === "teacher" || user?.role === "admin") {
          setIsTeacherMode(true);
          console.log("👨🏫 Teacher/Admin viewing preview");
        }

        // Check if user is enrolled (for students)
        if (user?.role === "student" && courseData?.id) {
          try {
            const enrollmentRes = await axiosInstance.get(`/enrollments/status/${courseData.id}`);
            setIsEnrolled(enrollmentRes.data?.enrolled === true);
          } catch (e) {
            console.log("Enrollment check failed:", e.message);
          }
        }
      } else {
        throw new Error(response.data.error || "Failed to load preview");
      }
    } catch (err) {
      console.error("❌ Error fetching preview:", err);
      
      // Try fallback for teachers
      if ((user?.role === "teacher" || user?.role === "admin") && courseId) {
        try {
          console.log("🔄 Trying fallback for teacher...");
          const lessonsRes = await axiosInstance.get(`/courses/${courseId}/lessons`);
          if (lessonsRes.data.success && lessonsRes.data.lessons.length > 0) {
            const firstLesson = lessonsRes.data.lessons[0];
            setLesson({
              ...firstLesson,
              isPreview: true,
            });
            setCourse({ 
              id: courseId, 
              title: location.state?.courseTitle || "Course Preview",
              teacher_id: user.id
            });
            setIsTeacherMode(true);
            setError("");
            console.log("✅ Using first lesson as fallback preview");
            return;
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      }
      
      setError(
        err.response?.data?.error || 
        err.message || 
        "Failed to load preview content"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (location.state?.returnUrl) {
      navigate(location.state.returnUrl);
    } else if (course?.id) {
      navigate(`/courses/${course.id}`);
    } else {
      navigate("/courses");
    }
  };

  // ✅ FIXED: Correct edit URL for teachers
  const handleEditLesson = () => {
    if (!lesson?.id || !user?.role) return;
    
    const targetCourseId = course?.id || courseId;
    
    if (!targetCourseId) {
      toast.error("Cannot edit: Course ID not found");
      return;
    }
    
    console.log("✏️ Edit lesson clicked:", {
      lessonId: lesson.id,
      courseId: targetCourseId,
      userRole: user.role
    });
    
    // ✅ CORRECT ROUTE FOR TEACHER LESSON EDITING
    if (user.role === "teacher" || user.role === "admin") {
      navigate(`/teacher/courses/${targetCourseId}/lessons/${lesson.id}/edit`, {
        state: {
          lesson,
          course,
          returnUrl: location.pathname
        }
      });
    }
  };

  const handleManageCourse = () => {
    if (!user?.role) return;
    
    const targetCourseId = course?.id || courseId;
    if (!targetCourseId) {
      toast.error("Course ID not found");
      return;
    }
    
    if (user.role === "teacher" || user.role === "admin") {
      navigate(`/courses/${targetCourseId}/manage-lessons`);
    }
  };

  const handleDownload = () => {
    if (!lesson?.fileUrl) return;
    
    const link = document.createElement('a');
    link.href = lesson.fileUrl;
    link.download = `${lesson.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!lesson?.fileUrl) return;
    
    window.open(lesson.fileUrl, '_blank', 'noopener,noreferrer');
  };

  const renderContent = () => {
    if (!lesson) return null;

    // PDF content
    if (lesson.fileUrl && (lesson.contentType === "pdf" || lesson.fileUrl.includes(".pdf"))) {
      return (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            📄 PDF Preview: {lesson.title}
          </Typography>
          
          {/* Quick actions for teachers */}
          {isTeacherMode && (
            <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Tooltip title="Edit this lesson">
                <IconButton color="primary" onClick={handleEditLesson}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download PDF">
                <IconButton color="default" onClick={handleDownload}>
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open in new tab">
                <IconButton color="default" onClick={handleOpenInNewTab}>
                  <OpenInNew />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          
          <PdfViewer 
            pdfUrl={lesson.fileUrl} 
            title={lesson.title} 
          />
        </Box>
      );
    }

    // Video content
    if (lesson.videoUrl) {
      return (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            🎬 Video Lesson
          </Typography>
          <Box sx={{ 
            width: "100%", 
            maxWidth: "800px", 
            mx: "auto",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3
          }}>
            <video
              controls
              style={{ width: "100%", maxHeight: "500px" }}
              poster={course?.thumbnail}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Box>
      );
    }

    // Text content
    if (lesson.textContent) {
      return (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            📝 Lesson Content
          </Typography>
          <Box sx={{ 
            p: 3, 
            bgcolor: "background.paper", 
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: 1
          }}>
            <Typography variant="body1" whiteSpace="pre-wrap">
              {lesson.textContent}
            </Typography>
          </Box>
        </Box>
      );
    }

    // No content
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        This preview lesson doesn't have any content yet.
        {isTeacherMode && (
          <Button
            variant="contained"
            onClick={handleEditLesson}
            sx={{ mt: 2 }}
            startIcon={<Edit />}
          >
            Add Content to This Lesson
          </Button>
        )}
      </Alert>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3, color: "text.secondary" }}>
            Loading preview content...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h5" color="error" gutterBottom>
              Unable to Load Preview
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {error}
            </Typography>
            
            <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Back to Courses
              </Button>
              
              {isTeacherMode && (course?.id || courseId) && (
                <Button
                  variant="outlined"
                  onClick={handleManageCourse}
                  startIcon={<Edit />}
                >
                  Manage Course
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          {/* Header with navigation */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2
          }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              variant="outlined"
              size="small"
            >
              Back to Course
            </Button>
            
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label="Preview Mode"
                color="primary"
                variant="outlined"
                size="small"
              />
              
              {isTeacherMode && (
                <Chip
                  icon={<School />}
                  label={user?.id === course?.teacher_id ? "Your Course" : "Teacher View"}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              )}
              
              {isEnrolled && (
                <Chip
                  label="✓ Enrolled"
                  color="success"
                  size="small"
                />
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Course and Lesson Info */}
          {course && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                COURSE PREVIEW
              </Typography>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                {course.title}
              </Typography>
              
              {lesson && (
                <>
                  <Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    📚 {lesson.title}
                  </Typography>
                  
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                    {lesson.contentType && (
                      <Chip
                        label={lesson.contentType.toUpperCase()}
                        size="small"
                        color="default"
                        variant="outlined"
                        icon={lesson.contentType === "pdf" ? <Description /> : 
                              lesson.contentType === "video" ? <VideoLibrary /> : null}
                      />
                    )}
                    
                    {lesson.isPreview && (
                      <Chip
                        label="Free Preview Lesson"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    )}
                    
                    {isTeacherMode && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={handleEditLesson}
                        sx={{ ml: "auto" }}
                      >
                        Edit Lesson
                      </Button>
                    )}
                  </Box>
                </>
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Preview Content */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Preview Content
            </Typography>
            {renderContent()}
          </Box>

          {/* Teacher Tools Section */}
          {isTeacherMode && (course || courseId) && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ 
                p: 3, 
                bgcolor: "action.hover", 
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider"
              }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  👨🏫 Teacher Tools
                </Typography>
                
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  {lesson?.id && (
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={handleEditLesson}
                    >
                      Edit This Lesson
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    startIcon={<MenuBook />}
                    onClick={handleManageCourse}
                  >
                    Manage Course Lessons
                  </Button>
                  
                  <Button
                    variant="text"
                    onClick={() => navigate(`/create-course`)}
                  >
                    Create New Course
                  </Button>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  💡 As a teacher, you can edit lesson content, manage course structure, or create new courses.
                </Typography>
              </Box>
            </>
          )}

          {/* Enrollment CTA for Students */}
          {user?.role === "student" && !isEnrolled && course && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ 
                p: 4, 
                bgcolor: "primary.light", 
                borderRadius: 2,
                textAlign: "center",
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
              }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                  Want full access to this course?
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ maxWidth: "600px", mx: "auto", mb: 3 }}>
                  This is just a preview lesson. Enroll in the full course to access all {course.totalLessons || "lessons"}, 
                  exercises, quizzes, and get instructor support.
                </Typography>
                
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View Course Details & Enroll
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/my-courses")}
                  >
                    View My Courses
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PreviewLessonPage;