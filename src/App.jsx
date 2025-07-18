
// import React, { useState, useEffect, Suspense } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import axios from "axios";
// import { API_BASE_URL } from "./config";

// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import ErrorBoundary from "./components/ErrorBoundary";
// import Loading from "./components/Loading";
// import Contact from "./components/Contact";
// import Login from "./Pages/auth/Login";
// import PaymentSuccess from "./Pages/payments/PaymentSuccess";
// import PaymentCancel from "./Pages/payments/PaymentCancel";
// import Unauthorized from "./Pages/Unauthorized";
// import StartCoursePage from "./Pages/StartCoursePage";
// import FileManager from "./Pages/FileManager";
// import ManageLessons from "./Pages/ManageLessons";
// import EditLesson from "./Pages/EditLesson";
// import MyTeachingCourses from "./Pages/teachers/MyTeachingCourses";
// import CreateCourse from "./Pages/CreateCourse";
// import CourseLessons from "./Pages/CourseLessons";
// import LessonCreationForm from "./components/LessonCreationForm";
// import MyCoursesPage from "./Pages/courses/MyCourses";
// import TeacherCourseProgress from "./Pages/courses/TeacherCourseProgress";

// import AdminLessonLogs from "./Pages/AdminLessonLogs";

// import { ThemeProvider } from "./context/ThemeContext";

// // ✅ Lazy-loaded pages
// const Home = React.lazy(() => import("./Pages/Home"));
// const Register = React.lazy(() => import("./Pages/auth/Register"));
// const CourseList = React.lazy(() => import("./Pages/courses/CourseList"));
// const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
// const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
// const CourseCreator = React.lazy(() => import("./Pages/courses/CourseCreator"));
// const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail"));
// const Profile = React.lazy(() => import("./Pages/users/Profile"));
// const Payment = React.lazy(() => import("./Pages/payments/Payment"));
// const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
// const NotFound = React.lazy(() => import("./Pages/NotFound"));

// // ✅ Axios token interceptor
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// function App() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("token");

//     if (storedUser && token && token.startsWith("eyJ")) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         if (parsedUser && parsedUser.id && parsedUser.role) {
//           setUser(parsedUser);
//           axios
//             .get(`${API_BASE_URL}/api/v1/users/me`)
//             .then((response) => {
//               setUser(response.data);
//               localStorage.setItem("user", JSON.stringify(response.data));
//             })
//             .catch((err) => {
//               if (err.response?.status === 401) {
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("user");
//                 setUser(null);
//                 toast.error("Session expired. Please log in again.");
//                 navigate("/login");
//               }
//             });
//         }
//       } catch {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//       }
//     }
//   }, [navigate]);

//   return (
//     <ThemeProvider>
//       <div className="app">
//         <ErrorBoundary>
//           <Navbar user={user} onLogout={handleLogout} />
//           <Suspense fallback={<Loading />}>
//             <Routes>
//               {/* ✅ Public Routes */}
//               <Route path="/" element={<Home />} />
//               <Route
//                 path="/register"
//                 element={<Register setUser={setUser} />}
//               />
//               <Route path="/login" element={<Login />} />
//               <Route path="/courses" element={<CourseList />} />
//               <Route path="/courses/:id" element={<CourseViewer />} />
//               <Route path="/course/:id" element={<CourseDetail />} />
//               <Route path="/payment-success" element={<PaymentSuccess />} />
//               <Route path="/payment-cancel" element={<PaymentCancel />} />
//               <Route path="/unauthorized" element={<Unauthorized />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/cancel" element={<Cancel />} />
//               <Route path="/class/:slug" element={<StartCoursePage />} />

