// src/utils/fileUtils.js - Add this file
export const getFileIcon = (contentType) => {
  if (!contentType) return '📄';
  
  const type = contentType.toLowerCase();
  
  if (type.includes('pdf')) return '📕';
  if (type.includes('video') || type.includes('mp4') || type.includes('mov')) return '🎬';
  if (type.includes('image')) return '🖼️';
  if (type.includes('audio')) return '🎵';
  if (type.includes('text') || type.includes('html') || type.includes('doc')) return '📝';
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('sheet')) return '📊';
  if (type.includes('presentation') || type.includes('powerpoint') || type.includes('ppt')) return '📽️';
  
  return '📄';
};

export const getFileTypeColor = (contentType) => {
  if (!contentType) return '#3498db';
  
  const type = contentType.toLowerCase();
  
  if (type.includes('pdf')) return '#e74c3c';
  if (type.includes('video')) return '#9b59b6';
  if (type.includes('image')) return '#1abc9c';
  if (type.includes('audio')) return '#f39c12';
  if (type.includes('text') || type.includes('html') || type.includes('doc')) return '#3498db';
  if (type.includes('spreadsheet') || type.includes('excel')) return '#27ae60';
  if (type.includes('presentation') || type.includes('powerpoint')) return '#e67e22';
  
  return '#95a5a6';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const openFileInNewTab = (url, fileName) => {
  if (!url) return false;
  
  try {
    // For PDFs, use Google Docs Viewer
    if (url.includes('.pdf') || url.toLowerCase().includes('pdf')) {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      window.open(viewerUrl, '_blank', 'noopener,noreferrer');
      return true;
    }
    
    // For videos, create a simple video page
    if (url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || 
        url.includes('.webm') || url.toLowerCase().includes('video')) {
      const videoPage = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${fileName || 'Video Preview'}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; padding: 0; background: #000; }
              video { width: 100%; height: 100vh; }
            </style>
          </head>
          <body>
            <video controls autoplay>
              <source src="${url}" type="video/mp4">
              Your browser doesn't support video playback.
            </video>
          </body>
        </html>
      `;
      
      const win = window.open('', '_blank');
      win.document.write(videoPage);
      return true;
    }
    
    // For images
    if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || 
        url.includes('.gif') || url.includes('.webp') || url.toLowerCase().includes('image')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
    
    // For text files, try to open in browser
    if (url.includes('.txt') || url.includes('.html') || url.includes('.md')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
    
    // Default: open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
    
  } catch (error) {
    console.error('Error opening file:', error);
    return false;
  }
};