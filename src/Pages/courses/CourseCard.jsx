// src/pages/courses/CourseCard.jsx - UPDATED VERSION
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from '../../utils/axiosInstance';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Chip
} from "@mui/material";
import {
  Close,
  Download,
  OpenInNew,
  PictureAsPdf,
  Visibility,
  PlayCircle,
  Article,
  LockOpen,
  School
} from "@mui/icons-material";
import "./CourseCard.css";

const CourseCard = ({ course, onCourseDeleted }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // PDF Preview States
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [checkingPreview, setCheckingPreview] = useState(false);

  // Check enrollment status
  useEffect(() => {
    let isMounted = true;
    const checkEnrollmentStatus = async () => {
      if (!user || !course?.id) return;
      try {
        setIsCheckingEnrollment(true);
        const res = await axiosInstance.get(`/enrollments/check/${course.id}`);
        if (isMounted) setIsEnrolled(res.data.enrolled || false);
      } catch (err) {
        if (isMounted) setIsEnrolled(false);
        console.error("Error checking enrollment:", err);
      } finally {
        if (isMounted) setIsCheckingEnrollment(false);
      }
    };
    checkEnrollmentStatus();
    return () => (isMounted = false);
  }, [user, course?.id]);

  // Get preview button text based on content type
  const getPreviewButtonText = () => {
    if (checkingPreview) return "Checking...";
    return "Free Preview";
  };

  // Get preview icon
  const getPreviewIcon = () => {
    if (checkingPreview) return <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />;
    return <Visibility sx={{ mr: 1, fontSize: '18px' }} />;
  };

  // Handle Free Preview Click - SIMPLIFIED
  const handleFreePreview = async () => {
    console.log("🎬 Free Preview clicked for:", course.title);
    
    // Simple navigation to preview page
    if (course.slug) {
      navigate(`/courses/${course.slug}/preview`);
    } else if (course.id) {
      navigate(`/courses/${course.id}/preview`);
    }
  };

  const openPreviewDialog = (lesson) => {
    const fileUrl = lesson.fileUrl || lesson.file_url;
    if (!fileUrl) {
      toast.error("Preview file not available");
      return;
    }
    
    setPreviewLesson(lesson);
    setPreviewLoading(true);
    setPreviewError(null);
    
    // Use Google Docs Viewer for better compatibility
    try {
      const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      setPreviewUrl(googleViewerUrl);
      setPreviewOpen(true);
      // Auto-hide loading after timeout
      setTimeout(() => {
        setPreviewLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      setPreviewError("Failed to load preview");
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewLoading(false);
    setPreviewError(null);
    setPreviewUrl(null);
  };

  const handlePreviewDownload = () => {
    if (previewLesson) {
      const fileUrl = previewLesson.fileUrl || previewLesson.file_url;
      if (fileUrl) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `${previewLesson.title?.replace(/[^a-z0-9]/gi, '_') || 'preview'}.pdf`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Download started");
      }
    }
  };

  const handlePreviewOpenInNewTab = () => {
    if (previewLesson) {
      const fileUrl = previewLesson.fileUrl || previewLesson.file_url;
      if (fileUrl) {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleIframeLoad = () => {
    console.log('✅ Preview iframe loaded');
    setPreviewLoading(false);
  };

  const handleIframeError = (e) => {
    console.error('❌ Preview iframe error:', e);
    setPreviewError('Failed to load preview. Try opening in a new tab.');
    setPreviewLoading(false);
  };

  const handleStartCourse = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to access the course.");
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }
    
    if (user?.id === course.teacher_id) {
      navigate(`/courses/${course.id}/manage`);
      return;
    }
    
    if (isEnrolled) {
      navigate(`/courses/${course.id}/view-lessons`);
    } else {
      toast.error("You are not enrolled in this course.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/courses/${course.id}`);
      toast.success("Course deleted successfully");
      if (onCourseDeleted) onCourseDeleted(course.id);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete course");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const canAccessCourse = isEnrolled || user?.id === course.teacher_id;
  const isTeacher = user?.role === "teacher";

  // Get course image based on title
  const getCourseImage = (courseTitle) => {
    const images = {
      "Algebra 1": "/images/math-logos/algebra1.jpeg",
      "Algebra 2": "/images/math-logos/algebra2.png",
      "Pre-Calculus": "/images/math-logos/Pre-calculus.jpeg",
      "Calculus": "/images/math-logos/Calculus.jpeg",
      "Geometry & Trigonometry": "/images/math-logos/geometry.jpeg",
      "Statistics & Probability": "/images/math-logos/statistic.png",
    };
    return images[courseTitle] || "/images/default-course.jpg";
  };

  return (
    <div className="course-card">
      <div className="course-image-container">
        <img
          src={getCourseImage(course.title)}
          alt={course.title}
          className="course-image"
          onError={(e) => {
            e.target.src = "/images/default-course.jpg";
          }}
        />
        {isEnrolled && (
          <Chip
            label="Enrolled"
            size="small"
            color="success"
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontWeight: 'bold'
            }}
          />
        )}
        <Chip
          label="Preview Available"
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontWeight: 'bold',
            backgroundColor: '#2196f3'
          }}
        />
      </div>
      
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description ||
            "Learn essential mathematical concepts and techniques."}
        </p>
        
        {course.teacher && (
          <div className="course-meta">
            <span className="course-teacher">
              👨🏫 {course.teacher.name}
            </span>
            <span className="course-price">${parseFloat(course.price || 0).toFixed(2)}</span>
          </div>
        )}
        
        {/* Free Preview Button */}
        <div className="preview-section">
          <button
            className="preview-btn"
            onClick={handleFreePreview}
            disabled={checkingPreview}
          >
            {getPreviewIcon()}
            {getPreviewButtonText()}
          </button>
          <p className="preview-note">
            Preview course materials before enrolling
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="course-actions">
          <Link
            to={`/courses/${course.slug || course.id}`}
            className="btn-details"
          >
            View Details
          </Link>
          
          {canAccessCourse && (
            <button onClick={handleStartCourse} className="btn-start">
              {isTeacher ? "Manage Course" : "Start Learning"}
            </button>
          )}
          
          {isTeacher && user?.id === course.teacher_id && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-delete"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '70vh',
            maxHeight: '85vh',
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" noWrap>
              {previewLesson?.content_type === 'video' ? '🎬' : '📄'}
              {' '}
              {previewLesson?.title || 'Course Preview'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {course.title} • Free Preview
            </Typography>
          </Box>
          <IconButton
            onClick={handleClosePreview}
            size="small"
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 0, position: 'relative', minHeight: '60vh' }}>
          {previewLoading && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 10
            }}>
              <CircularProgress size={50} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading Preview...
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Powered by Google Docs Viewer
              </Typography>
            </Box>
          )}
          
          {previewError && (
            <Box sx={{
              p: 4,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Alert severity="warning" sx={{ mb: 2, maxWidth: '400px' }}>
                <Typography variant="h6" gutterBottom>
                  Preview Unavailable
                </Typography>
                <Typography variant="body2">
                  {previewError}
                </Typography>
              </Alert>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handlePreviewOpenInNewTab}
                  startIcon={<OpenInNew />}
                >
                  Open in New Tab
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/courses/${course.id}/preview`)}
                >
                  Go to Full Preview Page
                </Button>
              </Box>
            </Box>
          )}
          
          {/* PDF Preview Iframe */}
          {previewUrl && !previewError && !previewLoading && (
            <iframe
              src={previewUrl}
              title={`PDF Preview - ${previewLesson?.title || 'Course Preview'}`}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '60vh',
                border: 'none',
                display: 'block'
              }}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allow="fullscreen"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          )}
        </DialogContent>
        
        <Box sx={{
          p: 2,
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          backgroundColor: '#f5f5f5'
        }}>
          <Box>
            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
              {previewLesson
                ? `Previewing: ${previewLesson.title}`
                : 'Course Material Preview'}
            </Typography>
            {previewLesson?.content_type && (
              <Chip
                label={previewLesson.content_type.toUpperCase()}
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              startIcon={<Download />}
              onClick={handlePreviewDownload}
              variant="contained"
              color="primary"
              size="small"
              disabled={!previewLesson}
            >
              Download
            </Button>
            <Button
              onClick={handlePreviewOpenInNewTab}
              variant="outlined"
              size="small"
              startIcon={<OpenInNew />}
              disabled={!previewLesson}
            >
              Open Full
            </Button>
            <Button
              onClick={() => navigate(`/courses/${course.id}/preview`)}
              variant="text"
              size="small"
            >
              Full Preview Page
            </Button>
            <Button
              onClick={handleClosePreview}
              variant="outlined"
              size="small"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete "{course.title}"? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-danger">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;