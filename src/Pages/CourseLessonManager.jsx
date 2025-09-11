import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import "./CourseLessonManager.css";

const BASE_URL = "https://mathe-class-website-backend-1.onrender.com";

const CourseLessonManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const fetchLessons = useCallback(async () => {
    try {
      const res = await api.get(`/lessons/${courseId}/lessons`);
      setLessons(res.data.lessons);
    } catch (err) {
      toast.error("❌ Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const fetchCourseDetails = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch {
      toast.error("❌ Failed to load course info");
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
    fetchCourseDetails();
  }, [fetchLessons, fetchCourseDetails]);

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      toast.success("🗑️ Lesson deleted");
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  const startEditing = (lesson) => {
    setEditingLesson(lesson.id);
    setEditedTitle(lesson.title);
  };

  const cancelEditing = () => {
    setEditingLesson(null);
    setEditedTitle("");
  };

  const saveTitle = async (lessonId) => {
    try {
      await api.put(`/lessons/${lessonId}`, { title: editedTitle });
      toast.success("✏️ Lesson title updated");

      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, title: editedTitle } : l))
      );
      cancelEditing();
    } catch {
      toast.error("❌ Failed to update title");
    }
  };

  return (
    <div className="lesson-manager">
      <h2>📘 Manage Lessons for Course</h2>
      {course && <h3>{course.title}</h3>}

      <div className="lesson-actions">
        <Link to={`/courses/${courseId}/lessons/new`}>
          <button className="btn-create">➕ Create Lesson</button>
        </Link>
        <button className="btn-back" onClick={() => navigate(-1)}>
          🔙 Back
        </button>
      </div>

      {loading ? (
        <p>Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <ul className="lesson-list">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="lesson-item">
              <div className="lesson-info">
                {editingLesson === lesson.id ? (
                  <>
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="lesson-edit-input"
                    />
                    <button onClick={() => saveTitle(lesson.id)}>
                      💾 Save
                    </button>
                    <button onClick={cancelEditing}>❌ Cancel</button>
                  </>
                ) : (
                  <>
                    <strong>{lesson.title}</strong> — {lesson.contentType}
                    {lesson.contentType === "file" && lesson.contentUrl && (
                      <>
                        {" "}
                        —{" "}
                        <a
                          href={`${BASE_URL}${lesson.contentUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📄 View PDF
                        </a>
                      </>
                    )}
                    {lesson.contentType === "text" && (
                      <span className="preview-inline"> — 📝 Text Content</span>
                    )}
                    {lesson.contentType === "video" && (
                      <span className="preview-inline">
                        {" "}
                        — 🎥 Video Content
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="lesson-controls">
                {editingLesson !== lesson.id && (
                  <button onClick={() => startEditing(lesson)}>✏️ Edit</button>
                )}
                <button onClick={() => handleDelete(lesson.id)}>
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseLessonManager;
