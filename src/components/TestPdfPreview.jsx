// src/components/TestPdfPreview.jsx
import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  TextField, 
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { BugReport, Link, Visibility, Download } from '@mui/icons-material';

const TestPdfPreview = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [testResults, setTestResults] = useState([]);

  const testPdfUrls = [
    {
      name: 'Sample PDF 1',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      name: 'Sample PDF 2', 
      url: 'https://www.africau.edu/images/default/sample.pdf'
    },
    {
      name: 'Sample PDF 3',
      url: 'https://www.orimi.com/pdf-test.pdf'
    }
  ];

  const testIframe = (url, name = 'Custom URL') => {
    console.log(`🧪 Testing iframe with URL: ${url}`);
    
    // Remove existing test iframe
    const existing = document.getElementById('test-pdf-iframe');
    if (existing) existing.remove();
    
    // Create test container
    const container = document.createElement('div');
    container.id = 'test-pdf-container';
    container.style.cssText = `
      position: fixed;
      top: 50px;
      right: 50px;
      width: 600px;
      height: 800px;
      background: white;
      border: 3px solid #4CAF50;
      border-radius: 8px;
      z-index: 99999;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      background: #4CAF50;
      color: white;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
    `;
    header.innerHTML = `<span>🧪 Testing: ${name}</span>`;
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: #f44336;
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeBtn.onclick = () => container.remove();
    header.appendChild(closeBtn);
    
    // Iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'test-pdf-iframe';
    iframe.src = url;
    iframe.style.cssText = `
      flex: 1;
      border: none;
      width: 100%;
    `;
    iframe.title = `Test PDF - ${name}`;
    
    iframe.onload = () => {
      console.log(`✅ Test iframe loaded successfully: ${name}`);
      setTestResults(prev => [...prev, {
        name,
        url,
        success: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };
    
    iframe.onerror = (e) => {
      console.error(`❌ Test iframe error for ${name}:`, e);
      setTestResults(prev => [...prev, {
        name,
        url,
        success: false,
        error: 'Failed to load',
        timestamp: new Date().toLocaleTimeString()
      }]);
    };
    
    container.appendChild(header);
    container.appendChild(iframe);
    document.body.appendChild(container);
  };

  const checkLessonData = () => {
    console.clear();
    console.log('🔍 Checking lesson data on page...');
    
    // Find all lesson elements
    const lessonElements = [];
    
    // Look for elements with lesson data
    document.querySelectorAll('*').forEach(el => {
      const text = el.textContent || '';
      if (text.includes('Lesson') && text.length < 100) {
        lessonElements.push({
          element: el,
          text: text.substring(0, 50)
        });
      }
      
      // Check data attributes
      const attrs = el.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.name.includes('data') || attr.name.includes('id')) {
          if (attr.value && (attr.value.includes('lesson') || attr.value.includes('Lesson'))) {
            console.log('Found lesson-related attribute:', {
              element: el.tagName,
              attribute: attr.name,
              value: attr.value
            });
          }
        }
      }
    });
    
    console.log('Found potential lesson elements:', lessonElements.length);
    
    // Highlight all preview buttons
    const buttons = document.querySelectorAll('button');
    let previewButtons = 0;
    buttons.forEach((btn, i) => {
      if (btn.textContent.includes('Preview') || btn.textContent.includes('PDF')) {
        previewButtons++;
        console.log(`Preview button ${i}:`, {
          text: btn.textContent,
          disabled: btn.disabled,
          onclick: btn.onclick ? 'Has onclick' : 'No onclick',
          style: window.getComputedStyle(btn)
        });
        btn.style.border = '2px solid red';
      }
    });
    
    console.log(`Total preview buttons found: ${previewButtons}`);
    
    alert(`Found ${previewButtons} preview buttons. Check console for details.`);
  };

  const testApiUrl = (endpoint) => {
    const baseUrl = 'https://mathe-class-website-backend-1.onrender.com/api/v1';
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    console.log('Testing API URL:', fullUrl);
    testIframe(fullUrl, `API: ${endpoint}`);
  };

  const clearTestResults = () => {
    setTestResults([]);
    const container = document.getElementById('test-pdf-container');
    if (container) container.remove();
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', border: '2px solid #e9ecef' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <BugReport color="primary" />
        <Typography variant="h6">🧪 PDF Preview Debugger</Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Use this tool to test PDF preview functionality and debug issues.
      </Alert>

      <Grid container spacing={2}>
        {/* Test Public PDFs */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Test Public PDFs:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {testPdfUrls.map((pdf, i) => (
              <Button
                key={i}
                variant="outlined"
                size="small"
                startIcon={<Visibility />}
                onClick={() => testIframe(pdf.url, pdf.name)}
                sx={{ mb: 1 }}
              >
                {pdf.name}
              </Button>
            ))}
          </Box>

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Custom PDF URL:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="https://example.com/document.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />
            <Button
              variant="contained"
              disabled={!pdfUrl}
              onClick={() => testIframe(pdfUrl, 'Custom PDF')}
            >
              Test
            </Button>
          </Box>
        </Grid>

        {/* API Testing */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Test API Endpoints:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="/api/v1/files/filename.pdf"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="outlined"
              fullWidth
              disabled={!testUrl}
              onClick={() => testApiUrl(testUrl)}
            >
              Test API URL
            </Button>
          </Box>

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quick Tests:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={checkLessonData}
            >
              Check Lesson Data
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                console.log('📊 Current page structure:');
                console.log('Body children:', document.body.children.length);
                console.log('All buttons:', document.querySelectorAll('button').length);
              }}
            >
              Log Page Info
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={clearTestResults}
            >
              Clear Tests
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Test Results */}
      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Test Results ({testResults.length}):
        </Typography>
        {testResults.length > 0 ? (
          <List dense sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper' }}>
            {testResults.slice().reverse().map((result, i) => (
              <ListItem key={i} sx={{ borderBottom: '1px solid #eee' }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {result.success ? '✅' : '❌'}
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {result.name}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" display="block" sx={{ wordBreak: 'break-all' }}>
                        {result.url.substring(0, 100)}...
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {result.timestamp} {result.error && `- Error: ${result.error}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
            No tests run yet. Try testing a PDF URL above.
          </Typography>
        )}
      </Box>

      <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
        Tip: Click "Check Lesson Data" to see what lesson information is available on the page.
      </Typography>
    </Paper>
  );
};

// Add Grid import if not already imported
import { Grid } from '@mui/material';

export default TestPdfPreview;