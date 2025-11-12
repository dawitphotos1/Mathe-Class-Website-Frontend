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
// import PendingEnrollments from "./components/PendingEnrollments";
// import CSSDebug from "./components/CSSDebug";
// import ConfirmAccount from "./pages/ConfirmAccount";
// import "./pages/AdminDashboard.css";
// import "react-toastify/dist/ReactToastify.css";

// // ✅ Lazy-loaded pages
// const Home = React.lazy(() => import("./pages/Home"));
// const Register = React.lazy(() => import("./pages/auth/Register"));
// const Login = React.lazy(() => import("./pages/auth/Login"));
// const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
// const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));
// const Courses = React.lazy(() => import("./pages/courses/Courses"));
// const CourseDetail = React.lazy(() => import("./pages/courses/CourseDetail"));
// const CoursePreviewPage = React.lazy(() => import("./pages/CoursePreviewPage"));
// const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));
// const PaymentSuccess = React.lazy(() =>
//   import("./pages/payments/PaymentSuccess")
// );
// const PaymentCancel = React.lazy(() =>
//   import("./pages/payments/PaymentCancel")
// );
// const Cancel = React.lazy(() => import("./pages/payments/Cancel"));
// const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
// const ManageCourses = React.lazy(() => import("./pages/AdminManageCourses"));
// const ManageUsers = React.lazy(() => import("./pages/AdminManageUsers"));
// const CourseViewer = React.lazy(() => import("./pages/courses/CourseViewer"));
// const Profile = React.lazy(() => import("./pages/users/Profile"));
// const Unauthorized = React.lazy(() => import("./pages/Unauthorized"));
// const FileManager = React.lazy(() => import("./pages/FileManager"));
// const ManageLessons = React.lazy(() => import("./pages/ManageLessons"));
// const CreateCourse = React.lazy(() => import("./pages/CreateCourse"));
// const CreateCourseWithUnits = React.lazy(() =>
//   import("./pages/CreateCourseWithUnits")
// ); // ✅ NEW
// const CourseLessons = React.lazy(() => import("./pages/CourseLessons"));
// const MyCoursesPage = React.lazy(() => import("./pages/courses/MyCourses"));
// const AdminLessonLogs = React.lazy(() => import("./pages/AdminLessonLogs"));
// const NotFound = React.lazy(() => import("./pages/NotFound"));
// const EditCourse = React.lazy(() => import("./pages/teachers/EditCourse"));
// const MyTeachingCourses = React.lazy(() =>
//   import("./pages/teachers/MyTeachingCourses")
// );
// const TeacherCourseProgress = React.lazy(() =>
//   import("./pages/courses/TeacherCourseProgress")
// );
// const EditLesson = React.lazy(() => import("./pages/teachers/EditLesson"));
// const LessonCreationForm = React.lazy(() =>
//   import("./components/LessonCreationForm")
// );

// /* -------------------- PublicRoute -------------------- */
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

// /* -------------------- Role-Based Redirect -------------------- */
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

// /* -------------------- Main App -------------------- */
// function AppContent() {
//   const { loading, checked } = useAuth();

//   if (loading || !checked) return <Loading />;

//   return (
//     <div className="app">
//       <CSSDebug />
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
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/courses" element={<Courses />} />
//             <Route path="/courses/:slug" element={<CourseDetail />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             // Add these routes to your main routing file
//             <Route
//               path="/courses/:courseId/lessons/new"
//               element={<CreateLessonPage />}
//             />
//             <Route
//               path="/lessons/:lessonId/edit"
//               element={<EditLessonPage />}
//             />
//             <Route
//               path="/courses/:courseId/preview"
//               element={<CoursePreviewPage />}
//             />
//             <Route path="/payment/:courseId" element={<PaymentPage />} />
//             <Route path="/payment-success" element={<PaymentSuccess />} />
//             <Route path="/payment-cancel" element={<PaymentCancel />} />
//             <Route path="/cancel" element={<Cancel />} />
//             <Route path="/confirm-account" element={<ConfirmAccount />} />
//             {/* Dashboards */}
//             <Route path="/dashboard" element={<RoleBasedRedirect />} />
//             {/* ---------------- Admin Routes ---------------- */}
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
//               <Route
//                 path="pending-enrollments"
//                 element={<PendingEnrollments />}
//               />
//               <Route path="manage-courses" element={<ManageCourses />} />
//               <Route path="manage-users" element={<ManageUsers />} />
//               <Route path="lesson-logs" element={<AdminLessonLogs />} />
//               <Route path="file-manager" element={<FileManager />} />
//             </Route>
//             {/* ---------------- Teacher Routes ---------------- */}
//             <Route
//               path="/teacher-dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <MyTeachingCourses />
//                 </ProtectedRoute>
//               }
//             />
//             {/* ✅ SIMPLE COURSE CREATION */}
//             <Route
//               path="/create-course"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <CreateCourse />
//                 </ProtectedRoute>
//               }
//             />
//             {/* ✅ ADVANCED COURSE CREATION WITH UNITS */}
//             <Route
//               path="/create-course-advanced"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <CreateCourseWithUnits />
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
//               path="/courses/:courseId/edit"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <EditCourse />
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
//               path="/teacher/course/:courseId/progress"
//               element={
//                 <ProtectedRoute allowedRoles={["teacher"]}>
//                   <TeacherCourseProgress />
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
//             {/* ---------------- Student Routes ---------------- */}
//             <Route
//               path="/my-courses"
//               element={
//                 <ProtectedRoute allowedRoles={["student"]}>
//                   <MyCoursesPage />
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
//             <Route
//               path="/courses/:courseId/view-lessons"
//               element={
//                 <ProtectedRoute allowedRoles={["student"]}>
//                   <CourseLessons />
//                 </ProtectedRoute>
//               }
//             />
//             {/* Shared Profile */}
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

