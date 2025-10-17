
// src/Pages/CourseCard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance"; // ✅ corrected import path
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

  // 🔍 Check enrollment status
  useEffect(() => {
    let isMounted = true;

    const checkEnrollmentStatus = async () => {
      if (!user || !course?.id) return;
      try {
        setIsCheckingEnrollment(true);
        const res = await axiosInstance.get(`/enrollments/check/${course.id}`);
        if (isMounted) setIsEnrolled(res.data.isEnrolled);
      } catch (err) {
        if (isMounted) setIsEnrolled(false);
        console.error("Error checking enrollment:", err.response?.data || err);
      } finally {
        if (isMounted) setIsCheckingEnrollment(false);
      }
    };

    checkEnrollmentStatus();
    return () => (isMounted = false);
  }, [user, course?.id]);

  // 🧩 FRONTEND DUPLICATE CHECK - NEW FUNCTION
  const checkExistingEnrollment = async () => {
    try {
      const response = await axiosInstance.get(`/enrollments/check/${course.id}`);
      return response.data.alreadyEnrolled || response.data.enrolled;
    } catch (error) {
      console.error("Error checking enrollment:", error);
      return false;
    }
  };

  // 🗑️ Delete Course
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/courses/${course.id}`);
      toast.success("Course deleted successfully");
      if (onCourseDeleted) onCourseDeleted(course.id);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete course");
      console.error("Delete error:", err.response?.data || err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 💳 Stripe Enrollment Flow - ENHANCED WITH DUPLICATE PREVENTION
  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please log in to enroll.");
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }

    if (!course.id || !course.title || typeof course.price === "undefined") {
      toast.error("Course data is incomplete.");
      return;
    }

    // 🧩 FRONTEND DUPLICATE CHECK - PREVENT UNNECESSARY PAYMENT ATTEMPTS
    try {
      const alreadyEnrolled = await checkExistingEnrollment();
      if (alreadyEnrolled) {
        toast.error("You are already enrolled in this course!");
        return;
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
      // Continue with payment even if check fails (backend will catch duplicates)
    }

    // 🧩 ADDITIONAL CHECK: If already enrolled in state, block immediately
    if (isEnrolled) {
      toast.error("You are already enrolled in this course!");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Load Stripe
      const { loadStripe } = await import("@stripe/stripe-js");
      const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

      if (!stripePublicKey) {
        toast.error("Stripe public key not configured.");
        setIsLoading(false);
        return;
      }

      const stripe = await loadStripe(stripePublicKey);

      console.log("🔄 Creating checkout session for course:", course.id);

      // ✅ Create checkout session
      const res = await axiosInstance.post("/payments/create-checkout-session", {
        courseId: String(course.id),
      });

      if (!res.data.sessionId) {
        toast.error("No checkout session returned by server.");
        setIsLoading(false);
        return;
      }

      console.log("✅ Checkout session created:", res.data.sessionId);

      // ✅ Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: res.data.sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        
        // 🧩 Handle specific error cases
        if (error.message?.includes("already paid") || 
            error.message?.includes("duplicate") ||
            error.message?.includes("already enrolled")) {
          toast.error("You have already purchased this course!");
          // Refresh enrollment status
          const enrollmentStatus = await checkExistingEnrollment();
          setIsEnrolled(enrollmentStatus);
        } else {
          toast.error("Failed to open Stripe checkout page.");
        }
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      
      // 🧩 Handle duplicate payment error from backend
      if (err.response?.data?.error?.includes("already paid") || 
          err.response?.data?.error?.includes("duplicate") ||
          err.response?.data?.error?.includes("already enrolled")) {
        toast.error("You have already purchased this course!");
        // Refresh enrollment status
        const enrollmentStatus = await checkExistingEnrollment();
        setIsEnrolled(enrollmentStatus);
      } else {
        toast.error(
          err.response?.data?.error ||
            "Failed to initiate payment. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCourse = () => {
    if (!user) {
      toast.error("Please log in to access the course.");
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }

    if (user?.id === course.teacherId) {
      navigate(`/courses/${course.id}/manage`);
      return;
    }

    if (isEnrolled) {
      navigate(`/courses/${course.id}`);
    } else {
      toast.error("You are not enrolled in this course.");
    }
  };

  const canAccessCourse = isEnrolled || user?.id === course.teacherId;
  const isTeacher = user?.id === course.teacherId;

  return (
    <div className="course-card">
      {isLoading && (
        <div className="loading-overlay">
          <LoadingSpinner />
          <p>Processing enrollment...</p>
        </div>
      )}

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
        {isEnrolled && (
          <span className="enrolled-badge">✅ Enrolled</span>
        )}
      </div>

      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description || "No description available"}
        </p>

        <div className="course-meta">
          <span
            className={`difficulty-badge ${
              course.difficulty?.toLowerCase() || ""
            }`}
          >
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
              {isCheckingEnrollment
                ? "Checking..."
                : isTeacher
                ? "Manage Course"
                : "Start Course"}
            </button>
          ) : (
            user?.role === "student" && (
              <button
                className="btn btn-primary enroll-btn"
                onClick={handleEnroll}
                disabled={isLoading || isCheckingEnrollment}
              >
                {isLoading ? "Processing..." : 
                 isCheckingEnrollment ? "Checking..." : 
                 `Enroll Now - $${course.price}`}
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

        {/* 🧩 DUPLICATE PAYMENT WARNING */}
        {isEnrolled && user?.role === "student" && (
          <div className="enrollment-warning">
            <small>✅ You are already enrolled in this course</small>
          </div>
        )}
      </div>

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