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
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch course by slug
        const courseRes = await axios.get(
          `${API_BASE_URL}/api/v1/courses/slug/${slug}`,
          { headers }
        );
        const courseData = courseRes.data;

        if (!courseData?.id) {
          throw new Error("Invalid course data");
        }

        setCourse(courseData);

        // Fetch lessons
        const lessonRes = await axios.get(
          `${API_BASE_URL}/api/v1/courses/${courseData.id}/lessons`,
          { headers }
        );
        setLessons(lessonRes.data.lessons || []);

        // Fetch completed progress
        const userId = JSON.parse(atob(token.split(".")[1])).id;
        const progressRes = await axios.get(
          `${API_BASE_URL}/api/v1/progress/${userId}`,
          { headers }
        );
        const completed =
          progressRes.data?.progress?.map((p) => p.lessonId) || [];
        setCompletedLessons(completed);

        setLoading(false);
      } catch (err) {
        console.error("🚨 Error loading course or lessons:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
        } else {
          setError("❌ Course not found or failed to load.");
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
      toast.success("✅ Lesson marked complete!");
    } catch {
      toast.error("❌ Failed to update progress");
    }
  };

  if (loading)
    return <div className="course-container">⏳ Loading course...</div>;
  if (error) return <div className="course-container error">{error}</div>;

  return (
    <div className="course-container">
      <h1 className="course-title">📘 {course.title}</h1>
      {course.description && (
        <p className="course-description">{course.description}</p>
      )}

      {course.teacher && (
        <p className="course-teacher">
          👨‍🏫 <strong>Instructor:</strong> {course.teacher.name} (
          {course.teacher.email})
        </p>
      )}

      {course.thumbnail && (
        <img
          src={`${API_BASE_URL}${course.thumbnail}`}
          alt="Course Thumbnail"
          className="course-thumbnail"
        />
      )}

      {course.introVideoUrl && (
        <video className="course-video" controls>
          <source
            src={`${API_BASE_URL}${course.introVideoUrl}`}
            type="video/mp4"
          />
        </video>
      )}

      {course.attachmentUrls?.length > 0 && (
        <div className="course-attachments">
          <h3>📎 Attachments:</h3>
          <ul>
            {course.attachmentUrls.map((url, i) => (
              <li key={i}>
                <a
                  href={`${API_BASE_URL}${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Download file {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr />
      <h2>📚 Lessons</h2>
      {!lessons.length ? (
        <p>⚠️ This course has no lessons yet.</p>
      ) : (
        lessons.map((lesson) => (
          <div className="lesson-card" key={lesson.id}>
            <h3 className="lesson-title">
              {lesson.isUnitHeader ? "📦 Unit: " : "📝 "} {lesson.title}
            </h3>

            {lesson.content && (
              <p className="lesson-description">{lesson.content}</p>
            )}

            {lesson.videoUrl && (
              <video className="lesson-video" controls>
                <source src={lesson.videoUrl} type="video/mp4" />
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
        ))
      )}
    </div>
  );
};

export default StartCoursePage;
