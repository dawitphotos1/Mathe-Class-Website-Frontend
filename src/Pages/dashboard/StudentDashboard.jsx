// pages/dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';
import { toast } from "react-toastify";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedLessons: 0,
    totalLessons: 0,
    progressPercentage: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/enrollments/my-courses");
      
      if (response.data.success) {
        const enrolledCourses = response.data.courses || [];
        setCourses(enrolledCourses);
        
        // Calculate statistics
        const completedLessons = enrolledCourses.reduce((sum, course) => 
          sum + (course.completed_lessons || 0), 0
        );
        const totalLessons = enrolledCourses.reduce((sum, course) => 
          sum + (course.total_lessons || 0), 0
        );
        const progressPercentage = totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100) 
          : 0;
        
        setStats({
          totalCourses: enrolledCourses.length,
          completedLessons,
          totalLessons,
          progressPercentage
        });
      } else {
        toast.error("Failed to load your courses");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      toast.error("Unable to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = (courseId, courseSlug) => {
    // Use slug if available, otherwise use ID
    if (courseSlug) {
      navigate(`/courses/${courseSlug}/view`);
    } else {
      navigate(`/courses/${courseId}/view`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="student-dashboard-container">
      {/* Header */}
      <div className="student-dashboard-header">
        <h1>🎓 My Learning Dashboard</h1>
        <p className="dashboard-subtitle">
          Track your progress and continue learning
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Enrolled Courses</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedLessons}/{stats.totalLessons}</h3>
            <p>Lessons Completed</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.progressPercentage}%</h3>
            <p>Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main-content">
        {/* Enrolled Courses Section */}
        <div className="courses-section">
          <div className="section-header">
            <h2>📋 My Enrolled Courses</h2>
            <Link to="/courses" className="view-all-link">
              Browse More Courses →
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No Courses Yet</h3>
              <p>You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onContinueLearning={handleContinueLearning}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section">
            <h3>🎯 Quick Actions</h3>
            <div className="quick-actions">
              <button 
                onClick={() => navigate("/courses")}
                className="action-btn"
              >
                <span className="action-icon">🔍</span>
                <span>Browse Courses</span>
              </button>
              <button 
                onClick={() => navigate("/profile")}
                className="action-btn"
              >
                <span className="action-icon">👤</span>
                <span>Update Profile</span>
              </button>
              <button 
                onClick={() => window.open("/contact", "_blank")}
                className="action-btn"
              >
                <span className="action-icon">💬</span>
                <span>Get Support</span>
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>📅 Recent Activity</h3>
            <div className="activity-list">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="activity-item">
                  <div className="activity-icon">📖</div>
                  <div className="activity-content">
                    <p className="activity-title">{course.title}</p>
                    <p className="activity-time">
                      Last accessed: {formatDate(course.last_accessed_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, onContinueLearning }) => {
  const progress = course.total_lessons > 0 
    ? Math.round((course.completed_lessons / course.total_lessons) * 100)
    : 0;

  return (
    <div className="enrolled-course-card">
      <div className="course-card-header">
        <div className="course-thumbnail">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="thumbnail-image"
            />
          ) : (
            <div className="thumbnail-placeholder">
              📚
            </div>
          )}
        </div>
        <div className="course-title-section">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-description">
            {course.description || "No description available"}
          </p>
        </div>
      </div>

      <div className="course-progress-section">
        <div className="progress-info">
          <span className="progress-label">Progress</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="lessons-count">
          {course.completed_lessons || 0} of {course.total_lessons || 0} lessons completed
        </div>
      </div>

      <div className="course-actions">
        <button 
          onClick={() => onContinueLearning(course.id, course.slug)}
          className="continue-learning-btn"
        >
          {progress === 100 ? "Review Course" : "Continue Learning"}
        </button>
        <Link 
          to={`/courses/${course.slug || course.id}`}
          className="view-details-link"
        >
          View Details
        </Link>
      </div>

      <div className="course-meta">
        <span className="meta-item">
          📅 Enrolled: {formatDate(course.enrolledAt)}
        </span>
        {course.approval_status && (
          <span className={`status-badge ${course.approval_status}`}>
            {course.approval_status === "approved" ? "✅ Approved" : "⏳ Pending"}
          </span>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;