// import React from 'react';
// import PropTypes from 'prop-types';

// /**
//  * Cloudinary PDF Preview Button
//  * Opens PDF files in new tab with optimized Cloudinary viewer
//  */
// const PdfPreviewButton = ({ lesson, variant = 'default', size = 'medium' }) => {
//   /**
//    * Transform Cloudinary URL for optimal PDF viewing
//    */
//   const getOptimizedPdfUrl = () => {
//     if (!lesson?.fileUrl) return null;
    
//     let url = lesson.fileUrl;
    
//     // If it's a Cloudinary URL, optimize it for PDF viewing
//     if (url.includes('cloudinary.com')) {
//       // Convert raw upload to image upload for better PDF viewing
//       if (url.includes('/raw/upload/')) {
//         url = url.replace('/raw/upload/', '/image/upload/');
//       }
      
//       // Ensure .pdf extension for proper MIME type detection
//       if (!url.toLowerCase().includes('.pdf')) {
//         // Check if URL already has query parameters
//         if (url.includes('?')) {
//           url = url.replace('?', '.pdf?');
//         } else {
//           url += '.pdf';
//         }
//       }
      
//       // Add Cloudinary transformations for better PDF display
//       const separator = url.includes('?') ? '&' : '?';
//       url += `${separator}flags=layer_apply`;
//     }
    
//     return url;
//   };

//   /**
//    * Handle preview button click
//    */
//   const handlePreviewClick = () => {
//     const pdfUrl = getOptimizedPdfUrl();
    
//     if (!pdfUrl) {
//       console.error('No PDF URL available');
//       alert('PDF not available for preview');
//       return;
//     }
    
//     // Open in new tab with proper security attributes
//     window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    
//     // Log for debugging
//     console.log('Opening PDF:', {
//       originalUrl: lesson.fileUrl,
//       optimizedUrl: pdfUrl,
//       lessonId: lesson.id,
//       lessonTitle: lesson.title
//     });
//   };

//   /**
//    * Get button styles based on variant and size
//    */
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
//       textDecoration: 'none'
//     };

//     const variants = {
//       default: {
//         backgroundColor: '#4CAF50',
//         color: 'white',
//         '&:hover': {
//           backgroundColor: '#45a049',
//           transform: 'translateY(-1px)',
//           boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
//         }
//       },
//       primary: {
//         backgroundColor: '#2196F3',
//         color: 'white',
//         '&:hover': {
//           backgroundColor: '#1976D2',
//           transform: 'translateY(-1px)',
//           boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
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
//           backgroundColor: '#7B1FA2',
//           transform: 'translateY(-1px)',
//           boxShadow: '0 2px 8px rgba(156, 39, 176, 0.3)'
//         }
//       },
//       student: {
//         backgroundColor: '#FF9800',
//         color: 'white',
//         '&:hover': {
//           backgroundColor: '#F57C00',
//           transform: 'translateY(-1px)',
//           boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
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
//       '&:hover': {
//         ...baseStyles['&:hover'],
//         ...variants[variant]['&:hover']
//       }
//     };
//   };

//   // If no file URL, show disabled button
//   if (!lesson?.fileUrl) {
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
//       title={`Preview PDF: ${lesson.title}`}
//       aria-label={`Preview PDF document for ${lesson.title}`}
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
//     fileUrl: PropTypes.string
//   }).isRequired,
//   variant: PropTypes.oneOf(['default', 'primary', 'outline', 'teacher', 'student']),
//   size: PropTypes.oneOf(['small', 'medium', 'large'])
// };

// export default PdfPreviewButton;




// src/components/PdfPreviewButton.jsx
import React from 'react';
import PropTypes from 'prop-types';

const PdfPreviewButton = ({ lesson, variant = 'default', size = 'medium', style = {}, ...props }) => {
  const handlePreviewClick = () => {
    if (!lesson?.fileUrl) {
      console.error('No PDF URL available for lesson:', lesson);
      alert('PDF not available for preview');
      return;
    }

    // Transform Cloudinary URL for better PDF viewing
    let viewerUrl = lesson.fileUrl;
    
    // If it's a Cloudinary URL, optimize it for PDF viewing
    if (viewerUrl.includes('cloudinary.com')) {
      // Convert raw upload to image upload for better PDF viewing
      if (viewerUrl.includes('/raw/upload/')) {
        viewerUrl = viewerUrl.replace('/raw/upload/', '/image/upload/');
      }
      
      // Ensure .pdf extension for proper MIME type detection
      if (!viewerUrl.toLowerCase().includes('.pdf')) {
        // Check if URL already has query parameters
        if (viewerUrl.includes('?')) {
          viewerUrl = viewerUrl.replace('?', '.pdf?');
        } else {
          viewerUrl += '.pdf';
        }
      }
      
      // Add Cloudinary transformations for better PDF display
      const separator = viewerUrl.includes('?') ? '&' : '?';
      viewerUrl += `${separator}flags=layer_apply`;
    }
    
    // Open in new tab with proper security attributes
    window.open(viewerUrl, '_blank', 'noopener,noreferrer');
    
    console.log('Opening PDF:', {
      originalUrl: lesson.fileUrl,
      optimizedUrl: viewerUrl,
      lessonId: lesson.id,
      lessonTitle: lesson.title
    });
  };

  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'inherit',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }
    };

    const variants = {
      default: {
        backgroundColor: '#4CAF50',
        color: 'white',
        '&:hover': {
          backgroundColor: '#45a049'
        }
      },
      primary: {
        backgroundColor: '#2196F3',
        color: 'white',
        '&:hover': {
          backgroundColor: '#1976D2'
        }
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#2196F3',
        border: '2px solid #2196F3',
        '&:hover': {
          backgroundColor: '#2196F3',
          color: 'white'
        }
      },
      teacher: {
        backgroundColor: '#9C27B0',
        color: 'white',
        '&:hover': {
          backgroundColor: '#7B1FA2'
        }
      },
      student: {
        backgroundColor: '#FF9800',
        color: 'white',
        '&:hover': {
          backgroundColor: '#F57C00'
        }
      }
    };

    const sizes = {
      small: {
        padding: '6px 12px',
        fontSize: '13px'
      },
      medium: {
        padding: '8px 16px',
        fontSize: '14px'
      },
      large: {
        padding: '12px 24px',
        fontSize: '16px'
      }
    };

    return {
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
      ...style
    };
  };

  if (!lesson?.fileUrl) {
    return (
      <button
        disabled
        style={{
          ...getButtonStyles(),
          opacity: 0.5,
          cursor: 'not-allowed'
        }}
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
      title={`Preview PDF: ${lesson.title}`}
      aria-label={`Preview PDF document for ${lesson.title}`}
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
    fileUrl: PropTypes.string
  }).isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'outline', 'teacher', 'student']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.object
};

export default PdfPreviewButton;