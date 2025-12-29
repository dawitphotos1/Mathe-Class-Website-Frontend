// // src/App.jsx - UPDATED WITH CORRECT PREVIEW PAGE
// import React, { Suspense, useState, useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { ThemeProvider } from "./context/ThemeContext";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import { FixedToastContainer } from "./components/FixedToastContainer";
// import ErrorBoundary from "./components/ErrorBoundary";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Loading from "./components/Loading";
// import CSSDebug from "./components/CSSDebug";
// import Contact from "./components/Contact";
// import "react-toastify/dist/ReactToastify.css";

// // ✅ IMPORT ALL PAGES FROM INDEX
// import * as Pages from "./pages";

// /* Lazy load all pages using the Pages index */
// const lazyPage = (page) => React.lazy(() => Promise.resolve({ default: page }));

// const Home = lazyPage(Pages.Home);
// const Register = lazyPage(Pages.Register);
// const Login = lazyPage(Pages.Login);
// const ForgotPassword = lazyPage(Pages.ForgotPassword);
// const ResetPassword = lazyPage(Pages.ResetPassword);
// const ConfirmAccount = lazyPage(Pages.ConfirmAccount);
// const Courses = lazyPage(Pages.Courses);
// const CourseDetail = lazyPage(Pages.CourseDetail);
// const CourseViewer = lazyPage(Pages.CourseViewer);
// const PreviewLessonPage = lazyPage(Pages.PreviewLessonPage);
// const CoursePreviewPage = lazyPage(Pages.CoursePreviewPage); // Add this line
// const PaymentPage = lazyPage(Pages.PaymentPage);
// const PaymentSuccess = lazyPage(Pages.PaymentSuccess);
// const PaymentCancel = lazyPage(Pages.PaymentCancel);
// const Cancel = lazyPage(Pages.Cancel);
// const AdminDashboard = lazyPage(Pages.AdminDashboard);
// const ManageCourses = lazyPage(Pages.ManageCourses);
// const ManageUsers = lazyPage(Pages.ManageUsers);
// const TeacherManageLessons = lazyPage(Pages.TeacherManageLessons);
// const CreateCourse = lazyPage(Pages.CreateCourse);
// const CreateCourseWithUnits = lazyPage(Pages.CreateCourseWithUnits);
// const CourseLessons = lazyPage(Pages.CourseLessons);
// const EditCourse = lazyPage(Pages.EditCourse);

// // ✅ IMPORT EDIT LESSON FROM TEACHERS FOLDER
// const EditLesson = React.lazy(() => import("./pages/teachers/EditLesson"));

// const CreateLessonPage = lazyPage(Pages.CreateLessonPage);
// const MyTeachingCourses = lazyPage(Pages.MyTeachingCourses);
// const TeacherCourseViewer = lazyPage(Pages.TeacherCourseViewer);
// const StudentLessons = lazyPage(Pages.StudentLessons);
// const PreviewLesson = lazyPage(Pages.PreviewLesson);
// const NotFound = lazyPage(Pages.NotFound);
// const Unauthorized = lazyPage(Pages.Unauthorized);
// const MyCoursesPage = lazyPage(Pages.MyCoursesPage);
// const Profile = lazyPage(Pages.Profile);
// const StudentDashboard = lazyPage(Pages.StudentDashboard);
// const FileManager = lazyPage(Pages.FileManager);

// // ✅ IMPORT THE NEW PREVIEW PAGE
// const PreviewPage = React.lazy(() => import("./pages/PreviewPage"));

// // Admin layout and components that need separate imports
// const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
// const PendingStudents = React.lazy(() =>
//   import("./components/PendingStudents")
// );
// const PendingEnrollments = React.lazy(() =>
//   import("./components/PendingEnrollments")
// );
// const AdminLessonLogs = React.lazy(() => import("./pages/AdminLessonLogs"));

