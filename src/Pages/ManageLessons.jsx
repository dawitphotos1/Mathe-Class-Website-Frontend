// src/pages/ManageLessons.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageLessons.css";

const BASE_URL = "https://mathe-class-website-backend-1.onrender.com";

const ManageLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewText, setPreviewText] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/api/v1/lessons/${courseId}/lessons`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLessons(res.data.lessons || []);
      } catch (err) {
        toast.error("Failed to fetch lessons");
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/v1/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("Lesson deleted");
    } catch (err) {
      toast.error("Failed to delete lesson");
    }
  };

  const handlePreview = (lesson) => {
    if (lesson.contentType === "video" && lesson.videoUrl) {
      window.open(lesson.videoUrl, "_blank");
    } else if (lesson.contentType === "file" && lesson.contentUrl) {
      window.open(`${BASE_URL}${lesson.contentUrl}`, "_blank");
    } else if (lesson.contentType === "text" && lesson.content) {
      setPreviewText(lesson.content);
    }
  };

  const closePreviewModal = () => setPreviewText(null);

  return (
    <div className="manage-lessons">
      <h2>📚 Manage Lessons</h2>
      <Link to={`/courses/${courseId}/lessons/new`} className="create-btn">
        ➕ Create New Lesson
      </Link>

      {loading ? (
        <p>Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <ul className="lesson-list">
          {lessons.map((lesson, idx) => (
            <li
              key={idx}
              className={lesson.isUnitHeader ? "unit-header" : "lesson-item"}
            >
              <strong>{lesson.title}</strong>
              {!lesson.isUnitHeader && (
                <>
                  <span className="badge">{lesson.contentType}</span>
                  <div className="actions">
                    <button onClick={() => handlePreview(lesson)}>
                      👁️ Preview
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(
                          `/courses/${courseId}/lessons/${lesson.id}/edit`
                        )
                      }
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Text Preview Modal */}
      {previewText && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closePreviewModal}>
              ❌ Close
            </button>
            <div
              className="text-preview"
              dangerouslySetInnerHTML={{ __html: previewText }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLessons;
