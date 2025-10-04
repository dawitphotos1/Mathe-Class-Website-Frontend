// // // src/App.jsx
// // import React, { Suspense } from "react";
// // import { Routes, Route } from "react-router-dom";
// // import { ToastContainer } from "react-toastify";
// // import { ThemeProvider } from "./context/ThemeContext";
// // import { AuthProvider } from "./context/AuthContext";
// // import ErrorBoundary from "./components/ErrorBoundary";
// // import Navbar from "./components/Navbar";
// // import ProtectedRoute from "./components/ProtectedRoute";
// // import Loading from "./components/Loading";
// // import Contact from "./components/Contact";
// // import EditCourse from "./Pages/teachers/EditCourse";
// // import PaymentSuccess from "./Pages/payments/PaymentSuccess";
// // import PaymentCancel from "./Pages/payments/PaymentCancel";
// // import Unauthorized from "./Pages/Unauthorized";
// // import FileManager from "./Pages/FileManager";
// // import ManageLessons from "./Pages/ManageLessons";
// // import MyTeachingCourses from "./Pages/teachers/MyTeachingCourses";
// // import CreateCourse from "./Pages/CreateCourse";
// // import CourseLessons from "./Pages/CourseLessons";
// // import LessonCreationForm from "./components/LessonCreationForm";
// // import MyCoursesPage from "./Pages/courses/MyCourses";
// // import TeacherCourseProgress from "./Pages/courses/TeacherCourseProgress";
// // import CourseLessonManager from "./Pages/CourseLessonManager";
// // import AdminLessonLogs from "./Pages/AdminLessonLogs";
// // import EditLesson from "./Pages/teachers/EditLesson";
// // import EnrollmentSuccess from "./Pages/payments/EnrollmentSuccess";
// // import AdminLayout from "./components/AdminLayout";
// // import PendingStudents from "./components/PendingStudents";

// // // Lazy-loaded pages
// // const Home = React.lazy(() => import("./Pages/Home"));
// // const Register = React.lazy(() => import("./Pages/auth/Register"));
// // const Login = React.lazy(() => import("./Pages/auth/Login"));
// // const CourseList = React.lazy(() => import("./Pages/courses/CourseList"));
// // const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail")); // ✅ now lazy
// // const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
// // const ManageCourses = React.lazy(() => import("./Pages/AdminManageCourses"));
// // const ManageUsers = React.lazy(() => import("./Pages/AdminManageUsers"));
// // const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
// // const Profile = React.lazy(() => import("./Pages/users/Profile"));
// // const Payment = React.lazy(() => import("./Pages/payments/Payment"));
// // const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
// // const NotFound = React.lazy(() => import("./Pages/NotFound"));

// // function App() {
// //   return (
// //     <ThemeProvider>
// //       <AuthProvider>
// //         <div className="app">
// //           <ErrorBoundary>
// //             <Navbar />
// //             <Suspense fallback={<Loading />}>
// //               <Routes>
// //                 {/* Public Routes */}
// //                 <Route path="/" element={<Home />} />
// //                 <Route path="/register" element={<Register />} />
// //                 <Route path="/login" element={<Login />} />
// //                 <Route path="/courses" element={<CourseList />} />

// //                 {/* ✅ Curriculum page */}
// //                 <Route path="/course/:id" element={<CourseDetail />} />

// //                 {/* ✅ Real lesson viewer */}
// //                 <Route path="/course/:slug/viewer" element={<CourseViewer />} />

// //                 <Route
// //                   path="/enrollment-success"
// //                   element={<EnrollmentSuccess />}
// //                 />
// //                 <Route path="/payment-success" element={<PaymentSuccess />} />
// //                 <Route path="/payment-cancel" element={<PaymentCancel />} />
// //                 <Route path="/contact" element={<Contact />} />
// //                 <Route path="/cancel" element={<Cancel />} />
// //                 <Route path="/unauthorized" element={<Unauthorized />} />

// //                 {/* Course Management */}
// //                 <Route path="/courses/:slug/edit" element={<EditCourse />} />
// //                 <Route
// //                   path="/courses/:courseId/manage-lessons"
// //                   element={<CourseLessonManager />}
// //                 />
// //                 <Route
// //                   path="/lessons/:lessonId/edit"
// //                   element={<EditLesson />}
// //                 />

// //                 {/* ✅ Admin Routes */}
// //                 <Route
// //                   path="/admin"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["admin"]}>
// //                       <AdminLayout />
// //                     </ProtectedRoute>
// //                   }
// //                 >
// //                   <Route index element={<AdminDashboard />} />
// //                   <Route
// //                     path="pending-students"
// //                     element={<PendingStudents />}
// //                   />
// //                   <Route path="manage-courses" element={<ManageCourses />} />
// //                   <Route path="manage-users" element={<ManageUsers />} />
// //                   <Route path="lesson-logs" element={<AdminLessonLogs />} />
// //                   <Route path="files" element={<FileManager />} />
// //                 </Route>

