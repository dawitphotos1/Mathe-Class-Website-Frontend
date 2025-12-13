// import React, { useEffect, useRef, useState } from "react";
// import PropTypes from "prop-types";
// import Dialog from "@mui/material/Dialog";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import CircularProgress from "@mui/material/CircularProgress";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Stack from "@mui/material/Stack";
// import DownloadIcon from "@mui/icons-material/Download";
// import CloseIcon from "@mui/icons-material/Close";
// import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import ZoomOutIcon from "@mui/icons-material/ZoomOut";
// import RotateLeftIcon from "@mui/icons-material/RotateLeft";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import "./LessonPreview.css";

// /**
//  * LessonPreview
//  *
//  * Props:
//  * - open (bool) - whether dialog is open
//  * - onClose (fn) - close handler
//  * - lesson (object) - { title, fileUrl, videoUrl, contentType, textContent }
//  *
//  * contentType is expected to be "pdf", "video", "image", "text" (or fallback)
//  */
// const LessonPreview = ({ open, onClose, lesson = {} }) => {
//   const { title = "Lesson Preview", fileUrl = null, videoUrl = null, contentType = null, textContent = "" } = lesson;
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [zoom, setZoom] = useState(1);
//   const [rotate, setRotate] = useState(0);
//   const containerRef = useRef(null);

//   const resolvedType = (() => {
//     if (contentType) return contentType;
//     if (videoUrl) return "video";
//     if (fileUrl) {
//       const ext = fileUrl.split(".").pop()?.split("?")[0]?.toLowerCase();
//       if (ext === "pdf") return "pdf";
//       if (["mp4", "webm", "mov"].includes(ext)) return "video";
//       if (["jpg", "jpeg", "png", "gif", "svg"].includes(ext)) return "image";
//       // fallback
//       return "file";
//     }
//     if (textContent) return "text";
//     return "unknown";
//   })();

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     setZoom(1);
//     setRotate(0);
//   }, [open, fileUrl, videoUrl, textContent, contentType]);

//   useEffect(() => {
//     // close on Escape
//     const onKey = (e) => {
//       if (e.key === "Escape") onClose?.();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [onClose]);

//   const handleDownload = () => {
//     const href = videoUrl || fileUrl || null;
//     if (!href) return;
//     // open in new tab (safer), also trigger download attribute
//     const a = document.createElement("a");
//     a.href = href;
//     a.target = "_blank";
//     a.rel = "noopener noreferrer";
//     // set download only for local raw files; browsers may ignore cross-origin download
//     try { a.download = href.split("/").pop().split("?")[0]; } catch (e) {}
//     a.click();
//   };

//   const handleOpenInNew = () => {
//     const href = videoUrl || fileUrl || null;
//     if (!href) return;
//     window.open(href, "_blank", "noopener,noreferrer");
//   };

//   const renderContent = () => {
//     if (resolvedType === "pdf" && fileUrl) {
//       return (
//         <div className="lp-embedded-wrapper" ref={containerRef}>
//           {/* iframe PDF viewer (Cloudinary raw URLs or /api/v1/files/... ) */}
//           <iframe
//             title={title}
//             src={fileUrl}
//             onLoad={() => setLoading(false)}
//             onError={() => { setLoading(false); setError("Failed to load PDF"); }}
//             className="lp-iframe"
//             style={{
//               transform: `scale(${zoom}) rotate(${rotate}deg)`,
//               transformOrigin: "top left",
//             }}
//           />
//         </div>
//       );
//     }

//     if (resolvedType === "video" && (videoUrl || fileUrl)) {
//       const src = videoUrl || fileUrl;
//       return (
//         <div className="lp-media-wrapper">
//           <video
//             controls
//             autoPlay={false}
//             onLoadedData={() => setLoading(false)}
//             onError={() => { setLoading(false); setError("Failed to load video"); }}
//             className="lp-video"
//             src={src}
//           >
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       );
//     }

