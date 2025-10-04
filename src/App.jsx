
// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import Contact from "./components/Contact";
import EditCourse from "./Pages/teachers/EditCourse";
import PaymentSuccess from "./Pages/payments/PaymentSuccess";
import PaymentCancel from "./Pages/payments/PaymentCancel";
import Unauthorized from "./Pages/Unauthorized";
import FileManager from "./Pages/FileManager";
import ManageLessons from "./Pages/ManageLessons";
import MyTeachingCourses from "./Pages/teachers/MyTeachingCourses";
import CreateCourse from "./Pages/CreateCourse";
import CourseLessons from "./Pages/CourseLessons";
import LessonCreationForm from "./components/LessonCreationForm";
import MyCoursesPage from "./Pages/courses/MyCourses";
import TeacherCourseProgress from "./Pages/courses/TeacherCourseProgress";
import CourseLessonManager from "./Pages/CourseLessonManager";
import AdminLessonLogs from "./Pages/AdminLessonLogs";
import EditLesson from "./Pages/teachers/EditLesson";
import EnrollmentSuccess from "./Pages/payments/EnrollmentSuccess";
import AdminLayout from "./components/AdminLayout";
import PendingStudents from "./components/PendingStudents";

// Lazy-loaded pages
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
const Payment = React.lazy(() => import("./Pages/payments/Payment"));
const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
const NotFound = React.lazy(() => import("./Pages/NotFound"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          <ErrorBoundary>
            <Navbar />
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:slug" element={<CourseDetail />} />
                <Route path="/contact" element={<Contact />} />

                {/* Payments */}
                <Route path="/payment/:courseId" element={<Payment />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
                <Route path="/enrollment-success" element={<EnrollmentSuccess />} />
                <Route path="/cancel" element={<Cancel />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
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

                {/* Teacher Routes */}
                <Route
                  path="/create-course"
                  element={
                    <ProtectedRoute allowedRoles={["teacher"]}>
                      <CreateCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["teacher"]}>
                      <MyTeachingCourses />
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
                      <LessonCreationForm />
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

                {/* Student Routes */}
                <Route
                  path="/my-courses"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <MyCoursesPage />
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

                {/* Shared */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin", "teacher", "student"]}
                    >
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <ToastContainer />
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
