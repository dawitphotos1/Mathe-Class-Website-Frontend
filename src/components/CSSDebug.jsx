// src/components/CSSDebug.jsx
import React from 'react';
import "../pages/AdminDashboard.css";
const CSSDebug = () => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const [showDebug, setShowDebug] = React.useState(false);
  const [issues, setIssues] = React.useState([]);

  React.useEffect(() => {
    const checkIssues = () => {
      const newIssues = [];
      
      // Check for common CSS issues
      
      // 1. Missing Tailwind classes
      if (!document.querySelector('[class*="tailwind"]')) {
        newIssues.push({
          type: 'warning',
          message: 'Tailwind CSS might not be loaded properly',
          severity: 'medium'
        });
      }
      
      // 2. Check for inline styles (bad practice)
      const elementsWithInlineStyles = document.querySelectorAll('[style]');
      if (elementsWithInlineStyles.length > 50) {
        newIssues.push({
          type: 'warning',
          message: `${elementsWithInlineStyles.length} elements with inline styles detected`,
          severity: 'low'
        });
      }
      
      // 3. Check for deprecated class names
      const deprecatedClasses = ['float-left', 'float-right', 'clearfix'];
      deprecatedClasses.forEach(className => {
        const elements = document.querySelectorAll(`.${className}`);
        if (elements.length > 0) {
          newIssues.push({
            type: 'deprecated',
            message: `Deprecated class "${className}" found on ${elements.length} elements`,
            severity: 'low'
          });
        }
      });
      
      setIssues(newIssues);
    };

    // Run checks after initial render
    const timeoutId = setTimeout(checkIssues, 1000);
    
    // Also check on DOM changes
    const observer = new MutationObserver(checkIssues);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Debug toggle button */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '8px 12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      >
        {showDebug ? 'Hide CSS Debug' : 'Show CSS Debug'}
      </button>

      {/* Debug panel */}
      {showDebug && (
        <div style={{
          position: 'fixed',
          bottom: '60px',
          right: '20px',
          zIndex: 9998,
          width: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '15px',
          fontSize: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px'
          }}>
            <strong>CSS Debug Panel</strong>
            <button
              onClick={() => setShowDebug(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
          </div>
          
          {/* Environment info */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Environment:</div>
            <div style={{ color: '#666', fontSize: '11px' }}>
              <div>NODE_ENV: {process.env.NODE_ENV}</div>
              <div>REACT_APP_ENV: {process.env.REACT_APP_ENV || 'Not set'}</div>
              <div>Screen: {window.innerWidth} × {window.innerHeight}</div>
            </div>
          </div>
          
          {/* Issues list */}
          {issues.length > 0 ? (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Detected Issues ({issues.length}):
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {issues.map((issue, index) => (
                  <div 
                    key={index}
                    style={{
                      marginBottom: '8px',
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: 
                        issue.severity === 'high' ? '#f8d7da' :
                        issue.severity === 'medium' ? '#fff3cd' : '#d1ecf1',
                      borderLeft: `4px solid ${
                        issue.severity === 'high' ? '#dc3545' :
                        issue.severity === 'medium' ? '#ffc107' : '#17a2b8'
                      }`
                    }}
                  >
                    <div style={{ 
                      fontWeight: 'bold',
                      color: 
                        issue.severity === 'high' ? '#721c24' :
                        issue.severity === 'medium' ? '#856404' : '#0c5460'
                    }}>
                      {issue.type.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '11px' }}>{issue.message}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '10px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              No CSS issues detected ✓
            </div>
          )}
          
          {/* Quick actions */}
          <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Quick Actions:</div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  // Highlight all elements with inline styles
                  document.querySelectorAll('[style]').forEach(el => {
                    el.style.outline = '2px solid red';
                    setTimeout(() => el.style.outline = '', 3000);
                  });
                }}
                style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Highlight Inline Styles
              </button>
              
              <button
                onClick={() => {
                  // Clear all highlights
                  document.querySelectorAll('[style]').forEach(el => {
                    el.style.outline = '';
                  });
                }}
                style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Clear Highlights
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CSSDebug;