//     if (resolvedType === "image" && fileUrl) {
//       return (
//         <div className="lp-media-wrapper">
//           <img
//             src={fileUrl}
//             alt={title}
//             className="lp-image"
//             onLoad={() => setLoading(false)}
//             onError={() => { setLoading(false); setError("Failed to load image"); }}
//             style={{
//               transform: `scale(${zoom}) rotate(${rotate}deg)`,
//             }}
//           />
//         </div>
//       );
//     }

//     if (resolvedType === "text" && textContent) {
//       return (
//         <div className="lp-text-wrapper">
//           <div className="lp-text" dangerouslySetInnerHTML={{ __html: textContent }} />
//         </div>
//       );
//     }

//     // fallback: try to show fileUrl in iframe (may be HTML or PDF)
//     if ((fileUrl || videoUrl) && resolvedType === "file") {
//       const href = fileUrl || videoUrl;
//       return (
//         <div className="lp-embedded-wrapper" ref={containerRef}>
//           <iframe
//             title={title}
//             src={href}
//             onLoad={() => setLoading(false)}
//             onError={() => { setLoading(false); setError("Failed to load file"); }}
//             className="lp-iframe"
//             style={{ transform: `scale(${zoom}) rotate(${rotate}deg)`, transformOrigin: "top left" }}
//           />
//         </div>
//       );
//     }

//     setLoading(false);
//     return <div className="lp-empty">No preview available for this lesson.</div>;
//   };

//   return (
//     <Dialog
//       fullScreen
//       open={!!open}
//       onClose={onClose}
//       PaperProps={{ className: "lesson-preview-dialog" }}
//     >
//       <AppBar position="sticky" color="transparent" elevation={0} className="lp-appbar">
//         <Toolbar className="lp-toolbar">
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Typography variant="h6" component="div" className="lp-title">
//               {title}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" className="lp-subtitle">
//               {resolvedType?.toUpperCase()}
//             </Typography>
//           </Box>

//           <Stack direction="row" spacing={1} className="lp-actions">
//             <Tooltip title="Zoom in">
//               <IconButton onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2))} size="large">
//                 <ZoomInIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Zoom out">
//               <IconButton onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2))} size="large">
//                 <ZoomOutIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Rotate">
//               <IconButton onClick={() => setRotate((r) => (r + 90) % 360)} size="large">
//                 <RotateLeftIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Open in new tab">
//               <IconButton onClick={handleOpenInNew} size="large">
//                 <OpenInNewIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Download">
//               <IconButton onClick={handleDownload} size="large">
//                 <DownloadIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Close">
//               <IconButton onClick={onClose} size="large">
//                 <CloseIcon />
//               </IconButton>
//             </Tooltip>
//           </Stack>
//         </Toolbar>
//       </AppBar>

//       <Box className="lp-body">
//         {loading && (
//           <Box className="lp-loader">
//             <CircularProgress />
//           </Box>
//         )}

//         {error && (
//           <Box className="lp-error">
//             <Typography variant="body1" color="error">
//               {error}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//               You can try to open the file in a new tab.
//             </Typography>
//             <Box sx={{ mt: 2 }}>
//               <button className="lp-open-btn" onClick={handleOpenInNew}>
//                 Open in new tab
//               </button>
//             </Box>
//           </Box>
//         )}

//         {!error && renderContent()}
//       </Box>
//     </Dialog>
//   );
// };

// LessonPreview.propTypes = {
//   open: PropTypes.bool,
//   onClose: PropTypes.func,
//   lesson: PropTypes.shape({
//     title: PropTypes.string,
//     fileUrl: PropTypes.string,
//     videoUrl: PropTypes.string,
//     contentType: PropTypes.string,
//     textContent: PropTypes.string,
//   }),
// };

// export default LessonPreview;




