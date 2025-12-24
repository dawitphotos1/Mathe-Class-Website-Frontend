// src/components/PdfViewer.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, IconButton } from '@mui/material';
import { Download, OpenInNew, Refresh, Error as ErrorIcon } from '@mui/icons-material';

const PdfViewer = ({ pdfUrl, title = "PDF Document" }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerType, setViewerType] = useState('google'); // 'google', 'pdfjs', or 'direct'
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (pdfUrl) {
      testPdfAccess();
    }
  }, [pdfUrl, retryCount]);

  const testPdfAccess = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📄 Testing PDF URL:', pdfUrl);
      
      // Test if URL is accessible
      const response = await fetch(pdfUrl, { 
        method: 'HEAD',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      
      console.log('📊 PDF Response:', {
        status: response.status,
        contentType,
        contentDisposition,
        accessible: response.ok
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (contentDisposition && contentDisposition.includes('attachment')) {
        setError('PDF is configured for download only. Cannot display inline.');
        setViewerType('google'); // Use Google viewer as fallback
      } else if (contentType && contentType.includes('application/pdf')) {
        // Try direct viewer first
        setViewerType('direct');
      } else {
        setError(`Unexpected content type: ${contentType}`);
        setViewerType('google');
      }
      
    } catch (err) {
      console.error('❌ PDF test failed:', err.message);
      setError(`Cannot access PDF directly: ${err.message}. Using Google viewer.`);
      setViewerType('google');
    } finally {
      setLoading(false);
    }
  };

  const getViewerUrl = () => {
    if (!pdfUrl) return '';
    
    switch(viewerType) {
      case 'google':
        return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true&hl=en`;
      case 'pdfjs':
        return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
      case 'direct':
      default:
        return pdfUrl;
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!pdfUrl) return;
    
    // Add view parameters for better PDF display
    const viewUrl = `${pdfUrl}#view=FitH&toolbar=0`;
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSwitchViewer = () => {
    const types = ['google', 'pdfjs', 'direct'];
    const currentIndex = types.indexOf(viewerType);
    const nextIndex = (currentIndex + 1) % types.length;
    setViewerType(types[nextIndex]);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading PDF viewer...
        </Typography>
      </Box>
    );
  }

  if (!pdfUrl) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        No PDF URL provided
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Viewer controls */}
      <Box sx={{ 
        mb: 2, 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center'
      }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" fontWeight="medium">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Using: {viewerType === 'google' ? 'Google Docs Viewer' : 
                    viewerType === 'pdfjs' ? 'PDF.js Viewer' : 
                    'Direct PDF Viewer'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small" 
            title="Retry"
            onClick={handleRetry}
            color="primary"
          >
            <Refresh fontSize="small" />
          </IconButton>
          
          <Button
            size="small"
            variant="outlined"
            startIcon={<OpenInNew />}
            onClick={handleOpenInNewTab}
          >
            Open
          </Button>
          
          <Button
            size="small"
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownload}
          >
            Download
          </Button>
          
          <Button
            size="small"
            variant="outlined"
            onClick={handleSwitchViewer}
          >
            Switch Viewer
          </Button>
        </Box>
      </Box>

      {/* Error display */}
      {error && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* PDF Viewer */}
      <Box sx={{ 
        width: '100%', 
        height: '70vh',
        minHeight: '500px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'grey.100'
      }}>
        <iframe
          src={getViewerUrl()}
          title={`PDF Viewer: ${title}`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={() => setLoading(false)}
          onError={(e) => {
            console.error('Iframe load error:', e);
            setError('Failed to load PDF viewer. Try switching viewers.');
            setLoading(false);
          }}
        />
      </Box>

      {/* Help text */}
      <Box sx={{ mt: 2, px: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💡 Tip: If the PDF doesn't display, try "Switch Viewer" or "Open in New Tab"
        </Typography>
      </Box>
    </Box>
  );
};

export default PdfViewer;