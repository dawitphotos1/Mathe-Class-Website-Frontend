
// import React, { Suspense, useContext } from "react";
// import { Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { ThemeProvider } from "./context/ThemeContext";
// import ErrorBoundary from "./components/ErrorBoundary";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Loading from "./components/Loading";
// import Contact from "./components/Contact";
// import EditCourse from "./Pages/teachers/EditCourse";
// import PaymentSuccess from "./Pages/payments/PaymentSuccess";
// import PaymentCancel from "./Pages/payments/PaymentCancel";
// import Unauthorized from "./Pages/Unauthorized";
// import StartCoursePage from "./Pages/StartCoursePage";
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
// // ✅ FIXED: these belong to src/components now
// import AdminLayout from "./components/AdminLayout";
// import PendingStudents from "./components/PendingStudents";
// // ✅ Contexts
// import { PendingProvider } from "./context/PendingContext";
// import { AuthContext } from "./context/AuthContext";
// import PendingApproval from "./Pages/PendingApproval";


// // Lazy-loaded pages
// const Home = React.lazy(() => import("./Pages/Home"));
// const Register = React.lazy(() => import("./Pages/auth/Register"));
// const Login = React.lazy(() => import("./Pages/auth/Login"));
// const CourseList = React.lazy(() => import("./Pages/courses/CourseList"));
// const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
// const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
// const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail"));
// const Profile = React.lazy(() => import("./Pages/users/Profile"));
// const Payment = React.lazy(() => import("./Pages/payments/Payment"));
// const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
// const NotFound = React.lazy(() => import("./Pages/NotFound"));

// function App() {
//   const { user, token } = useContext(AuthContext);

//   return (
//     <ThemeProvider>
//       <div className="app">
//         <ErrorBoundary>
//           <Navbar />
//           {/* ✅ Wrap routes with PendingProvider so sidebar + pages sync */}
//           <PendingProvider user={user} token={token}>
//             <Suspense fallback={<Loading />}>
//               <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/courses" element={<CourseList />} />
//                 <Route
//                   path="/courses/:id"
//                   element={
//                     <ErrorBoundary>
//                       <CourseViewer />
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route
//                   path="/course/:slug"
//                   element={
//                     <ErrorBoundary>
//                       <CourseDetail />
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route
//                   path="/courses/:slug"
//                   element={
//                     <ErrorBoundary>
//                       <CourseDetail />
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route path="/pending-approval" element={<PendingApproval />} />

//                 <Route
//                   path="/enrollment-success"
//                   element={<EnrollmentSuccess />}
//                 />
//                 <Route path="/payment-success" element={<PaymentSuccess />} />
//                 <Route path="/admin" element={<AdminLayout />}>
//                   <Route
//                     path="pending-students"
//                     element={<PendingStudents />}
//                   />
//                   {/* add other admin pages inside here */}
//                 </Route>
//                 <Route path="/payment-cancel" element={<PaymentCancel />} />
//                 <Route path="/unauthorized" element={<Unauthorized />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/cancel" element={<Cancel />} />
//                 <Route
//                   path="/courses/:slug/edit"
//                   element={
//                     <ErrorBoundary>
//                       <EditCourse />
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route
//                   path="/class/:slug"
//                   element={
//                     <ErrorBoundary>
//                       <StartCoursePage />
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route
//                   path="/courses/:courseId/manage-lessons"
//                   element={
//                     <ErrorBoundary>
//                       <CourseLessonManager />
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route
//                   path="/lessons/:lessonId/edit"
//                   element={
//                     <ErrorBoundary>
//                       <EditLesson />
//                     </ErrorBoundary>
//                   }
//                 />

