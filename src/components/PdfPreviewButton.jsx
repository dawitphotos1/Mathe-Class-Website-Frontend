// // src/components/PdfPreviewButton.jsx - FINAL WORKING VERSION
// import React, { useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   IconButton,
//   Box,
//   CircularProgress,
//   Typography,
//   Alert
// } from '@mui/material';
// import { Close, Download, Visibility, OpenInNew } from '@mui/icons-material';

// const PdfPreviewButton = ({ 
//   lesson, 
//   variant = 'default', 
//   size = 'medium', 
//   style = {} 
// }) => {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const iframeRef = useRef(null);
//   const timeoutRef = useRef(null);

//   const normalizeLesson = (lesson) => {
//     const fileUrl = 
//       lesson.fileUrl || 
//       lesson.file_url || 
//       lesson.file ||
//       (lesson.uploads && lesson.uploads.fileUrl) ||
//       null;
    
//     const contentType = 
//       lesson.contentType || 
//       lesson.content_type || 
//       (fileUrl ? (fileUrl.includes('.pdf') ? 'pdf' : 'file') : 'text');
    
//     return {
//       id: lesson.id,
//       title: lesson.title || 'Untitled Document',
//       fileUrl: fileUrl,
//       contentType: contentType.toLowerCase()
//     };
//   };

//   // FIX: Transform Cloudinary URL for preview
//   const getPreviewUrl = (originalUrl) => {
//     if (!originalUrl) return null;
    
//     console.log('Original URL:', originalUrl);
    
//     // Check if it's a Cloudinary URL
//     if (originalUrl.includes('cloudinary.com')) {
//       // Transform /raw/upload/ to /image/upload/ for preview
//       if (originalUrl.includes('/raw/upload/')) {
//         // Method 1: Use Google Docs Viewer (most reliable)
//         const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(originalUrl)}&embedded=true`;
//         console.log('Using Google Docs Viewer:', googleViewerUrl);
//         return googleViewerUrl;
        
//         // Method 2: Transform Cloudinary URL (sometimes works)
//         // const previewUrl = originalUrl.replace('/raw/upload/', '/image/upload/fl_attachment/');
//         // console.log('Transformed Cloudinary URL:', previewUrl);
//         // return previewUrl;
//       }
      
//       // Already an image URL? Add PDF flag
//       if (originalUrl.includes('/image/upload/')) {
//         return `${originalUrl}.pdf`;
//       }
//     }
    
//     // Non-Cloudinary URL: use Google Docs Viewer
//     return `https://docs.google.com/gview?url=${encodeURIComponent(originalUrl)}&embedded=true`;
//   };

//   const handlePreviewClick = (e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
    
//     const normalized = normalizeLesson(lesson);
    
//     if (!normalized.fileUrl) {
//       console.warn('No file URL found for lesson:', lesson.id);
//       alert('No PDF file found for this lesson');
//       return;
//     }
    
//     console.log('Opening PDF preview for:', normalized.title);
//     console.log('Original URL:', normalized.fileUrl);
    
//     setOpen(true);
//     setLoading(true);
//     setError(null);
    
//     // Get preview URL
//     const preview = getPreviewUrl(normalized.fileUrl);
//     console.log('Preview URL:', preview);
    
//     if (!preview) {
//       setError('Could not generate preview URL');
//       setLoading(false);
//       return;
//     }
    
//     setPreviewUrl(preview);
    
//     // Set timeout to hide loading
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
    
