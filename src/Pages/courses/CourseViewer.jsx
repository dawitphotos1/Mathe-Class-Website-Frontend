// Mathe-Class-Website-Frontend/src/Pages/courses/CourseViewer.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CourseViewer = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch course on load
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view courses");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const courseData = response.data;
        const formatted = {
          id: courseData.id?.toString(),
          name: courseData.title?.toString(),
          price: parseFloat(courseData.price) || 0,
          description: courseData.description || "No description available",
          teacher: courseData.teacher?.name || "Unknown",
        };

        if (!formatted.id || !formatted.name) {
          throw new Error("Invalid course data");
        }

        setCourse(formatted);
        setLoadingCourse(false);
      } catch (err) {
        console.error("❌ Fetch course error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load course");
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  // ✅ Handle enrollment via Stripe
  const handleEnroll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to enroll");
      navigate("/login");
      return;
    }

    if (!course || !course.id || !course.name || isNaN(course.price)) {
      console.error("🚫 Invalid course object:", course);
      toast.error("Course data not loaded properly");
      return;
    }

    setEnrolling(true);

    try {
      const payload = {
        courseId: course.id,
        courseTitle: course.name, // ✅ CORRECT
        coursePrice: course.price,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (err) {
      console.error("❌ Enroll error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Enrollment failed");
      setEnrolling(false);
    }
  };

  // ✅ UI Rendering

  if (loadingCourse) return <div>Loading course...</div>;
  if (error) return <div className="error">❌ {error}</div>;
  if (!course) return <div>⚠️ Course not found</div>;

  return (
    <div className="course-view-container">
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <p>Price: ${course.price.toFixed(2)}</p>
      <p>Instructor: {course.teacher}</p>
      <button
        onClick={handleEnroll}
        className="enroll-button"
        disabled={enrolling}
      >
        {enrolling ? "⏳ Enrolling..." : "Enroll Now"}
      </button>
    </div>
  );
};

export default CourseViewer;
