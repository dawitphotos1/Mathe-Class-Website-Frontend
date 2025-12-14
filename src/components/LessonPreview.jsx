// src/components/LessonPreview.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Slide,
  LinearProgress,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import ErrorIcon from "@mui/icons-material/Error";
import BugReportIcon from "@mui/icons-material/BugReport";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// 🔥 CRITICAL: Fix Cloudinary URLs helper
const fixCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  console.log(`🔧 fixCloudinaryUrl called with: ${url.substring(0, 100)}...`);
  
  // Fix Cloudinary PDF URLs that are incorrectly typed as images
  if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
    // Check for PDFs
    if (url.includes('.pdf') || url.includes('/pdfs/') || url.includes('/mathe-class/pdfs/')) {
      const fixedUrl = url.replace('/image/upload/', '/raw/upload/');
      console.log(`🔧 Fixed Cloudinary PDF URL: ${fixedUrl.substring(0, 100)}...`);
      return fixedUrl;
    }
    
    // Fix Office documents
    if (url.match(/\.(doc|docx|ppt|pptx|xls|xlsx)(\?|$)/i)) {
      const fixedUrl = url.replace('/image/upload/', '/raw/upload/');
      console.log(`🔧 Fixed Office document URL: ${fixedUrl.substring(0, 100)}...`);
      return fixedUrl;
    }
  }
  
  return url;
};

// Helper to normalize URLs
const normalizeUrl = (url, backendUrl = window.location.origin) => {
  if (!url) return null;
  
  console.log(`🌐 normalizeUrl called with: ${url}`);
  
  // First, fix any Cloudinary URL issues
  url = fixCloudinaryUrl(url);
  
  // If already absolute URL, return
  if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
    console.log(`✅ Already absolute URL: ${url.substring(0, 100)}...`);
    return url;
  }
  
  // If starts with /Uploads or Uploads, use files route
  if (url.startsWith("/Uploads") || url.startsWith("Uploads/")) {
    const normalized = `${backendUrl}/api/v1/files/${encodeURIComponent(url.replace(/^\/?Uploads\//, ""))}`;
    console.log(`📁 Local file normalized to: ${normalized.substring(0, 100)}...`);
    return normalized;
  }
  
  // If it's a simple filename, use files route
  if (!url.includes("/") && !url.includes(":")) {
    const normalized = `${backendUrl}/api/v1/files/${encodeURIComponent(url)}`;
    console.log(`📄 Simple filename normalized to: ${normalized}`);
    return normalized;
  }
  
  // otherwise return as-is
  console.log(`⚠️ Returning URL as-is: ${url.substring(0, 100)}...`);
  return url;
};

/**
 * LessonPreview - Enhanced with debugging
 */
