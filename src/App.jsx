// src/App.jsx - UPDATED VERSION
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FixedToastContainer } from "./components/FixedToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import CSSDebug from "./components/CSSDebug";
import Contact from "./components/Contact";
import ConfirmAccount from "./pages/ConfirmAccount";

import "react-toastify/dist/ReactToastify.css";

/* Lazy pages */
const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

const Courses = React.lazy(() => import("./pages/courses/Courses"));
const CourseDetail = React.lazy(() => import("./pages/courses/CourseDetail"));

const PreviewLessonPage = React.lazy(() => import("./pages/PreviewLessonPage"));

const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));
const PaymentSuccess = React.lazy(() =>
  import("./pages/payments/PaymentSuccess")
);
const PaymentCancel = React.lazy(() =>
  import("./pages/payments/PaymentCancel")
);
const Cancel = React.lazy(() => import("./pages/payments/Cancel"));

const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const ManageCourses = React.lazy(() => import("./pages/AdminManageCourses"));
const ManageUsers = React.lazy(() => import("./pages/AdminManageUsers"));
const PendingStudents = React.lazy(() =>
  import("./components/PendingStudents")
);
const PendingEnrollments = React.lazy(() =>
  import("./components/PendingEnrollments")
);
const AdminLessonLogs = React.lazy(() => import("./pages/AdminLessonLogs"));
const FileManager = React.lazy(() => import("./pages/FileManager"));

const CourseViewer = React.lazy(() => import("./pages/courses/CourseViewer"));
const Profile = React.lazy(() => import("./pages/users/Profile"));

const Unauthorized = React.lazy(() => import("./pages/Unauthorized"));

const MyCoursesPage = React.lazy(() => import("./pages/courses/MyCourses"));

const ManageLessons = React.lazy(() =>
  import("./pages/teachers/ManageLessons")
);
const CreateCourse = React.lazy(() => import("./pages/CreateCourse"));
const CreateCourseWithUnits = React.lazy(() =>
  import("./pages/CreateCourseWithUnits")
);
const CourseLessons = React.lazy(() => import("./pages/CourseLessons"));
const EditCourse = React.lazy(() => import("./pages/teachers/EditCourse"));
const EditLesson = React.lazy(() => import("./pages/teachers/EditLesson"));
const CreateLessonPage = React.lazy(() =>
  import("./pages/teachers/CreateLessonPage")
);
const MyTeachingCourses = React.lazy(() =>
  import("./pages/teachers/MyTeachingCourses")
);

const PreviewLesson = React.lazy(() => import("./pages/PreviewLesson"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

/* Public Route */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, checked, user } = useAuth();
  if (loading || !checked) return <Loading />;

  if (isAuthenticated && user?.role) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "teacher":
        return <Navigate to="/teacher-dashboard" replace />;
      case "student":
        return <Navigate to="/my-courses" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  return children;
};

/* Role Redirect */
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "teacher":
      return <Navigate to="/teacher-dashboard" replace />;
    case "student":
      return <Navigate to="/my-courses" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

function AppContent() {
  const { loading, checked } = useAuth();
  if (loading || !checked) return <Loading />;

  return (
    <div className="app">
      <CSSDebug />
      <ErrorBoundary>
        <Navbar />

        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/confirm-account" element={<ConfirmAccount />} />

              {/* COURSE ROUTES */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />

              {/* PUBLIC PREVIEW */}
              <Route path="/preview/:lessonId" element={<PreviewLessonPage />} />
              <Route
                path="/courses/:courseId/preview"
                element={<PreviewLessonPage />}
              />

              {/* PROTECTED PREVIEW */}
              <Route
                path="/lessons/:lessonId/preview"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "student", "admin"]}>
                    <PreviewLesson />
                  </ProtectedRoute>
                }
              />

              <Route path="/dashboard" element={<RoleBasedRedirect />} />

              {/* ADMIN */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="pending-students" element={<PendingStudents />} />
                <Route path="pending-enrollments" element={<PendingEnrollments />} />
                <Route path="manage-courses" element={<ManageCourses />} />
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="lesson-logs" element={<AdminLessonLogs />} />
                <Route path="file-manager" element={<FileManager />} />
              </Route>

              {/* TEACHER */}
              <Route
                path="/teacher-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <MyTeachingCourses />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/create-course"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-course-advanced"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <CreateCourseWithUnits />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/courses/:courseId/edit" 
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <EditCourse />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/courses/:courseId/manage-lessons"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <ManageLessons />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/lessons/new"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <CreateLessonPage />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/lessons/:lessonId/edit" 
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <EditLesson />
                  </ProtectedRoute>
                } 
              />

              {/* STUDENT */}
              <Route 
                path="/my-courses" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                    <MyCoursesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses/:courseId/view" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                    <CourseViewer />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/courses/:courseId/view-lessons"
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                    <CourseLessons />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* PAYMENTS */}
              <Route 
                path="/payment/:courseId" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <PaymentPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment-success" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <PaymentSuccess />
                  </ProtectedRoute>
                } 
              />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route path="/cancel" element={<Cancel />} />
              
              {/* UNAUTHORIZED */}
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Toast Container */}
        <FixedToastContainer />
        
        {/* Footer can be added here */}
        <footer style={{ 
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          textAlign: 'center',
          borderTop: '1px solid #dee2e6'
        }}>
          <p>© {new Date().getFullYear()} Math Class Platform. All rights reserved.</p>
          <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            <a href="/contact" style={{ color: '#6c757d', textDecoration: 'none' }}>
              Contact Support
            </a>
          </p>
        </footer>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;