// /* Public Route */
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading, checked, user } = useAuth();
//   if (loading || !checked) return <Loading />;

//   if (isAuthenticated && user?.role) {
//     switch (user.role) {
//       case "admin":
//         return <Navigate to="/admin" replace />;
//       case "teacher":
//         return <Navigate to="/teacher-dashboard" replace />;
//       case "student":
//         return <Navigate to="/my-courses" replace />;
//       default:
//         return <Navigate to="/" replace />;
//     }
//   }
//   return children;
// };

// /* Role Redirect */
// const RoleBasedRedirect = () => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;

//   switch (user.role) {
//     case "admin":
//       return <Navigate to="/admin" replace />;
//     case "teacher":
//       return <Navigate to="/teacher-dashboard" replace />;
//     case "student":
//       return <Navigate to="/my-courses" replace />;
//     default:
//       return <Navigate to="/" replace />;
//   }
// };

// // Debug wrapper
// const DebugWrapper = ({ children }) => {
//   const [showDebug, setShowDebug] = useState(false);
//   const { user } = useAuth();
//   const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";
//   if (!isTeacherOrAdmin) return children;

//   return (
//     <>
//       {children}
//       <button
//         onClick={() => setShowDebug(!showDebug)}
//         style={{
//           position: "fixed",
//           bottom: 20,
//           right: 20,
//           zIndex: 999,
//           background: "#1976d2",
//           color: "white",
//           border: "none",
//           borderRadius: "50%",
//           width: "40px",
//           height: "40px",
//           cursor: "pointer",
//           fontSize: "18px",
//         }}
//       >
//         {showDebug ? "×" : "🐛"}
//       </button>
//       {showDebug && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 70,
//             right: 20,
//             background: "#fff",
//             border: "1px solid #ddd",
//             padding: "1rem",
//             zIndex: 999,
//             borderRadius: "8px",
//             boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//             maxWidth: "300px",
//           }}
//         >
//           <h4 style={{ margin: "0 0 10px 0" }}>Debug Panel</h4>
//           <pre
//             style={{
//               fontSize: "12px",
//               margin: 0,
//               whiteSpace: "pre-wrap",
//               fontFamily: "monospace",
//             }}
//           >
//             User: {JSON.stringify(user, null, 2)}
//           </pre>
//         </div>
//       )}
//     </>
//   );
// };

// function AppContent() {
//   const { loading, checked } = useAuth();

//   if (loading || !checked) return <Loading />;

//   return (
//     <div className="app">
//       <CSSDebug />
//       <ErrorBoundary>
//         <Navbar />
//         <main style={{ minHeight: "calc(100vh - 200px)" }}>
//           <Suspense fallback={<Loading />}>
//             <Routes>
//               {/* PUBLIC */}
//               <Route path="/" element={<Home />} />
//               <Route
//                 path="/register"
//                 element={
//                   <PublicRoute>
//                     <Register />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path="/login"
//                 element={
//                   <PublicRoute>
//                     <Login />
//                   </PublicRoute>
//                 }
//               />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path="/reset-password" element={<ResetPassword />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/confirm-account" element={<ConfirmAccount />} />

//               {/* COURSES */}
//               <Route path="/courses" element={<Courses />} />
//               <Route path="/courses/:slug" element={<CourseViewer />} />
//               <Route path="/courses/id/:id" element={<CourseViewer />} />

//               {/* ✅ UPDATED: CORRECT PREVIEW ROUTES */}
//               {/* For viewing actual lesson content (PDF, video, text) */}
//               <Route path="/preview/:lessonId" element={<PreviewPage />} />

//               {/* For viewing course preview/curriculum (sales page) */}
//               <Route
//                 path="/courses/:courseId/preview"
//                 element={<CoursePreviewPage />}
//               />

