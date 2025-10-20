 // src/components/CourseCard.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../hooks/usePayment";
import axiosInstance from "../../utils/axiosInstance";
import "./CourseCard.css";

const CourseCard = ({ course, onCourseDeleted }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createCheckout, processing } = usePayment();

  // DEBUG: Log course data to verify price
  console.log("🔍 CourseCard received:", {
    title: course?.title,
    price: course?.price,
    priceType: typeof course?.price,
    fullCourse: course,
  });

  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check enrollment status
  useEffect(() => {
    let isMounted = true;

    const checkEnrollmentStatus = async () => {
      if (!user || !course?.id) return;
      try {
        setIsCheckingEnrollment(true);
        const res = await axiosInstance.get(`/enrollments/check/${course.id}`);
        if (isMounted) setIsEnrolled(res.data.enrolled || false);
      } catch (err) {
        if (isMounted) setIsEnrolled(false);
        console.error("Error checking enrollment:", err);
      } finally {
        if (isMounted) setIsCheckingEnrollment(false);
      }
    };

    checkEnrollmentStatus();
    return () => (isMounted = false);
  }, [user, course?.id]);

  // FIXED: Enhanced price extraction with fallbacks
  const getDisplayPrice = () => {
    if (!course) {
      console.log("❌ No course object");
      return "0.00";
    }

    // Try multiple price locations
    const price = course.price;
    console.log("💰 Raw price value:", price);

    if (price === undefined || price === null) {
      console.log("⚠️ Price is undefined/null, using fallback");

      // Fallback prices based on course title
      const priceMap = {
        "Algebra 1": "1200.00",
        "Algebra 2": "1200.00",
        "Pre-Calculus": "1200.00",
        Calculus: "1250.00",
        "Geometry & Trigonometry": "1250.00",
        "Statistics & Probability": "1250.00",
      };

      const fallbackPrice = priceMap[course.title] || "0.00";
      console.log("🎯 Using fallback price:", fallbackPrice);
      return fallbackPrice;
    }

    // Convert to proper format
    const formattedPrice = parseFloat(price).toFixed(2);
    console.log("✅ Using actual price:", formattedPrice);
    return formattedPrice;
  };

  const displayPrice = getDisplayPrice();

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to enroll.");
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }

    if (!course.id || !course.title) {
      toast.error("Course data is incomplete.");
      return;
    }

    if (isEnrolled) {
      toast.error("You are already enrolled in this course!");
      return;
    }

    console.log("🔄 Starting payment process for course:", course.id);
    try {
      await createCheckout(course.id);
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const handleStartCourse = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to access the course.");
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }

    if (user?.id === course.teacher_id) {
      navigate(`/courses/${course.id}/manage`);
      return;
    }

    if (isEnrolled) {
      navigate(`/courses/${course.id}/view-lessons`);
    } else {
      toast.error("You are not enrolled in this course.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/courses/${course.id}`);
      toast.success("Course deleted successfully");
      if (onCourseDeleted) onCourseDeleted(course.id);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete course");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const canAccessCourse = isEnrolled || user?.id === course.teacher_id;
  const isTeacher = user?.role === "teacher";

  // Get course image based on title
  const getCourseImage = (courseTitle) => {
    const images = {
      "Algebra 1": "/images/math-logos/algebra1.jpeg",
      "Algebra 2": "/images/math-logos/algebra2.png",
      "Pre-Calculus": "/images/math-logos/Pre-calculus.jpeg",
      Calculus: "/images/math-logos/Calculus.jpeg",
      "Geometry & Trigonometry": "/images/math-logos/geometry.jpeg",
      "Statistics & Probability": "/images/math-logos/statistic.png",
    };

    return images[courseTitle] || "/images/default-course.jpg";
  };

  return (
    <div className="course-card">
      <div className="course-image">
        <img
          src={getCourseImage(course.title)}
          alt={course.title}
          onError={(e) => {
            e.target.src = "/images/default-course.jpg";
          }}
        />
        {isEnrolled && <div className="enrolled-badge">Enrolled</div>}
      </div>

      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description ||
            "Learn essential mathematical concepts and techniques."}
        </p>

        {course.teacher && (
          <p className="course-instructor">
            <strong>Instructor:</strong> {course.teacher.name}
          </p>
        )}

        <div className="course-price">${displayPrice}</div>

        <div className="course-actions">
          <button
            onClick={handleEnroll}
            className="btn-enroll"
            disabled={isCheckingEnrollment || isEnrolled || processing}
          >
            {processing
              ? "Processing..."
              : isCheckingEnrollment
              ? "Checking..."
              : isEnrolled
              ? "Enrolled"
              : `ENROLL NOW - $${displayPrice}`}
          </button>

          <Link
            to={`/courses/${course.slug || course.id}`}
            className="btn-details"
          >
            View Details
          </Link>

          {canAccessCourse && (
            <button onClick={handleStartCourse} className="btn-start">
              {isTeacher ? "Manage Course" : "Start Learning"}
            </button>
          )}

          {isTeacher && user?.id === course.teacher_id && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-delete"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete "{course.title}"? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-danger">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;