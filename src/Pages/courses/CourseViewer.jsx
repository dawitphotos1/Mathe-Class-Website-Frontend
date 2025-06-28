
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";
import "./CourseViewer.css";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CourseViewer = () => {
  const { slug: courseSlug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

  const token = localStorage.getItem("token");

  const markLessonAsComplete = async (lessonId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/progress/complete`,
        { lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedLessons((prev) => [...prev, lessonId]);
      console.log("✅ Completed Lessons:", completedLessons);
      console.log("✅ currentLesson ID:", currentLesson.id);

      toast.success("✅ Marked as complete");

      const allLessons = course.units.flatMap((u) => u.lessons || []);
      const index = allLessons.findIndex((l) => l.id === lessonId);
      const nextLesson = allLessons[index + 1];
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      } else {
        toast.info("🎉 You’ve completed all lessons!");
      }
    } catch (err) {
      console.error("Error marking complete:", err);
      toast.error("Failed to mark as complete");
    }
  };

  const markLessonAsIncomplete = async (lessonId) => {
    const confirm = window.confirm(
      "Are you sure you want to mark this as not complete?"
    );
    if (!confirm) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/progress/incomplete`,
        { lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedLessons((prev) => prev.filter((id) => id !== lessonId));
      toast.info("⏪ Marked as incomplete");
    } catch (err) {
      console.error("Error marking incomplete:", err);
      toast.error("Failed to mark as incomplete");
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!token) {
          toast.error("Please log in to view courses");
          navigate("/login");
          return;
        }

        const courseRes = await axios.get(
          `${API_BASE_URL}/api/v1/courses/slug/${courseSlug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = courseRes.data;

        const enrollmentRes = await axios.get(
          `${API_BASE_URL}/api/v1/enrollments/check/${data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let completed = [];
        if (enrollmentRes.data?.isEnrolled) {
          const completedRes = await axios.get(
            `${API_BASE_URL}/api/v1/progress/completed-lessons/${data.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          completed = completedRes.data?.completedLessons || [];
        }

        setIsEnrolled(enrollmentRes.data?.isEnrolled || false);
        setCompletedLessons(completed);

        const formatted = {
          ...data,
          id: data.id?.toString(),
          price: Number(data.price),
          teacher: {
            name: data.teacher?.name || "Unknown",
            profileImage: data.teacher?.profileImage || null,
          },
          units: Array.isArray(data.units) ? data.units : [],
        };

        setCourse(formatted);

        if (enrollmentRes.data?.isEnrolled && formatted.units.length > 0) {
          const firstLesson = formatted.units.find((u) => u.lessons?.length)
            ?.lessons[0];
          setCurrentLesson(firstLesson || null);
        }
      } catch (err) {
        toast.error("Failed to load course");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseSlug, navigate, token]);

  const handleEnroll = async () => {
    try {
      if (!token) {
        toast.error("Please log in to enroll");
        navigate("/login");
        return;
      }

      setEnrolling(true);

      const payload = {
        courseId: course.id,
        courseTitle: course.title,
        coursePrice: course.price,
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
    } catch (err) {
      toast.error("Enrollment failed");
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.contentType) {
      case "video":
        return (
          <div className="video-container">
            <iframe
              src={currentLesson.videoUrl}
              title={currentLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      case "text":
        return (
          <div
            className="text-content"
            dangerouslySetInnerHTML={{ __html: currentLesson.content }}
          />
        );
      case "document":
        return (
          <div className="document-viewer">
            <iframe
              src={currentLesson.contentUrl}
              title={`Document: ${currentLesson.title}`}
            />
          </div>
        );
      default:
        return <p>Unsupported content type</p>;
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (!course) return <div className="error-message">❌ Course not found</div>;

  return (
    <div className="course-viewer-container">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          {course.price > 0 && <span>${course.price.toFixed(2)}</span>}
          <span>Instructor: {course.teacher.name}</span>
          <span>{course.studentCount} students enrolled</span>
        </div>

        {!isEnrolled && (
          <button onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? "Processing..." : "Enroll Now"}
          </button>
        )}
      </div>

      {isEnrolled ? (
        <div className="course-content">
          <div className="units-sidebar">
            <h2>Course Content</h2>
            {course.units.map((unit, idx) => (
              <div key={idx}>
                <h3>{unit.unitName}</h3>
                <ul>
                  {unit.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className={`${
                        currentLesson?.id === lesson.id ? "active" : ""
                      } ${
                        completedLessons.includes(lesson.id) ? "completed" : ""
                      }`}
                      onClick={() => handleLessonSelect(lesson)}
                    >
                      {lesson.title}
                      {completedLessons.includes(lesson.id) && " ✓"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lesson-content">
            {currentLesson ? (
              <>
                <h2>{currentLesson.title}</h2>
                {renderLessonContent()}

                {/* ✅ Completion Toggle Buttons */}
                {/* <div
                  className="completion-controls"
                  style={{ marginTop: "1.5rem" }}
                >
                  {completedLessons.includes(currentLesson.id) ? (
                    <button
                      onClick={() => markLessonAsIncomplete(currentLesson.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      ❌ Not Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => markLessonAsComplete(currentLesson.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      ✅ Mark as Complete
                    </button>
                  )}
                </div> */}

                <div
                  className="completion-controls"
                  style={{ marginTop: "1rem" }}
                >
                  <p style={{ fontSize: "0.9rem", color: "#999" }}>
                    [Debug] This lesson ID: {currentLesson.id} <br />
                    Is in completedLessons? →{" "}
                    {completedLessons.includes(currentLesson.id)
                      ? "✅ YES"
                      : "❌ NO"}
                  </p>

                  {completedLessons.includes(currentLesson.id) ? (
                    <button
                      onClick={() => markLessonAsIncomplete(currentLesson.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      ❌ Not Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => markLessonAsComplete(currentLesson.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      ✅ Mark as Complete
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p>Select a lesson from the sidebar to begin</p>
            )}
          </div>
        </div>
      ) : (
        <div className="preview-content">
          <p>Preview available. Enroll to unlock full content.</p>
        </div>
      )}
    </div>
  );
};

export default CourseViewer;