//                 {/* Admin-Only Routes */}
//                 <Route
//                   path="/admin/lesson-logs"
//                   element={
//                     <ProtectedRoute allowedRoles={["admin"]}>
//                       <ErrorBoundary>
//                         <AdminLessonLogs />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/admin/files"
//                   element={
//                     <ProtectedRoute allowedRoles={["admin"]}>
//                       <ErrorBoundary>
//                         <FileManager />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Teacher-Only Routes */}
//                 <Route
//                   path="/teacher/create-course"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ErrorBoundary>
//                         <CreateCourse />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/teacher/course/:courseId/progress"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ErrorBoundary>
//                         <TeacherCourseProgress />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/courses/:courseId/manage-lessons"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ErrorBoundary>
//                         <ManageLessons />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/courses/:courseId/lessons/new"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ErrorBoundary>
//                         <LessonCreationForm />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/courses/:courseId/lessons/:lessonId/edit"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ErrorBoundary>
//                         <EditLesson />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/my-teaching-courses"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ErrorBoundary>
//                         <MyTeachingCourses />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/create-course"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ErrorBoundary>
//                         <CreateCourse />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Student-Only Routes */}
//                 <Route
//                   path="/courses/:courseId/view-lessons"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <ErrorBoundary>
//                         <CourseLessons />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/my-courses"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <ErrorBoundary>
//                         <MyCoursesPage />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/payment/:courseId"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <ErrorBoundary>
//                         <Payment />
//                       </ErrorBoundary>
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
//                       <ErrorBoundary>
//                         <Profile />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/admindashboard"
//                   element={
//                     <ProtectedRoute allowedRoles={["admin"]}>
//                       <ErrorBoundary>
//                         <AdminDashboard />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/dashboard"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <ErrorBoundary>
//                         <MyTeachingCourses />
//                       </ErrorBoundary>
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Catch-all 404 */}
//                 <Route
//                   path="*"
//                   element={
//                     <ErrorBoundary>
//                       <NotFound />
//                     </ErrorBoundary>
//                   }
//                 />
//               </Routes>
//             </Suspense>
//           </PendingProvider>
//           <ToastContainer />
//         </ErrorBoundary>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;






import React, { Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import { PendingProvider } from "./context/PendingContext";
import { AuthContext } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import Contact from "./components/Contact";
import AdminLayout from "./components/AdminLayout";
import PendingStudents from "./components/PendingStudents";
import PendingApproval from "./Pages/PendingApproval";
import EditCourse from "./Pages/teachers/EditCourse";
import PaymentSuccess from "./Pages/payments/PaymentSuccess";
import PaymentCancel from "./Pages/payments/PaymentCancel";
import Unauthorized from "./Pages/Unauthorized";
import StartCoursePage from "./Pages/StartCoursePage";
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

// Lazy-loaded pages
const Home = React.lazy(() => import("./Pages/Home"));
const Register = React.lazy(() => import("./Pages/auth/Register"));
const Login = React.lazy(() => import("./Pages/auth/Login"));
const CourseList = React.lazy(() => import("./Pages/courses/CourseList"));
const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail"));
const Profile = React.lazy(() => import("./Pages/users/Profile"));
const Payment = React.lazy(() => import("./Pages/payments/Payment"));
const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
const NotFound = React.lazy(() => import("./Pages/NotFound"));

function App() {
  const { user, token, loading } = useContext(AuthContext);

  // Show loading screen while auth state is initializing
  if (loading) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <div className="app">
        <ErrorBoundary>
          <Navbar />
          <PendingProvider user={user} token={token}>
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/login/pending"
                  element={<Navigate to="/pending-approval" replace />}
                />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/courses" element={<CourseList />} />
                <Route
                  path="/courses/:id"
                  element={
                    <ErrorBoundary>
                      <CourseViewer />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/course/:slug"
                  element={
                    <ErrorBoundary>
                      <CourseDetail />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/courses/:slug"
                  element={
                    <ErrorBoundary>
                      <CourseDetail />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/enrollment-success"
                  element={<EnrollmentSuccess />}
                />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route
                  path="/courses/:slug/edit"
                  element={
                    <ErrorBoundary>
                      <EditCourse />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/class/:slug"
                  element={
                    <ErrorBoundary>
                      <StartCoursePage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/courses/:courseId/manage-lessons"
                  element={
                    <ErrorBoundary>
                      <CourseLessonManager />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/lessons/:lessonId/edit"
                  element={
                    <ErrorBoundary>
                      <EditLesson />
                    </ErrorBoundary>
                  }
                />

                {/* Admin-Only Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route
                    path="pending-students"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <PendingStudents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="lesson-logs"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminLessonLogs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="files"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <FileManager />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Teacher-Only Routes */}
                <Route
                  path="/teacher/create-course"
                  element={
                    <ProtectedRoute allowedRoles={["teacher"]}>
                      <CreateCourse />
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
                <Route
                  path="/my-teaching-courses"
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

                {/* Student-Only Routes */}
                <Route
                  path="/courses/:courseId/view-lessons"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <CourseLessons />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-courses"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <MyCoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/:courseId"
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
                <Route
                  path="/admindashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
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

                {/* Catch-all 404 */}
                <Route
                  path="*"
                  element={
                    <ErrorBoundary>
                      <NotFound />
                    </ErrorBoundary>
                  }
                />
              </Routes>
            </Suspense>
          </PendingProvider>
        </ErrorBoundary>
        <ToastContainer autoClose={2000} />
      </div>
    </ThemeProvider>
  );
}

export default App;