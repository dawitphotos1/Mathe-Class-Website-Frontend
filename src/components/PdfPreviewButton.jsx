
// src/components/PdfPreviewButton.jsx - FINAL FIXED VERSION
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
  Typography
} from '@mui/material';
import { Close, Download, Visibility, OpenInNew } from '@mui/icons-material';

const PdfPreviewButton = ({ 
  lesson, 
  variant = 'default', 
  size = 'medium', 
  style = {} 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);
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

  const handlePreviewClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const normalized = normalizeLesson(lesson);
    
    if (!normalized.fileUrl) {
      console.warn('No file URL found for lesson:', lesson.id);
      alert('No PDF file found for this lesson');
      return;
    }
    
    console.log('Opening PDF preview:', normalized.fileUrl);
    setOpen(true);
    setLoading(true);
    setError(null);
    setIframeKey(prev => prev + 1);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setError(null);
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
    if (normalized.fileUrl) {
      const a = document.createElement('a');
      a.href = normalized.fileUrl;
      a.download = `${normalized.title.replace(/[^a-z0-9]/gi, '_') || 'document'}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleIframeLoad = () => {
    console.log('PDF iframe loaded successfully');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
  };

  const handleIframeError = (e) => {
    console.error('Iframe loading error:', e);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError('Failed to load the PDF document. It may be inaccessible.');
    setLoading(false);
  };

  const handleIframeLoadStart = () => {
    console.log('PDF loading started...');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      console.warn('PDF loading timeout - checking iframe state');
      setLoading(false);
      
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
          console.log('Iframe content is ready');
        }
      } catch (err) {
        console.log('Cannot access iframe due to security restrictions');
      }
    }, 10000);
  };

  const handleOpenInNewTab = () => {
    const normalized = normalizeLesson(lesson);
    if (normalized.fileUrl) {
      window.open(normalized.fileUrl, '_blank', 'noopener,noreferrer');
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
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Box component="div" sx={{ flex: 1 }}>
            <Typography variant="h6" noWrap>
              📄 {normalizedLesson.title}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            size="small"
            aria-label="close"
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
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading PDF...
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                This may take a moment
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
              <Typography variant="h6" color="error" gutterBottom>
                Unable to Load PDF
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {error}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  onClick={handleOpenInNewTab}
                  startIcon={<OpenInNew />}
                >
                  Open in New Tab
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    setIframeKey(prev => prev + 1);
                  }}
                >
                  Retry
                </Button>
              </Box>
            </Box>
          )}

          {/* The fixed iframe with allow-downloads sandbox permission */}
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={normalizedLesson.fileUrl}
            title={`PDF Preview - ${normalizedLesson.title}`}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '70vh',
              border: 'none',
              display: loading || error ? 'none' : 'block',
              visibility: loading || error ? 'hidden' : 'visible'
            }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            onLoadStart={handleIframeLoadStart}
            sandbox="allow-same-origin allow-scripts allow-popups allow-downloads"
            allow="fullscreen"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </DialogContent>

        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
            {normalizedLesson.fileUrl ? `Source: ${normalizedLesson.fileUrl.split('/').pop()}` : ''}
          </Typography>
          
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