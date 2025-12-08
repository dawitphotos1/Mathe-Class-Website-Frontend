
// src/Pages/StartCoursePage.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./StartCoursePage.css";

const StartCoursePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // ✅ Fetch course with lessons + teacher
        const res = await axios.get(`/courses/public/slug/${slug}`, {
          headers,
        });

        const courseData = res.data;
        if (!courseData?.id) {
          throw new Error("Invalid course data");
        }

        setCourse(courseData);

        // ✅ Progress fetch (if logged in)
        if (token) {
          const userId = JSON.parse(atob(token.split(".")[1])).id;
          const progressRes = await axios.get(`/progress/${userId}`, {
            headers,
          });
          const completed =
            progressRes.data?.progress?.map((p) => p.lessonId) || [];
          setCompletedLessons(completed);
        }

        setLoading(false);
      } catch (err) {
        console.error("🚨 Error loading course:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
        } else {
          setError("❌ Course not found or failed to load.");
        }
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, navigate]);

  const markComplete = async (lessonId) => {
    try {
      await axios.post(
        `/progress/complete`,
        { lessonId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      setCompletedLessons((prev) => [...new Set([...prev, lessonId])]);
      toast.success("✅ Lesson marked complete!");
    } catch {
      toast.error("❌ Failed to update progress");
    }
  };

  if (loading) return <div className="course-container">⏳ Loading course...</div>;
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
          src={
            course.thumbnail.startsWith("http")
              ? course.thumbnail
              : `${course.thumbnail}`
          }
          alt="Course Thumbnail"
          className="course-thumbnail"
        />
      )}

      {course.introVideoUrl && (
        <video className="course-video" controls>
          <source
            src={
              course.introVideoUrl.startsWith("http")
                ? course.introVideoUrl
                : `${course.introVideoUrl}`
            }
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
                  href={url.startsWith("http") ? url : `${url}`}
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
      {!course.lessons?.length ? (
        <p>⚠️ This course has no lessons yet.</p>
      ) : (
        course.lessons.map((lesson) => (
          <div className="lesson-card" key={lesson.id}>
            <h3 className="lesson-title">
              {lesson.isUnitHeader ? "📦 Unit: " : "📝 "} {lesson.title}
            </h3>

            {lesson.content && (
              <p className="lesson-description">{lesson.content}</p>
            )}

            {lesson.video_url && (
              <video className="lesson-video" controls>
                <source
                  src={
                    lesson.video_url.startsWith("http")
                      ? lesson.video_url
                      : `${lesson.video_url}`
                  }
                  type="video/mp4"
                />
              </video>
            )}

            {lesson.contentUrl && (
              <a
                href={
                  lesson.contentUrl.startsWith("http")
                    ? lesson.contentUrl
                    : `${lesson.contentUrl}`
                }
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
