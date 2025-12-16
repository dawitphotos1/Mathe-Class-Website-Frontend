// src/App.jsx - UPDATED VERSION with Debug Component
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
import ConfirmAccount from "./pages/ConfirmAccount";
import DebugLessonData from "./components/DebugLessonData"; // Added for debugging

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

// Debug wrapper component (can be removed later)
const DebugWrapper = ({ children }) => {
  const [showDebug, setShowDebug] = useState(false);
  const { user } = useAuth();

  // Only show debug for teachers/admins
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  if (!isTeacherOrAdmin) {
    return children;
  }

  return (
    <>
      {children}

      {/* Debug button - bottom right corner */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: showDebug ? "#ff4444" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          zIndex: 9999,
        }}
        title="Toggle Debug Panel"
      >
        {showDebug ? "×" : "🐛"}
      </button>

      {/* Debug panel */}
      {showDebug && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "400px",
            maxHeight: "500px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            zIndex: 9998,
            padding: "15px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ margin: 0 }}>Debug Panel</h3>
            <button
              onClick={() => setShowDebug(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#666",
              }}
            >
              ×
            </button>
          </div>

          <DebugLessonData lessonId={5788} />

          <div
            style={{
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #eee",
            }}
          >
            <h4>Quick Actions:</h4>
            <button
              onClick={() => {
                console.clear();
                console.log("🧹 Console cleared");
              }}
              style={{
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                padding: "8px 12px",
                borderRadius: "4px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            >
              Clear Console
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              style={{
                backgroundColor: "#ffebee",
                border: "1px solid #ffcdd2",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout & Refresh
            </button>
          </div>
        </div>
      )}
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
              <Route
                path="/preview/:lessonId"
                element={<PreviewLessonPage />}
              />
              <Route
                path="/courses/:courseId/preview"
                element={<PreviewLessonPage />}
              />

              {/* PROTECTED PREVIEW */}
              <Route
                path="/lessons/:lessonId/preview"
                element={
                  <ProtectedRoute
                    allowedRoles={["teacher", "student", "admin"]}
                  >
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

              {/* TEACHER */}
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

        {/* Footer */}
        <footer
          style={{
            marginTop: "3rem",
            padding: "2rem",
            backgroundColor: "#f8f9fa",
            textAlign: "center",
            borderTop: "1px solid #dee2e6",
          }}
        >
          <p>
            © {new Date().getFullYear()} Math Class Platform. All rights
            reserved.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#6c757d" }}>
            <a
              href="/contact"
              style={{ color: "#6c757d", textDecoration: "none" }}
            >
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