//               {/* ✅ Admin-Only Routes */}
//               <Route
//                 path="/admin/lesson-logs"
//                 element={
//                   <ProtectedRoute allowedRoles={["admin"]}>
//                     <AdminLessonLogs />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/admin/files"
//                 element={
//                   <ProtectedRoute allowedRoles={["admin"]}>
//                     <FileManager />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* ✅ Teacher-Only Routes */}
//               <Route
//                 path="/teacher/create-course"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher"]}>
//                     <CreateCourse />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/teacher/course/:courseId/progress"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher"]}>
//                     <TeacherCourseProgress />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/manage-lessons"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher"]}>
//                     <ManageLessons />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/lessons/new"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher"]}>
//                     <LessonCreationForm />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/courses/:courseId/lessons/:lessonId/edit"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher"]}>
//                     <EditLesson />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/my-teaching-courses"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher"]}>
//                     <MyTeachingCourses />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/create-course"
//                 element={
//                   <ProtectedRoute allowedRoles={["teacher"]}>
//                     <CreateCourse />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* ✅ Student-Only Routes */}
//               <Route
//                 path="/courses/:courseId/view-lessons"
//                 element={
//                   <ProtectedRoute allowedRoles={["student"]}>
//                     <CourseLessons />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/my-courses"
//                 element={
//                   <ProtectedRoute allowedRoles={["student"]}>
//                     <MyCoursesPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/payment/:courseId"
//                 element={
//                   <ProtectedRoute allowedRoles={["student"]}>
//                     <Payment />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* ✅ Shared Routes */}
//               <Route
//                 path="/profile"
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={["admin", "teacher", "student"]}
//                   >
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute allowedRoles={["admin", "teacher"]}>
//                     <AdminDashboard onLogout={handleLogout} />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* ✅ Catch-all 404 */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </Suspense>
//           <ToastContainer />
//         </ErrorBoundary>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;


import React, { useContext, useEffect, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { API_BASE_URL } from "./config";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading";
import Contact from "./components/Contact";
import Login from "./Pages/auth/Login";
import PaymentSuccess from "./Pages/payments/PaymentSuccess";
import PaymentCancel from "./Pages/payments/PaymentCancel";
import Unauthorized from "./Pages/Unauthorized";
import StartCoursePage from "./Pages/StartCoursePage";
import FileManager from "./Pages/FileManager";
import ManageLessons from "./Pages/ManageLessons";
import EditLesson from "./Pages/EditLesson";
import MyTeachingCourses from "./Pages/teachers/MyTeachingCourses"; // Updated path
import CreateCourse from "./Pages/CreateCourse";
import CourseLessons from "./Pages/CourseLessons";
import LessonCreationForm from "./components/LessonCreationForm";
import MyCoursesPage from "./Pages/courses/MyCourses";
import TeacherCourseProgress from "./Pages/courses/TeacherCourseProgress";
import AdminLessonLogs from "./Pages/AdminLessonLogs";

const Home = React.lazy(() => import("./Pages/Home"));
const Register = React.lazy(() => import("./Pages/auth/Register"));
const CourseList = React.lazy(() => import("./Pages/courses/CourseList"));
const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
const CourseViewer = React.lazy(() => import("./Pages/courses/CourseViewer"));
const CourseCreator = React.lazy(() => import("./Pages/courses/CourseCreator"));
const CourseDetail = React.lazy(() => import("./Pages/courses/CourseDetail"));
const Profile = React.lazy(() => import("./Pages/users/Profile"));
const Payment = React.lazy(() => import("./Pages/payments/Payment"));
const Cancel = React.lazy(() => import("./Pages/payments/Cancel"));
const NotFound = React.lazy(() => import("./Pages/NotFound"));

// ... (rest of App.jsx remains unchanged; include full content if needed)
function App() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token && !user) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("token");
          setUser(null);
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }
      }
    };
    checkAuth();
  }, [user, setUser, navigate]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/:id/view" element={<CourseViewer />} />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-teaching-courses"
            element={
              <ProtectedRoute role="teacher">
                <MyTeachingCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/manage-lessons"
            element={
              <ProtectedRoute role="teacher">
                <ManageLessons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/lessons/new"
            element={
              <ProtectedRoute role="teacher">
                <LessonCreationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/lessons/:lessonId/edit"
            element={
              <ProtectedRoute role="teacher">
                <EditLesson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-course"
            element={
              <ProtectedRoute role="teacher">
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/start"
            element={
              <ProtectedRoute>
                <StartCoursePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/lessons"
            element={
              <ProtectedRoute>
                <CourseLessons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/progress"
            element={
              <ProtectedRoute role="teacher">
                <TeacherCourseProgress />
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
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lesson-logs"
            element={
              <ProtectedRoute role="admin">
                <AdminLessonLogs />
              </ProtectedRoute>
            }
          />
          <Route path="/file-manager" element={<FileManager />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;