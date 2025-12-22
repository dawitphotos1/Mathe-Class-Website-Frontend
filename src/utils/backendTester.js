// src/utils/backendTester.js
export const findWorkingBackendEndpoint = async () => {
  // Try different base URLs
  const baseURLs = [
    'https://mathe-class-website-backend-1.onrender.com',
    'http://localhost:5000',
  ];
  
  // Try different endpoint patterns
  const endpoints = [
    '/api/v1/courses',
    '/courses',
    '/api/courses',
    '/api/v1',
    '/',
  ];
  
  console.log('🔍 Testing backend endpoints...');
  
  for (const base of baseURLs) {
    for (const endpoint of endpoints) {
      const url = `${base}${endpoint}`;
      try {
        console.log(`Testing: ${url}`);
        const response = await fetch(url, { 
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        console.log(`Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found working endpoint: ${url}`);
          console.log('Response:', data);
          
          return {
            baseURL: base,
            endpoint: endpoint,
            fullURL: url,
            data: data,
            status: response.status,
            statusText: response.statusText,
          };
        }
      } catch (error) {
        console.log(`❌ ${url}: ${error.message}`);
      }
    }
  }
  
  console.log('❌ No working endpoints found');
  return null;
};

// Quick test function
export const quickBackendTest = async () => {
  console.log('🚀 Running quick backend test...');
  
  // Direct test without axios
  const testURL = 'https://mathe-class-website-backend-1.onrender.com/api/v1/courses';
  console.log(`Testing: ${testURL}`);
  
  try {
    const response = await fetch(testURL);
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Data:', data);
      return data;
    } else {
      console.log('❌ Failed:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  return null;
};