// src/components/LessonPreview.jsx
import React from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * LessonPreview
 * - full-screen preview dialog
 * - supports PDF (iframe), video (video tag), image, and rich text/html
 *
 * Props:
 * - open (bool)
 * - onClose (fn)
 * - lesson (object) - supports mixed casing (fileUrl / file_url / videoUrl / video_url, content_type/contentType, textContent/content)
 */
const LessonPreview = ({ open, onClose, lesson }) => {
  if (!lesson) return null;

  // compatibility: accept snake_case or camelCase
  const contentType =
    lesson.contentType ??
    lesson.content_type ??
    lesson.type ??
    (lesson.fileUrl || lesson.file_url ? "pdf" : "text");

  const videoUrl =
    lesson.videoUrl ?? lesson.video_url ?? lesson.video ?? null;

  const fileUrl =
    lesson.fileUrl ??
    lesson.file_url ??
    lesson.file ??
    lesson.fileUrl ??
    null;

  const textContent =
    lesson.textContent ?? lesson.content ?? lesson.text ?? "";

  // Helper to produce displayable URL: if path starts with /Uploads or doesn't start with http(s)
  const normalizeUrl = (url) => {
    if (!url) return null;
    // If already absolute URL, return
    if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) return url;
    // If starts with /Uploads or Uploads, use window.origin prefix
    if (url.startsWith("/Uploads") || url.startsWith("Uploads/")) {
      return `${window.location.origin}/api/v1/files/${encodeURIComponent(url.replace(/^\/?Uploads\//, ""))}`;
    }
    // Fallback: treat as filename served by /api/v1/files/:filename
    if (!url.includes("/")) {
      return `${window.location.origin}/api/v1/files/${encodeURIComponent(url)}`;
    }
    // otherwise return as-is
    return url;
  };

  const normalizedFileUrl = normalizeUrl(fileUrl);
  const normalizedVideoUrl = normalizeUrl(videoUrl);

  const renderContent = () => {
    const ct = (contentType || "").toLowerCase();

    if ((ct === "pdf" || (normalizedFileUrl && /\.pdf($|\?)/i.test(normalizedFileUrl))) && normalizedFileUrl) {
      // iframe PDF viewer
      return (
        <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
          <iframe
            title={lesson.title || "Lesson PDF Preview"}
            src={normalizedFileUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </Box>
      );
    }

    if ((ct === "video" || (normalizedVideoUrl && /\.(mp4|webm|mov|ogg)($|\?)/i.test(normalizedVideoUrl))) && normalizedVideoUrl) {
      return (
        <Box sx={{ p: 2, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <video
            controls
            src={normalizedVideoUrl}
            style={{ width: "100%", maxHeight: "100%" }}
          >
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    }

    if ((ct === "image" || (normalizedFileUrl && /\.(jpe?g|png|gif|webp|svg)($|\?)/i.test(normalizedFileUrl))) && normalizedFileUrl) {
      return (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <img
            src={normalizedFileUrl}
            alt={lesson.title || "Lesson Image"}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </Box>
      );
    }

    // Default: render text/html content
    return (
      <Box sx={{ p: 3, overflow: "auto", height: "100%" }}>
        {textContent ? (
          // assume content may contain HTML from rich editor
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

  const hasDownload = !!normalizedFileUrl;
  const openInNewTab = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
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
            {lesson.title || "Lesson Preview"}
          </Typography>

          {normalizedVideoUrl && (
            <Button
              color="inherit"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={() => openInNewTab(normalizedVideoUrl)}
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
                onClick={() => openInNewTab(normalizedFileUrl)}
                sx={{ mr: 1 }}
              >
                Open
              </Button>
              <Button
                color="inherit"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  // force download by creating a temporary link
                  const a = document.createElement("a");
                  a.href = normalizedFileUrl;
                  a.download = (lesson.title || "lesson").replace(/\s+/g, "_");
                  a.target = "_blank";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }}
              >
                Download
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ height: "calc(100% - 64px)", bgcolor: "background.default" }}>
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

export default LessonPreview;
