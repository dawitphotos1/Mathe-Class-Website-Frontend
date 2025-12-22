
// src/App.jsx
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

// ✅ IMPORT ALL PAGES FROM INDEX
import * as Pages from "./pages";

/* Lazy load all pages using the Pages index */
const lazyPage = (page) => React.lazy(() => Promise.resolve({ default: page }));

const Home = lazyPage(Pages.Home);
const Register = lazyPage(Pages.Register);
const Login = lazyPage(Pages.Login);
const ForgotPassword = lazyPage(Pages.ForgotPassword);
const ResetPassword = lazyPage(Pages.ResetPassword);
const ConfirmAccount = lazyPage(Pages.ConfirmAccount);
const Courses = lazyPage(Pages.Courses);
const CourseDetail = lazyPage(Pages.CourseDetail);
const CourseViewer = lazyPage(Pages.CourseViewer);
const PreviewLessonPage = lazyPage(Pages.PreviewLessonPage);
const PaymentPage = lazyPage(Pages.PaymentPage);
const PaymentSuccess = lazyPage(Pages.PaymentSuccess);
const PaymentCancel = lazyPage(Pages.PaymentCancel);
const Cancel = lazyPage(Pages.Cancel);
const AdminDashboard = lazyPage(Pages.AdminDashboard);
const ManageCourses = lazyPage(Pages.ManageCourses);
const ManageUsers = lazyPage(Pages.ManageUsers);
const TeacherManageLessons = lazyPage(Pages.TeacherManageLessons);
const CreateCourse = lazyPage(Pages.CreateCourse);
const CreateCourseWithUnits = lazyPage(Pages.CreateCourseWithUnits);
const CourseLessons = lazyPage(Pages.CourseLessons);
const EditCourse = lazyPage(Pages.EditCourse);
const EditLesson = lazyPage(Pages.EditLesson);
const CreateLessonPage = lazyPage(Pages.CreateLessonPage);
const MyTeachingCourses = lazyPage(Pages.MyTeachingCourses);
const TeacherCourseViewer = lazyPage(Pages.TeacherCourseViewer);
const StudentLessons = lazyPage(Pages.StudentLessons);
const PreviewLesson = lazyPage(Pages.PreviewLesson);
const NotFound = lazyPage(Pages.NotFound);
const Unauthorized = lazyPage(Pages.Unauthorized);
const MyCoursesPage = lazyPage(Pages.MyCoursesPage);
const Profile = lazyPage(Pages.Profile);
const StudentDashboard = lazyPage(Pages.StudentDashboard);
const FileManager = lazyPage(Pages.FileManager);

// Admin layout and components that need separate imports
const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
const PendingStudents = React.lazy(() => import("./components/PendingStudents"));
const PendingEnrollments = React.lazy(() => import("./components/PendingEnrollments"));
const AdminLessonLogs = React.lazy(() => import("./pages/AdminLessonLogs"));

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

// Debug wrapper
const DebugWrapper = ({ children }) => {
  const [showDebug, setShowDebug] = useState(false);
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";
  if (!isTeacherOrAdmin) return children;

  return (
    <>
      {children}
      <button onClick={() => setShowDebug(!showDebug)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
        {showDebug ? "×" : "🐛"}
      </button>
      {showDebug && <div style={{ position: "fixed", bottom: 60, right: 20, background: "#fff", border: "1px solid #000", padding: "1rem", zIndex: 999 }}>Debug Panel</div>}
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
              {/* PUBLIC */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/confirm-account" element={<ConfirmAccount />} />

              {/* COURSES */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseViewer />} />
              <Route path="/courses/id/:id" element={<CourseViewer />} />

              {/* PREVIEW */}
              <Route path="/preview/:lessonId" element={<PreviewLessonPage />} />
              <Route path="/courses/:courseId/preview" element={<PreviewLessonPage />} />
              <Route path="/lessons/:lessonId/preview" element={
                <ProtectedRoute allowedRoles={["teacher","student","admin"]}><PreviewLesson /></ProtectedRoute>
              } />

              {/* DASHBOARD REDIRECT */}
              <Route path="/dashboard" element={<RoleBasedRedirect />} />

              {/* ADMIN */}
              <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["admin"]}><DebugWrapper><AdminLayout /></DebugWrapper></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="pending-students" element={<PendingStudents />} />
                <Route path="pending-enrollments" element={<PendingEnrollments />} />
                <Route path="manage-courses" element={<ManageCourses />} />
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="lesson-logs" element={<AdminLessonLogs />} />
                <Route path="file-manager" element={<FileManager />} />
              </Route>

              {/* TEACHER */}
              <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={["teacher"]}><DebugWrapper><MyTeachingCourses /></DebugWrapper></ProtectedRoute>} />
              <Route path="/teacher/courses/:courseId/view" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><TeacherCourseViewer /></ProtectedRoute>} />
              <Route path="/create-course" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateCourse /></ProtectedRoute>} />
              <Route path="/create-course-advanced" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateCourseWithUnits /></ProtectedRoute>} />
              <Route path="/courses/:courseId/edit" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><EditCourse /></ProtectedRoute>} />
              <Route path="/courses/:courseId/manage-lessons" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><TeacherManageLessons /></ProtectedRoute>} />
              <Route path="/courses/:courseId/lessons/new" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateLessonPage /></ProtectedRoute>} />
              <Route path="/lessons/:lessonId/edit" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><EditLesson /></ProtectedRoute>} />

              {/* STUDENT */}
              <Route path="/my-courses" element={<ProtectedRoute allowedRoles={["student","teacher","admin"]}><MyCoursesPage /></ProtectedRoute>} />
              <Route path="/courses/:courseId/view" element={<ProtectedRoute allowedRoles={["student","teacher","admin"]}><CourseViewer /></ProtectedRoute>} />
              <Route path="/courses/:courseId/view-lessons" element={<ProtectedRoute allowedRoles={["student","teacher","admin"]}><CourseLessons /></ProtectedRoute>} />
              <Route path="/student/courses/:courseId/lessons" element={<ProtectedRoute allowedRoles={["student"]}><StudentLessons /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* PAYMENT */}
              <Route path="/payment/:courseId" element={<ProtectedRoute allowedRoles={["student"]}><PaymentPage /></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute allowedRoles={["student"]}><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route path="/cancel" element={<Cancel />} />

              {/* ERROR */}
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
