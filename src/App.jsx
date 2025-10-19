// // src/App.jsx
// import React, { Suspense } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ThemeProvider } from "./context/ThemeContext";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import ErrorBoundary from "./components/ErrorBoundary";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Loading from "./components/Loading";
// import Contact from "./components/Contact";
// import AdminLayout from "./components/AdminLayout";
// import PendingStudents from "./components/PendingStudents";

// // Lazy-loaded pages with correct paths
// const Home = React.lazy(() => import("./Pages/Home"));
// const Register = React.lazy(() => import("./Pages/auth/Register"));
// const Login = React.lazy(() => import("./Pages/auth/Login"));
// const Courses = React.lazy(() => import("./Pages/courses/Courses"));
// const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail"));
// const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
// const ManageCourses = React.lazy(() => import("./Pages/AdminManageCourses"));
// const ManageUsers = React.lazy(() => import("./Pages/AdminManageUsers"));
// const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
// const Profile = React.lazy(() => import("./Pages/users/Profile"));
// const PaymentPage = React.lazy(() => import("./Pages/PaymentPage"));
// const PaymentSuccess = React.lazy(() => import("./Pages/payments/PaymentSuccess"));
// const PaymentCancel = React.lazy(() => import("./Pages/payments/PaymentCancel"));
// const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
// const Unauthorized = React.lazy(() => import("./Pages/Unauthorized"));
// const FileManager = React.lazy(() => import("./Pages/FileManager"));
// const ManageLessons = React.lazy(() => import("./Pages/ManageLessons"));
// const CreateCourse = React.lazy(() => import("./Pages/CreateCourse"));
// const CourseLessons = React.lazy(() => import("./Pages/CourseLessons"));
// const MyCoursesPage = React.lazy(() => import("./Pages/courses/MyCourses"));
// const AdminLessonLogs = React.lazy(() => import("./Pages/AdminLessonLogs"));
// const NotFound = React.lazy(() => import("./Pages/NotFound"));

// // Teacher components
// const EditCourse = React.lazy(() => import("./Pages/teachers/EditCourse"));
// const MyTeachingCourses = React.lazy(() => import("./Pages/teachers/MyTeachingCourses"));
// const TeacherCourseProgress = React.lazy(() => import("./Pages/courses/TeacherCourseProgress"));
// const EditLesson = React.lazy(() => import("./Pages/teachers/EditLesson"));
// const LessonCreationForm = React.lazy(() => import("./components/LessonCreationForm"));

// // Public Route component (redirects if already logged in)
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
  
//   if (loading) return <Loading />;
  
//   if (isAuthenticated) {
//     return <Navigate to="/my-courses" replace />;
//   }
  
//   return children;
// };

// /* =========================================================
//    🌐 Inner App Content — waits for Auth to finish loading
// ========================================================= */
// function AppContent() {
//   const { loading, checked } = useAuth();

//   if (loading || !checked) {
//     return <Loading />;
//   }

//   return (
//     <div className="app">
//       <ErrorBoundary>
//         <Navbar />
//         <Suspense fallback={<Loading />}>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route 
//               path="/register" 
//               element={
//                 <PublicRoute>
//                   <Register />
//                 </PublicRoute>
//               } 
//             />
//             <Route 
//               path="/login" 
//               element={
//                 <PublicRoute>
//                   <Login />
//                 </PublicRoute>
//               } 
//             />
//             <Route path="/courses" element={<Courses />} />
//             <Route path="/courses/:slug" element={<CourseDetail />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />

//             {/* Payments */}
//             <Route path="/payment/:courseId" element={<PaymentPage />} />
//             <Route path="/payment-success" element={<PaymentSuccess />} />
//             <Route path="/payment-cancel" element={<PaymentCancel />} />
//             <Route path="/cancel" element={<Cancel />} />

//             {/* Admin Routes */}
//             <Route
//               path="/admin/*"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <AdminLayout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<AdminDashboard />} />
//               <Route path="pending-students" element={<PendingStudents />} />
//               <Route path="manage-courses" element={<ManageCourses />} />
//               <Route path="manage-users" element={<ManageUsers />} />
//               <Route path="lesson-logs" element={<AdminLessonLogs />} />
//               <Route path="files" element={<FileManager />} />
//             </Route>

