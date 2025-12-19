// src/App.jsx - COMPLETE FIXED VERSION
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

// ✅ IMPORT FROM PAGES INDEX
import * as Pages from "./pages";

/* Lazy pages - NOW USING PAGES INDEX */
// Remove these duplicate imports and use the Pages object instead
const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

// These will be imported from Pages object
const Courses = React.lazy(() => Promise.resolve({ default: Pages.Courses }));
const CourseDetail = React.lazy(() => Promise.resolve({ default: Pages.CourseDetail }));
const CourseViewer = React.lazy(() => Promise.resolve({ default: Pages.CourseViewer }));
const PreviewLessonPage = React.lazy(() => Promise.resolve({ default: Pages.PreviewLessonPage }));
const PaymentPage = React.lazy(() => Promise.resolve({ default: Pages.PaymentPage }));
const PaymentSuccess = React.lazy(() => Promise.resolve({ default: Pages.PaymentSuccess }));
const PaymentCancel = React.lazy(() => Promise.resolve({ default: Pages.PaymentCancel }));
const Cancel = React.lazy(() => Promise.resolve({ default: Pages.Cancel }));

// Admin components
const AdminDashboard = React.lazy(() => Promise.resolve({ default: Pages.AdminDashboard }));
const ManageCourses = React.lazy(() => Promise.resolve({ default: Pages.ManageCourses }));
const ManageUsers = React.lazy(() => Promise.resolve({ default: Pages.ManageUsers }));

// Teacher components - ✅ FIXED: Use TeacherManageLessons instead of ManageLessons
const TeacherManageLessons = React.lazy(() => Promise.resolve({ default: Pages.TeacherManageLessons }));
const CreateCourse = React.lazy(() => Promise.resolve({ default: Pages.CreateCourse }));
const CreateCourseWithUnits = React.lazy(() => Promise.resolve({ default: Pages.CreateCourseWithUnits }));
const CourseLessons = React.lazy(() => Promise.resolve({ default: Pages.CourseLessons }));
const EditCourse = React.lazy(() => Promise.resolve({ default: Pages.EditCourse }));
const EditLesson = React.lazy(() => Promise.resolve({ default: Pages.EditLesson }));
const CreateLessonPage = React.lazy(() => Promise.resolve({ default: Pages.CreateLessonPage }));
const MyTeachingCourses = React.lazy(() => Promise.resolve({ default: Pages.MyTeachingCourses }));
const TeacherCourseViewer = React.lazy(() => Promise.resolve({ default: Pages.TeacherCourseViewer }));

// Student components - ✅ FIXED: Use StudentLessons for student view
const StudentLessons = React.lazy(() => Promise.resolve({ default: Pages.StudentLessons }));
const PreviewLesson = React.lazy(() => Promise.resolve({ default: Pages.PreviewLesson }));
const NotFound = React.lazy(() => Promise.resolve({ default: Pages.NotFound }));
const Unauthorized = React.lazy(() => Promise.resolve({ default: Pages.Unauthorized }));
const MyCoursesPage = React.lazy(() => Promise.resolve({ default: Pages.MyCoursesPage }));
const Profile = React.lazy(() => Promise.resolve({ default: Pages.Profile }));

// Admin layout and components that need separate imports
const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
const PendingStudents = React.lazy(() => import("./components/PendingStudents"));
const PendingEnrollments = React.lazy(() => import("./components/PendingEnrollments"));
const AdminLessonLogs = React.lazy(() => import("./pages/AdminLessonLogs"));
const FileManager = React.lazy(() => Promise.resolve({ default: Pages.FileManager }));

// Dashboard components
const StudentDashboard = React.lazy(() => Promise.resolve({ default: Pages.StudentDashboard }));
const ConfirmAccount = React.lazy(() => Promise.resolve({ default: Pages.ConfirmAccount }));

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

