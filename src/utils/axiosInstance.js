// // src/utils/axiosInstance.js - FIXED VERSION
// import axios from 'axios';

// // Determine the backend URL - WITH /api/v1 included
// const getBackendUrl = () => {
//   // Priority 1: Environment variable (should include /api/v1)
//   if (process.env.REACT_APP_API_URL) {
//     const url = process.env.REACT_APP_API_URL.trim();
//     // Ensure it ends with /api/v1
//     return url.endsWith('/api/v1') ? url : `${url.replace(/\/+$/, '')}/api/v1`;
//   }
  
//   // Priority 2: Alternative environment variable
//   if (process.env.REACT_APP_BACKEND_URL) {
//     const url = process.env.REACT_APP_BACKEND_URL.trim();
//     return url.endsWith('/api/v1') ? url : `${url.replace(/\/+$/, '')}/api/v1`;
//   }
  
//   // Priority 3: Production URL (with /api/v1)
//   if (process.env.NODE_ENV === 'production') {
//     return 'https://mathe-class-website-backend-1.onrender.com/api/v1';
//   }
  
//   // Priority 4: Development default (with /api/v1)
//   return 'http://localhost:5000/api/v1';
// };

// const BACKEND_URL = getBackendUrl();
// console.log(`🌐 Backend Base URL: ${BACKEND_URL}`);
// console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
// console.log(`🌐 REACT_APP_API_URL: ${process.env.REACT_APP_API_URL || 'Not set'}`);

// // Create axios instance - baseURL now includes /api/v1
// const axiosInstance = axios.create({
//   baseURL: BACKEND_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 30000,
// });

// // Request interceptor - add auth token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token') || 
//                   localStorage.getItem('authToken') || 
//                   localStorage.getItem('jwtToken') ||
//                   sessionStorage.getItem('token');
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     const fullUrl = config.url.startsWith('http') 
//       ? config.url 
//       : `${config.baseURL}${config.url}`;
//     console.log(`🌐 Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    
//     return config;
//   },
//   (error) => {
//     console.error('❌ Request interceptor error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       const { status, data } = error.response;
//       const url = error.config?.url;
//       const method = error.config?.method?.toUpperCase();
      
//       console.error(`❌ API Error ${status} ${method} ${url}:`, data?.error || data?.message || 'Unknown error');
      
//       if (status === 401) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('authToken');
//         sessionStorage.removeItem('token');
        
//         if (!window.location.pathname.includes('/login') && 
//             !window.location.pathname.includes('/register')) {
//           const currentPath = window.location.pathname + window.location.search;
//           window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
//         }
//       }
//     } else if (error.request) {
//       console.error('📡 No response received - server might be down or network issue');
//     } else {
//       console.error('🚫 Request setup error:', error.message);
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Helper function to test backend connectivity
// export const testBackendConnection = async () => {
//   console.log('🔍 Testing backend connectivity...');
//   console.log(`🌐 Base URL: ${BACKEND_URL}`);
  
//   try {
//     const response = await axiosInstance.get('/courses');
    
//     if (response.data) {
//       console.log('✅ Backend connection successful!');
//       console.log(`📊 Found ${Array.isArray(response.data) ? response.data.length : response.data.courses?.length || 0} courses`);
//       return { 
//         success: true, 
//         baseUrl: BACKEND_URL,
//         data: response.data 
//       };
//     }
//   } catch (error) {
//     console.error('❌ Backend test failed:', error.message);
//     return { 
//       success: false, 
//       error: error.message,
//       baseUrl: BACKEND_URL 
//     };
//   }
// };

// // Helper functions
// export const setAuthToken = (token) => {
//   if (token) {
//     localStorage.setItem('token', token);
//     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     console.log('🔐 Auth token set');
//   } else {
//     clearAuthToken();
//   }
// };

// export const clearAuthToken = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('authToken');
//   delete axiosInstance.defaults.headers.common['Authorization'];
//   console.log('🔓 Auth token cleared');
// };

// export const getAuthToken = () => {
//   return localStorage.getItem('token') || localStorage.getItem('authToken');
// };

