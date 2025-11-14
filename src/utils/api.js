// // src/utils/api.js (Frontend)
// import axios from "axios";

// const pendingRequests = new Set();
// const MAX_CONCURRENT_REQUESTS = 5;
// const REQUEST_DELAY = 100; // ms

// // Create axios instance with base configuration
// const api = axios.create({
//   baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:3000/api/v1",
//   timeout: 30000,
//   withCredentials: true,
// });

// // Request throttling interceptor
// api.interceptors.request.use(async (config) => {
//   // Wait if too many requests are pending
//   while (pendingRequests.size >= MAX_CONCURRENT_REQUESTS) {
//     await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
//   }

//   const requestId = `${config.method}-${config.url}`;
//   pendingRequests.add(requestId);

//   return config;
// });

// // Response interceptor to remove from pending requests
// api.interceptors.response.use(
//   (response) => {
//     const requestId = `${response.config.method}-${response.config.url}`;
//     pendingRequests.delete(requestId);
//     return response;
//   },
//   (error) => {
//     const requestId = `${error.config?.method}-${error.config?.url}`;
//     pendingRequests.delete(requestId);

//     // Handle 429 errors with retry logic
//     if (error.response?.status === 429) {
//       console.warn("Rate limit exceeded, implementing backoff...");
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(api(error.config));
//         }, 2000); // Wait 2 seconds before retry
//       });
//     }

//     return Promise.reject(error);
//   }
// );

// // Batch request helper
// export const batchRequests = async (requests) => {
//   const results = [];

//   for (let i = 0; i < requests.length; i += MAX_CONCURRENT_REQUESTS) {
//     const batch = requests.slice(i, i + MAX_CONCURRENT_REQUESTS);
//     const batchResults = await Promise.allSettled(batch);
//     results.push(...batchResults);

//     // Small delay between batches
//     if (i + MAX_CONCURRENT_REQUESTS < requests.length) {
//       await new Promise((resolve) => setTimeout(resolve, 50));
//     }
//   }

//   return results;
// };

// // Batch fetch lessons for a course (optimized)
// export const fetchCourseLessons = async (courseId) => {
//   try {
//     console.log(
//       `📚 Fetching all lessons for course ${courseId} in single request`
//     );
//     const response = await api.get(`/courses/${courseId}/lessons`);
//     return response.data.lessons || [];
//   } catch (error) {
//     console.error("❌ Error fetching course lessons:", error);
//     return [];
//   }
// };

// // Cache for lessons to avoid repeated requests
// const lessonCache = new Map();
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// export const getCachedLessons = async (courseId) => {
//   const cacheKey = `lessons-${courseId}`;
//   const cached = lessonCache.get(cacheKey);

//   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//     console.log(`📚 Using cached lessons for course ${courseId}`);
//     return cached.data;
//   }

//   const lessons = await fetchCourseLessons(courseId);
//   lessonCache.set(cacheKey, {
//     data: lessons,
//     timestamp: Date.now(),
//   });

//   return lessons;
// };

// // Clear cache helper
// export const clearLessonCache = (courseId = null) => {
//   if (courseId) {
//     lessonCache.delete(`lessons-${courseId}`);
//   } else {
//     lessonCache.clear();
//   }
// };

// export default api;




// src/utils/api.js
import axios from 'axios';

const pendingRequests = new Set();
const MAX_CONCURRENT_REQUESTS = 5;

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
  withCredentials: true,
});

// Request throttling interceptor
api.interceptors.request.use(async (config) => {
  // Wait if too many requests are pending
  while (pendingRequests.size >= MAX_CONCURRENT_REQUESTS) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const requestId = `${config.method}-${config.url}`;
  pendingRequests.add(requestId);
  
  return config;
});

// Response interceptor to remove from pending requests
api.interceptors.response.use(
  (response) => {
    const requestId = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(requestId);
    return response;
  },
  (error) => {
    const requestId = `${error.config?.method}-${error.config?.url}`;
    pendingRequests.delete(requestId);
    
    // Handle 429 errors with retry logic
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded, implementing backoff...');
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(api(error.config));
        }, 2000); // Wait 2 seconds before retry
      });
    }
    
    return Promise.reject(error);
  }
);

// Cache for lessons to avoid repeated requests
const lessonCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchCourseLessons = async (courseId) => {
  try {
    console.log(`📚 Fetching all lessons for course ${courseId} in single request`);
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data.lessons || [];
  } catch (error) {
    console.error('❌ Error fetching course lessons:', error);
    return [];
  }
};

export const getCachedLessons = async (courseId) => {
  const cacheKey = `lessons-${courseId}`;
  const cached = lessonCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📚 Using cached lessons for course ${courseId}`);
    return cached.data;
  }
  
  const lessons = await fetchCourseLessons(courseId);
  lessonCache.set(cacheKey, {
    data: lessons,
    timestamp: Date.now()
  });
  
  return lessons;
};

export const clearLessonCache = (courseId = null) => {
  if (courseId) {
    lessonCache.delete(`lessons-${courseId}`);
  } else {
    lessonCache.clear();
  }
};

// Batch request helper
export const batchRequests = async (requests) => {
  const results = [];
  
  for (let i = 0; i < requests.length; i += MAX_CONCURRENT_REQUESTS) {
    const batch = requests.slice(i, i + MAX_CONCURRENT_REQUESTS);
    const batchResults = await Promise.allSettled(batch);
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + MAX_CONCURRENT_REQUESTS < requests.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  return results;
};

export default api;