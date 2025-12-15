// // src/components/PdfPreviewButton.jsx - FINAL FIXED VERSION
// import React from 'react';
// import PropTypes from 'prop-types';

// const PdfPreviewButton = ({ lesson, variant = 'default', size = 'medium', style = {}, ...props }) => {
//   const handlePreviewClick = () => {
//     console.log('🎬 ========== PDF PREVIEW CLICKED ==========');
    
//     if (!lesson) {
//       console.error('❌ No lesson data provided');
//       alert('Lesson data not available');
//       return;
//     }

//     // Get the file URL - check all possible properties
//     const fileUrl = lesson.fileUrl || lesson.file_url || lesson.file;
//     console.log('🔍 File URL from lesson:', fileUrl);
    
//     if (!fileUrl) {
//       console.error('❌ No PDF URL available for lesson');
//       alert('PDF not available for preview');
//       return;
//     }

//     console.log('🚀 Original file URL:', fileUrl);

//     // Transform the URL based on its type
//     let viewerUrl = fileUrl;
    
//     // Handle Cloudinary URLs
//     if (viewerUrl.includes('cloudinary.com')) {
//       console.log('☁️ Cloudinary URL detected');
      
//       // For Cloudinary PDFs: Keep raw upload URLs AS-IS, no .pdf extension!
//       if (viewerUrl.includes('/raw/upload/')) {
//         console.log('  - Raw upload URL, keeping as-is');
//         // DO NOT add .pdf extension (Cloudinary doesn't need it)
//         // DO NOT convert to image/upload
//       }
//       // If it's an image upload URL (incorrect for PDFs)
//       else if (viewerUrl.includes('/image/upload/')) {
//         console.log('  - Image upload URL, converting to raw');
//         // Convert to raw upload for PDFs
//         viewerUrl = viewerUrl.replace('/image/upload/', '/raw/upload/');
//         // Remove .pdf extension if present
//         viewerUrl = viewerUrl.replace('.pdf', '');
//       }
//     }
//     // Handle relative URLs (local uploads)
//     else if (fileUrl.startsWith('/uploads/') || (fileUrl.startsWith('/') && !fileUrl.startsWith('http'))) {
//       console.log('📁 Relative URL detected');
//       const baseUrl = 'https://mathe-class-website-backend-1.onrender.com';
//       viewerUrl = baseUrl + fileUrl;
//       console.log('🔄 Converted to:', viewerUrl);
//     }
    
//     console.log('🎯 Final URL to open:', viewerUrl);
    
//     // Open in new tab
//     console.log('📖 Opening PDF...');
//     const newWindow = window.open(viewerUrl, '_blank', 'noopener,noreferrer');
    
//     if (!newWindow) {
//       console.warn('🚫 Popup blocked, using download link');
//       // Create download link as fallback
//       const link = document.createElement('a');
//       link.href = viewerUrl;
//       link.target = '_blank';
//       link.rel = 'noopener noreferrer';
//       link.click();
//     }
    
//     console.log('✅ PDF opened successfully');
//   };

//   const getButtonStyles = () => {
//     const baseStyles = {
//       border: 'none',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       display: 'inline-flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '8px',
//       fontFamily: 'inherit',
//       fontWeight: 500,
//       transition: 'all 0.2s ease',
//       '&:hover': {
//         transform: 'translateY(-1px)',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
//       }
//     };

//     const variants = {
//       default: {
//         backgroundColor: '#4CAF50',
//         color: 'white',
//         '&:hover': {
//           backgroundColor: '#45a049'
//         }
//       },
//       primary: {
//         backgroundColor: '#2196F3',
//         color: 'white',
//         '&:hover': {
//           backgroundColor: '#1976D2'
//         }
//       },
//       outline: {
//         backgroundColor: 'transparent',
//         color: '#2196F3',
//         border: '2px solid #2196F3',
//         '&:hover': {
//           backgroundColor: '#2196F3',
//           color: 'white'
//         }
//       },
//       teacher: {
//         backgroundColor: '#9C27B0',
//         color: 'white',
//         '&:hover': {
//           backgroundColor: '#7B1FA2'
//         }
//       },
//       student: {
//         backgroundColor: '#FF9800',
//         color: 'white',
//         '&:hover': {
//           backgroundColor: '#F57C00'
//         }
//       }
//     };

//     const sizes = {
//       small: {
//         padding: '6px 12px',
//         fontSize: '13px'
//       },
//       medium: {
//         padding: '8px 16px',
//         fontSize: '14px'
//       },
//       large: {
//         padding: '12px 24px',
//         fontSize: '16px'
//       }
//     };

//     return {
//       ...baseStyles,
//       ...variants[variant],
//       ...sizes[size],
//       ...style
//     };
//   };