//     timeoutRef.current = setTimeout(() => {
//       console.log('Auto-hiding loading spinner');
//       setLoading(false);
//     }, 2000); // Auto-hide after 2 seconds
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setLoading(false);
//     setError(null);
//     setPreviewUrl(null);
    
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   const handleDownload = () => {
//     const normalized = normalizeLesson(lesson);
//     if (normalized.fileUrl) {
//       const a = document.createElement('a');
//       a.href = normalized.fileUrl;
//       a.download = `${normalized.title.replace(/[^a-z0-9]/gi, '_') || 'document'}.pdf`;
//       a.target = '_blank';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     }
//   };

//   const handleIframeLoad = () => {
//     console.log('✅ PDF viewer loaded successfully');
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     setLoading(false);
//   };

//   const handleIframeError = (e) => {
//     console.error('❌ Iframe loading error:', e);
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     setError('Failed to load PDF viewer. Try opening in a new tab.');
//     setLoading(false);
//   };

//   const handleOpenInNewTab = () => {
//     const normalized = normalizeLesson(lesson);
//     if (normalized.fileUrl) {
//       window.open(normalized.fileUrl, '_blank', 'noopener,noreferrer');
//     }
//   };

//   const getButtonStyles = () => {
//     const base = {
//       border: 'none',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       display: 'inline-flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '8px',
//       fontFamily: 'inherit',
//       fontWeight: 500,
//       transition: 'all 0.2s',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//       '&:hover': {
//         transform: 'translateY(-1px)',
//         boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
//       }
//     };

//     const variants = {
//       default: { backgroundColor: '#4CAF50', color: 'white' },
//       primary: { backgroundColor: '#2196F3', color: 'white' },
//       teacher: { backgroundColor: '#9C27B0', color: 'white' }
//     };

//     const sizes = {
//       small: { padding: '6px 12px', fontSize: '13px', minWidth: '100px' },
//       medium: { padding: '8px 16px', fontSize: '14px', minWidth: '120px' },
//       large: { padding: '12px 24px', fontSize: '16px', minWidth: '140px' }
//     };

//     return {
//       ...base,
//       ...(variants[variant] || variants.default),
//       ...(sizes[size] || sizes.medium),
//       ...style
//     };
//   };

//   const normalizedLesson = normalizeLesson(lesson);
//   const hasPdf = !!normalizedLesson.fileUrl && 
//     (normalizedLesson.contentType === 'pdf' || 
//      normalizedLesson.contentType === 'file' || 
//      (normalizedLesson.fileUrl && normalizedLesson.fileUrl.includes('.pdf')));

//   if (!hasPdf) {
//     return (
//       <button
//         disabled
//         style={{
//           ...getButtonStyles(),
//           opacity: 0.5,
//           cursor: 'not-allowed',
//           backgroundColor: '#cccccc',
//           color: '#666666'
//         }}
//         title="No PDF available for this lesson"
//       >
//         <Visibility fontSize="small" />
//         No PDF
//       </button>
//     );
//   }

//   return (
//     <>
//       <button
//         onClick={handlePreviewClick}
//         style={getButtonStyles()}
//         title={`Preview PDF: ${normalizedLesson.title}`}
//       >
//         <Visibility fontSize="small" />
//         Preview PDF
//       </button>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{
//           sx: {
//             minHeight: '80vh',
//             maxHeight: '90vh',
//             '& .MuiDialogContent-root': {
//               padding: 0
//             }
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           m: 0, 
//           p: 2, 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between',
//           borderBottom: '1px solid #e0e0e0'
//         }}>
//           <Box component="div" sx={{ flex: 1 }}>
//             <Typography variant="h6" noWrap>
//               📄 {normalizedLesson.title}
//             </Typography>
//           </Box>
//           <IconButton 
//             onClick={handleClose} 
//             size="small"
//             aria-label="close"
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers sx={{ p: 0, position: 'relative', minHeight: '70vh' }}>
//           {loading && (
//             <Box sx={{ 
//               position: 'absolute', 
//               top: 0, 
//               left: 0, 
//               right: 0, 
//               bottom: 0, 
//               display: 'flex', 
//               flexDirection: 'column',
//               alignItems: 'center', 
//               justifyContent: 'center',
//               backgroundColor: 'rgba(255, 255, 255, 0.95)',
//               zIndex: 10 
//             }}>
//               <CircularProgress size={60} />
//               <Typography variant="body1" sx={{ mt: 2 }}>
//                 Loading PDF Viewer...
//               </Typography>
//               <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
//                 Using Google Docs Viewer for preview
//               </Typography>
//             </Box>
//           )}

//           {error && (
//             <Box sx={{ 
//               p: 4, 
//               textAlign: 'center', 
//               height: '100%', 
//               display: 'flex', 
//               flexDirection: 'column', 
//               justifyContent: 'center',
//               alignItems: 'center'
//             }}>
//               <Alert severity="error" sx={{ mb: 2, maxWidth: '400px' }}>
//                 <Typography variant="h6" gutterBottom>
//                   Preview Failed
//                 </Typography>
//                 <Typography variant="body2">
//                   {error}
//                 </Typography>
//               </Alert>
//               <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                 <Button 
//                   variant="contained" 
//                   onClick={handleOpenInNewTab}
//                   startIcon={<OpenInNew />}
//                 >
//                   Open Original in New Tab
//                 </Button>
//                 <Button 
//                   variant="outlined" 
//                   onClick={handlePreviewClick}
//                 >
//                   Try Preview Again
//                 </Button>
//               </Box>
//             </Box>
//           )}

//           {/* PDF Preview Iframe */}
//           {previewUrl && !error && (
//             <iframe
//               ref={iframeRef}
//               src={previewUrl}
//               title={`PDF Preview - ${normalizedLesson.title}`}
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 minHeight: '70vh',
//                 border: 'none',
//                 display: 'block'
//               }}
//               onLoad={handleIframeLoad}
//               onError={handleIframeError}
//               sandbox="allow-same-origin allow-scripts allow-popups"
//               allow="fullscreen"
//               referrerPolicy="no-referrer"
//               loading="eager"
//             />
//           )}
//         </DialogContent>

//         <DialogActions sx={{ 
//           p: 2, 
//           borderTop: '1px solid #e0e0e0',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//           gap: 1
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
//               Preview via Google Docs Viewer
//             </Typography>
//             {normalizedLesson.fileUrl.includes('cloudinary.com') && (
//               <Typography variant="caption" color="info.main" sx={{ fontSize: '0.7rem', ml: 1 }}>
//                 (Cloudinary file)
//               </Typography>
//             )}
//           </Box>
          
//           <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//             <Button
//               startIcon={<Download />}
//               onClick={handleDownload}
//               variant="contained"
//               color="primary"
//               size="medium"
//             >
//               Download Original
//             </Button>
//             <Button 
//               onClick={handleOpenInNewTab}
//               variant="outlined"
//               size="medium"
//               startIcon={<OpenInNew />}
//             >
//               Open in Tab
//             </Button>
//             <Button 
//               onClick={handleClose} 
//               variant="outlined"
//               size="medium"
//             >
//               Close
//             </Button>
//           </Box>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// PdfPreviewButton.propTypes = {
//   lesson: PropTypes.object.isRequired,
//   variant: PropTypes.string,
//   size: PropTypes.string,
//   style: PropTypes.object
// };

// export default PdfPreviewButton;





// src/components/PdfPreviewButton.jsx - FINAL WORKING VERSION
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { Close, Download, Visibility, OpenInNew, ContentCopy } from '@mui/icons-material';

const PdfPreviewButton = ({ 
  lesson, 
  variant = 'default', 
  size = 'medium', 
  style = {} 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  const normalizeLesson = (lesson) => {
    const fileUrl = 
      lesson.fileUrl || 
      lesson.file_url || 
      lesson.file ||
      (lesson.uploads && lesson.uploads.fileUrl) ||
      null;
    
    const contentType = 
      lesson.contentType || 
      lesson.content_type || 
      (fileUrl ? (fileUrl.includes('.pdf') ? 'pdf' : 'file') : 'text');
    
    return {
      id: lesson.id,
      title: lesson.title || 'Untitled Document',
      fileUrl: fileUrl,
      contentType: contentType.toLowerCase()
    };
  };

  // ✅ FIXED: Better URL transformation for Cloudinary PDFs
  const getPreviewUrl = (originalUrl) => {
    if (!originalUrl) return null;
    
    console.log('📄 Original URL for preview:', originalUrl);
    
    // Check if it's a Cloudinary URL
    if (originalUrl.includes('cloudinary.com')) {
      // Try different methods for Cloudinary PDFs
      
      // Method 1: Direct URL (works in new tab)
      console.log('Using direct Cloudinary URL for new tab');
      return originalUrl;
      
      // Note: For iframe preview, we'll handle it differently
    }
    
    // Non-Cloudinary URL: use Google Docs Viewer
    const googleUrl = `https://docs.google.com/gview?url=${encodeURIComponent(originalUrl)}&embedded=true`;
    console.log('Using Google Docs Viewer:', googleUrl);
    return googleUrl;
  };

  // ✅ NEW: Direct Cloudinary URL fixer
  const fixCloudinaryUrl = (url) => {
    if (!url) return url;
    
    // Ensure PDF uses raw upload
    if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
      if (url.includes('.pdf') || url.includes('/pdfs/')) {
        return url.replace('/image/upload/', '/raw/upload/');
      }
    }
    return url;
  };

  const handlePreviewClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const normalized = normalizeLesson(lesson);
    
    if (!normalized.fileUrl) {
      console.warn('❌ No file URL found for lesson:', lesson.id);
      alert('No PDF file found for this lesson');
      return;
    }
    
    console.log('📖 Opening PDF preview for:', normalized.title);
    console.log('📄 Original URL:', normalized.fileUrl);
    
    setOpen(true);
    setLoading(true);
    setError(null);
    
    // Fix Cloudinary URL if needed
    const fixedUrl = fixCloudinaryUrl(normalized.fileUrl);
    console.log('✅ Fixed URL:', fixedUrl);
    
    // Get preview URL
    const preview = getPreviewUrl(fixedUrl);
    console.log('🔗 Preview URL:', preview);
    
    if (!preview) {
      setError('Could not generate preview URL');
      setLoading(false);
      return;
    }
    
    setPreviewUrl(preview);
    
    // Set timeout to hide loading
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      console.log('⏱️ Auto-hiding loading spinner');
      setLoading(false);
    }, 3000); // Auto-hide after 3 seconds
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setError(null);
    setPreviewUrl(null);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDownload = () => {
    const normalized = normalizeLesson(lesson);
    let fileUrl = fixCloudinaryUrl(normalized.fileUrl);
    
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = `${normalized.title.replace(/[^a-z0-9]/gi, '_') || 'document'}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleIframeLoad = () => {
    console.log('✅ PDF viewer loaded successfully');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
  };

  const handleIframeError = (e) => {
    console.error('❌ Iframe loading error:', e);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError('PDF preview failed. Try opening in a new tab or downloading.');
    setLoading(false);
  };

  const handleOpenInNewTab = () => {
    const normalized = normalizeLesson(lesson);
    let fileUrl = fixCloudinaryUrl(normalized.fileUrl);
    
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyUrl = () => {
    const normalized = normalizeLesson(lesson);
    let fileUrl = fixCloudinaryUrl(normalized.fileUrl);
    
    if (fileUrl) {
      navigator.clipboard.writeText(fileUrl);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  const getButtonStyles = () => {
    const base = {
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'inherit',
      fontWeight: 500,
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
      }
    };

    const variants = {
      default: { backgroundColor: '#4CAF50', color: 'white' },
      primary: { backgroundColor: '#2196F3', color: 'white' },
      teacher: { backgroundColor: '#9C27B0', color: 'white' }
    };

    const sizes = {
      small: { padding: '6px 12px', fontSize: '13px', minWidth: '100px' },
      medium: { padding: '8px 16px', fontSize: '14px', minWidth: '120px' },
      large: { padding: '12px 24px', fontSize: '16px', minWidth: '140px' }
    };

    return {
      ...base,
      ...(variants[variant] || variants.default),
      ...(sizes[size] || sizes.medium),
      ...style
    };
  };

  const normalizedLesson = normalizeLesson(lesson);
  const hasPdf = !!normalizedLesson.fileUrl && 
    (normalizedLesson.contentType === 'pdf' || 
     normalizedLesson.contentType === 'file' || 
     (normalizedLesson.fileUrl && normalizedLesson.fileUrl.includes('.pdf')));

  if (!hasPdf) {
    return (
      <button
        disabled
        style={{
          ...getButtonStyles(),
          opacity: 0.5,
          cursor: 'not-allowed',
          backgroundColor: '#cccccc',
          color: '#666666'
        }}
        title="No PDF available for this lesson"
      >
        <Visibility fontSize="small" />
        No PDF
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handlePreviewClick}
        style={getButtonStyles()}
        title={`Preview PDF: ${normalizedLesson.title}`}
      >
        <Visibility fontSize="small" />
        Preview PDF
      </button>

      {/* Copied URL Snackbar */}
      <Snackbar
        open={showCopiedMessage}
        autoHideDuration={2000}
        onClose={() => setShowCopiedMessage(false)}
        message="✅ PDF URL copied to clipboard!"
      />

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '80vh',
            maxHeight: '90vh',
            '& .MuiDialogContent-root': {
              padding: 0
            }
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
          <Box component="div" sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
              📄 {normalizedLesson.title}
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap>
              {normalizedLesson.fileUrl.includes('cloudinary.com') ? 'Cloudinary PDF' : 'PDF Document'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            size="small"
            aria-label="close"
            sx={{ ml: 1 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0, position: 'relative', minHeight: '70vh' }}>
          {loading && (
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
              <CircularProgress size={60} />
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
                Loading PDF...
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Cloudinary PDFs may take a moment to load
              </Typography>
            </Box>
          )}

          {error && (
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
                  PDF Preview Unavailable
                </Typography>
                <Typography variant="body2">
                  Cloudinary PDFs cannot be previewed in an iframe due to security restrictions.
                </Typography>
              </Alert>
              
              <Alert severity="info" sx={{ mb: 3, maxWidth: '400px' }}>
                <Typography variant="body2">
                  Please use one of the options below to view your PDF.
                </Typography>
              </Alert>
              
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: '400px' }}>
                <Button 
                  variant="contained" 
                  onClick={handleOpenInNewTab}
                  startIcon={<OpenInNew />}
                  fullWidth
                  size="large"
                >
                  Open PDF in New Tab
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={handleDownload}
                  startIcon={<Download />}
                  fullWidth
                  size="large"
                >
                  Download PDF
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={handleCopyUrl}
                  startIcon={<ContentCopy />}
                  fullWidth
                  size="large"
                >
                  Copy PDF URL
                </Button>
              </Box>
            </Box>
          )}

          {/* PDF Preview Iframe - Only for non-Cloudinary PDFs */}
          {previewUrl && !error && normalizedLesson.fileUrl.includes('cloudinary.com') ? (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Alert severity="info" sx={{ mb: 3, maxWidth: '500px' }}>
                <Typography variant="h6" gutterBottom>
                  Cloudinary PDF Detected
                </Typography>
                <Typography variant="body2">
                  Cloudinary PDFs cannot be embedded for security reasons. Please use the options below.
                </Typography>
              </Alert>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: '400px' }}>
                <Button 
                  variant="contained" 
                  onClick={handleOpenInNewTab}
                  startIcon={<OpenInNew />}
                  fullWidth
                  size="large"
                >
                  Open in New Tab
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={handleDownload}
                  startIcon={<Download />}
                  fullWidth
                  size="large"
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          ) : previewUrl && !error ? (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title={`PDF Preview - ${normalizedLesson.title}`}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '70vh',
                border: 'none',
                display: 'block'
              }}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-popups"
              allow="fullscreen"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          ) : null}
        </DialogContent>

        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          backgroundColor: '#f9f9f9'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
              {normalizedLesson.fileUrl.includes('cloudinary.com') ? 'Cloudinary PDF' : 'PDF Document'}
            </Typography>
            
            <Button
              size="small"
              variant="text"
              startIcon={<ContentCopy />}
              onClick={handleCopyUrl}
              sx={{ fontSize: '0.75rem' }}
            >
              Copy URL
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              startIcon={<Download />}
              onClick={handleDownload}
              variant="contained"
              color="primary"
              size="medium"
            >
              Download
            </Button>
            
            <Button 
              onClick={handleOpenInNewTab}
              variant="outlined"
              size="medium"
              startIcon={<OpenInNew />}
            >
              Open in Tab
            </Button>
            
            <Button 
              onClick={handleClose} 
              variant="outlined"
              size="medium"
            >
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

PdfPreviewButton.propTypes = {
  lesson: PropTypes.object.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object
};

export default PdfPreviewButton;