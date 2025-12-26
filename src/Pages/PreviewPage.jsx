// src/pages/PreviewPage.jsx - FIXED IMPORT PATHS
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // FIXED: Changed from ../../ to ../
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance"; // FIXED: Changed from ../../ to ../
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
} from "@mui/material";
import {
  ArrowBack,
  Close,
  PictureAsPdf,
  VideoLibrary,
  Description,
  Download,
  OpenInNew,
} from "@mui/icons-material";

const PreviewPage = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    title: '',
    url: '',
    type: '',
  });

  // Helper function to parse URLs (handles array strings)
  const parseUrl = (url) => {
    if (!url) return null;
    
    // Check if it's a string that looks like an array
    if (typeof url === 'string' && url.startsWith('[') && url.endsWith(']')) {
      try {
        const urls = JSON.parse(url);
        return Array.isArray(urls) && urls.length > 0 ? urls[0] : null;
      } catch (error) {
        const match = url.match(/https?:\/\/[^\s,"']+/);
        return match ? match[0] : null;
      }
    }
    
    return url.startsWith('http') ? url : null;
  };

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        
        // Check if lesson data was passed via state
        if (location.state?.lesson) {
          console.log('📄 Using lesson from location state:', location.state.lesson);
          setLesson(location.state.lesson);
          if (location.state.error) {
            setError(location.state.error);
          }
          setLoading(false);
          return;
        }
        
        // Fetch lesson data from API
        const res = await axiosInstance.get(`/lessons/public-preview/${lessonId}`);
        console.log('📄 API Response:', res.data);
        
        if (res.data.success && res.data.lesson) {
          const lessonData = res.data.lesson;
          
          // Parse URLs
          const parsedLesson = {
            ...lessonData,
            file_url: parseUrl(lessonData.file_url || lessonData.fileUrl),
            video_url: parseUrl(lessonData.video_url || lessonData.videoUrl),
          };
          
          setLesson(parsedLesson);
        } else {
          setError(res.data.error || "Lesson not found");
        }
      } catch (err) {
        console.error('❌ Error fetching lesson:', err);
        setError("Failed to load preview content");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, location.state]);

  const handleOpenPdf = (pdfUrl, title) => {
    if (!pdfUrl) {
      toast.error("PDF URL not available");
      return;
    }
    
    // Use Google Docs Viewer for reliable PDF viewing
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
    
    setPreviewDialog({
      open: true,
      title: `${title || 'PDF Preview'}`,
      url: googleDocsUrl,
      directUrl: pdfUrl,
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
      directUrl: videoUrl,
      type: 'video'
    });
  };

  const handleDownload = (url, filename) => {
    if (!url) {
      toast.error("Download URL not available");
      return;
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClosePreviewDialog = () => {
    setPreviewDialog({
      open: false,
      title: '',
      url: '',
      type: '',
    });
  };

  const renderContent = () => {
    if (!lesson) return null;

    const courseTitle = location.state?.courseTitle || 'Course';
    const isTeacherPreview = location.state?.isTeacherPreview || user?.role === "teacher";
    
    // Parse attachments if they exist
    let attachments = [];
    if (lesson.attachments && Array.isArray(lesson.attachments)) {
      attachments = lesson.attachments.map(att => ({
        ...att,
        url: parseUrl(att.url || att.filePath)
      }));
    }

    // Determine what content to show
    const hasPdf = lesson.file_url && (lesson.file_url.includes('.pdf') || lesson.content_type === 'pdf');
    const hasVideo = lesson.video_url || (lesson.file_url && (lesson.file_url.includes('.mp4') || lesson.file_url.includes('.mov')));
    const hasText = lesson.content || lesson.textContent;
    const hasAttachments = attachments.length > 0;

    return (
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {lesson.title || 'Preview Lesson'}
              </Typography>
              <Typography variant="subtitle1">
                {courseTitle} • {isTeacherPreview ? 'Teacher Preview' : 'Free Preview'}
              </Typography>
            </Box>
            <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
          </Box>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Content Preview */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            📚 Preview Content
          </Typography>
          
          {hasPdf ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                This lesson contains a PDF document.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdf />}
                  onClick={() => handleOpenPdf(lesson.file_url, lesson.title)}
                >
                  View PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleDownload(lesson.file_url, `${lesson.title}.pdf`)}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          ) : hasVideo ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                This lesson contains a video.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<VideoLibrary />}
                  onClick={() => handleOpenVideo(lesson.video_url || lesson.file_url, lesson.title)}
                >
                  Play Video
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleDownload(lesson.video_url || lesson.file_url, `${lesson.title}.mp4`)}
                >
                  Download Video
                </Button>
              </Box>
            </Box>
          ) : hasText ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" whiteSpace="pre-wrap">
                {lesson.content || lesson.textContent}
              </Typography>
            </Box>
          ) : hasAttachments ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                This lesson contains attachments:
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {attachments.map((att, index) => (
                  <Paper key={index} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {att.url && att.url.includes('.pdf') ? <PictureAsPdf color="error" /> :
                       att.url && (att.url.includes('.mp4') || att.url.includes('.mov')) ? <VideoLibrary color="primary" /> :
                       <Description color="action" />}
                      <Typography>
                        {att.name || `Attachment ${index + 1}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {att.url && att.url.includes('.pdf') && (
                        <Button
                          size="small"
                          startIcon={<PictureAsPdf />}
                          onClick={() => handleOpenPdf(att.url, att.name)}
                        >
                          View
                        </Button>
                      )}
                      {att.url && (att.url.includes('.mp4') || att.url.includes('.mov')) && (
                        <Button
                          size="small"
                          startIcon={<VideoLibrary />}
                          onClick={() => handleOpenVideo(att.url, att.name)}
                        >
                          Play
                        </Button>
                      )}
                      {att.url && (
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleDownload(att.url, att.name)}
                        >
                          Download
                        </Button>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          ) : (
            <Alert severity="info">
              This preview lesson doesn't have any content yet.
            </Alert>
          )}

          {/* Enrollment CTA for non-teachers */}
          {!isTeacherPreview && (
            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                🔓 Want full access?
              </Typography>
              <Typography variant="body1" paragraph>
                Enroll in this course to access all lessons, assignments, and instructor support.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate(`/payment/${location.state?.courseId || ''}`)}
              >
                Enroll Now
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  // Preview Dialog
  const PreviewDialog = () => (
    <Dialog
      open={previewDialog.open}
      onClose={handleClosePreviewDialog}
      maxWidth={previewDialog.type === 'pdf' ? 'lg' : 'md'}
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
          <>
            <iframe
              src={previewDialog.url}
              title={previewDialog.title}
              style={{
                width: '100%',
                height: '500px',
                border: 'none',
                borderRadius: '8px'
              }}
            />
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => window.open(previewDialog.directUrl, '_blank')}
                startIcon={<OpenInNew />}
              >
                Open in New Tab
              </Button>
            </Box>
          </>
        )}
        {previewDialog.type === 'video' && previewDialog.url && (
          <>
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
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => window.open(previewDialog.directUrl, '_blank')}
                startIcon={<OpenInNew />}
              >
                Open in New Tab
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading preview...</Typography>
      </Box>
    );
  }

  if (!lesson && !loading) {
    return (
      <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Preview content not found or unavailable.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/courses')}>
          Back to Courses
        </Button>
      </Box>
    );
  }

  return (
    <>
      <PreviewDialog />
      {renderContent()}
    </>
  );
};

export default PreviewPage;