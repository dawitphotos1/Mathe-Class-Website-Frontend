
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import "./StartCoursePage.css";

const StartCoursePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to access this course.");
          setLoading(false);
          navigate("/login");
          return;
        }

        // Get course info by slug
        const courseRes = await axios.get(
          `${API_BASE_URL}/api/v1/courses/slug/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const courseData = courseRes.data;
        if (!courseData) {
          setError(
            "Course not found. Please check the course slug or contact support."
          );
          setLoading(false);
          return;
        }
        setCourse(courseData);

        // Get lessons
        const lessonRes = await axios.get(
          `${API_BASE_URL}/api/v1/courses/${courseData.id}/lessons`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const flatLessons = lessonRes.data.units.flatMap((unit) => [
          {
            id: `unit-${unit.unitName}`,
            title: unit.unitName,
            isUnitHeader: true,
          },
          ...unit.lessons.map((lesson) => ({ ...lesson, isUnitHeader: false })),
        ]);

        setLessons(flatLessons);

        // Get progress
        const userId = JSON.parse(atob(token.split(".")[1])).id;
        const progressRes = await axios.get(
          `${API_BASE_URL}/api/v1/progress/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const completed = progressRes.data.progress.map((p) => p.lessonId);
        setCompletedLessons(completed);

        setLoading(false);
      } catch (err) {
        console.error("Error loading course:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
        } else if (err.response?.status === 404) {
          setError(
            "Course not found. Please check the course slug or contact support."
          );
        } else {
          setError("Failed to load course or lessons. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [slug, navigate]);

  const markComplete = async (lessonId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/progress/complete`,
        { lessonId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCompletedLessons((prev) => [...new Set([...prev, lessonId])]);
      toast.success("Lesson marked complete!");
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  if (loading) {
    return <div className="course-container">⏳ Loading course...</div>;
  }

  if (error) {
    return <div className="course-container error">❌ {error}</div>;
  }

  if (!course || !lessons.length) {
    return (
      <div className="course-container">
        📭 No lessons available for this course yet.
      </div>
    );
  }

  return (
    <div className="course-container">
      <h1 className="course-title">📘 {course.title}</h1>
      <div className="lessons-list">
        {lessons.map((lesson) => (
          <div className="lesson-card" key={lesson.id}>
            <h3 className="lesson-title">
              {lesson.isUnitHeader ? "📚 Unit: " : "📝 "} {lesson.title}
            </h3>
            {lesson.content && (
              <p className="lesson-description">{lesson.content}</p>
            )}
            {lesson.videoUrl && (
              <video className="lesson-video" controls>
                <source src={lesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {lesson.contentUrl && (
              <a
                href={lesson.contentUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="lesson-download"
              >
                ⬇️ Download Material
              </a>
            )}
            {!lesson.isUnitHeader && (
              <button
                onClick={() => markComplete(lesson.id)}
                disabled={completedLessons.includes(lesson.id)}
              >
                {completedLessons.includes(lesson.id)
                  ? "✅ Completed"
                  : "Mark as Complete"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartCoursePage;