// // src/components/DebugLessonData.jsx
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';

// const DebugLessonData = ({ lessonId = 5788 }) => {
//   const [lessonData, setLessonData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchLessonData();
//   }, [lessonId]);

//   const fetchLessonData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/lessons/${lessonId}`);
//       console.log('🔍 Lesson API Response:', response.data);
//       setLessonData(response.data.lesson || response.data);
//     } catch (err) {
//       console.error('❌ Error fetching lesson:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div>Loading lesson data...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div style={{ 
//       padding: '20px', 
//       border: '1px solid #ccc', 
//       margin: '20px', 
//       backgroundColor: '#f5f5f5',
//       borderRadius: '8px'
//     }}>
//       <h3>🔍 Debug Lesson Data (ID: {lessonId})</h3>
      
//       <div style={{ marginTop: '20px' }}>
//         <h4>Lesson Object:</h4>
//         <pre style={{ 
//           backgroundColor: '#fff', 
//           padding: '10px', 
//           border: '1px solid #ddd',
//           borderRadius: '4px',
//           overflow: 'auto',
//           maxHeight: '300px'
//         }}>
//           {JSON.stringify(lessonData, null, 2)}
//         </pre>
//       </div>

//       <div style={{ marginTop: '20px' }}>
//         <h4>PDF File Info:</h4>
//         <ul>
//           <li><strong>fileUrl:</strong> {lessonData.fileUrl || '(not set)'}</li>
//           <li><strong>file_url:</strong> {lessonData.file_url || '(not set)'}</li>
//           <li><strong>file:</strong> {lessonData.file || '(not set)'}</li>
//           <li><strong>contentType:</strong> {lessonData.contentType || '(not set)'}</li>
//           <li><strong>content_type:</strong> {lessonData.content_type || '(not set)'}</li>
//         </ul>
//       </div>

//       <div style={{ marginTop: '20px' }}>
//         <h4>Test PDF Opening:</h4>
//         <button 
//           onClick={() => {
//             const fileUrl = lessonData.fileUrl || lessonData.file_url || lessonData.file;
//             if (fileUrl) {
//               // Test if it's relative
//               let fullUrl = fileUrl;
//               if (fileUrl.startsWith('/uploads/') || (fileUrl.startsWith('/') && !fileUrl.startsWith('http'))) {
//                 fullUrl = 'https://mathe-class-website-backend-1.onrender.com' + fileUrl;
//               }
//               console.log('Testing URL:', fullUrl);
//               window.open(fullUrl, '_blank');
//             } else {
//               alert('No file URL found');
//             }
//           }}
//           style={{
//             backgroundColor: '#2196F3',
//             color: 'white',
//             border: 'none',
//             padding: '10px 20px',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Test Open PDF Directly
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DebugLessonData;




// src/components/DebugLessonData.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const DebugLessonData = ({ lessonId = 5788 }) => {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urlTestResults, setUrlTestResults] = useState({});

  useEffect(() => {
    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      console.log(`🔍 Fetching lesson data for ID: ${lessonId}`);
      const response = await axiosInstance.get(`/lessons/${lessonId}`);
      console.log('📦 Lesson API Response:', response.data);
      
      const lesson = response.data.lesson || response.data;
      setLessonData(lesson);
      
      // Test all URLs automatically
      testAllUrls(lesson);
    } catch (err) {
      console.error('❌ Error fetching lesson:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testUrl = async (url, key) => {
    if (!url) return { accessible: false, error: 'No URL' };
    
    try {
      console.log(`🧪 Testing URL (${key}):`, url);
      
      let fullUrl = url;
      if (url.startsWith('/uploads/') || (url.startsWith('/') && !url.startsWith('http'))) {
        fullUrl = 'https://mathe-class-website-backend-1.onrender.com' + url;
      }
      
      // Test with fetch HEAD request
      const response = await fetch(fullUrl, { method: 'HEAD', mode: 'no-cors' });
      return { 
        accessible: true, 
        url: fullUrl,
        originalUrl: url,
        note: 'HEAD request succeeded (CORS may prevent full check)' 
      };
    } catch (fetchError) {
      console.log(`❌ Fetch test failed for ${key}:`, fetchError);
      
      // Try image load test
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ 
          accessible: true, 
          url: fullUrl || url,
          originalUrl: url,
          note: 'Image load succeeded' 
        });
        img.onerror = () => resolve({ 
          accessible: false, 
          url: fullUrl || url,
          originalUrl: url,
          error: 'Failed to load resource' 
        });
        img.src = fullUrl || url;
      });
    }
  };

  const testAllUrls = async (lesson) => {
    const urlsToTest = {
      fileUrl: lesson.fileUrl,
      file_url: lesson.file_url,
      file: lesson.file,
      videoUrl: lesson.videoUrl,
      video_url: lesson.video_url
    };
    
    const results = {};
    
    for (const [key, url] of Object.entries(urlsToTest)) {
      if (url) {
        const result = await testUrl(url, key);
        results[key] = result;
      }
    }
    
    setUrlTestResults(results);
    console.log('📊 URL Test Results:', results);
  };

  const testUrlOpening = (url, key = '') => {
    if (!url) {
      alert('No URL provided');
      return;
    }

    console.log(`🔗 Testing URL opening (${key}):`, url);
    
    // Check if it's relative
    let fullUrl = url;
    if (url.startsWith('/uploads/') || (url.startsWith('/') && !url.startsWith('http'))) {
      fullUrl = 'https://mathe-class-website-backend-1.onrender.com' + url;
      console.log('🔄 Converted to absolute URL:', fullUrl);
    }
    
    // Test if URL is accessible
    const testLink = document.createElement('a');
    testLink.href = fullUrl;
    testLink.target = '_blank';
    testLink.rel = 'noopener noreferrer';
    
    console.log('🚀 Opening URL in new tab...');
    testLink.click();
    
    // Log the result
    setTimeout(() => {
      console.log(`📄 Opened URL: ${fullUrl}`);
      console.log(`📊 Test result from earlier:`, urlTestResults[key] || 'No test performed');
    }, 500);
  };

  const refreshData = () => {
    setLoading(true);
    fetchLessonData();
  };

  if (loading) return <div style={{ padding: '10px', color: '#666' }}>Loading lesson data...</div>;
  if (error) return <div style={{ padding: '10px', color: '#d32f2f' }}>Error: {error}</div>;
  if (!lessonData) return <div style={{ padding: '10px', color: '#666' }}>No lesson data found</div>;

  // Get all possible file URL properties
  const fileUrls = {
    fileUrl: lessonData.fileUrl,
    file_url: lessonData.file_url,
    file: lessonData.file,
    videoUrl: lessonData.videoUrl,
    video_url: lessonData.video_url
  };

  const contentType = lessonData.contentType || lessonData.content_type || 'text';
  const isPdf = contentType.toLowerCase() === 'pdf' || contentType.toLowerCase() === 'file';
  const hasAnyUrl = Object.values(fileUrls).some(url => url);

  return (
    <div style={{ 
      padding: '15px', 
      border: '1px solid #e0e0e0', 
      backgroundColor: '#f9f9f9',
      borderRadius: '6px',
      marginBottom: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h4 style={{ margin: 0 }}>📊 Lesson Debug (ID: {lessonId})</h4>
        <button 
          onClick={refreshData}
          style={{
            padding: '5px 10px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Refresh
        </button>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div><strong>Title:</strong> {lessonData.title || 'N/A'}</div>
        <div><strong>Content Type:</strong> {contentType}</div>
        <div><strong>Is PDF Type:</strong> {isPdf ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Has Any URL:</strong> {hasAnyUrl ? '✅ Yes' : '❌ No'}</div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h5 style={{ marginBottom: '8px' }}>📁 File URLs & Tests:</h5>
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {Object.entries(fileUrls).map(([key, value]) => {
            const testResult = urlTestResults[key];
            const isAccessible = testResult?.accessible;
            
            return (
              <div key={key} style={{ 
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: value ? (isAccessible ? '#e8f5e9' : '#ffebee') : '#f5f5f5',
                borderRadius: '4px',
                borderLeft: `4px solid ${value ? (isAccessible ? '#4CAF50' : '#f44336') : '#9e9e9e'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{key}:</strong> {value || '(empty)'}
                    {value && (
                      <div style={{ marginTop: '4px', fontSize: '11px' }}>
                        {testResult ? (
                          <>
                            <span style={{ color: isAccessible ? '#4CAF50' : '#f44336' }}>
                              {isAccessible ? '✅ Accessible' : '❌ Not accessible'}
                            </span>
                            {testResult.note && <div style={{ color: '#666' }}>{testResult.note}</div>}
                            {testResult.error && <div style={{ color: '#f44336' }}>{testResult.error}</div>}
                          </>
                        ) : (
                          <span style={{ color: '#FF9800' }}>⏳ Testing...</span>
                        )}
                      </div>
                    )}
                  </div>
                  {value && (
                    <button
                      onClick={() => testUrlOpening(value, key)}
                      style={{
                        padding: '4px 12px',
                        fontSize: '11px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Open
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h5 style={{ marginBottom: '8px' }}>🔧 Quick Actions:</h5>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(fileUrls).map(([key, value]) => (
            value && (
              <button
                key={key}
                onClick={() => testUrlOpening(value, key)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Open {key}
              </button>
            )
          ))}
          
          <button
            onClick={() => {
              console.clear();
              console.log('🧹 Console cleared');
              console.log('📦 Current lesson data:', lessonData);
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear & Log
          </button>
        </div>
      </div>

      <div>
        <h5 style={{ marginBottom: '8px' }}>📝 Raw Data:</h5>
        <details>
          <summary style={{ cursor: 'pointer', color: '#666', fontSize: '13px' }}>
            Click to view full lesson object
          </summary>
          <pre style={{ 
            marginTop: '10px',
            backgroundColor: '#fff', 
            padding: '10px', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '11px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(lessonData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default DebugLessonData;