// // Run a quick test on module load in development
// if (process.env.NODE_ENV === 'development') {
//   setTimeout(() => {
//     testBackendConnection().then(result => {
//       if (!result.success) {
//         console.warn('⚠️ Backend connection test failed on startup');
//       }
//     });
//   }, 1000);
// }

// export default axiosInstance;



// src/utils/axiosInstance.js - ENHANCED DEBUGGING VERSION
import axios from 'axios';

// Determine the backend URL - WITH /api/v1 included
const getBackendUrl = () => {
  // Priority 1: Environment variable (should include /api/v1)
  if (process.env.REACT_APP_API_URL) {
    const url = process.env.REACT_APP_API_URL.trim();
    // Ensure it ends with /api/v1
    return url.endsWith('/api/v1') ? url : `${url.replace(/\/+$/, '')}/api/v1`;
  }
  
  // Priority 2: Alternative environment variable
  if (process.env.REACT_APP_BACKEND_URL) {
    const url = process.env.REACT_APP_BACKEND_URL.trim();
    return url.endsWith('/api/v1') ? url : `${url.replace(/\/+$/, '')}/api/v1`;
  }
  
  // Priority 3: Production URL (with /api/v1)
  if (process.env.NODE_ENV === 'production') {
    return 'https://mathe-class-website-backend-1.onrender.com/api/v1';
  }
  
  // Priority 4: Development default (with /api/v1)
  return 'http://localhost:5000/api/v1';
};

const BACKEND_URL = getBackendUrl();

// Enhanced logging configuration
const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || 'info';
const shouldLog = (level) => {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  return levels[LOG_LEVEL] <= levels[level];
};

