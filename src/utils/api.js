// src/utils/api.js
import axios from "axios";

const pendingRequests = new Set();
const MAX_CONCURRENT_REQUESTS = 5;

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:3000/api/v1",
  timeout: 30000,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Request throttling
api.interceptors.request.use(async (config) => {
  while (pendingRequests.size >= MAX_CONCURRENT_REQUESTS) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const requestId = `${config.method}-${config.url}`;
  pendingRequests.add(requestId);

  return config;
});

// Response handling
api.interceptors.response.use(
  (response) => {
    const requestId = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(requestId);
    return response;
  },
  (error) => {
    const requestId = `${error.config?.method}-${error.config?.url}`;
    pendingRequests.delete(requestId);

    if (error.response?.status === 429) {
      console.warn("Rate limit hit, retrying...");
      return new Promise((resolve) => {
        setTimeout(() => resolve(api(error.config)), 2000);
      });
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Simple cache implementation
const lessonCache = new Map();

export const getCachedLessons = async (courseId) => {
  if (!courseId) return [];

  const cacheKey = `lessons-${courseId}`;

  // Return cached data if available
  if (lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey);
  }

  try {
    // Use batch endpoint to get all lessons for course
    const response = await api.get(`/courses/${courseId}/lessons`);
    const lessons = response.data?.lessons || [];

    // Cache the result
    lessonCache.set(cacheKey, lessons);

    return lessons;
  } catch (err) {
    console.error("Failed to fetch lessons:", err);
    return [];
  }
};

export const clearLessonCache = (courseId = null) => {
  if (courseId) {
    lessonCache.delete(`lessons-${courseId}`);
  } else {
    lessonCache.clear();
  }
  console.log("Lesson cache cleared");
};

export default api;