//   // Check if PDF is available
//   const hasPdf = lesson?.fileUrl || lesson?.file_url || lesson?.file;
//   const contentType = (lesson?.contentType || lesson?.content_type || '').toLowerCase();
//   const isPdfType = contentType === 'pdf' || contentType === 'file';

//   if (!hasPdf || !isPdfType) {
//     return (
//       <button
//         disabled
//         style={{
//           ...getButtonStyles(),
//           opacity: 0.5,
//           cursor: 'not-allowed'
//         }}
//       >
//         <span>📄</span>
//         No PDF Available
//       </button>
//     );
//   }

//   return (
//     <button
//       onClick={handlePreviewClick}
//       style={getButtonStyles()}
//       title={`Preview PDF: ${lesson.title || 'Document'}`}
//       aria-label={`Preview PDF document for ${lesson.title || 'lesson'}`}
//       {...props}
//     >
//       <span>📄</span>
//       Preview PDF
//     </button>
//   );
// };

// PdfPreviewButton.propTypes = {
//   lesson: PropTypes.shape({
//     id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     title: PropTypes.string,
//     fileUrl: PropTypes.string,
//     file_url: PropTypes.string,
//     file: PropTypes.string,
//     contentType: PropTypes.string,
//     content_type: PropTypes.string
//   }).isRequired,
//   variant: PropTypes.oneOf(['default', 'primary', 'outline', 'teacher', 'student']),
//   size: PropTypes.oneOf(['small', 'medium', 'large']),
//   style: PropTypes.object
// };

// export default PdfPreviewButton;




// src/components/PdfPreviewButton.jsx - UPDATED WITH DEBUGGING
import React from 'react';
import PropTypes from 'prop-types';

/**
 * PDF Preview Button Component
 * Opens PDF in modal with iframe (not new tab)
 */

const normalizeLessonForPreview = (lesson) => {
  if (!lesson) {
    console.log('❌ normalizeLessonForPreview: No lesson provided');
    return null;
  }
  
  console.log('📦 Original lesson data:', JSON.parse(JSON.stringify(lesson)));
  
  // Check all possible file URL properties
  const fileUrl = 
    lesson.fileUrl || 
    lesson.file_url || 
    lesson.file ||
    (lesson.uploads && lesson.uploads.fileUrl) ||
    (lesson.metadata && lesson.metadata.fileUrl) ||
    null;
  
  console.log('🔍 File URL found:', fileUrl);
  
  // Determine content type
  let contentType = 
    lesson.contentType || 
    lesson.content_type || 
    lesson.type ||
    (fileUrl ? (fileUrl.includes('.pdf') ? 'pdf' : 'file') : 'text');
  
  contentType = (contentType || '').toLowerCase();
  console.log('🔍 Content type found:', contentType);
  
  const normalized = {
    id: lesson.id || Date.now(),
    title: lesson.title || "Untitled Lesson",
    fileUrl: fileUrl,
    contentType: contentType,
    content_type: contentType,
    file_url: fileUrl,
    _original: { ...lesson }
  };
  
  console.log('✨ Normalized lesson:', normalized);
  return normalized;
};

const fixCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
    if (url.includes('.pdf') || url.includes('/pdfs/')) {
      return url.replace('/image/upload/', '/raw/upload/');
    }
  }
  
  return url;
};