// Log initialization
console.log(`🌐 Backend Base URL: ${BACKEND_URL}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
console.log(`🌐 REACT_APP_API_URL: ${process.env.REACT_APP_API_URL || 'Not set'}`);
console.log(`📝 Log Level: ${LOG_LEVEL}`);

// Create axios instance - baseURL now includes /api/v1
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor - add auth token with debugging
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from various storage locations
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('jwtToken') ||
                  sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (shouldLog('debug')) {
        console.debug('🔐 Auth token added to request');
      }
    }
    
    // Construct full URL for logging
    const fullUrl = config.url.startsWith('http') 
      ? config.url 
      : `${config.baseURL}${config.url}`;
    
    // Enhanced logging based on log level
    if (shouldLog('info')) {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    if (shouldLog('debug')) {
      console.debug('📦 Request config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor - COMPLETELY CLEANED UP VERSION
axiosInstance.interceptors.response.use(
  (response) => {
    // Clean success logging - NO FEATURES CHECKING
    if (shouldLog('info')) {
      console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    
    if (shouldLog('debug')) {
      console.debug('📦 Response data:', {
        status: response.status,
        data: response.data,
        url: response.config.url,
      });
    }
    
    // ✅ CRITICAL FIX: Simply return the response without any modifications
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.response) {
      const { status, data, config } = error.response;
      const url = config?.url || 'unknown';
      const method = config?.method?.toUpperCase() || 'UNKNOWN';
      
      // Log error based on status code
      if (status >= 500) {
        console.error(`🔥 Server Error ${status} ${method} ${url}:`, data?.error || data?.message || 'Internal server error');
      } else if (status === 401) {
        console.warn(`🔐 Unauthorized ${method} ${url}:`, data?.error || 'Authentication required');
      } else if (status === 404) {
        console.warn(`🔍 Not Found ${method} ${url}`);
      } else {
        console.error(`❌ API Error ${status} ${method} ${url}:`, data?.error || data?.message || 'Unknown error');
      }
      
      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        // Don't redirect from contact page
        const currentPath = window.location.pathname;
        const isContactPage = currentPath.includes('/contact');
        const isAuthPage = currentPath.includes('/login') || 
                          currentPath.includes('/register') || 
                          currentPath.includes('/auth');
        
        if (!isAuthPage && !isContactPage) {
          // Gentle notification
          if (window.showToast) {
            window.showToast('Session expired. Please log in again.', 'warning');
          }
          
          // Redirect after delay
          setTimeout(() => {
            const redirectPath = encodeURIComponent(currentPath + window.location.search);
            window.location.href = `/login?redirect=${redirectPath}`;
          }, 2000);
        }
      }
      
      // Add helpful error messages for common cases
      if (status === 403) {
        error.userMessage = 'Access denied. You do not have permission for this action.';
      } else if (status === 404) {
        error.userMessage = 'Resource not found.';
      } else if (status >= 500) {
        error.userMessage = 'Server error. Please try again later.';
      } else {
        error.userMessage = data?.error || data?.message || 'An error occurred.';
      }
      
    } else if (error.request) {
      // The request was made but no response was received
      console.error('📡 Network Error: No response received from server');
      console.error('   URL:', error.config?.url);
      console.error('   Method:', error.config?.method);
      
      error.userMessage = 'Network error. Please check your connection and try again.';
      
    } else {
      // Something happened in setting up the request
      console.error('🚫 Request setup error:', error.message);
      error.userMessage = 'Failed to send request. Please try again.';
    }
    
    // Add timestamp for debugging
    error.timestamp = new Date().toISOString();
    
    return Promise.reject(error);
  }
);

// Helper function to test backend connectivity
export const testBackendConnection = async () => {
  console.log('🔍 Testing backend connectivity...');
  console.log(`🌐 Base URL: ${BACKEND_URL}`);
  
  try {
    // Try a lightweight endpoint first
    const response = await axiosInstance.get('/auth/me', { timeout: 5000 });
    
    console.log('✅ Backend connection successful!');
    console.log('📊 Auth endpoint responded with status:', response.status);
    
    return { 
      success: true, 
      baseUrl: BACKEND_URL,
      status: response.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    
    // Try a different endpoint as fallback
    try {
      const fallbackResponse = await axiosInstance.get('/courses', { timeout: 3000 });
      console.log('⚠️ Auth endpoint failed but courses endpoint works');
      return { 
        success: true, 
        baseUrl: BACKEND_URL,
        warning: 'Auth endpoint may have issues, but backend is reachable',
        status: fallbackResponse.status
      };
    } catch (fallbackError) {
      console.error('❌ Both endpoints failed:', fallbackError.message);
      
      return { 
        success: false, 
        error: error.message,
        baseUrl: BACKEND_URL,
        timestamp: new Date().toISOString()
      };
    }
  }
};

// Enhanced auth token management
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    if (shouldLog('info')) {
      console.log('🔐 Auth token set');
    }
  } else {
    clearAuthToken();
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  delete axiosInstance.defaults.headers.common['Authorization'];
  
  if (shouldLog('info')) {
    console.log('🔓 Auth token cleared');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Convenience functions for common API calls
export const apiGet = (url, config = {}) => axiosInstance.get(url, config);
export const apiPost = (url, data = {}, config = {}) => axiosInstance.post(url, data, config);
export const apiPut = (url, data = {}, config = {}) => axiosInstance.put(url, data, config);
export const apiPatch = (url, data = {}, config = {}) => axiosInstance.patch(url, data, config);
export const apiDelete = (url, config = {}) => axiosInstance.delete(url, config);

// Special contact form function that bypasses interceptors if needed
export const sendContactForm = async (formData) => {
  console.log('📨 Sending contact form directly...');
  
  // Use direct fetch to avoid axios interceptor issues
  try {
    const response = await fetch(`${BACKEND_URL}/email/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('📨 Direct fetch failed:', error);
    throw error;
  }
};

// Run a quick test on module load in development
if (process.env.NODE_ENV === 'development' && shouldLog('info')) {
  setTimeout(() => {
    testBackendConnection().then(result => {
      if (!result.success) {
        console.warn('⚠️ Backend connection test failed on startup');
        console.warn('   Please check if backend server is running');
        console.warn(`   Backend URL: ${BACKEND_URL}`);
      } else {
        console.log('🚀 Backend connection verified on startup');
      }
    });
  }, 2000);
}

export default axiosInstance;