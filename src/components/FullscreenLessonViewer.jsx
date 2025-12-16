
// src/components/FullscreenLessonViewer.jsx - UPDATED
import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
  CircularProgress,
  Tooltip,
  Button,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  GetApp as GetAppIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstance";
import "../pages/teachers/MyTeachingCourses.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullscreenLessonViewer = ({ open, onClose, lessonId, darkMode = false }) => {
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [zoom, setZoom] = useState(1);
  const pdfIframeRef = useRef(null);

  const fetchLesson = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      setLesson(null);
      const res = await axiosInstance.get(`/lessons/${id}`);
      setLesson(res?.data?.lesson ?? null);
    } catch (err) {
      console.error("FullscreenLessonViewer fetch error:", err);
      setLesson(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && lessonId) {
      fetchLesson(lessonId);
      setZoom(1);
    } else if (!open) {
      setLesson(null);
      setZoom(1);
    }
  }, [open, lessonId, fetchLesson]);

  const downloadFile = () => {
    if (!lesson) return;
    const url = lesson.fileUrl || lesson.videoUrl;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = (lesson.title || "download").replace(/\s+/g, "_");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Fixed: Update iframe instead of opening new tab
  const openInNewTab = () => {
    if (!lesson) return;
    const url = lesson.fileUrl || lesson.videoUrl;
    if (!url) return;
    
    if (lesson.contentType === 'pdf' || lesson.contentType === 'file') {
      if (pdfIframeRef.current) {
        pdfIframeRef.current.src = url;
        console.log('🔄 PDF iframe URL updated');
      }
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));

  const handleIframeLoad = () => {
    console.log('✅ PDF iframe loaded');
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{ className: `preview-modal ${darkMode ? "dark-mode" : ""}` }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>

          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" noWrap>
            {lesson?.title || "Preview"}
          </Typography>

          <Tooltip title="Zoom out"><IconButton color="inherit" onClick={zoomOut}><ZoomOutIcon /></IconButton></Tooltip>
          <Tooltip title="Zoom in"><IconButton color="inherit" onClick={zoomIn}><ZoomInIcon /></IconButton></Tooltip>
          <Tooltip title="Download"><IconButton color="inherit" onClick={downloadFile}><GetAppIcon /></IconButton></Tooltip>
          <Tooltip title={lesson?.contentType === 'pdf' ? "Reload PDF" : "Open in new tab"}>
            <IconButton color="inherit" onClick={openInNewTab}><OpenInNewIcon /></IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <DialogContent className="preview-dialog-content">
        {loading ? (
          <Box className="preview-loading">
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading preview...</Typography>
          </Box>
        ) : lesson ? (
          <Box className="viewer-wrapper">
            {lesson.contentType === "text" && (
              <Box className="text-viewer" dangerouslySetInnerHTML={{ __html: lesson.textContent || "<p>No content</p>" }} />
            )}

            {lesson.contentType === "video" && lesson.videoUrl && (
              <Box className="media-container" style={{ transform: `scale(${zoom})` }}>
                <video key={lesson.videoUrl} src={lesson.videoUrl} controls style={{ maxWidth: "100%", maxHeight: "80vh", width: "100%" }} />
              </Box>
            )}

            {lesson.contentType === "image" && lesson.fileUrl && (
              <Box className="media-container" style={{ transform: `scale(${zoom})` }}>
                <img src={lesson.fileUrl} alt={lesson.title} style={{ maxWidth: "100%", maxHeight: "80vh", display: "block", margin: "0 auto" }} />
              </Box>
            )}

            {(lesson.contentType === "pdf" || lesson.contentType === "file") && lesson.fileUrl && (
              <Box className="media-container" style={{ transform: `scale(${zoom})` }}>
                <iframe
                  ref={pdfIframeRef}
                  title={lesson.title || "file-preview"}
                  src={lesson.fileUrl}
                  className="pdf-iframe"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  onLoad={handleIframeLoad}
                  style={{ 
                    width: '100%', 
                    height: '80vh', 
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            )}

            {!lesson.fileUrl && lesson.contentType !== "text" && (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h6">No preview available</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>You can download or open the file.</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" startIcon={<GetAppIcon />} onClick={downloadFile} sx={{ mr: 1 }}>Download</Button>
                  <Button variant="outlined" startIcon={<OpenInNewIcon />} onClick={openInNewTab}>Open in new tab</Button>
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="preview-loading">
            <Typography sx={{ mt: 2 }}>No preview available</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

FullscreenLessonViewer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lessonId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  darkMode: PropTypes.bool,
};

export default FullscreenLessonViewer;