
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./CourseCard.css";
import LoadingSpinner from "../common/LoadingSpinner";
import ConfirmModal from "../common/ConfirmModal";

const CourseCard = ({ course, user, onCourseDeleted }) => {
  const navigate = useNavigate();
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check enrollment status when component mounts or user changes
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!user || !course?.id) return;
      
      try {
        setIsCheckingEnrollment(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/enrollments/check/${course.id}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem("token")}` 
            }
          }
        );
        setIsEnrolled(response.data.isEnrolled);
      } catch (err) {
        console.error("Error checking enrollment:", err);
        setIsEnrolled(false);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    checkEnrollmentStatus();
  }, [user, course?.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/v1/courses/${course.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully");
      if (onCourseDeleted) onCourseDeleted(course.id);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete course");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      toast.error("Please log in to enroll.");
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }

    if (!course.id || !course.title || !course.price) {
      console.error("Invalid course data:", course);
      toast.error("Course data is incomplete.");
      return;
    }

    setIsLoading(true);
    try {
      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        {
          courseId: String(course.id),
          courseTitle: course.title,
          coursePrice: parseFloat(course.price),
          userId: user.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      toast.error(
        err.response?.data?.error || "Failed to initiate payment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCourse = async () => {
    if (!user) {
      toast.error("Please log in to access the course.");
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }

    // For teachers, allow direct access
    if (user?.id === course.teacherId) {
      navigate(`/courses/${course.id}/manage`);
      return;
    }

    // For students, verify enrollment
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/enrollments/check/${course.id}`,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          }
        }
      );

      if (response.data.isEnrolled) {
        navigate(`/courses/${course.id}`);
      } else {
        toast.error("You are not enrolled in this course.");
      }
    } catch (err) {
      console.error("Enrollment check error:", err);
      toast.error("Failed to verify enrollment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canAccessCourse = isEnrolled || user?.id === course.teacherId;
  const isTeacher = user?.id === course.teacherId;

  return (
    <div className="course-card">
      {isLoading && <div className="loading-overlay"><LoadingSpinner /></div>}
      
      <div className="course-thumbnail-container">
        <img
          src={course.thumbnail || "/images/default-course.jpg"}
          alt={course.title}
          className="course-thumbnail"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default-course.jpg";
          }}
        />
        {course.category && (
          <span className="course-category-badge">{course.category}</span>
        )}
      </div>

      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description || "No description available"}
        </p>

        <div className="course-meta">
          <span className={`difficulty-badge ${course.difficulty?.toLowerCase()}`}>
            {course.difficulty || "All Levels"}
          </span>
          <span className="course-price">
            {course.price > 0 ? `$${course.price}` : "Free"}
          </span>
          {course.studentCount && (
            <span className="student-count">
              👥 {course.studentCount} students
            </span>
          )}
        </div>

        <div className="action-buttons">
          <Link 
            to={`/courses/${course.id}`} 
            className="btn btn-outline view-course-btn"
          >
            View Details
          </Link>

          {canAccessCourse ? (
            <button
              className="btn btn-primary start-course-btn"
              onClick={handleStartCourse}
              disabled={isCheckingEnrollment}
            >
              {isCheckingEnrollment ? (
                "Checking..."
              ) : (
                <>
                  ▶️ {isTeacher ? "Manage Course" : "Start Course"}
                </>
              )}
            </button>
          ) : (
            user?.role === "student" && (
              <button
                className="btn btn-primary enroll-btn"
                onClick={handleEnroll}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Enroll Now"}
              </button>
            )
          )}

          {isTeacher && (
            <>
              <Link
                to={`/courses/${course.id}/edit`}
                className="btn btn-outline edit-btn"
              >
                Edit
              </Link>
              <button
                className="btn btn-danger delete-btn"
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          message="Are you sure you want to delete this course? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          isDanger={true}
        />
      )}
    </div>
  );
};

export default CourseCard;