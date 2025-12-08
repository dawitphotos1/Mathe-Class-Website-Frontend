
//Components/
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // adjust the path accordingly
import "./ClassPage.css";

const getFileIcon = (url) => {
  if (!url) return "📁";
  if (url.endsWith(".pdf")) return "📄";
  if (url.endsWith(".mp4") || url.includes("video")) return "🎬";
  if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return "🖼️";
  return "📎";
};

const ClassPage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [expandedUnits, setExpandedUnits] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Use axiosInstance instead of axios
        const enrolledRes = await axiosInstance.get("/enrollments/my-courses");

        const matched = enrolledRes.data.courses.find((c) => c.slug === slug);
        if (!matched) {
          setError("Course not found or not enrolled.");
          setLoading(false);
          return;
        }
        setCourse(matched);

        const lessonsRes = await axiosInstance.get(
          `/lessons/course/${matched.id}/lessons`
        );

        const grouped = lessonsRes.data.lessons.reduce((acc, lesson) => {
          const unit = lesson.unitTitle || "General";
          if (!acc[unit]) acc[unit] = [];
          acc[unit].push(lesson);
          return acc;
        }, {});

        setLessons(grouped);
        setExpandedUnits(
          Object.keys(grouped).reduce((acc, unit) => {
            acc[unit] = true;
            return acc;
          }, {})
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load course or lessons.");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) return <div className="class-loading">Loading...</div>;
  if (error) return <div className="class-error">{error}</div>;
  if (!course) return null;

  return (
    <div className="class-page">
      <h2>{course.title}</h2>
      <p className="class-description">{course.description}</p>

      <div className="lesson-list">
        {Object.entries(lessons).map(([unit, unitLessons]) => (
          <div className="unit-section" key={unit}>
            <div
              className="unit-toggle"
              onClick={() =>
                setExpandedUnits((prev) => ({
                  ...prev,
                  [unit]: !prev[unit],
                }))
              }
            >
              {expandedUnits[unit] ? "▼" : "►"} {unit}
            </div>

            {expandedUnits[unit] && (
              <div className="unit-lessons">
                {unitLessons.map((lesson) => (
                  <div className="lesson-item with-thumbnail" key={lesson.id}>
                    {lesson.contentUrl && (
                      <img
                        className="lesson-thumb"
                        src={
                          lesson.contentUrl.endsWith(".mp4")
                            ? "/images/video-thumb.jpg"
                            : "/images/pdf-thumb.jpg"
                        }
                        alt="thumb"
                      />
                    )}
                    <div className="lesson-content">
                      <h4>
                        {getFileIcon(lesson.contentUrl)} {lesson.title}
                        {lesson.contentType !== "text" && (
                          <span
                            className="preview-icon"
                            onClick={() => setPreview(lesson)}
                          >
                            🔍
                          </span>
                        )}
                      </h4>
                      {lesson.contentType === "text" && <p>{lesson.text}</p>}
                      {lesson.contentType === "video" && lesson.videoUrl && (
                        <video
                          className="lesson-video"
                          controls
                          src={lesson.videoUrl}
                        ></video>
                      )}
                      {lesson.contentType === "file" && lesson.contentUrl && (
                        <a
                          href={lesson.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lesson-download"
                        >
                          Download File
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setPreview(null)}>
              ✖
            </span>
            {preview.contentType === "file" &&
            preview.contentUrl.endsWith(".pdf") ? (
              <iframe
                src={preview.contentUrl}
                className="preview-pdf"
                title="Preview PDF"
              />
            ) : preview.contentType === "video" ? (
              <video
                className="preview-video"
                controls
                src={preview.videoUrl}
              ></video>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;
