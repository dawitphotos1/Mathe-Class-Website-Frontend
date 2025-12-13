// // src/components/LessonPreview.jsx
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   Dialog,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   Box,
//   Button,
//   Slide,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import DownloadIcon from "@mui/icons-material/Download";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// import ImageIcon from "@mui/icons-material/Image";
// import ArticleIcon from "@mui/icons-material/Article";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// /**
//  * LessonPreview
//  * - full-screen preview dialog
//  * - supports PDF (iframe), video (video tag), image, and rich text/html
//  *
//  * Props:
//  * - open (bool)
//  * - onClose (fn)
//  * - lesson (object) - supports mixed casing (fileUrl / file_url / videoUrl / video_url, content_type/contentType, textContent/content)
//  */
// const LessonPreview = ({ open, onClose, lesson }) => {
//   if (!lesson) return null;

//   // compatibility: accept snake_case or camelCase
//   const contentType =
//     lesson.contentType ??
//     lesson.content_type ??
//     lesson.type ??
//     (lesson.fileUrl || lesson.file_url ? "pdf" : "text");

//   const videoUrl =
//     lesson.videoUrl ?? lesson.video_url ?? lesson.video ?? null;

//   const fileUrl =
//     lesson.fileUrl ??
//     lesson.file_url ??
//     lesson.file ??
//     lesson.fileUrl ??
//     null;

//   const textContent =
//     lesson.textContent ?? lesson.content ?? lesson.text ?? "";

//   // Helper to produce displayable URL: if path starts with /Uploads or doesn't start with http(s)
//   const normalizeUrl = (url) => {
//     if (!url) return null;
//     // If already absolute URL, return
//     if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) return url;
//     // If starts with /Uploads or Uploads, use window.origin prefix
//     if (url.startsWith("/Uploads") || url.startsWith("Uploads/")) {
//       return `${window.location.origin}/api/v1/files/${encodeURIComponent(url.replace(/^\/?Uploads\//, ""))}`;
//     }
//     // Fallback: treat as filename served by /api/v1/files/:filename
//     if (!url.includes("/")) {
//       return `${window.location.origin}/api/v1/files/${encodeURIComponent(url)}`;
//     }
//     // otherwise return as-is
//     return url;
//   };

//   const normalizedFileUrl = normalizeUrl(fileUrl);
//   const normalizedVideoUrl = normalizeUrl(videoUrl);

//   const renderContent = () => {
//     const ct = (contentType || "").toLowerCase();

//     if ((ct === "pdf" || (normalizedFileUrl && /\.pdf($|\?)/i.test(normalizedFileUrl))) && normalizedFileUrl) {
//       // iframe PDF viewer
//       return (
//         <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
//           <iframe
//             title={lesson.title || "Lesson PDF Preview"}
//             src={normalizedFileUrl}
//             style={{ width: "100%", height: "100%", border: "none" }}
//             sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
//           />
//         </Box>
//       );
//     }

//     if ((ct === "video" || (normalizedVideoUrl && /\.(mp4|webm|mov|ogg)($|\?)/i.test(normalizedVideoUrl))) && normalizedVideoUrl) {
//       return (
//         <Box sx={{ p: 2, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <video
//             controls
//             src={normalizedVideoUrl}
//             style={{ width: "100%", maxHeight: "100%" }}
//           >
//             Your browser does not support the video tag.
//           </video>
//         </Box>
//       );
//     }

//     if ((ct === "image" || (normalizedFileUrl && /\.(jpe?g|png|gif|webp|svg)($|\?)/i.test(normalizedFileUrl))) && normalizedFileUrl) {
//       return (
//         <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//           <img
//             src={normalizedFileUrl}
//             alt={lesson.title || "Lesson Image"}
//             style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
//           />
//         </Box>
//       );
//     }

//     // Default: render text/html content
//     return (
//       <Box sx={{ p: 3, overflow: "auto", height: "100%" }}>
//         {textContent ? (
//           // assume content may contain HTML from rich editor
//           <div dangerouslySetInnerHTML={{ __html: textContent }} />
//         ) : (
//           <Box sx={{ textAlign: "center", mt: 4 }}>
//             <ArticleIcon sx={{ fontSize: 64, opacity: 0.35 }} />
//             <Typography variant="h6" sx={{ mt: 2 }}>
//               No preview available
//             </Typography>
//             <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//               This lesson has no previewable content.
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   const hasDownload = !!normalizedFileUrl;
//   const openInNewTab = (url) => {
//     if (!url) return;
//     window.open(url, "_blank", "noopener,noreferrer");
//   };

//   return (
//     <Dialog
//       fullScreen
//       open={open}
//       onClose={onClose}
//       TransitionComponent={Transition}
//       PaperProps={{ sx: { backgroundColor: "background.paper" } }}
//     >
//       <AppBar sx={{ position: "relative" }}>
//         <Toolbar>
//           <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
//             <CloseIcon />
//           </IconButton>
//           <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" noWrap>
//             {lesson.title || "Lesson Preview"}
//           </Typography>

//           {normalizedVideoUrl && (
//             <Button
//               color="inherit"
//               startIcon={<PlayCircleOutlineIcon />}
//               onClick={() => openInNewTab(normalizedVideoUrl)}
//               sx={{ mr: 1 }}
//             >
//               Open Video
//             </Button>
//           )}

//           {hasDownload && (
//             <>
//               <Button
//                 color="inherit"
//                 startIcon={<OpenInNewIcon />}
//                 onClick={() => openInNewTab(normalizedFileUrl)}
//                 sx={{ mr: 1 }}
//               >
//                 Open
//               </Button>
//               <Button
//                 color="inherit"
//                 startIcon={<DownloadIcon />}
//                 onClick={() => {
//                   // force download by creating a temporary link
//                   const a = document.createElement("a");
//                   a.href = normalizedFileUrl;
//                   a.download = (lesson.title || "lesson").replace(/\s+/g, "_");
//                   a.target = "_blank";
//                   document.body.appendChild(a);
//                   a.click();
//                   a.remove();
//                 }}
//               >
//                 Download
//               </Button>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>

//       <Box sx={{ height: "calc(100% - 64px)", bgcolor: "background.default" }}>
//         {renderContent()}
//       </Box>
//     </Dialog>
//   );
// };

// LessonPreview.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   lesson: PropTypes.object,
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

// 🔥 NEW: Helper to fix Cloudinary URLs
const fixCloudinaryUrl = (url) => {
  if (!url) return url;
  
  // Fix Cloudinary PDF URLs that are incorrectly typed as images
  if (url.includes('cloudinary.com') && 
      url.includes('/image/upload/') && 
      (url.includes('.pdf') || url.includes('/pdfs/') || url.includes('/mathe-class/pdfs/'))) {
    console.log(`🔧 Frontend: Fixing Cloudinary PDF URL: ${url.substring(0, 80)}...`);
    return url.replace('/image/upload/', '/raw/upload/');
  }
  
  // Fix Office documents
  if (url.includes('cloudinary.com') && 
      url.includes('/image/upload/') && 
      url.match(/\.(doc|docx|ppt|pptx|xls|xlsx)(\?|$)/i)) {
    console.log(`🔧 Frontend: Fixing Office document URL: ${url.substring(0, 80)}...`);
    return url.replace('/image/upload/', '/raw/upload/');
  }
  
  return url;
};

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

  // Updated normalizeUrl function with URL fixing
  const normalizeUrl = (url) => {
    if (!url) return null;
    
    // 🔥 FIX: First, fix any Cloudinary URL issues
    url = fixCloudinaryUrl(url);
    
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