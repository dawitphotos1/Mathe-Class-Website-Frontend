
// src/pages/PreviewLessonPage.jsx - UPDATED WITH PDF PROXY
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
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
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
  Close,
} from "@mui/icons-material";

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
  const [pdfDialog, setPdfDialog] = useState({
    open: false,
    url: '',
    title: ''
  });

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

      let apiUrl = "";
      
      if (lessonId) {
        apiUrl = `/lessons/public-preview/${lessonId}`;
      } else if (courseId) {
        apiUrl = `/courses/${courseId}/preview-lesson`;
      } else {
        throw new Error("No valid identifier provided");
      }

      const response = await axiosInstance.get(apiUrl);

      if (response.data.success) {
        const { lesson: lessonData, course: courseData } = response.data;
        
        setLesson(lessonData);
        setCourse(courseData);
        
        if (user?.role === "teacher" || user?.role === "admin") {
          setIsTeacherMode(true);
        }

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
      setError(
        err.response?.data?.error || 
        err.message || 
        "Failed to load preview content"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Function to open PDF using proxy
  const openPdfWithProxy = (pdfUrl, title) => {
    try {
      const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
      const proxyUrl = `/api/v1/pdf-proxy?url=${encodeURIComponent(pdfUrl)}&filename=${encodeURIComponent(cleanTitle + '.pdf')}`;
      
      setPdfDialog({
        open: true,
        url: proxyUrl,
        title: `${title} - PDF Preview`
      });
    } catch (error) {
      console.error("Error with PDF proxy:", error);
      // Fallback to direct opening
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
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
    
    if (lesson.fileUrl.includes('.pdf')) {
      openPdfWithProxy(lesson.fileUrl, lesson.title);
    } else {
      window.open(lesson.fileUrl, '_blank', 'noopener,noreferrer');
    }
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
          
          <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<OpenInNew />}
              onClick={() => openPdfWithProxy(lesson.fileUrl, lesson.title)}
            >
              View PDF in Browser
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
            
            {isTeacherMode && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate(`/teacher/courses/${course?.id || courseId}/lessons/${lesson.id}/edit`)}
              >
                Edit Lesson
              </Button>
            )}
          </Box>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            If PDF doesn't load, try downloading it or opening in a new tab.
          </Alert>
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

    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        This preview lesson doesn't have any content yet.
        {isTeacherMode && (
          <Button
            variant="contained"
            onClick={() => navigate(`/teacher/courses/${course?.id || courseId}/lessons/${lesson.id}/edit`)}
            sx={{ mt: 2 }}
            startIcon={<Edit />}
          >
            Add Content to This Lesson
          </Button>
        )}
      </Alert>
    );
  };

  // PDF Dialog component
  const PdfDialog = () => (
    <Dialog
      open={pdfDialog.open}
      onClose={() => setPdfDialog({ open: false, url: '', title: '' })}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pr: 2 
      }}>
        <Typography variant="h6">{pdfDialog.title}</Typography>
        <Box>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDownload}
            sx={{ mr: 1 }}
          >
            Download
          </Button>
          <IconButton onClick={() => setPdfDialog({ open: false, url: '', title: '' })}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <iframe
          src={pdfDialog.url}
          title={pdfDialog.title}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />
      </DialogContent>
    </Dialog>
  );

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
                onClick={() => navigate("/courses")}
              >
                Back to Courses
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <PdfDialog />
      
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
                onClick={() => navigate(-1)}
                variant="outlined"
                size="small"
              >
                Back
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
    </>
  );
};

export default PreviewLessonPage;