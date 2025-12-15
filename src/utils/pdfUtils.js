
/**
 * Utility functions for PDF handling with Cloudinary
 */

/**
 * Transform any PDF URL for optimal viewing
 */
export const transformPdfUrl = (url, options = {}) => {
  const {
    forceDownload = false,
    forcePreview = false,
    filename = null
  } = options;

  if (!url) return null;

  let transformedUrl = url;

  // Handle Cloudinary URLs
  if (transformedUrl.includes('cloudinary.com')) {
    // For download, keep raw URL
    if (forceDownload) {
      // Add download flag for Cloudinary
      if (!transformedUrl.includes('fl_attachment')) {
        const separator = transformedUrl.includes('?') ? '&' : '?';
        transformedUrl += `${separator}fl_attachment`;
      }
    } 
    // For preview, use image upload
    else if (forcePreview || transformedUrl.includes('/raw/upload/')) {
      transformedUrl = transformedUrl.replace('/raw/upload/', '/image/upload/');
      
      // Add .pdf extension if missing
      if (!transformedUrl.toLowerCase().includes('.pdf')) {
        if (transformedUrl.includes('?')) {
          transformedUrl = transformedUrl.replace('?', '.pdf?');
        } else {
          transformedUrl += '.pdf';
        }
      }
      
      // Add viewer optimizations
      const separator = transformedUrl.includes('?') ? '&' : '?';
      transformedUrl += `${separator}flags=layer_apply`;
    }
  }

  // Add filename for download if specified
  if (filename && !transformedUrl.includes('response-content-disposition')) {
    const encodedFilename = encodeURIComponent(filename);
    const separator = transformedUrl.includes('?') ? '&' : '?';
    transformedUrl += `${separator}response-content-disposition=attachment%3B%20filename%3D${encodedFilename}`;
  }

  return transformedUrl;
};

/**
 * Get PDF file extension from URL
 */
export const getPdfExtension = (url) => {
  if (!url) return '.pdf';
  
  if (url.toLowerCase().includes('.pdf')) {
    return '.pdf';
  }
  
  // Check for Cloudinary PDF without extension
  if (url.includes('cloudinary.com') && 
      (url.includes('/pdfs/') || url.includes('/raw/upload/'))) {
    return '.pdf';
  }
  
  return '.pdf'; // Default to .pdf
};

/**
 * Sanitize filename for PDF download
 */
export const sanitizePdfFilename = (title, lessonId) => {
  if (!title) return `lesson_${lessonId || 'document'}.pdf`;
  
  // Remove special characters, keep only alphanumeric, spaces, dots, and underscores
  const sanitized = title
    .replace(/[^a-zA-Z0-9\s\.\-_]/g, '_') // Replace special chars with underscore
    .replace(/\s+/g, '_')                 // Replace spaces with underscore
    .replace(/_+/g, '_')                   // Collapse multiple underscores
    .replace(/^_+|_+$/g, '')              // Trim underscores from start/end
    .substring(0, 100);                   // Limit length
  
  return `${sanitized}.pdf`;
};

/**
 * Check if browser can display PDF inline
 */
export const canDisplayPdfInline = () => {
  // Check if browser has PDF viewer capability
  const isChrome = /Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  const isEdge = /Edg/.test(navigator.userAgent);
  
  return isChrome || isFirefox || isEdge;
};

/**
 * Create PDF download link and trigger download
 */
export const downloadPdf = (url, filename) => {
  if (!url) return false;
  
  try {
    const link = document.createElement('a');
    link.href = transformPdfUrl(url, { forceDownload: true, filename });
    link.download = filename || sanitizePdfFilename();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('PDF download failed:', error);
    return false;
  }
};

/**
 * Test if PDF URL is accessible
 */
export const testPdfAccessibility = async (url) => {
  if (!url) return { accessible: false, error: 'No URL provided' };
  
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    
    // For no-cors mode, we can't read status but request succeeded
    return { 
      accessible: true, 
      message: 'PDF is accessible (CORS restrictions may apply)' 
    };
  } catch (error) {
    // Try alternative method for CORS issues
    try {
      const img = new Image();
      img.src = url;
      
      return new Promise((resolve) => {
        img.onload = () => resolve({ 
          accessible: true, 
          message: 'PDF is accessible via image load' 
        });
        img.onerror = () => resolve({ 
          accessible: false, 
          error: 'PDF not accessible' 
        });
      });
    } catch (imgError) {
      return { 
        accessible: false, 
        error: `PDF accessibility test failed: ${imgError.message}` 
      };
    }
  }
};