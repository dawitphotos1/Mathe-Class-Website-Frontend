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






// src/components/PdfPreviewButton.jsx - FIXED VERSION (opens in modal, not new tab)
import React from 'react';
import PropTypes from 'prop-types';

const PdfPreviewButton = ({ lesson, variant = 'default', size = 'medium', style = {}, ...props }) => {
  /**
   * Opens PDF in a modal with iframe instead of new tab
   */
  const handlePreviewClick = () => {
    console.log('🎬 ========== PDF PREVIEW CLICKED ==========');
    
    if (!lesson) {
      console.error('❌ No lesson data provided');
      alert('Lesson data not available');
      return;
    }

    // Get the file URL - check all possible properties
    const fileUrl = lesson.fileUrl || lesson.file_url || lesson.file;
    console.log('🔍 File URL from lesson:', fileUrl);
    
    if (!fileUrl) {
      console.error('❌ No PDF URL available for lesson');
      alert('PDF not available for preview');
      return;
    }

    console.log('🚀 Original file URL:', fileUrl);

    // Transform the URL based on its type
    let viewerUrl = fileUrl;
    
    // Handle Cloudinary URLs
    if (viewerUrl.includes('cloudinary.com')) {
      console.log('☁️ Cloudinary URL detected');
      
      // For Cloudinary PDFs: Keep raw upload URLs AS-IS
      if (viewerUrl.includes('/raw/upload/')) {
        console.log('  - Raw upload URL, keeping as-is');
      }
      // If it's an image upload URL (incorrect for PDFs)
      else if (viewerUrl.includes('/image/upload/')) {
        console.log('  - Image upload URL, converting to raw');
        viewerUrl = viewerUrl.replace('/image/upload/', '/raw/upload/');
        viewerUrl = viewerUrl.replace('.pdf', '');
      }
    }
    // Handle relative URLs (local uploads)
    else if (fileUrl.startsWith('/uploads/') || (fileUrl.startsWith('/') && !fileUrl.startsWith('http'))) {
      console.log('📁 Relative URL detected');
      const baseUrl = 'https://mathe-class-website-backend-1.onrender.com';
      viewerUrl = baseUrl + fileUrl;
      console.log('🔄 Converted to:', viewerUrl);
    }
    
    console.log('🎯 Final URL to open:', viewerUrl);
    
    // Open modal with iframe instead of new tab
    openPdfModal(viewerUrl, lesson.title || 'PDF Preview');
  };

  /**
   * Opens a modal with iframe for PDF preview
   */
  const openPdfModal = (pdfUrl, title) => {
    // Remove existing modal if any
    const existingModal = document.getElementById('pdf-preview-modal');
    if (existingModal) {
      document.body.removeChild(existingModal);
    }

    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'pdf-preview-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Create modal header
    const header = document.createElement('div');
    header.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
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
      background: #ef4444;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      min-width: 80px;
    `;
    closeBtn.onmouseenter = () => {
      closeBtn.style.background = '#dc2626';
      closeBtn.style.transform = 'scale(1.05)';
    };
    closeBtn.onmouseleave = () => {
      closeBtn.style.background = '#ef4444';
      closeBtn.style.transform = 'scale(1)';
    };
    closeBtn.onclick = () => {
      document.body.removeChild(modal);
      console.log('✅ PDF modal closed');
    };
    
    header.appendChild(titleSpan);
    header.appendChild(closeBtn);
    
    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
      flex: 1;
      padding: 20px;
      background: #1a202c;
      position: relative;
      overflow: hidden;
    `;
    
    // Create loading indicator
    const loading = document.createElement('div');
    loading.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255,255,255,0.1);
      border-left-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    const loadingText = document.createElement('span');
    loadingText.textContent = 'Loading PDF...';
    
    loading.appendChild(spinner);
    loading.appendChild(loadingText);
    iframeContainer.appendChild(loading);
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = pdfUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
      background: white;
    `;
    iframe.title = `PDF Viewer - ${title}`;
    iframe.allow = 'fullscreen';
    
    // When iframe loads, hide loading indicator
    iframe.onload = () => {
      console.log('✅ PDF iframe loaded successfully');
      iframe.style.opacity = '1';
      iframeContainer.removeChild(loading);
    };
    
    iframe.onerror = (e) => {
      console.error('❌ PDF iframe error:', e);
      loadingText.textContent = 'Failed to load PDF. Click to download.';
      loading.style.cursor = 'pointer';
      loading.onclick = () => {
        window.open(pdfUrl, '_blank');
        document.body.removeChild(modal);
      };
    };
    
    iframeContainer.appendChild(iframe);
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(iframeContainer);
    
    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Add to page
    document.body.appendChild(modal);
    
    // Focus the modal
    modal.focus();
    
    console.log('✅ PDF modal opened in same window');
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
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }
    };

    const variants = {
      default: {
        backgroundColor: '#10b981',
        color: 'white',
        '&:hover': {
          backgroundColor: '#059669'
        }
      },
      primary: {
        backgroundColor: '#3b82f6',
        color: 'white',
        '&:hover': {
          backgroundColor: '#2563eb'
        }
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#3b82f6',
        border: '2px solid #3b82f6',
        '&:hover': {
          backgroundColor: '#3b82f6',
          color: 'white'
        }
      },
      teacher: {
        backgroundColor: '#8b5cf6',
        color: 'white',
        '&:hover': {
          backgroundColor: '#7c3aed'
        }
      },
      student: {
        backgroundColor: '#f59e0b',
        color: 'white',
        '&:hover': {
          backgroundColor: '#d97706'
        }
      }
    };

    const sizes = {
      small: {
        padding: '6px 12px',
        fontSize: '13px',
        minHeight: '32px'
      },
      medium: {
        padding: '10px 20px',
        fontSize: '14px',
        minHeight: '40px'
      },
      large: {
        padding: '14px 28px',
        fontSize: '16px',
        minHeight: '48px'
      }
    };

    return {
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
      ...style
    };
  };

  // Check if PDF is available
  const hasPdf = lesson?.fileUrl || lesson?.file_url || lesson?.file;
  const contentType = (lesson?.contentType || lesson?.content_type || '').toLowerCase();
  const isPdfType = contentType === 'pdf' || contentType === 'file' || 
                   (hasPdf && (lesson.fileUrl?.includes('.pdf') || 
                              lesson.file_url?.includes('.pdf') || 
                              lesson.file?.includes('.pdf')));

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
        title="No PDF available for this lesson"
      >
        <span>📄</span>
        No PDF Available
      </button>
    );
  }

  return (
    <button
      onClick={handlePreviewClick}
      style={getButtonStyles()}
      title={`Preview PDF: ${lesson.title || 'Document'}`}
      aria-label={`Preview PDF document for ${lesson.title || 'lesson'}`}
      {...props}
    >
      <span>📄</span>
      Preview PDF
    </button>
  );
};

PdfPreviewButton.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    fileUrl: PropTypes.string,
    file_url: PropTypes.string,
    file: PropTypes.string,
    contentType: PropTypes.string,
    content_type: PropTypes.string
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'outline', 'teacher', 'student']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.object
};

export default PdfPreviewButton;