//             {/* Teacher Routes */}
//             <Route
//               path="/create-course"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <CreateCourse />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <MyTeachingCourses />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/teacher/course/:courseId/progress"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <TeacherCourseProgress />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/courses/:courseId/manage-lessons"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <ManageLessons />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/courses/:courseId/lessons/new"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <LessonCreationForm />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/lessons/:lessonId/edit"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <EditLesson />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/courses/:courseId/edit"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <EditCourse />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Student Routes */}
//             <Route
//               path="/my-courses"
//               element={
//                 <ProtectedRoute allowedRoles={["student"]}>
//                   <MyCoursesPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/courses/:courseId/view-lessons"
//               element={
//                 <ProtectedRoute allowedRoles={["student"]}>
//                   <CourseLessons />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/courses/:courseId/view"
//               element={
//                 <ProtectedRoute allowedRoles={["student"]}>
//                   <CourseViewer />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Shared Routes */}
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
//                   <Profile />
//                 </ProtectedRoute>
//               }
//             />

//             {/* 404 Fallback */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Suspense>
//         <ToastContainer />
//       </ErrorBoundary>
//     </div>
//   );
// }

// /* =========================================================
//    🌍 Root App Wrapper
// ========================================================= */
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



// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import Contact from "./components/Contact";
import AdminLayout from "./components/AdminLayout";
import PendingStudents from "./components/PendingStudents";

// ✅ Lazy-loaded pages (clean paths)
const Home = React.lazy(() => import("./Pages/Home"));
const Register = React.lazy(() => import("./Pages/auth/Register"));
const Login = React.lazy(() => import("./Pages/auth/Login"));
const Courses = React.lazy(() => import("./Pages/courses/Courses"));
const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail"));
const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
const ManageCourses = React.lazy(() => import("./Pages/AdminManageCourses"));
const ManageUsers = React.lazy(() => import("./Pages/AdminManageUsers"));
const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
const Profile = React.lazy(() => import("./Pages/users/Profile"));
const PaymentPage = React.lazy(() => import("./Pages/PaymentPage"));
const PaymentSuccess = React.lazy(() => import("./Pages/payments/PaymentSuccess"));
const PaymentCancel = React.lazy(() => import("./Pages/payments/PaymentCancel"));
const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
const Unauthorized = React.lazy(() => import("./Pages/Unauthorized"));
const FileManager = React.lazy(() => import("./Pages/FileManager"));
const ManageLessons = React.lazy(() => import("./Pages/ManageLessons"));
const CreateCourse = React.lazy(() => import("./Pages/CreateCourse"));
const CourseLessons = React.lazy(() => import("./Pages/CourseLessons"));
const MyCoursesPage = React.lazy(() => import("./Pages/courses/MyCourses"));
const AdminLessonLogs = React.lazy(() => import("./Pages/AdminLessonLogs"));
const NotFound = React.lazy(() => import("./Pages/NotFound"));
const EditCourse = React.lazy(() => import("./Pages/teachers/EditCourse"));
const MyTeachingCourses = React.lazy(() => import("./Pages/teachers/MyTeachingCourses"));
const TeacherCourseProgress = React.lazy(() => import("./Pages/courses/TeacherCourseProgress"));
const EditLesson = React.lazy(() => import("./Pages/teachers/EditLesson"));
const LessonCreationForm = React.lazy(() => import("./components/LessonCreationForm"));

/* =========================================================
   🧩 PublicRoute — only for guests
========================================================= */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, checked, user } = useAuth();

  if (loading || !checked) return <Loading />;

  if (isAuthenticated && user?.role) {
    console.log("🔁 Redirecting logged-in user:", user.role);
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

/* =========================================================
   🧭 RoleBasedRedirect — smart central redirect
========================================================= */
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  console.log("🎯 RoleBasedRedirect for:", user.role);

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

/* =========================================================
   🌐 Main App Content
========================================================= */
function AppContent() {
  const { loading, checked } = useAuth();

  if (loading || !checked) {
    return <Loading />;
  }

  return (
    <div className="app">
      <ErrorBoundary>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Universal redirect path */}
            <Route path="/dashboard" element={<RoleBasedRedirect />} />

            {/* Payments */}
            <Route path="/payment/:courseId" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/cancel" element={<Cancel />} />

            {/* ==================== ADMIN ROUTES ==================== */}
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
              <Route path="manage-courses" element={<ManageCourses />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="lesson-logs" element={<AdminLessonLogs />} />
              <Route path="files" element={<FileManager />} />
            </Route>

            {/* ==================== TEACHER ROUTES ==================== */}
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
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/manage-lessons"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <ManageLessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/edit"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <EditCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons/:lessonId/edit"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <EditLesson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/course/:courseId/progress"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherCourseProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/lessons/new"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <LessonCreationForm />
                </ProtectedRoute>
              }
            />

            {/* ==================== STUDENT ROUTES ==================== */}
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/view"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <CourseViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/view-lessons"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <CourseLessons />
                </ProtectedRoute>
              }
            />

            {/* Shared Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

/* =========================================================
   🌍 Root App Wrapper
========================================================= */
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
