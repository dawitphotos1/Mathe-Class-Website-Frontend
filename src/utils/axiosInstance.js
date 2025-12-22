// src/utils/axiosInstance.js - FIXED VERSION
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
console.log(`🌐 Backend Base URL: ${BACKEND_URL}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
console.log(`🌐 REACT_APP_API_URL: ${process.env.REACT_APP_API_URL || 'Not set'}`);

// Create axios instance - baseURL now includes /api/v1
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('jwtToken') ||
                  sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const fullUrl = config.url.startsWith('http') 
      ? config.url 
      : `${config.baseURL}${config.url}`;
    console.log(`🌐 Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const url = error.config?.url;
      const method = error.config?.method?.toUpperCase();
      
      console.error(`❌ API Error ${status} ${method} ${url}:`, data?.error || data?.message || 'Unknown error');
      
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('token');
        
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          const currentPath = window.location.pathname + window.location.search;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    } else if (error.request) {
      console.error('📡 No response received - server might be down or network issue');
    } else {
      console.error('🚫 Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to test backend connectivity
export const testBackendConnection = async () => {
  console.log('🔍 Testing backend connectivity...');
  console.log(`🌐 Base URL: ${BACKEND_URL}`);
  
  try {
    const response = await axiosInstance.get('/courses');
    
    if (response.data) {
      console.log('✅ Backend connection successful!');
      console.log(`📊 Found ${Array.isArray(response.data) ? response.data.length : response.data.courses?.length || 0} courses`);
      return { 
        success: true, 
        baseUrl: BACKEND_URL,
        data: response.data 
      };
    }
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    return { 
      success: false, 
      error: error.message,
      baseUrl: BACKEND_URL 
    };
  }
};

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

// Run a quick test on module load in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    testBackendConnection().then(result => {
      if (!result.success) {
        console.warn('⚠️ Backend connection test failed on startup');
      }
    });
  }, 1000);
}

export default axiosInstance;