//               {/* Legacy preview routes - keeping for compatibility */}
//               <Route
//                 path="/lessons/:lessonId/preview"
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={["teacher", "student", "admin"]}
//                   >
//                     <PreviewLesson />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/preview-lesson"
//                 element={<PreviewLessonPage />}
//               />

//               {/* DASHBOARD REDIRECT */}
//               <Route path="/dashboard" element={<RoleBasedRedirect />} />

//               {/* ADMIN */}
//               <Route
//                 path="/admin/*"
//                 element={
//                   <ProtectedRoute allowedRoles={["admin"]}>
//                     <DebugWrapper>
//                       <AdminLayout />
//                     </DebugWrapper>
//                   </ProtectedRoute>
//                 }
//               >
//                 <Route index element={<AdminDashboard />} />
//                 <Route path="pending-students" element={<PendingStudents />} />
//                 <Route
//                   path="pending-enrollments"
//                   element={<PendingEnrollments />}
//                 />
//                 <Route path="manage-courses" element={<ManageCourses />} />
//                 <Route path="manage-users" element={<ManageUsers />} />
//                 <Route path="lesson-logs" element={<AdminLessonLogs />} />
//                 <Route path="file-manager" element={<FileManager />} />
//               </Route>

//               {/* ✅ FIXED: TEACHER DASHBOARD AND EDIT ROUTES */}
//               <Route
//                 path="/teacher-dashboard"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher"]}>
//                     <DebugWrapper>
//                       <MyTeachingCourses />
//                     </DebugWrapper>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/teacher/courses/:courseId/view"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <TeacherCourseViewer />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* ✅ CRITICAL: ALL POSSIBLE EDIT LESSON ROUTES */}
//               {/* Route 1: From Teacher Dashboard → Manage Lessons */}
//               <Route
//                 path="/teacher/courses/:courseId/lessons/:lessonId/edit"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <EditLesson />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Route 2: From Course Management */}
//               <Route
//                 path="/courses/:courseId/lessons/:lessonId/edit"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <EditLesson />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Route 3: Direct lesson edit (legacy) */}
//               <Route
//                 path="/lessons/:lessonId/edit"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <EditLesson />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Route 4: From preview page */}
//               <Route
//                 path="/preview/:lessonId/edit"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <EditLesson />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Route 5: From teacher specific path */}
//               <Route
//                 path="/teacher/lessons/:lessonId/edit"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <EditLesson />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* OTHER TEACHER ROUTES */}
//               <Route
//                 path="/create-course"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <CreateCourse />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/create-course-advanced"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <CreateCourseWithUnits />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/edit"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <EditCourse />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/manage-lessons"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <TeacherManageLessons />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/lessons/new"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                     <CreateLessonPage />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* STUDENT */}
//               <Route
//                 path="/my-courses"
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={["student", "teacher", "admin"]}
//                   >
//                     <MyCoursesPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/view"
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={["student", "teacher", "admin"]}
//                   >
//                     <CourseViewer />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/view-lessons"
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={["student", "teacher", "admin"]}
//                   >
//                     <CourseLessons />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/student/courses/:courseId/lessons"
//                 element={
//                   <ProtectedRoute allowedRoles={["student"]}>
//                     <StudentLessons />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/profile"
//                 element={
//                   <ProtectedRoute>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* PAYMENT */}
//               <Route
//                 path="/payment/:courseId"
//                 element={
//                   <ProtectedRoute allowedRoles={["student"]}>
//                     <PaymentPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/payment-success"
//                 element={
//                   <ProtectedRoute allowedRoles={["student"]}>
//                     <PaymentSuccess />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route path="/payment-cancel" element={<PaymentCancel />} />
//               <Route path="/cancel" element={<Cancel />} />

//               {/* ERROR */}
//               <Route path="/unauthorized" element={<Unauthorized />} />
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </Suspense>
//         </main>

