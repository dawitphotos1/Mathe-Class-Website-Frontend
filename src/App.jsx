
import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
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
import "./App.css";

// ✅ Student-only route
import MyCoursesPage from "./Pages/courses/MyCourses";

// Lazy-loaded pages
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

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token && token.startsWith("eyJ")) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.role) {
          setUser(parsedUser);
          axios
            .get(`${API_BASE_URL}/api/v1/users/me`, {
              withCredentials: true,
            })
            .then((response) => {
              setUser(response.data);
              localStorage.setItem("user", JSON.stringify(response.data));
            })
            .catch((err) => {
              if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                toast.error("Session expired. Please log in again.");
                navigate("/login");
              }
            });
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, [navigate]);

  return (
    <div className="app">
      <ErrorBoundary
        fallback={
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <p>Please try refreshing the page or contact support.</p>
            <button onClick={() => window.location.reload()}>Refresh</button>
          </div>
        }
      >
        <Navbar user={user} onLogout={handleLogout} />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseViewer />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/start-course/:slug" element={<StartCoursePage />} />

            {/* ✅ Protected Routes Below */}
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-course"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <CourseCreator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["teacher", "student", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <AdminDashboard onLogout={handleLogout} />
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

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

export default App;