//         <ToastContainer
//           position="top-right"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="light"
//         />
//       </ErrorBoundary>
//     </div>
//   );
// }

// /* -------------------- Root Wrapper -------------------- */
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
import PendingEnrollments from "./components/PendingEnrollments";
import CSSDebug from "./components/CSSDebug";
import ConfirmAccount from "./pages/ConfirmAccount";
import "./pages/AdminDashboard.css";
import "react-toastify/dist/ReactToastify.css";

// ✅ Lazy-loaded pages
const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));
const Courses = React.lazy(() => import("./pages/courses/Courses"));
const CourseDetail = React.lazy(() => import("./pages/courses/CourseDetail"));
const CoursePreviewPage = React.lazy(() => import("./pages/CoursePreviewPage"));
const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));
const PaymentSuccess = React.lazy(() =>
  import("./pages/payments/PaymentSuccess")
);
const PaymentCancel = React.lazy(() =>
  import("./pages/payments/PaymentCancel")
);
const Cancel = React.lazy(() => import("./pages/payments/Cancel"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const ManageCourses = React.lazy(() => import("./pages/AdminManageCourses"));
const ManageUsers = React.lazy(() => import("./pages/AdminManageUsers"));
const CourseViewer = React.lazy(() => import("./pages/courses/CourseViewer"));
const Profile = React.lazy(() => import("./pages/users/Profile"));
const Unauthorized = React.lazy(() => import("./pages/Unauthorized"));
const FileManager = React.lazy(() => import("./pages/FileManager"));
const ManageLessons = React.lazy(() => import("./pages/ManageLessons"));
const CreateCourse = React.lazy(() => import("./pages/CreateCourse"));
const CreateCourseWithUnits = React.lazy(() =>
  import("./pages/CreateCourseWithUnits")
);
const CourseLessons = React.lazy(() => import("./pages/CourseLessons"));
const MyCoursesPage = React.lazy(() => import("./pages/courses/MyCourses"));
const AdminLessonLogs = React.lazy(() => import("./pages/AdminLessonLogs"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const EditCourse = React.lazy(() => import("./pages/teachers/EditCourse"));
const MyTeachingCourses = React.lazy(() =>
  import("./pages/teachers/MyTeachingCourses")
);
const TeacherCourseProgress = React.lazy(() =>
  import("./pages/courses/TeacherCourseProgress")
);
const EditLesson = React.lazy(() => import("./pages/teachers/EditLesson"));
const CreateLessonPage = React.lazy(() => 
  import("./pages/teachers/CreateLessonPage")
);
const LessonCreationForm = React.lazy(() =>
  import("./components/LessonCreationForm")
);

/* -------------------- PublicRoute -------------------- */
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

/* -------------------- Role-Based Redirect -------------------- */
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

/* -------------------- Main App -------------------- */
function AppContent() {
  const { loading, checked } = useAuth();

  if (loading || !checked) return <Loading />;

  return (
    <div className="app">
      <CSSDebug />
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/courses/:courseId/preview"
              element={<CoursePreviewPage />}
            />
            <Route path="/payment/:courseId" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/confirm-account" element={<ConfirmAccount />} />
            
            {/* Dashboards */}
            <Route path="/dashboard" element={<RoleBasedRedirect />} />
            
            {/* ---------------- Admin Routes ---------------- */}
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
              <Route
                path="pending-enrollments"
                element={<PendingEnrollments />}
              />
              <Route path="manage-courses" element={<ManageCourses />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="lesson-logs" element={<AdminLessonLogs />} />
              <Route path="file-manager" element={<FileManager />} />
            </Route>
            
            {/* ---------------- Teacher Routes ---------------- */}
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <MyTeachingCourses />
                </ProtectedRoute>
              }
            />
            
            {/* ✅ COURSE CREATION ROUTES */}
            <Route
              path="/create-course"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-course-advanced"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateCourseWithUnits />
                </ProtectedRoute>
              }
            />
            
            {/* ✅ LESSON MANAGEMENT ROUTES */}
            <Route
              path="/courses/:courseId/manage-lessons"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <ManageLessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/lessons/new"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CreateLessonPage />
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
            
            {/* ✅ COURSE MANAGEMENT ROUTES */}
            <Route
              path="/courses/:courseId/edit"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <EditCourse />
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
            
            {/* ---------------- Student Routes ---------------- */}
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

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ErrorBoundary>
    </div>
  );
}

/* -------------------- Root Wrapper -------------------- */
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