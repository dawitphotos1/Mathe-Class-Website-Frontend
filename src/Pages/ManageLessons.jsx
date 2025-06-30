// src/pages/ManageLessons.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageLessons.css";

const ManageLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/v1/courses/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lessonList = res.data.units.flatMap((unit) => [
          { ...unit, isHeader: true },
          ...unit.lessons.map((l) => ({ ...l, unitName: unit.unitName })),
        ]);
        setLessons(lessonList);
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
      await axios.delete(`/api/v1/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("Lesson deleted");
    } catch (err) {
      toast.error("Failed to delete lesson");
    }
  };

  return (
    <div className="manage-lessons">
      <h2>Manage Lessons</h2>
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
    </div>
  );
};

export default ManageLessons;