// //                 {/* Teacher Routes */}
// //                 <Route
// //                   path="/create-course"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["teacher"]}>
// //                       <CreateCourse />
// //                     </ProtectedRoute>
// //                   }
// //                 />
// //                 <Route
// //                   path="/dashboard"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["teacher"]}>
// //                       <MyTeachingCourses />
// //                     </ProtectedRoute>
// //                   }
// //                 />
// //                 <Route
// //                   path="/teacher/course/:courseId/progress"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["teacher"]}>
// //                       <TeacherCourseProgress />
// //                     </ProtectedRoute>
// //                   }
// //                 />
// //                 <Route
// //                   path="/courses/:courseId/manage-lessons"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["teacher"]}>
// //                       <ManageLessons />
// //                     </ProtectedRoute>
// //                   }
// //                 />
// //                 <Route
// //                   path="/courses/:courseId/lessons/new"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["teacher"]}>
// //                       <LessonCreationForm />
// //                     </ProtectedRoute>
// //                   }
// //                 />
// //                 <Route
// //                   path="/courses/:courseId/lessons/:lessonId/edit"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["teacher"]}>
// //                       <EditLesson />
// //                     </ProtectedRoute>
// //                   }
// //                 />

// //                 {/* Student Routes */}
// //                 <Route
// //                   path="/my-courses"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["student"]}>
// //                       <MyCoursesPage />
// //                     </ProtectedRoute>
// //                   }
// //                 />
// //                 <Route
// //                   path="/courses/:courseId/view-lessons"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["student"]}>
// //                       <CourseLessons />
// //                     </ProtectedRoute>
// //                   }
// //                 />
// //                 <Route
// //                   path="/payment/:courseId"
// //                   element={
// //                     <ProtectedRoute allowedRoles={["student"]}>
// //                       <Payment />
// //                     </ProtectedRoute>
// //                   }
// //                 />

// //                 {/* Shared Routes */}
// //                 <Route
// //                   path="/profile"
// //                   element={
// //                     <ProtectedRoute
// //                       allowedRoles={["admin", "teacher", "student"]}
// //                     >
// //                       <Profile />
// //                     </ProtectedRoute>
// //                   }
// //                 />

// //                 {/* Catch-all 404 */}
// //                 <Route path="*" element={<NotFound />} />
// //               </Routes>
// //             </Suspense>
// //             <ToastContainer />
// //           </ErrorBoundary>
// //         </div>
// //       </AuthProvider>
// //     </ThemeProvider>
// //   );
// // }

// // export default App;





// // src/App.jsx
// import React, { Suspense } from "react";
// import { Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ThemeProvider } from "./context/ThemeContext";
// import { AuthProvider } from "./context/AuthContext";
// import ErrorBoundary from "./components/ErrorBoundary";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Loading from "./components/Loading";
// import Contact from "./components/Contact";
// import EditCourse from "./Pages/teachers/EditCourse";
// import PaymentSuccess from "./Pages/payments/PaymentSuccess";
// import PaymentCancel from "./Pages/payments/PaymentCancel";
// import Unauthorized from "./Pages/Unauthorized";
// import FileManager from "./Pages/FileManager";
// import ManageLessons from "./Pages/ManageLessons";
// import MyTeachingCourses from "./Pages/teachers/MyTeachingCourses";
// import CreateCourse from "./Pages/CreateCourse";
// import CourseLessons from "./Pages/CourseLessons";
// import LessonCreationForm from "./components/LessonCreationForm";
// import MyCoursesPage from "./Pages/courses/MyCourses";
// import TeacherCourseProgress from "./Pages/courses/TeacherCourseProgress";
// import CourseLessonManager from "./Pages/CourseLessonManager";
// import AdminLessonLogs from "./Pages/AdminLessonLogs";
// import EditLesson from "./Pages/teachers/EditLesson";
// import EnrollmentSuccess from "./Pages/payments/EnrollmentSuccess";
// import AdminLayout from "./components/AdminLayout";
// import PendingStudents from "./components/PendingStudents";

// // Lazy-loaded pages
// const Home = React.lazy(() => import("./Pages/Home"));
// const Register = React.lazy(() => import("./Pages/auth/Register"));
// const Login = React.lazy(() => import("./Pages/auth/Login"));
// const CourseList = React.lazy(() => import("./Pages/courses/CourseList"));
// const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail")); // ✅ now lazy
// const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
// const ManageCourses = React.lazy(() => import("./Pages/AdminManageCourses"));
// const ManageUsers = React.lazy(() => import("./Pages/AdminManageUsers"));
// const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
// const Profile = React.lazy(() => import("./Pages/users/Profile"));
// const Payment = React.lazy(() => import("./Pages/payments/Payment"));
// const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
// const NotFound = React.lazy(() => import("./Pages/NotFound"));

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <div className="app">
//           <ErrorBoundary>
//             <Navbar />
//             <Suspense fallback={<Loading />}>
//               <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/courses" element={<CourseList />} />

