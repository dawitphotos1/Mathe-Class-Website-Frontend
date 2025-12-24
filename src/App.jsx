
// // src/App.jsx
// import React, { Suspense, useState } from "react";
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
// const EditLesson = lazyPage(Pages.EditLesson);
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

// // Admin layout and components that need separate imports
// const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
// const PendingStudents = React.lazy(() => import("./components/PendingStudents"));
// const PendingEnrollments = React.lazy(() => import("./components/PendingEnrollments"));
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
//       <button onClick={() => setShowDebug(!showDebug)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
//         {showDebug ? "×" : "🐛"}
//       </button>
//       {showDebug && <div style={{ position: "fixed", bottom: 60, right: 20, background: "#fff", border: "1px solid #000", padding: "1rem", zIndex: 999 }}>Debug Panel</div>}
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
//               <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
//               <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path="/reset-password" element={<ResetPassword />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/confirm-account" element={<ConfirmAccount />} />

//               {/* COURSES */}
//               <Route path="/courses" element={<Courses />} />
//               <Route path="/courses/:slug" element={<CourseViewer />} />
//               <Route path="/courses/id/:id" element={<CourseViewer />} />

//               {/* PREVIEW */}
//               <Route path="/preview/:lessonId" element={<PreviewLessonPage />} />
//               <Route path="/courses/:courseId/preview" element={<PreviewLessonPage />} />
//               <Route path="/lessons/:lessonId/preview" element={
//                 <ProtectedRoute allowedRoles={["teacher","student","admin"]}><PreviewLesson /></ProtectedRoute>
//               } />

//               {/* DASHBOARD REDIRECT */}
//               <Route path="/dashboard" element={<RoleBasedRedirect />} />

//               {/* ADMIN */}
//               <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["admin"]}><DebugWrapper><AdminLayout /></DebugWrapper></ProtectedRoute>}>
//                 <Route index element={<AdminDashboard />} />
//                 <Route path="pending-students" element={<PendingStudents />} />
//                 <Route path="pending-enrollments" element={<PendingEnrollments />} />
//                 <Route path="manage-courses" element={<ManageCourses />} />
//                 <Route path="manage-users" element={<ManageUsers />} />
//                 <Route path="lesson-logs" element={<AdminLessonLogs />} />
//                 <Route path="file-manager" element={<FileManager />} />
//               </Route>

//               {/* TEACHER */}
//               <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={["teacher"]}><DebugWrapper><MyTeachingCourses /></DebugWrapper></ProtectedRoute>} />
//               <Route path="/teacher/courses/:courseId/view" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><TeacherCourseViewer /></ProtectedRoute>} />
//               <Route path="/create-course" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateCourse /></ProtectedRoute>} />
//               <Route path="/create-course-advanced" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateCourseWithUnits /></ProtectedRoute>} />
//               <Route path="/courses/:courseId/edit" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><EditCourse /></ProtectedRoute>} />
//               <Route path="/courses/:courseId/manage-lessons" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><TeacherManageLessons /></ProtectedRoute>} />
//               <Route path="/courses/:courseId/lessons/new" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateLessonPage /></ProtectedRoute>} />
//               <Route path="/lessons/:lessonId/edit" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><EditLesson /></ProtectedRoute>} />

//               {/* STUDENT */}
//               <Route path="/my-courses" element={<ProtectedRoute allowedRoles={["student","teacher","admin"]}><MyCoursesPage /></ProtectedRoute>} />
//               <Route path="/courses/:courseId/view" element={<ProtectedRoute allowedRoles={["student","teacher","admin"]}><CourseViewer /></ProtectedRoute>} />
//               <Route path="/courses/:courseId/view-lessons" element={<ProtectedRoute allowedRoles={["student","teacher","admin"]}><CourseLessons /></ProtectedRoute>} />
//               <Route path="/student/courses/:courseId/lessons" element={<ProtectedRoute allowedRoles={["student"]}><StudentLessons /></ProtectedRoute>} />
//               <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

//               {/* PAYMENT */}
//               <Route path="/payment/:courseId" element={<ProtectedRoute allowedRoles={["student"]}><PaymentPage /></ProtectedRoute>} />
//               <Route path="/payment-success" element={<ProtectedRoute allowedRoles={["student"]}><PaymentSuccess /></ProtectedRoute>} />
//               <Route path="/payment-cancel" element={<PaymentCancel />} />
//               <Route path="/cancel" element={<Cancel />} />

//               {/* ERROR */}
//               <Route path="/unauthorized" element={<Unauthorized />} />
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </Suspense>
//         </main>

//         <FixedToastContainer />
//         <footer style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#f8f9fa", textAlign: "center" }}>
//           <p>© {new Date().getFullYear()} Math Class Platform. All rights reserved.</p>
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


// src/App.jsx - UPDATED WITH CORRECT IMPORT PATH
import React, { Suspense, useState, useEffect } from "react";
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