//         <FixedToastContainer />
//         <footer
//           style={{
//             marginTop: "3rem",
//             padding: "2rem",
//             backgroundColor: "#f8f9fa",
//             textAlign: "center",
//             borderTop: "1px solid #dee2e6",
//           }}
//         >
//           <p style={{ margin: 0, color: "#6c757d" }}>
//             © {new Date().getFullYear()} Math Class Platform. All rights
//             reserved.
//           </p>
//           <p
//             style={{
//               margin: "10px 0 0 0",
//               fontSize: "0.9rem",
//               color: "#6c757d",
//             }}
//           >
//             Need help?{" "}
//             <a href="/contact" style={{ color: "#1976d2" }}>
//               Contact Support
//             </a>
//           </p>
//         </footer>
//       </ErrorBoundary>
//     </div>
//   );
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;





// src/App.jsx - CLEAN & FIXED VERSION
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

// Public Pages
const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./pages/Register"));
const Login = React.lazy(() => import("./pages/Login"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const ConfirmAccount = React.lazy(() => import("./pages/ConfirmAccount"));
const Courses = React.lazy(() => import("./pages/Courses"));
const CourseDetail = React.lazy(() => import("./pages/CourseDetail"));
const CourseViewer = React.lazy(() => import("./pages/CourseViewer"));
const PreviewPage = React.lazy(() => import("./pages/PreviewPage"));
const CoursePreviewPage = React.lazy(() => import("./pages/CoursePreviewPage"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = React.lazy(() => import("./pages/PaymentCancel"));
const Cancel = React.lazy(() => import("./pages/Cancel"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Unauthorized = React.lazy(() => import("./pages/Unauthorized"));

// Protected Pages
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const ManageCourses = React.lazy(() => import("./pages/admin/ManageCourses"));
const ManageUsers = React.lazy(() => import("./pages/admin/ManageUsers"));
const TeacherManageLessons = React.lazy(() => import("./pages/teachers/TeacherManageLessons"));
const CreateCourse = React.lazy(() => import("./pages/teachers/CreateCourse"));
const CreateCourseWithUnits = React.lazy(() => import("./pages/teachers/CreateCourseWithUnits"));
const CourseLessons = React.lazy(() => import("./pages/teachers/CourseLessons"));
const EditCourse = React.lazy(() => import("./pages/teachers/EditCourse"));
const CreateLessonPage = React.lazy(() => import("./pages/teachers/CreateLessonPage"));
const MyTeachingCourses = React.lazy(() => import("./pages/teachers/MyTeachingCourses"));
const TeacherCourseViewer = React.lazy(() => import("./pages/teachers/TeacherCourseViewer"));
const StudentLessons = React.lazy(() => import("./pages/StudentLessons"));
const PreviewLesson = React.lazy(() => import("./pages/PreviewLesson"));
const MyCoursesPage = React.lazy(() => import("./pages/MyCoursesPage"));
const Profile = React.lazy(() => import("./pages/Profile"));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard"));
const FileManager = React.lazy(() => import("./pages/FileManager"));
const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));

// Dynamically imported components
const EditLesson = React.lazy(() => import("./pages/teachers/EditLesson"));
const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
const PendingStudents = React.lazy(() => import("./components/PendingStudents"));
const PendingEnrollments = React.lazy(() => import("./components/PendingEnrollments"));
const AdminLessonLogs = React.lazy(() => import("./pages/AdminLessonLogs"));

/* Public Route Component - SIMPLIFIED */
const PublicRoute = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return children;
};

/* Role-Based Redirect Component */
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  
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
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

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
              
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/confirm-account" element={<ConfirmAccount />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/courses/id/:id" element={<CourseViewer />} />

              {/* Preview Routes */}
              <Route path="/preview/:lessonId" element={<PreviewPage />} />
              <Route path="/courses/:courseId/preview" element={<CoursePreviewPage />} />

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
                <Route path="pending-enrollments" element={<PendingEnrollments />} />
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
            © {new Date().getFullYear()} Math Class Platform. All rights reserved.
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