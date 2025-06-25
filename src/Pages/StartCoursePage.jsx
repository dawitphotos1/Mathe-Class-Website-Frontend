import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./StartCoursePage.css";

const StartCoursePage = () => {
  const { slug } = useParams();
  const [courseId, setCourseId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        const token = localStorage.getItem("token");

        // Step 1: Get course info by slug
        const courseRes = await axios.get(
          `${API_BASE_URL}/api/v1/courses/slug/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const id = courseRes.data.id;
        setCourseId(id);

        // Step 2: Fetch lessons
        const lessonRes = await axios.get(
          `${API_BASE_URL}/api/v1/lessons/courses/${id}/lessons`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLessons(lessonRes.data.lessons || []);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error loading course:",
          err.response?.data || err.message
        );

        setError("Failed to load course or lessons.");
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [slug]);

  if (loading)
    return <div className="course-container">⏳ Loading course...</div>;
  if (error) return <div className="course-container error">❌ {error}</div>;
  if (!lessons.length)
    return (
      <div className="course-container">
        📭 No lessons available for this course yet.
      </div>
    );

  return (
    <div className="course-container">
      <h1 className="course-title">
        📘 Welcome to the course: {slug.replace(/-/g, " ")}
      </h1>
      {lessons.map((lesson) => (
        <div className="lesson-card" key={lesson.id}>
          <h3 className="lesson-title">{lesson.title}</h3>

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
        </div>
      ))}
    </div>
  );
};

export default StartCoursePage;
