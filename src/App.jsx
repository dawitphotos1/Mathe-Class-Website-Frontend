import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_BASE_URL } from "./config";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading";
import Contact from "./components/Contact"; // ✅ Correct import
import Login from "./Pages/auth/Login"; // Assuming Login is here
import PaymentSuccess from "./Pages/payments/PaymentSuccess"; // adjust path
import PaymentCancel from "./Pages/payments/PaymentCancel"; // adjust path
import "./App.css";

// Retry wrapper for lazy loading
const retryLazy = (factory, retries = 3, interval = 1000) => {
  return new Promise((resolve, reject) => {
    factory()
      .then(resolve)
      .catch((error) => {
        console.warn(`Lazy load failed, retries left: ${retries}`, error);
        if (retries === 0) return reject(error);
        setTimeout(
          () =>
            retryLazy(factory, retries - 1, interval)
              .then(resolve)
              .catch(reject),
          interval
        );
      });
  });
};

// Lazy imports
const Home = React.lazy(() => retryLazy(() => import("./Pages/Home")));
const Register = React.lazy(() =>
  retryLazy(() => import("./Pages/auth/Register"))
);
const CourseList = React.lazy(() =>
  retryLazy(() => import("./Pages/courses/CourseList"))
);
const CourseViewer = React.lazy(() =>
  retryLazy(() => import("./Pages/courses/CourseViewer"))
);
const CourseCreator = React.lazy(() =>
  retryLazy(() => import("./Pages/courses/CourseCreator"))
);
const CourseDetail = React.lazy(() =>
  retryLazy(() => import("./Pages/courses/CourseDetail"))
);
const Profile = React.lazy(() =>
  retryLazy(() => import("./Pages/users/Profile"))
);
const AdminDashboard = React.lazy(() =>
  retryLazy(() => import("./Pages/AdminDashboard"))
);
const Payment = React.lazy(() =>
  retryLazy(() => import("./Pages/payments/Payment"))
);
const Success = React.lazy(() =>
  retryLazy(() => import("./Pages/payments/Success"))
);
const Cancel = React.lazy(() =>
  retryLazy(() => import("./Pages/payments/Cancel"))
);
const NotFound = React.lazy(() => retryLazy(() => import("./Pages/NotFound")));

// Axios Interceptor for Authorization
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
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseViewer />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route
              path="/create-course"
              element={
                <ProtectedRoute user={user} allowedRoles={["teacher"]}>
                  <CourseCreator />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  user={user}
                  allowedRoles={["teacher", "student", "admin"]}
                >
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user} allowedRoles={["teacher", "admin"]}>
                  <AdminDashboard user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:courseId"
              element={
                <ProtectedRoute user={user}>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
