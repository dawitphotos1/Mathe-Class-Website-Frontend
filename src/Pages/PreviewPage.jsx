
// src/pages/PreviewPage.jsx - COMPLETE FIXED VERSION
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack,
  Close,
  PictureAsPdf,
  VideoLibrary,
  Description,
  Download,
  OpenInNew,
  Error as ErrorIcon,
} from "@mui/icons-material";

const PreviewPage = () => {
  const { slug } = useParams(); // Changed from lessonId to slug
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(location.state?.lesson || null);
  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(!lesson);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    title: '',
    url: '',
    type: '',
  });

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // If we have a course from state but no lesson, fetch the preview
        if (course && !lesson) {
          console.log('📄 Fetching preview for course:', course);
          
          // Method 1: Try to get preview from the course's previewLesson
          if (course.previewLesson) {
            console.log('✅ Using course.previewLesson:', course.previewLesson);
            setLesson(course.previewLesson);
            setLoading(false);
            return;
          }
          
          // Method 2: Fetch preview lesson via API
          try {
            const response = await axiosInstance.get(`/courses/${course.id}/preview-lesson`);
            console.log('📄 Preview API response:', response.data);
            
            if (response.data.success && response.data.lesson) {
              setLesson(response.data.lesson);
            } else if (response.data.success && response.data.hasPreview === false) {
              setError("No preview content available for this course");
            } else {
              setError("Failed to load preview content");
            }
          } catch (apiError) {
            console.error('❌ API error:', apiError);
            
            // Method 3: Try debug endpoint
            try {
              const debugResponse = await axiosInstance.get(`/courses/debug-preview/${course.id}`);
              console.log('🔍 Debug response:', debugResponse.data);
              
              if (debugResponse.data.success && debugResponse.data.lesson) {
                setLesson(debugResponse.data.lesson);
                setDebugInfo(debugResponse.data.debug);
              } else {
                setError("This course doesn't have any preview content yet");
              }
            } catch (debugError) {
              console.error('❌ Debug endpoint failed:', debugError);
              setError("Unable to load preview. Please try again later.");
            }
          }
        }
        
        // If we have neither course nor lesson, fetch by slug
        if (!course && slug) {
          console.log('🔍 Fetching course by slug:', slug);
          const courseResponse = await axiosInstance.get(`/courses/slug/${slug}`);
          
          if (courseResponse.data.success && courseResponse.data.course) {
            const fetchedCourse = courseResponse.data.course;
            setCourse(fetchedCourse);
            
            // Check if course has previewLesson
            if (fetchedCourse.previewLesson) {
              setLesson(fetchedCourse.previewLesson);
            } else {
              // Fetch preview separately
              const previewResponse = await axiosInstance.get(`/courses/${fetchedCourse.id}/preview-lesson`);
              if (previewResponse.data.success && previewResponse.data.lesson) {
                setLesson(previewResponse.data.lesson);
              } else {
                setError("No preview content available");
              }
            }
          } else {
            setError("Course not found");
          }
        }
      } catch (err) {
        console.error('❌ Error in fetchPreviewData:', err);
        setError(err.response?.data?.message || "Failed to load preview");
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [slug, course, lesson]);

  const handleOpenPdf = (pdfUrl, title) => {
    if (!pdfUrl) {
      toast.error("PDF URL not available");
      return;
    }
    
    // Check if URL is valid
    if (!pdfUrl.startsWith('http')) {
      toast.error("Invalid PDF URL format");
      return;
    }
    
    setPreviewDialog({
      open: true,
      title: `${title || 'PDF Preview'}`,
      url: pdfUrl,
      type: 'pdf'
    });
  };

  const handleOpenVideo = (videoUrl, title) => {
    if (!videoUrl) {
      toast.error("Video URL not available");
      return;
    }
    
    setPreviewDialog({
      open: true,
      title: `${title || 'Video Preview'}`,
      url: videoUrl,
      type: 'video'
    });
  };

  const handleClosePreviewDialog = () => {
    setPreviewDialog({
      open: false,
      title: '',
      url: '',
      type: '',
    });
  };

  const handleBack = () => {
    navigate(`/courses/${slug || ''}`);
  };

  const renderContent = () => {
    if (!lesson) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No preview content available for this course.
        </Alert>
      );
    }

    // Parse URLs from lesson data
    const fileUrls = lesson.fileUrls || (lesson.file_url ? [lesson.file_url] : []);
    const videoUrls = lesson.videoUrls || (lesson.video_url ? [lesson.video_url] : []);
    const attachments = lesson.attachments || [];
    const content = lesson.content || lesson.textContent || "";
    
    console.log('🔍 Lesson data for rendering:', {
      title: lesson.title,
      fileUrls,
      videoUrls,
      attachments: attachments.length,
      contentLength: content.length,
      isPreview: lesson.isPreview
    });

    // Check for different content types
    const hasPdf = fileUrls.some(url => url && (url.includes('.pdf') || url.includes('/pdf')));
    const hasVideo = videoUrls.length > 0;
    const hasText = content && content.trim().length > 0;
    const hasAttachments = attachments.length > 0;

    // If no content at all
    if (!hasPdf && !hasVideo && !hasText && !hasAttachments) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          This preview lesson doesn't have any content yet.
        </Alert>
      );
    }

    return (
      <Box sx={{ mt: 3 }}>
        {/* PDF Content */}
        {hasPdf && fileUrls.map((url, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PictureAsPdf sx={{ mr: 1, color: 'error.main' }} />
              PDF Preview {fileUrls.length > 1 ? `(${index + 1})` : ''}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<OpenInNew />}
                onClick={() => handleOpenPdf(url, lesson.title)}
              >
                View PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => window.open(url, '_blank')}
              >
                Download PDF
              </Button>
            </Box>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
              title={`PDF Preview - ${lesson.title}`}
              width="100%"
              height="600px"
              style={{ border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </Box>
        ))}

        {/* Video Content */}
        {hasVideo && videoUrls.map((url, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <VideoLibrary sx={{ mr: 1, color: 'primary.main' }} />
              Video Preview {videoUrls.length > 1 ? `(${index + 1})` : ''}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<VideoLibrary />}
                onClick={() => handleOpenVideo(url, lesson.title)}
              >
                Play Video
              </Button>
            </Box>
            <video
              controls
              style={{ width: '100%', maxHeight: '500px', borderRadius: '8px' }}
            >
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        ))}

        {/* Text Content */}
        {hasText && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              📝 Lesson Content
            </Typography>
            <Paper sx={{ p: 3, whiteSpace: 'pre-wrap', bgcolor: 'grey.50' }}>
              <Typography variant="body1">
                {content}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Attachments */}
        {hasAttachments && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              📎 Attachments
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {attachments.map((attachment, index) => (
                <Paper key={index} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {attachment.filePath && attachment.filePath.includes('.pdf') ? 
                      <PictureAsPdf color="error" /> : 
                      <Description color="action" />
                    }
                    <Box>
                      <Typography variant="subtitle1">
                        {attachment.fileName || `Attachment ${index + 1}`}
                      </Typography>
                      {attachment.fileSize && (
                        <Typography variant="caption" color="text.secondary">
                          {(attachment.fileSize / 1024).toFixed(2)} KB
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {attachment.filePath && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => window.open(attachment.filePath, '_blank')}
                    >
                      Download
                    </Button>
                  )}
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  // Preview Dialog Component
  const PreviewDialog = () => (
    <Dialog
      open={previewDialog.open}
      onClose={handleClosePreviewDialog}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {previewDialog.title}
        <IconButton onClick={handleClosePreviewDialog}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {previewDialog.type === 'pdf' && previewDialog.url && (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewDialog.url)}&embedded=true`}
            title={previewDialog.title}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              borderRadius: '8px'
            }}
          />
        )}
        {previewDialog.type === 'video' && previewDialog.url && (
          <video
            controls
            autoPlay
            style={{
              width: '100%',
              maxHeight: '500px',
              borderRadius: '8px'
            }}
          >
            <source src={previewDialog.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePreviewDialog}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => window.open(previewDialog.url, '_blank')}
          startIcon={<OpenInNew />}
        >
          Open in New Tab
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading preview content...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <PreviewDialog />
      
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{ color: 'white', borderColor: 'white', mb: 2 }}
              >
                Back to Course
              </Button>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {lesson?.title || 'Preview Lesson'}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {course?.title || 'Course'} • Free Preview
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body1">
              {error}
            </Typography>
          </Alert>
        )}

        {/* Content Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            📚 Preview Content
          </Typography>
          
          {renderContent()}

          {/* Debug Info (Development only) */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                🔍 Debug Information
              </Typography>
              <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </Box>
          )}

          {/* Enrollment CTA */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              🔓 Want Full Access?
            </Typography>
            <Typography variant="body1" paragraph>
              Enroll in this course to access all lessons, assignments, and instructor support.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(`/payment/${course?.id || ''}`)}
            >
              Enroll Now
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default PreviewPage;