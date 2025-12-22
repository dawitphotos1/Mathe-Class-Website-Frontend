// //utils/axiosInstance.js

// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token') || localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;





// src/utils/axiosInstance.js
import axios from 'axios';

// Determine the backend URL
const getBackendUrl = () => {
  // Priority order for backend URL
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // For production
  if (process.env.NODE_ENV === 'production') {
    return 'https://mathe-class-website-backend-1.onrender.com';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();
console.log(`🌐 Backend URL configured: ${BACKEND_URL}`);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Try multiple possible token storage keys
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('jwtToken') ||
                  sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error ${status}:`, {
        url: error.config?.url,
        method: error.config?.method,
        error: data?.error || data?.message || 'Unknown error',
      });
      
      switch (status) {
        case 401:
          // Unauthorized - clear token
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('token');
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            const currentPath = window.location.pathname + window.location.search;
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
          break;
          
        case 403:
          // Forbidden
          console.warn('⚠️ Access forbidden');
          break;
          
        case 404:
          // Not found
          console.warn('🔍 Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('🔥 Server error occurred');
          break;
          
        default:
          console.error(`⚠️ API Error ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('📡 No response received - network error or server down');
      
      // Check if backend is reachable
      if (error.code === 'ECONNREFUSED') {
        console.error('❌ Cannot connect to backend server. Please check if backend is running.');
      }
    } else {
      // Something else happened
      console.error('🚫 Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Auth token set');
  } else {
    clearAuthToken();
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  delete axiosInstance.defaults.headers.common['Authorization'];
  console.log('🔓 Auth token cleared');
};

export const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('🔄 Testing backend connection...');
    const response = await axiosInstance.get('/health');
    console.log('✅ Backend connection successful:', response.data);
    return { 
      success: true, 
      data: response.data,
      backendUrl: BACKEND_URL 
    };
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return { 
      success: false, 
      error: error.message,
      backendUrl: BACKEND_URL 
    };
  }
};

// Upload file helper
export const uploadFile = async (url, file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axiosInstance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress ? (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted);
    } : undefined,
  });
};

// Default export
export default axiosInstance;