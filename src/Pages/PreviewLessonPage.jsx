
// src/pages/PreviewLessonPage.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import {
  Description,
  VideoLibrary,
  ArrowBack,
  Download,
  Visibility,
  School,
  Book,
  Error as ErrorIcon,
} from "@mui/icons-material";
import "./PreviewLessonPage.css";

const PreviewLessonPage = () => {
  const { courseId, slug, lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log("🔍 Preview Mode:", {
      courseId,
      slug,
      lessonId,
      userRole: user?.role,
      isTeacher: user?.role === "teacher",
      locationState: location.state,
      pathname: location.pathname,
    });
  }, [courseId, slug, lessonId, user, location]);

  useEffect(() => {
    fetchPreviewLesson();
  }, [courseId, slug, lessonId]);

  const fetchPreviewLesson = async () => {
    try {
      setLoading(true);
      setError("");

      let apiUrl = "";

      // Determine API endpoint based on available parameters
      if (lessonId) {
        // ✅ FIXED: Use correct endpoint format
        apiUrl = `/lessons/public-preview/${lessonId}`;
        console.log(`📥 Fetching direct lesson preview: ${lessonId}`);
      } else if (courseId) {
        // Course preview
        apiUrl = `/courses/${courseId}/preview-lesson`;
        console.log(`📥 Fetching course preview for ID: ${courseId}`);
      } else if (slug) {
        // Get course ID from slug first
        try {
          const courseResponse = await axiosInstance.get(`/courses/slug/${slug}`);
          if (courseResponse.data.success) {
            const courseData = courseResponse.data.course;
            apiUrl = `/courses/${courseData.id}/preview-lesson`;
            console.log(`📥 Found course ID ${courseData.id} for slug: ${slug}`);
          }
        } catch (slugError) {
          console.error("Error getting course from slug:", slugError);
          // Try alternative endpoint
          apiUrl = `/courses/public/slug/${slug}/preview`;
        }
      }

      if (!apiUrl) {
        throw new Error("No valid preview endpoint found");
      }

      console.log(`🌐 Calling API: ${apiUrl}`);
      const response = await axiosInstance.get(apiUrl);

      if (response.data.success) {
        const { lesson: lessonData, course: courseData } = response.data;
        
        console.log("📦 Preview Data Received:", {
          lessonTitle: lessonData?.title,
          lessonId: lessonData?.id,
          hasFile: !!lessonData?.fileUrl,
          hasVideo: !!lessonData?.videoUrl,
          isPreview: lessonData?.isPreview,
          courseTitle: courseData?.title,
        });

        setLesson(lessonData);
        setCourse(courseData);
        
        // Check if user is teacher viewing their own course
        if (user?.role === "teacher" && courseData?.teacher_id === user.id) {
          console.log("👨🏫 Teacher viewing own course - showing preview content");
          setIsPreviewMode(true);
        } else if (user?.role === "teacher") {
          console.log("👨🏫 Teacher viewing other teacher's course");
          setIsPreviewMode(true);
        } else {
          setIsPreviewMode(true);
        }
      } else {
        throw new Error(response.data.error || "Failed to load preview");
      }
    } catch (err) {
      console.error("❌ Error fetching preview:", err);
      setError(
        err.response?.data?.error || 
        err.message || 
        "Failed to load preview content"
      );
      
      // Try fallback for teachers
      if (user?.role === "teacher" && courseId) {
        try {
          console.log("🔄 Trying fallback for teacher...");
          const lessonsResponse = await axiosInstance.get(`/courses/${courseId}/lessons`);
          if (lessonsResponse.data.success && lessonsResponse.data.lessons.length > 0) {
            const firstLesson = lessonsResponse.data.lessons[0];
            setLesson({
              ...firstLesson,
              isPreview: true,
            });
            setCourse({ id: courseId, title: "Course Preview" });
            setError("");
            console.log("✅ Using first lesson as fallback preview");
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (courseId || slug) {
      navigate(`/courses/${courseId || slug}`);
    } else {
      navigate("/courses");
    }
  };

  const handleDownload = () => {
    if (lesson?.fileUrl) {
      window.open(lesson.fileUrl, "_blank");
    }
  };

  const handleViewFile = () => {
    if (lesson?.fileUrl) {
      window.open(lesson.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleEditLesson = () => {
    if (lesson?.id && user?.role === "teacher") {
      navigate(`/teacher/courses/${course?.id || courseId}/lessons/${lesson.id}/edit`);
    } else {
      navigate(`/teacher/courses/${course?.id || courseId}/lessons`);
    }
  };

  const handleManageLessons = () => {
    navigate(`/teacher/courses/${course?.id || courseId}/lessons`);
  };

  const renderContent = () => {
    if (!lesson) return null;

    // If it's a PDF file
    if (lesson.fileUrl && (lesson.contentType === "pdf" || lesson.fileUrl.includes(".pdf"))) {
      return (
        <Box className="preview-content">
          <Box className="file-preview-container">
            <Typography variant="h6" gutterBottom>
              📄 PDF Preview
            </Typography>
            
            <Box className="file-actions">
              <Button
                variant="contained"
                startIcon={<Visibility />}
                onClick={handleViewFile}
                className="view-btn"
              >
                View PDF in Browser
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownload}
                className="download-btn"
              >
                Download PDF
              </Button>
            </Box>
            
            <Box className="pdf-embed-container">
              <iframe
                src={`${lesson.fileUrl}#view=FitH`}
                title={lesson.title}
                className="pdf-iframe"
                style={{ border: "none" }}
              />
              <Typography variant="body2" color="textSecondary" className="pdf-note">
                💡 If the PDF doesn't load, try the "View PDF in Browser" button above.
              </Typography>
            </Box>
          </Box>
        </Box>
      );
    }

    // If it's a video
    if (lesson.videoUrl) {
      return (
        <Box className="preview-content">
          <Typography variant="h6" gutterBottom>
            🎬 Video Lesson
          </Typography>
          
          <Box className="video-container">
            <video
              controls
              className="video-player"
              poster={course?.thumbnail}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Box>
      );
    }

    // If it's text content
    if (lesson.textContent) {
      return (
        <Box className="preview-content">
          <Typography variant="h6" gutterBottom>
            📝 Lesson Content
          </Typography>
          
          <Paper elevation={0} className="text-content-paper">
            <Typography variant="body1" className="lesson-text-content">
              {lesson.textContent}
            </Typography>
          </Paper>
        </Box>
      );
    }

    // No content available
    return (
      <Box className="preview-content">
        <Alert severity="info" className="no-content-alert">
          <Typography variant="body1">
            This preview lesson doesn't have any content yet.
          </Typography>
          {user?.role === "teacher" && (
            <Button
              variant="contained"
              onClick={handleEditLesson}
              sx={{ mt: 2 }}
            >
              Add Content to This Lesson
            </Button>
          )}
        </Alert>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="preview-container">
        <Box className="loading-container">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading preview content...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="preview-container">
        <Card className="error-card">
          <CardContent>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Unable to Load Preview
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {error}
            </Typography>
            
            <Box className="error-actions">
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Back to Courses
              </Button>
              
              {user?.role === "teacher" && courseId && (
                <Button
                  variant="outlined"
                  startIcon={<Book />}
                  onClick={handleManageLessons}
                  sx={{ ml: 2 }}
                >
                  Manage Lessons
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="preview-container">
      <Card elevation={3} className="preview-card">
        <CardContent>
          {/* Header */}
          <Box className="preview-header">
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              className="back-button"
            >
              Back to Course
            </Button>
            
            <Box className="header-badges">
              <Chip
                icon={<Visibility />}
                label="Preview Mode"
                color="primary"
                variant="outlined"
              />
              
              {user?.role === "teacher" && (
                <Chip
                  icon={<School />}
                  label="Teacher View"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Course Info */}
          {course && (
            <Box className="course-info">
              <Typography variant="caption" color="textSecondary">
                COURSE PREVIEW
              </Typography>
              <Typography variant="h4" className="course-title">
                {course.title}
              </Typography>
              
              {lesson && (
                <>
                  <Typography variant="subtitle1" className="lesson-title">
                    📚 {lesson.title}
                  </Typography>
                  
                  <Box className="lesson-meta">
                    {lesson.contentType && (
                      <Chip
                        label={lesson.contentType.toUpperCase()}
                        size="small"
                        className="content-type-chip"
                      />
                    )}
                    
                    {lesson.isPreview && (
                      <Chip
                        icon={<Description />}
                        label="Preview Lesson"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </>
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Preview Content */}
          <Box className="content-section">
            <Typography variant="h5" gutterBottom className="section-title">
              Preview Content
            </Typography>
            
            {renderContent()}
          </Box>

          {/* Teacher Actions */}
          {user?.role === "teacher" && course && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Box className="teacher-actions">
                <Typography variant="h6" gutterBottom>
                  👨🏫 Teacher Tools
                </Typography>
                
                <Box className="action-buttons">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditLesson}
                    startIcon={<Description />}
                  >
                    Edit This Lesson
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={handleManageLessons}
                    startIcon={<Book />}
                    sx={{ ml: 2 }}
                  >
                    Manage All Lessons
                  </Button>
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  💡 As a teacher, you can edit this lesson or manage all lessons in this course.
                </Typography>
              </Box>
            </>
          )}

          {/* Enrollment CTA for non-teachers */}
          {user?.role === "student" && course && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Box className="enrollment-cta">
                <Typography variant="h6" gutterBottom color="primary">
                  Want full access?
                </Typography>
                
                <Typography variant="body1" paragraph>
                  This is just a preview. Enroll in the full course to access all lessons,
                  exercises, and get instructor support.
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate(`/courses/${course.id || course.slug}`)}
                >
                  View Course Details & Enroll
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PreviewLessonPage;