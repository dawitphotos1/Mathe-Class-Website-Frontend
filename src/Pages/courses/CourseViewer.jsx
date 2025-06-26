
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

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view courses");
          navigate("/login");
          return;
        }

        // Fetch course details
        const courseRes = await axios.get(
          `${API_BASE_URL}/api/v1/courses/slug/${courseSlug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!courseRes.data?.success) {
          throw new Error("Invalid course response format");
        }

        const data = courseRes.data;

        // Check enrollment status
        const enrollmentRes = await axios.get(
          `${API_BASE_URL}/api/v1/enrollments/check/${data.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch completed lessons if enrolled
        let completed = [];
        if (enrollmentRes.data?.isEnrolled) {
          const completedRes = await axios.get(
            `${API_BASE_URL}/api/v1/progress/completed-lessons/${data.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          completed = completedRes.data?.completedLessons || [];
        }

        const formatted = {
          id: data.id?.toString(),
          title: data.title ?? "Untitled Course",
          price: Number(data.price) || 0,
          description: data.description || "No description available.",
          studentCount: data.studentCount || 0,
          introVideoUrl: data.introVideoUrl || null,
          thumbnail: data.thumbnail || null,
          teacher: {
            name: data.teacher?.name || "Unknown Instructor",
            profileImage: data.teacher?.profileImage || null,
          },
          units: Array.isArray(data.units) ? data.units : [],
        };

        setIsEnrolled(enrollmentRes.data?.isEnrolled || false);
        setCourse(formatted);
        setCompletedLessons(completed);

        // Set first lesson as default if enrolled
        if (enrollmentRes.data?.isEnrolled && formatted.units.length > 0) {
          const firstUnitWithLessons = formatted.units.find(
            (unit) => unit.lessons?.length > 0
          );
          if (firstUnitWithLessons) {
            setCurrentLesson(firstUnitWithLessons.lessons[0]);
          }
        }
      } catch (err) {
        console.error(
          "❌ Error loading course:",
          err.response?.data || err.message
        );
        toast.error(err.response?.data?.error || "Failed to load course");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseSlug, navigate]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to enroll");
        navigate("/login");
        return;
      }

      if (!course?.id || isNaN(course.price)) {
        toast.error("Invalid course data for enrollment");
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
          withCredentials: true,
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
    } catch (err) {
      console.error("❌ Enroll error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Enrollment failed");
      setEnrolling(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    // Mark lesson as viewed if not already completed
    if (!completedLessons.includes(lesson.id)) {
      markLessonAsCompleted(lesson.id);
    }
  };

  const markLessonAsCompleted = async (lessonId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `${API_BASE_URL}/api/v1/progress/complete-lesson`,
        { lessonId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCompletedLessons([...completedLessons, lessonId]);
    } catch (err) {
      console.error("Error marking lesson as completed:", err);
    }
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
          {course.price > 0 && (
            <span className="course-price">${course.price.toFixed(2)}</span>
          )}
          <span className="course-teacher">
            Instructor: {course.teacher.name}
          </span>
          <span className="course-stats">
            {course.studentCount} students enrolled
          </span>
        </div>

        {!isEnrolled && (
          <div className="course-actions">
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="enroll-btn"
            >
              {enrolling ? "Processing..." : "Enroll Now"}
            </button>
          </div>
        )}
      </div>

      {isEnrolled ? (
        <div className="course-content">
          <div className="units-sidebar">
            <h2>Course Content</h2>
            {course.units.length === 0 ? (
              <p>No content available yet.</p>
            ) : (
              course.units.map((unit, idx) => (
                <div key={idx} className="unit-section">
                  <h3>{unit.unitName}</h3>
                  <ul className="lessons-list">
                    {unit.lessons?.length ? (
                      unit.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className={`
                            ${currentLesson?.id === lesson.id ? "active" : ""}
                            ${
                              completedLessons.includes(lesson.id)
                                ? "completed"
                                : ""
                            }
                          `}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          {lesson.title}
                          {lesson.isPreview && (
                            <span className="preview-badge">Preview</span>
                          )}
                          {completedLessons.includes(lesson.id) && (
                            <span className="completed-badge">✓</span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li>No lessons in this unit.</li>
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>

          <div className="lesson-content">
            {currentLesson ? (
              <>
                <h2>{currentLesson.title}</h2>
                {renderLessonContent()}

                {/* Navigation buttons */}
                <div className="lesson-navigation">
                  <button
                    className="nav-button prev"
                    onClick={() => {
                      // Logic to find and set previous lesson
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    className="nav-button next"
                    onClick={() => {
                      // Logic to find and set next lesson
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <div className="no-lesson-selected">
                <p>Select a lesson from the sidebar to begin</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="preview-content">
          <h2>Course Preview</h2>
          {course.units.length > 0 && (
            <>
              <p>
                This course contains {course.units.length} units with lessons.
              </p>
              <p>Enroll to access all content.</p>

              {/* Show preview lessons if any */}
              {course.units.some((unit) =>
                unit.lessons?.some((lesson) => lesson.isPreview)
              ) && (
                <>
                  <h3>Preview Lessons</h3>
                  {course.units.map((unit) =>
                    unit.lessons
                      ?.filter((lesson) => lesson.isPreview)
                      .map((lesson) => (
                        <div key={lesson.id} className="lesson-card">
                          <h4>{lesson.title}</h4>
                          {lesson.contentType === "video" &&
                            lesson.videoUrl && (
                              <div className="video-container">
                                <iframe
                                  src={lesson.videoUrl}
                                  title={lesson.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            )}
                          {lesson.content && (
                            <div
                              className="text-content"
                              dangerouslySetInnerHTML={{
                                __html: lesson.content,
                              }}
                            />
                          )}
                        </div>
                      ))
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseViewer;