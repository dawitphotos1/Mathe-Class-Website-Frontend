// src/pages/courses/CourseDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, checked } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Check if user came from payment success page
  const fromPayment = location.state?.fromPayment || searchParams.get('fromPayment') === 'true';

  // ============================================================
  // Fetch course details
  // ============================================================
  useEffect(() => {
    if (!slug) return;
    fetchCourseDetails();
  }, [slug]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/courses/${slug}`);
      const courseData = data.course || data;

      if (!courseData) {
        toast.error("Course not found");
        return setCourse(null);
      }

      const formattedCourse = {
        ...courseData,
        lessons: Array.isArray(courseData.lessons) ? courseData.lessons : [],
        price: Number(courseData.price || 0),
      };

      setCourse(formattedCourse);

      // ✅ Only check enrollment *after* auth context is ready
      if (checked && isAuthenticated && user) {
        checkEnrollmentStatus(formattedCourse.id);
      }
    } catch (err) {
      console.error("❌ Error fetching course:", err);
      toast.error("Failed to load course information");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Enrollment check
  // ============================================================
  const checkEnrollmentStatus = async (courseId) => {
    try {
      const response = await axiosInstance.get(
        `/enrollments/check/${courseId}`
      );
      setIsEnrolled(response?.data?.enrolled || false);
    } catch {
      setIsEnrolled(false);
    }
  };

  // ============================================================
  // Handlers
  // ============================================================
  const handleEnroll = () => {
    if (!course?.id) {
      toast.error("Course ID missing. Cannot proceed.");
      return;
    }

    if (!checked) {
      toast.info("Checking authentication...");
      return;
    }

    if (!isAuthenticated) {
      toast.warning("Please login to enroll");
      navigate("/login", {
        state: { from: `/courses/${slug}` },
      });
      return;
    }

    navigate(`/payment/${course.id}`);
  };

  const toggleUnit = (index) => {
    setExpandedUnit(expandedUnit === index ? null : index);
  };

  // ============================================================
  // Render states
  // ============================================================
  if (loading) {
    return (
      <div className="course-detail-container">
        <div className="loading-section">
          <h2>Loading Course Details...</h2>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="error-section">
          <h2>Course Not Found</h2>
          <button onClick={() => navigate("/courses")} className="btn-primary">
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // Render main view
  // ============================================================
  const displayPrice = Number(course.price || 0).toFixed(2);
  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
  const isStudent = user?.role === "student";

  return (
    <div className="course-detail-container">
      {/* Payment Success Navigation Banner */}
      {fromPayment && (
        <div className="payment-success-navigation">
          <div className="success-banner">
            <h3>🎉 Payment Successful!</h3>
            <p>Your enrollment is pending admin approval. You can browse more courses or check your enrolled courses.</p>
          </div>
          <div className="navigation-buttons">
            <button 
              onClick={() => navigate('/')}
              className="nav-btn home-btn"
            >
              ← Return to Home
            </button>
            <button 
              onClick={() => navigate('/my-courses')}
              className="nav-btn courses-btn"
            >
              View My Courses
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className="nav-btn browse-btn"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      )}

      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description || "No description provided."}</p>
        <div className="course-meta">
          <span className="course-price">${displayPrice}</span>
          {isAuthenticated && user && (
            <span className={`user-badge role-${user.role}`}>
              {user.role.toUpperCase()}
              {isEnrolled && " • ENROLLED"}
            </span>
          )}
        </div>
      </div>

      <div className="course-content">
        <h2 className="curriculum-title">Course Curriculum</h2>
        {lessons.length > 0 ? (
          lessons.map((lesson, i) => (
            <div
              key={lesson.id || i}
              className={`unit-card ${expandedUnit === i ? "expanded" : ""}`}
            >
              <div className="unit-header" onClick={() => toggleUnit(i)}>
                <h3 className="unit-title">{lesson.title || "Untitled Lesson"}</h3>
                <span className="unit-toggle">{expandedUnit === i ? "−" : "+"}</span>
              </div>
              {expandedUnit === i && (
                <div className="lesson-content">
                  <p>{lesson.content || "Lesson details coming soon..."}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No lessons available yet.</p>
        )}
      </div>

      <div className="course-actions">
        {isStudent ? (
          <button
            className="btn-enroll-now"
            onClick={handleEnroll}
            disabled={isEnrolled}
          >
            {isEnrolled
              ? "Already Enrolled"
              : displayPrice === "0.00"
              ? "Enroll Now - FREE"
              : `Enroll Now - $${displayPrice}`}
          </button>
        ) : (
          <button className="btn-enroll-now" onClick={handleEnroll}>
            {displayPrice === "0.00"
              ? "Enroll Now - FREE"
              : `Enroll Now - $${displayPrice}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