const LessonPreview = ({ open, onClose, lesson }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [iframeKey, setIframeKey] = useState(0); // To force iframe reload

  useEffect(() => {
    if (open && lesson) {
      console.log("🎬 LessonPreview opened with lesson:", lesson);
      analyzeLessonData(lesson);
      setIframeKey(prev => prev + 1); // Force iframe refresh
    }
  }, [open, lesson]);

  const analyzeLessonData = (lessonData) => {
    console.group("📊 Lesson Data Analysis");
    
    const contentType = 
      lessonData.contentType ??
      lessonData.content_type ??
      (lessonData.fileUrl || lessonData.file_url ? "pdf" : "text");
    
    const fileUrl = 
      lessonData.fileUrl ??
      lessonData.file_url ??
      lessonData.file;
    
    const videoUrl = 
      lessonData.videoUrl ??
      lessonData.video_url ??
      lessonData.video;
    
    console.log("Content Type:", contentType);
    console.log("File URL (raw):", fileUrl);
    console.log("Video URL (raw):", videoUrl);
    
    // Normalize URLs
    const normalizedFileUrl = normalizeUrl(fileUrl);
    const normalizedVideoUrl = normalizeUrl(videoUrl);
    
    console.log("Normalized File URL:", normalizedFileUrl);
    console.log("Normalized Video URL:", normalizedVideoUrl);
    
    // Store debug info
    setDebugInfo({
      contentType,
      originalFileUrl: fileUrl,
      normalizedFileUrl,
      originalVideoUrl: videoUrl,
      normalizedVideoUrl,
      lessonId: lessonData.id,
      timestamp: new Date().toISOString(),
    });
    
    console.groupEnd();
    
    return { contentType, normalizedFileUrl, normalizedVideoUrl };
  };

  const testUrlAccessibility = async (url) => {
    if (!url) return { accessible: false, error: "No URL provided" };
    
    try {
      console.log(`🔍 Testing URL accessibility: ${url.substring(0, 100)}...`);
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return { accessible: true, status: response.status };
    } catch (error) {
      console.log(`❌ URL test failed:`, error.message);
      return { accessible: false, error: error.message };
    }
  };

  const renderContent = () => {
    if (!lesson) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h6">No lesson data provided</Typography>
        </Box>
      );
    }

    const { contentType, normalizedFileUrl, normalizedVideoUrl } = analyzeLessonData(lesson);
    const ct = contentType.toLowerCase();

    // Show debug info in development
    if (process.env.NODE_ENV === 'development' && debugInfo) {
      console.log("Debug Info:", debugInfo);
    }

    // PDF Content
    if ((ct === "pdf" || (normalizedFileUrl && /\.pdf($|\?)/i.test(normalizedFileUrl))) && normalizedFileUrl) {
      console.log(`📄 Rendering PDF: ${normalizedFileUrl.substring(0, 100)}...`);
      
      return (
        <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
          {loading && <LinearProgress />}
          
          {/* Debug banner for Cloudinary URLs */}
          {normalizedFileUrl.includes('cloudinary.com') && (
            <Alert 
              severity="info" 
              sx={{ mb: 1, mx: 2, mt: 2 }}
              icon={<BugReportIcon />}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  Cloudinary PDF Detected
                  {normalizedFileUrl.includes('/image/upload/') && " (⚠️ Needs /raw/upload/)"}
                  {normalizedFileUrl.includes('/raw/upload/') && " (✅ Correct format)"}
                </Typography>
                <Chip 
                  label="Cloudinary" 
                  size="small" 
                  color={normalizedFileUrl.includes('/raw/upload/') ? "success" : "warning"}
                />
              </Box>
            </Alert>
          )}
          
          <iframe
            key={iframeKey}
            title={lesson.title || "Lesson PDF Preview"}
            src={normalizedFileUrl}
            style={{ 
              width: "100%", 
              height: "100%", 
              border: "none",
              flex: 1
            }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={() => {
              console.log("✅ Iframe loaded successfully");
              setLoading(false);
              setError(null);
            }}
            onError={(e) => {
              console.error("❌ Iframe error:", e);
              setError("Failed to load PDF. The file may be inaccessible or in wrong format.");
              setLoading(false);
            }}
          />
          
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              <Typography variant="body2">{error}</Typography>
              <Button 
                size="small" 
                onClick={() => window.open(normalizedFileUrl, '_blank')}
                sx={{ mt: 1 }}
              >
                Try opening in new tab
              </Button>
            </Alert>
          )}
        </Box>
      );
    }

    // Video Content
    if ((ct === "video" || (normalizedVideoUrl && /\.(mp4|webm|mov|ogg)($|\?)/i.test(normalizedVideoUrl))) && normalizedVideoUrl) {
      return (
        <Box sx={{ p: 2, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <video
            controls
            src={normalizedVideoUrl}
            style={{ width: "100%", maxHeight: "100%" }}
            onError={(e) => {
              console.error("Video error:", e);
              setError("Failed to load video");
            }}
          >
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    }

    // Image Content
    if ((ct === "image" || (normalizedFileUrl && /\.(jpe?g|png|gif|webp|svg)($|\?)/i.test(normalizedFileUrl))) && normalizedFileUrl) {
      return (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <img
            src={normalizedFileUrl}
            alt={lesson.title || "Lesson Image"}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            onError={(e) => {
              console.error("Image error:", e);
              setError("Failed to load image");
            }}
          />
        </Box>
      );
    }

    // Text Content
    const textContent = lesson.textContent ?? lesson.content ?? lesson.text ?? "";
    return (
      <Box sx={{ p: 3, overflow: "auto", height: "100%" }}>
        {textContent ? (
          <div dangerouslySetInnerHTML={{ __html: textContent }} />
        ) : (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <ArticleIcon sx={{ fontSize: 64, opacity: 0.35 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No preview available
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              This lesson has no previewable content.
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const hasDownload = !!debugInfo?.normalizedFileUrl;
  const openInNewTab = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!debugInfo?.normalizedFileUrl) return;
    
    const a = document.createElement("a");
    a.href = debugInfo.normalizedFileUrl;
    a.download = (lesson?.title || "lesson").replace(/\s+/g, "_") + ".pdf";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{ sx: { backgroundColor: "background.paper" } }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" noWrap>
            {lesson?.title || "Lesson Preview"}
            {debugInfo?.contentType && (
              <Chip 
                label={debugInfo.contentType.toUpperCase()} 
                size="small" 
                sx={{ ml: 2, verticalAlign: 'middle' }} 
              />
            )}
          </Typography>

          {/* Debug button in development */}
          {process.env.NODE_ENV === 'development' && (
            <Tooltip title="Debug Info">
              <IconButton
                color="inherit"
                onClick={() => {
                  console.log("🐛 Debug Info:", debugInfo);
                  alert(`Debug info logged to console.\nFile URL: ${debugInfo?.normalizedFileUrl}`);
                }}
                sx={{ mr: 1 }}
              >
                <BugReportIcon />
              </IconButton>
            </Tooltip>
          )}

          {debugInfo?.normalizedVideoUrl && (
            <Button
              color="inherit"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={() => openInNewTab(debugInfo.normalizedVideoUrl)}
              sx={{ mr: 1 }}
            >
              Open Video
            </Button>
          )}

          {hasDownload && (
            <>
              <Button
                color="inherit"
                startIcon={<OpenInNewIcon />}
                onClick={() => openInNewTab(debugInfo.normalizedFileUrl)}
                sx={{ mr: 1 }}
              >
                Open
              </Button>
              <Button
                color="inherit"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Download
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ height: "calc(100% - 64px)", bgcolor: "background.default", position: 'relative' }}>
        {renderContent()}
      </Box>
    </Dialog>
  );
};

LessonPreview.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lesson: PropTypes.object,
};

// Add global helper for debugging
if (typeof window !== 'undefined') {
  window.debugLessonPreview = (lesson) => {
    console.group("🧪 Lesson Preview Debug");
    console.log("Lesson Object:", lesson);
    
    const fixCloudinaryUrl = (url) => {
      if (!url || typeof url !== 'string') return url;
      if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
        if (url.includes('.pdf') || url.includes('/pdfs/')) {
          return url.replace('/image/upload/', '/raw/upload/');
        }
      }
      return url;
    };
    
    const fileUrl = lesson?.fileUrl || lesson?.file_url;
    if (fileUrl) {
      console.log("Original File URL:", fileUrl);
      console.log("Fixed File URL:", fixCloudinaryUrl(fileUrl));
      console.log("Is Cloudinary PDF:", fileUrl.includes('cloudinary.com') && fileUrl.includes('.pdf'));
      console.log("Needs Fix:", fileUrl.includes('/image/upload/') && fileUrl.includes('.pdf'));
    }
    
    console.groupEnd();
  };
}

export default LessonPreview;