
// // services/authService.js
// import axios from "axios";

// const API_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// // Create axios instance with defaults
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // ✅ Always send cookies
// });

// // 🔐 Login
// export const login = (payload) => api.post("/auth/login", payload);

// // 📝 Register
// export const register = (payload) => api.post("/auth/register", payload);

// // 👤 Get current user
// export const getCurrentUser = () => api.get("/auth/me");

// // 🚪 Logout
// export const logout = () => api.post("/auth/logout");




// src/services/authService.js
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ Always send cookies
});

// =======================
// 🔐 Auth Endpoints
// =======================

// Login
export const login = (payload) => api.post("/auth/login", payload);

// Register
export const register = (payload) => api.post("/auth/register", payload);

// Get current user
export const getCurrentUser = () => api.get("/auth/me");

// Logout
export const logout = () => api.post("/auth/logout");

// =======================
// 🎓 Student Endpoints
// =======================

// Fetch student's enrolled courses (Approved & Pending)
export const fetchMyCourses = () => api.get("/enrollments/my-courses");

// Enroll in a course
export const enrollInCourse = (courseId) =>
  api.post(`/enrollments/course/${courseId}`);

// Check enrollment status for a specific course
export const checkEnrollmentStatus = (courseId) =>
  api.get(`/enrollments/course/${courseId}/status`);

// =======================
// 📚 Courses (Shared)
// =======================

// Fetch all courses
export const fetchCourses = () => api.get("/courses");

// Fetch a course by slug
export const fetchCourseBySlug = (slug) => api.get(`/courses/slug/${slug}`);

// Fetch lessons for a course (for students)
export const fetchLessonsByCourse = (courseId) =>
  api.get(`/lessons/course/${courseId}/all`);