// ✅ IMPORT ALL PAGES FROM INDEX (assuming your index exports EditLesson)
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
// ✅ IMPORT FROM CORRECT PATH - if EditLesson is not in pages/index.js
const EditLesson = React.lazy(() => import("./pages/teachers/EditLesson"));
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
      <button 
        onClick={() => setShowDebug(!showDebug)} 
        style={{ 
          position: "fixed", 
          bottom: 20, 
          right: 20, 
          zIndex: 999,
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          fontSize: "18px"
        }}
      >
        {showDebug ? "×" : "🐛"}
      </button>
      {showDebug && (
        <div style={{ 
          position: "fixed", 
          bottom: 70, 
          right: 20, 
          background: "#fff", 
          border: "1px solid #ddd",
          padding: "1rem", 
          zIndex: 999,
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "300px"
        }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Debug Panel</h4>
          <pre style={{ 
            fontSize: "12px", 
            margin: 0, 
            whiteSpace: "pre-wrap",
            fontFamily: "monospace"
          }}>
            User: {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

// ✅ ADD THIS FUNCTION TO HANDLE EXTENSION ERRORS
const setupErrorHandling = () => {
  const originalErrorHandler = window.onerror;
  const originalUnhandledRejectionHandler = window.onunhandledrejection;

  // Handle JavaScript errors
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string') {
      if (message.includes('Cannot read properties of undefined') && 
          message.includes('features')) {
        console.warn('🔧 Ignoring extension error:', message.substring(0, 100));
        return true;
      }
      
      if (message.includes('chrome-extension://') || 
          message.includes('moz-extension://')) {
        console.warn('🔧 Ignoring browser extension error');
        return true;
      }
    }

    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error);
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('🛑 Unhandled error:', { message, source, lineno, colno, error });
    }

    return false;
  };

  // Handle promise rejections
  window.onunhandledrejection = function(event) {
    const error = event.reason;
    
    if (error && typeof error.message === 'string') {
      if (error.message.includes('features') || 
          error.message.includes('chrome-extension://')) {
        console.warn('🔧 Ignoring extension promise rejection');
        event.preventDefault();
        return;
      }
    }

    if (originalUnhandledRejectionHandler) {
      originalUnhandledRejectionHandler.call(window, event);
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('🛑 Unhandled promise rejection:', error);
    }
  };

  return () => {
    window.onerror = originalErrorHandler;
    window.onunhandledrejection = originalUnhandledRejectionHandler;
  };
};

function AppContent() {
  const { loading, checked } = useAuth();
  
  // ✅ Setup error handling on component mount
  useEffect(() => {
    const cleanup = setupErrorHandling();
    return cleanup;
  }, []);

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

              {/* ✅ FIXED PREVIEW ROUTES */}
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

              {/* ✅ FIXED TEACHER ROUTES */}
              <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={["teacher"]}><DebugWrapper><MyTeachingCourses /></DebugWrapper></ProtectedRoute>} />
              <Route path="/teacher/courses/:courseId/view" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><TeacherCourseViewer /></ProtectedRoute>} />
              
              {/* ✅ FIXED: TEACHER LESSON EDIT ROUTE - Using your EditLesson component */}
              <Route path="/teacher/courses/:courseId/lessons/:lessonId/edit" 
                element={<ProtectedRoute allowedRoles={["teacher","admin"]}><EditLesson /></ProtectedRoute>} />
              
              <Route path="/create-course" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateCourse /></ProtectedRoute>} />
              <Route path="/create-course-advanced" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateCourseWithUnits /></ProtectedRoute>} />
              <Route path="/courses/:courseId/edit" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><EditCourse /></ProtectedRoute>} />
              <Route path="/courses/:courseId/manage-lessons" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><TeacherManageLessons /></ProtectedRoute>} />
              <Route path="/courses/:courseId/lessons/new" element={<ProtectedRoute allowedRoles={["teacher","admin"]}><CreateLessonPage /></ProtectedRoute>} />
              
              {/* Legacy edit route (backward compatibility) */}
              <Route path="/lessons/:lessonId/edit" 
                element={<ProtectedRoute allowedRoles={["teacher","admin"]}><EditLesson /></ProtectedRoute>} />

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
        <footer style={{ 
          marginTop: "3rem", 
          padding: "2rem", 
          backgroundColor: "#f8f9fa", 
          textAlign: "center",
          borderTop: "1px solid #dee2e6"
        }}>
          <p style={{ margin: 0, color: "#6c757d" }}>
            © {new Date().getFullYear()} Math Class Platform. All rights reserved.
          </p>
          <p style={{ margin: "10px 0 0 0", fontSize: "0.9rem", color: "#6c757d" }}>
            Need help? <a href="/contact" style={{ color: "#1976d2" }}>Contact Support</a>
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