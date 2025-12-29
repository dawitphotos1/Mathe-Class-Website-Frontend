// src/App.jsx - CLEAN AND COMPLETE VERSION
import React, { Suspense, useState } from "react";
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
import "react-toastify/dist/ReactToastify.css";

// Import all pages from index
import * as Pages from "./pages";

// Lazy load all pages
const lazyPage = (page) => React.lazy(() => Promise.resolve({ default: page }));

// Public Pages
const Home = lazyPage(Pages.Home);
const Register = lazyPage(Pages.Register);
const Login = lazyPage(Pages.Login);
const ForgotPassword = lazyPage(Pages.ForgotPassword);
const ResetPassword = lazyPage(Pages.ResetPassword);
const ConfirmAccount = lazyPage(Pages.ConfirmAccount);
const Courses = lazyPage(Pages.Courses);
const CourseDetail = lazyPage(Pages.CourseDetail);
const CourseViewer = lazyPage(Pages.CourseViewer);
const PreviewPage = lazyPage(Pages.PreviewPage);
const CoursePreviewPage = lazyPage(Pages.CoursePreviewPage);
const PaymentSuccess = lazyPage(Pages.PaymentSuccess);
const PaymentCancel = lazyPage(Pages.PaymentCancel);
const Cancel = lazyPage(Pages.Cancel);
const NotFound = lazyPage(Pages.NotFound);
const Unauthorized = lazyPage(Pages.Unauthorized);

// Protected Pages
const AdminDashboard = lazyPage(Pages.AdminDashboard);
const ManageCourses = lazyPage(Pages.ManageCourses);
const ManageUsers = lazyPage(Pages.ManageUsers);
const TeacherManageLessons = lazyPage(Pages.TeacherManageLessons);
const CreateCourse = lazyPage(Pages.CreateCourse);
const CreateCourseWithUnits = lazyPage(Pages.CreateCourseWithUnits);
const CourseLessons = lazyPage(Pages.CourseLessons);
const EditCourse = lazyPage(Pages.EditCourse);
const CreateLessonPage = lazyPage(Pages.CreateLessonPage);
const MyTeachingCourses = lazyPage(Pages.MyTeachingCourses);
const TeacherCourseViewer = lazyPage(Pages.TeacherCourseViewer);
const StudentLessons = lazyPage(Pages.StudentLessons);
const PreviewLesson = lazyPage(Pages.PreviewLesson);
const MyCoursesPage = lazyPage(Pages.MyCoursesPage);
const Profile = lazyPage(Pages.Profile);
const StudentDashboard = lazyPage(Pages.StudentDashboard);
const FileManager = lazyPage(Pages.FileManager);
const PaymentPage = lazyPage(Pages.PaymentPage);

// Dynamically imported components (to avoid circular dependencies)
const EditLesson = React.lazy(() => import("./pages/teachers/EditLesson"));
const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
const PendingStudents = React.lazy(() =>
  import("./components/PendingStudents")
);
const PendingEnrollments = React.lazy(() =>
  import("./components/PendingEnrollments")
);
const AdminLessonLogs = React.lazy(() => import("./pages/AdminLessonLogs"));

/* Public Route Component */
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

/* Role-Based Redirect Component */
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

/* Debug Panel Component */
const DebugWrapper = ({ children }) => {
  const [showDebug, setShowDebug] = useState(false);
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  if (!isTeacherOrAdmin) return children;

  return (
    <>
      {children}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="debug-toggle-btn"
        aria-label={showDebug ? "Close debug panel" : "Open debug panel"}
      >
        {showDebug ? "×" : "🐛"}
      </button>
      {showDebug && (
        <div className="debug-panel">
          <h4>Debug Panel</h4>
          <pre>User: {JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

/* Main App Content Component */
function AppContent() {
  const { loading, checked } = useAuth();

  if (loading || !checked) return <Loading />;

  return (
    <div className="app">
      <CSSDebug />
      <ErrorBoundary>
        <Navbar />

        <main className="main-content">
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* ================= PUBLIC ROUTES ================= */}
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
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseViewer />} />
              <Route path="/courses/id/:id" element={<CourseViewer />} />

              {/* Preview Routes */}
              <Route path="/preview/:lessonId" element={<PreviewPage />} />
              <Route
                path="/courses/:courseId/preview"
                element={<CoursePreviewPage />}
              />

              {/* Payment Result Pages */}
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route path="/cancel" element={<Cancel />} />

              {/* ================= DASHBOARD REDIRECT ================= */}
              <Route path="/dashboard" element={<RoleBasedRedirect />} />

              {/* ================= ADMIN ROUTES ================= */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DebugWrapper>
                      <AdminLayout />
                    </DebugWrapper>
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="pending-students" element={<PendingStudents />} />
                <Route
                  path="pending-enrollments"
                  element={<PendingEnrollments />}
                />
                <Route path="manage-courses" element={<ManageCourses />} />
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="lesson-logs" element={<AdminLessonLogs />} />
                <Route path="file-manager" element={<FileManager />} />
              </Route>

              {/* ================= TEACHER ROUTES ================= */}
              <Route
                path="/teacher-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <DebugWrapper>
                      <MyTeachingCourses />
                    </DebugWrapper>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teacher/courses/:courseId/view"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <TeacherCourseViewer />
                  </ProtectedRoute>
                }
              />

              {/* Multiple Edit Lesson Routes for compatibility */}
              <Route
                path="/teacher/courses/:courseId/lessons/:lessonId/edit"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <EditLesson />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/courses/:courseId/lessons/:lessonId/edit"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <EditLesson />
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

              <Route
                path="/preview/:lessonId/edit"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <EditLesson />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teacher/lessons/:lessonId/edit"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <EditLesson />
                  </ProtectedRoute>
                }
              />

              {/* Other Teacher Routes */}
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
                    <TeacherManageLessons />
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

              {/* ================= STUDENT ROUTES ================= */}
              <Route
                path="/my-courses"
                element={
                  <ProtectedRoute
                    allowedRoles={["student", "teacher", "admin"]}
                  >
                    <MyCoursesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/courses/:courseId/view"
                element={
                  <ProtectedRoute
                    allowedRoles={["student", "teacher", "admin"]}
                  >
                    <CourseViewer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/courses/:courseId/view-lessons"
                element={
                  <ProtectedRoute
                    allowedRoles={["student", "teacher", "admin"]}
                  >
                    <CourseLessons />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student/courses/:courseId/lessons"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentLessons />
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

              <Route
                path="/payment/:courseId"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />

              {/* ================= ERROR ROUTES ================= */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <FixedToastContainer />

        <footer className="app-footer">
          <p>
            © {new Date().getFullYear()} Math Class Platform. All rights
            reserved.
          </p>
          <p className="footer-help">
            Need help? <a href="/contact">Contact Support</a>
          </p>
        </footer>
      </ErrorBoundary>
    </div>
  );
}

/* Main App Component */
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
