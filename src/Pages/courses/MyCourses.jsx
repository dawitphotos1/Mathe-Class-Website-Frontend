
// src/pages/courses/MyCourses.jsx - REFINED VERSION
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../../utils/axiosInstance';
import "./MyCourses.css";

const CourseSkeleton = () => (
  <div className="enrolled-course-card skeleton">
    <div className="skeleton-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-badge"></div>
    </div>
    <div className="skeleton-description short"></div>
    <div className="skeleton-description long"></div>
    <div className="skeleton-meta"></div>
    <div className="skeleton-actions">
      <div className="skeleton-btn"></div>
      <div className="skeleton-btn secondary"></div>
    </div>
  </div>
);

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, approved, pending, completed
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/enrollments/my-courses");
      
      if (response.data.success) {
        setCourses(response.data.courses || []);
      } else {
        toast.error("Failed to load your courses");
      }
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      toast.error("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (course) => {
    // Use slug if available, otherwise use ID
    if (course.slug) {
      navigate(`/courses/${course.slug}`);
    } else if (course.id) {
      navigate(`/courses/id/${course.id}`);
    }
  };

  const handleContinueLearning = (courseId) => {
    navigate(`/courses/${courseId}/view-lessons`);
  };

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  const handleRefreshCourses = () => {
    fetchMyCourses();
    toast.info("Refreshing your courses...");
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      case 'completed':
        return '🏆';
      default:
        return '📚';
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.approval_status?.toLowerCase() === filter.toLowerCase();
  });

  const getCourseProgress = (course) => {
    // This would come from your API
    const progress = course.progress || 0;
    return Math.min(Math.max(progress, 0), 100);
  };

  const renderEmptyState = () => (
    <div className="empty-courses-state">
      <div className="empty-illustration">
        <span className="empty-icon">📚</span>
      </div>
      <h2>No Courses Enrolled Yet</h2>
      <p className="empty-subtitle">
        Begin your learning journey by enrolling in one of our comprehensive courses
      </p>
      <div className="empty-actions">
        <button onClick={handleBrowseCourses} className="btn-primary">
          Browse Available Courses
        </button>
        <button onClick={handleRefreshCourses} className="btn-secondary">
          Refresh Courses
        </button>
      </div>
    </div>
  );

  const renderCourseCard = (course) => {
    const progress = getCourseProgress(course);
    const isApproved = course.approval_status?.toLowerCase() === 'approved';
    const isPending = course.approval_status?.toLowerCase() === 'pending';
    const isCompleted = course.approval_status?.toLowerCase() === 'completed';
    const enrolledDate = course.enrolledAt ? new Date(course.enrolledAt) : new Date();

    return (
      <div key={course.id} className="enrolled-course-card">
        <div className="course-card-header">
          <div className="course-title-section">
            <h3 onClick={() => handleViewCourse(course)} className="course-title-link">
              {course.title}
            </h3>
            <span className={`status-badge ${getStatusBadgeClass(course.approval_status)}`}>
              {getStatusIcon(course.approval_status)} {course.approval_status || 'Pending'}
            </span>
          </div>
          
          <div className="course-instructor">
            <span className="instructor-icon">👨‍🏫</span>
            <span>{course.teacher?.name || 'Instructor'}</span>
          </div>
        </div>

        <div className="course-description-container">
          <p className="course-description">
            {course.description || "No description available. This course will help you master key concepts through interactive lessons and practical exercises."}
          </p>
        </div>

        <div className="course-progress-section">
          <div className="progress-header">
            <span className="progress-label">Course Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
              data-progress={progress}
            ></div>
          </div>
          
          <div className="course-meta-info">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span className="meta-text">
                Enrolled: {enrolledDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🕒</span>
              <span className="meta-text">
                Last accessed: {course.lastAccessed ? 
                  new Date(course.lastAccessed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
                  'Not started'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="course-actions">
          {isApproved || isCompleted ? (
            <>
              <button
                onClick={() => handleContinueLearning(course.id)}
                className="btn-continue-learning"
              >
                <span className="btn-icon">▶️</span>
                {isCompleted ? 'Review Course' : 'Continue Learning'}
              </button>
              <button
                onClick={() => handleViewCourse(course)}
                className="btn-view-details"
              >
                <span className="btn-icon">📖</span>
                Course Details
              </button>
            </>
          ) : isPending ? (
            <>
              <button className="btn-pending" disabled>
                <span className="btn-icon">⏳</span>
                Awaiting Approval
              </button>
              <button
                onClick={() => handleViewCourse(course)}
                className="btn-view-outline"
              >
                <span className="btn-icon">👁️</span>
                Preview Course
              </button>
            </>
          ) : (
            <button
              onClick={() => handleViewCourse(course)}
              className="btn-view-full"
            >
              <span className="btn-icon">📖</span>
              View Course Details
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="my-courses">
        <div className="my-courses-header">
          <h1>My Learning Dashboard</h1>
          <p>Loading your enrolled courses...</p>
        </div>
        <div className="filter-controls skeleton-controls">
          <div className="skeleton-filter"></div>
          <div className="skeleton-filter"></div>
          <div className="skeleton-filter"></div>
        </div>
        <div className="enrolled-courses-grid">
          {[1, 2, 3].map((i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-courses">
      <div className="my-courses-header">
        <h1>My Learning Dashboard</h1>
        <p className="dashboard-subtitle">
          Track your progress and continue your educational journey
        </p>
        <div className="dashboard-stats">
          <div className="stat-card total-courses">
            <span className="stat-icon">📚</span>
            <span className="stat-value">{courses.length}</span>
            <span className="stat-label">Total Courses</span>
          </div>
          <div className="stat-card active-courses">
            <span className="stat-icon">✅</span>
            <span className="stat-value">
              {courses.filter(c => c.approval_status?.toLowerCase() === 'approved').length}
            </span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card completion-rate">
            <span className="stat-icon">🏆</span>
            <span className="stat-value">
              {courses.length > 0 
                ? Math.round(courses.filter(c => c.progress >= 100).length / courses.length * 100)
                : 0
              }%
            </span>
            <span className="stat-label">Completion</span>
          </div>
        </div>
      </div>

      <div className="courses-control-panel">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Courses ({courses.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Active ({courses.filter(c => c.approval_status?.toLowerCase() === 'approved').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({courses.filter(c => c.approval_status?.toLowerCase() === 'pending').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({courses.filter(c => c.progress >= 100).length})
          </button>
        </div>
        
        <div className="control-actions">
          <button onClick={handleRefreshCourses} className="btn-refresh">
            <span className="refresh-icon">🔄</span>
            Refresh
          </button>
          <button onClick={handleBrowseCourses} className="btn-browse">
            <span className="browse-icon">➕</span>
            Browse More Courses
          </button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="courses-summary">
            <p>
              Showing <strong>{filteredCourses.length}</strong> course{filteredCourses.length !== 1 ? 's' : ''}
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>
          
          <div className="enrolled-courses-grid">
            {filteredCourses.map(renderCourseCard)}
          </div>
        </>
      )}
    </div>
  );
};

export default MyCourses;