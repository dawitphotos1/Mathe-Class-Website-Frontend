// src/components/PdfPreviewButton.jsx - FINAL FIXED VERSION
import React from 'react';
import PropTypes from 'prop-types';

const PdfPreviewButton = ({ lesson, variant = 'default', size = 'medium', style = {}, ...props }) => {
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
      
      // For Cloudinary PDFs: Keep raw upload URLs AS-IS, no .pdf extension!
      if (viewerUrl.includes('/raw/upload/')) {
        console.log('  - Raw upload URL, keeping as-is');
        // DO NOT add .pdf extension (Cloudinary doesn't need it)
        // DO NOT convert to image/upload
      }
      // If it's an image upload URL (incorrect for PDFs)
      else if (viewerUrl.includes('/image/upload/')) {
        console.log('  - Image upload URL, converting to raw');
        // Convert to raw upload for PDFs
        viewerUrl = viewerUrl.replace('/image/upload/', '/raw/upload/');
        // Remove .pdf extension if present
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
    
    // Open in new tab
    console.log('📖 Opening PDF...');
    const newWindow = window.open(viewerUrl, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      console.warn('🚫 Popup blocked, using download link');
      // Create download link as fallback
      const link = document.createElement('a');
      link.href = viewerUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
    
    console.log('✅ PDF opened successfully');
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

  // Check if PDF is available
  const hasPdf = lesson?.fileUrl || lesson?.file_url || lesson?.file;
  const contentType = (lesson?.contentType || lesson?.content_type || '').toLowerCase();
  const isPdfType = contentType === 'pdf' || contentType === 'file';

  if (!hasPdf || !isPdfType) {
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