//                 {/* ✅ Curriculum page */}
//                 <Route path="/course/:id" element={<CourseDetail />} />

//                 {/* ✅ Real lesson viewer */}
//                 <Route path="/course/:slug/viewer" element={<CourseViewer />} />

//                 <Route
//                   path="/enrollment-success"
//                   element={<EnrollmentSuccess />}
//                 />
//                 <Route path="/payment-success" element={<PaymentSuccess />} />
//                 <Route path="/payment-cancel" element={<PaymentCancel />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/cancel" element={<Cancel />} />
//                 <Route path="/unauthorized" element={<Unauthorized />} />

//                 {/* Course Management */}
//                 <Route path="/courses/:slug/edit" element={<EditCourse />} />
//                 <Route
//                   path="/courses/:courseId/manage-lessons"
//                   element={<CourseLessonManager />}
//                 />
//                 <Route
//                   path="/lessons/:lessonId/edit"
//                   element={<EditLesson />}
//                 />

//                 {/* ✅ Admin Routes */}
//                 <Route
//                   path="/admin"
//                   element={
//                     <ProtectedRoute allowedRoles={["admin"]}>
//                       <AdminLayout />
//                     </ProtectedRoute>
//                   }
//                 >
//                   <Route index element={<AdminDashboard />} />
//                   <Route
//                     path="pending-students"
//                     element={<PendingStudents />}
//                   />
//                   <Route path="manage-courses" element={<ManageCourses />} />
//                   <Route path="manage-users" element={<ManageUsers />} />
//                   <Route path="lesson-logs" element={<AdminLessonLogs />} />
//                   <Route path="files" element={<FileManager />} />
//                 </Route>

//                 {/* Teacher Routes */}
//                 <Route
//                   path="/create-course"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <CreateCourse />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/dashboard"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <MyTeachingCourses />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/teacher/course/:courseId/progress"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <TeacherCourseProgress />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/courses/:courseId/manage-lessons"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ManageLessons />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/courses/:courseId/lessons/new"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <LessonCreationForm />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/courses/:courseId/lessons/:lessonId/edit"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <EditLesson />
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Student Routes */}
//                 <Route
//                   path="/my-courses"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <MyCoursesPage />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/courses/:courseId/view-lessons"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <CourseLessons />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/enrollment-success"
//                   element={<EnrollmentSuccess />}
//                 />
                 
//                 <Route
//                   path="/payment/:courseId"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <Payment />
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Shared Routes */}
//                 <Route
//                   path="/profile"
//                   element={
//                     <ProtectedRoute
//                       allowedRoles={["admin", "teacher", "student"]}
//                     >
//                       <Profile />
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Catch-all 404 */}
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </Suspense>
//             <ToastContainer />
//           </ErrorBoundary>
//         </div>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;





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
const CourseList = React.lazy(() => import("./Pages/courses/CourseList"));
const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail"));
const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
const ManageCourses = React.lazy(() => import("./Pages/AdminManageCourses"));
const ManageUsers = React.lazy(() => import("./Pages/AdminManageUsers"));
const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
const Profile = React.lazy(() => import("./Pages/users/Profile"));
const Payment = React.lazy(() => import("./Pages/payments/Payment"));
const PaymentPage = React.lazy(() => import("./Pages/payment/PaymentPage")); // NEW: Import the PaymentPage component
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
                <Route path="/courses" element={<CourseList />} />

                {/* ✅ Curriculum page */}
                <Route path="/course/:id" element={<CourseDetail />} />

                {/* ✅ Real lesson viewer */}
                <Route path="/course/:slug/viewer" element={<CourseViewer />} />

                <Route
                  path="/enrollment-success"
                  element={<EnrollmentSuccess />}
                />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* ✅ FIXED: Payment page should be PUBLIC so anyone can access it */}
                <Route path="/payment/:courseId" element={<PaymentPage />} />

                {/* Course Management */}
                <Route path="/courses/:slug/edit" element={<EditCourse />} />
                <Route
                  path="/courses/:courseId/manage-lessons"
                  element={<CourseLessonManager />}
                />
                <Route
                  path="/lessons/:lessonId/edit"
                  element={<EditLesson />}
                />

                {/* ✅ Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route
                    path="pending-students"
                    element={<PendingStudents />}
                  />
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
                  path="/courses/:courseId/lessons/:lessonId/edit"
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

                {/* Keep the old payment route for backward compatibility, but it should redirect or be removed */}
                <Route
                  path="/payment-old/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <Payment />
                    </ProtectedRoute>
                  }
                />

                {/* Shared Routes */}
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

                {/* Catch-all 404 */}
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