const PdfPreviewButton = ({ lesson, variant = 'default', size = 'medium', style = {}, ...props }) => {
  const handlePreviewClick = (e) => {
    e.stopPropagation();
    console.log('🎬 ========== PDF PREVIEW CLICKED ==========');
    
    if (!lesson) {
      console.error('❌ No lesson data provided');
      alert('Lesson data not available');
      return;
    }

    const normalizedLesson = normalizeLessonForPreview(lesson);
    
    if (!normalizedLesson) {
      console.error('❌ Failed to normalize lesson data');
      alert('Unable to process lesson data');
      return;
    }
    
    const fileUrl = normalizedLesson.fileUrl;
    console.log('🔍 Normalized file URL:', fileUrl);
    
    if (!fileUrl) {
      console.error('❌ No PDF URL available for lesson');
      alert('PDF not available for preview');
      return;
    }

    let viewerUrl = fileUrl;
    
    // Fix Cloudinary URLs
    if (viewerUrl.includes('cloudinary.com')) {
      viewerUrl = fixCloudinaryUrl(viewerUrl);
    }
    // Handle relative URLs
    else if (viewerUrl.startsWith('/uploads/') || (viewerUrl.startsWith('/') && !viewerUrl.startsWith('http'))) {
      const baseUrl = 'https://mathe-class-website-backend-1.onrender.com';
      viewerUrl = baseUrl + viewerUrl;
    }
    // Handle Uploads folder
    else if (viewerUrl.includes('Uploads/')) {
      const baseUrl = 'https://mathe-class-website-backend-1.onrender.com';
      viewerUrl = viewerUrl.replace(/^\/?Uploads\//, '');
      viewerUrl = `${baseUrl}/api/v1/files/${encodeURIComponent(viewerUrl)}`;
    }
    
    console.log('🎯 Final viewer URL:', viewerUrl);
    
    // Open modal
    openPdfModal(viewerUrl, normalizedLesson.title || 'PDF Preview');
  };

  const openPdfModal = (pdfUrl, title) => {
    console.log('🎪 Opening PDF modal with URL:', pdfUrl);
    
    // Remove existing modal
    const existingModal = document.getElementById('pdf-preview-modal');
    if (existingModal) {
      document.body.removeChild(existingModal);
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'pdf-preview-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.95);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Add CSS
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleEl);
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      background: #2c3e50;
      color: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    `;
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;
    titleSpan.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 16px;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.style.cssText = `
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    closeBtn.onclick = () => {
      document.body.removeChild(modal);
      document.head.removeChild(styleEl);
    };
    
    header.appendChild(titleSpan);
    header.appendChild(closeBtn);
    
    // Iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
      flex: 1;
      padding: 20px;
      background: #34495e;
      position: relative;
      overflow: hidden;
      min-height: 0;
    `;
    
    // Loading
    const loading = document.createElement('div');
    loading.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255,255,255,0.1);
      border-left-color: #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;
    
    const loadingText = document.createElement('span');
    loadingText.textContent = 'Loading PDF...';
    
    loading.appendChild(spinner);
    loading.appendChild(loadingText);
    iframeContainer.appendChild(loading);
    
    // Iframe
    const iframe = document.createElement('iframe');
    iframe.src = pdfUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 8px;
      background: white;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    iframe.title = `PDF Viewer - ${title}`;
    iframe.allow = 'fullscreen';
    
    iframe.onload = () => {
      console.log('✅ PDF iframe loaded');
      iframe.style.opacity = '1';
      iframeContainer.removeChild(loading);
    };
    
    iframe.onerror = (e) => {
      console.error('❌ PDF iframe error:', e);
      loadingText.textContent = 'Failed to load PDF. Click to open in new tab.';
      loading.style.cursor = 'pointer';
      loading.onclick = () => {
        window.open(pdfUrl, '_blank');
        document.body.removeChild(modal);
        document.head.removeChild(styleEl);
      };
    };
    
    iframeContainer.appendChild(iframe);
    modal.appendChild(header);
    modal.appendChild(iframeContainer);
    document.body.appendChild(modal);
    
    // Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.head.removeChild(styleEl);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    console.log('✅ PDF modal opened');
  };

  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'inherit',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    };

    const variants = {
      default: { backgroundColor: '#10b981', color: 'white' },
      primary: { backgroundColor: '#3b82f6', color: 'white' },
      outline: { backgroundColor: 'transparent', color: '#3b82f6', border: '2px solid #3b82f6' },
      teacher: { backgroundColor: '#8b5cf6', color: 'white' },
      student: { backgroundColor: '#f59e0b', color: 'white' }
    };

    const sizes = {
      small: { padding: '6px 12px', fontSize: '13px', minHeight: '32px', minWidth: '120px' },
      medium: { padding: '10px 20px', fontSize: '14px', minHeight: '40px', minWidth: '140px' },
      large: { padding: '14px 28px', fontSize: '16px', minHeight: '48px', minWidth: '160px' }
    };

    return {
      ...baseStyles,
      ...(variants[variant] || variants.default),
      ...sizes[size],
      ...style
    };
  };

  const normalizedLesson = normalizeLessonForPreview(lesson);
  const hasPdf = !!normalizedLesson?.fileUrl;
  const contentType = normalizedLesson?.contentType || '';
  const isPdfType = contentType === 'pdf' || contentType === 'file' || 
                   (hasPdf && normalizedLesson.fileUrl.includes('.pdf'));

  console.log('🔍 Button state:', { hasPdf, contentType, isPdfType, fileUrl: normalizedLesson?.fileUrl });

  if (!hasPdf || !isPdfType) {
    return (
      <button
        disabled
        style={{
          ...getButtonStyles(),
          opacity: 0.5,
          cursor: 'not-allowed',
          pointerEvents: 'none'
        }}
        title={!hasPdf ? "No file attached" : `File type: ${contentType}`}
      >
        <span>📄</span>
        {!hasPdf ? 'No PDF' : 'No Preview'}
      </button>
    );
  }

  return (
    <button
      onClick={handlePreviewClick}
      style={getButtonStyles()}
      title={`Preview PDF: ${normalizedLesson.title || 'Document'}`}
      {...props}
    >
      <span>📄</span>
      Preview PDF
    </button>
  );
};

PdfPreviewButton.propTypes = {
  lesson: PropTypes.object.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object
};

export default PdfPreviewButton;