// Debug wrapper component (can be removed later)
const DebugWrapper = ({ children }) => {
  const [showDebug, setShowDebug] = useState(false);
  const { user } = useAuth();

  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";
  if (!isTeacherOrAdmin) return children;

  return (
    <>
      {children}
      <button onClick={() => setShowDebug(!showDebug)} style={{/* your styles */}}>
        {showDebug ? "×" : "🐛"}
      </button>
      {showDebug && <div style={{/* debug panel styles */}}>Debug Panel</div>}
    </>
  );
};

function AppContent() {
  const { loading, checked } = useAuth();
  if (loading || !checked) return <Loading />;

  return (
    <div className="app">
      <CSSDebug />
      <ErrorBoundary>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 200px)" }}>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* ==================== PUBLIC ROUTES ==================== */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/confirm-account" element={<ConfirmAccount />} />

              {/* ==================== COURSE ROUTES ==================== */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseViewer />} />
              <Route path="/courses/id/:id" element={<CourseViewer />} />
              <Route path="/courses/detail/:slug" element={<Navigate to="/courses/:slug" replace />} />

              {/* ==================== PREVIEW ROUTES ==================== */}
              <Route path="/preview/:lessonId" element={<PreviewLessonPage />} />
              <Route path="/courses/:courseId/preview" element={<PreviewLessonPage />} />
              <Route path="/lessons/:lessonId/preview" element={
                <ProtectedRoute allowedRoles={["teacher", "student", "admin"]}>
                  <PreviewLesson />
                </ProtectedRoute>
              } />

              {/* ==================== DASHBOARD REDIRECT ==================== */}
              <Route path="/dashboard" element={<RoleBasedRedirect />} />

              {/* ==================== ADMIN ROUTES ==================== */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DebugWrapper><AdminLayout /></DebugWrapper>
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="pending-students" element={<PendingStudents />} />
                <Route path="pending-enrollments" element={<PendingEnrollments />} />
                <Route path="manage-courses" element={<ManageCourses />} />
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="lesson-logs" element={<AdminLessonLogs />} />
                <Route path="file-manager" element={<FileManager />} />
              </Route>

              {/* ==================== TEACHER ROUTES ==================== */}
              <Route path="/teacher-dashboard" element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <DebugWrapper><MyTeachingCourses /></DebugWrapper>
                </ProtectedRoute>
              } />

              <Route path="/teacher/courses/:courseId/view" element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <TeacherCourseViewer />
                </ProtectedRoute>
              } />

              <Route path="/create-course" element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              
              <Route path="/create-course-advanced" element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <CreateCourseWithUnits />
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId/edit" element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <EditCourse />
                </ProtectedRoute>
              } />
              
              {/* ✅ FIXED: Changed from ManageLessons to TeacherManageLessons */}
              <Route path="/courses/:courseId/manage-lessons" element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <TeacherManageLessons />
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId/lessons/new" element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <CreateLessonPage />
                </ProtectedRoute>
              } />
              
              <Route path="/lessons/:lessonId/edit" element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <EditLesson />
                </ProtectedRoute>
              } />

              {/* ==================== STUDENT ROUTES ==================== */}
              <Route path="/my-courses" element={
                <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                  <MyCoursesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId/view" element={
                <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                  <CourseViewer />
                </ProtectedRoute>
              } />
              
              <Route path="/courses/:courseId/view-lessons" element={
                <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                  <CourseLessons />
                </ProtectedRoute>
              } />
              
              {/* ✅ NEW: Student lessons view */}
              <Route path="/student/courses/:courseId/lessons" element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentLessons />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              {/* ==================== PAYMENT ROUTES ==================== */}
              <Route path="/payment/:courseId" element={
                <ProtectedRoute allowedRoles={["student"]}><PaymentPage /></ProtectedRoute>
              } />
              <Route path="/payment-success" element={
                <ProtectedRoute allowedRoles={["student"]}><PaymentSuccess /></ProtectedRoute>
              } />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route path="/cancel" element={<Cancel />} />

              {/* ==================== ERROR ROUTES ==================== */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <FixedToastContainer />
        <footer style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#f8f9fa", textAlign: "center" }}>
          <p>© {new Date().getFullYear()} Math Class Platform. All rights reserved.</p>
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