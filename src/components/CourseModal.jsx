
import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyCourseCard.css";

const CourseModal = ({ course, onClose }) => {
  const navigate = useNavigate();
  const images = course.images?.length ? course.images : [course.thumbnail];
  const [index, setIndex] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIndex((i) => (i + 1) % images.length),
    onSwipedRight: () =>
      setIndex((i) => (i - 1 + images.length) % images.length),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get(`/api/v1/courses/${course.id}/lessons`);
        setLessons(res.data || []);
      } catch (err) {
        console.error("Failed to load lessons", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [course.id]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✖
        </button>

        <div className="carousel" {...swipeHandlers}>
          <img src={images[index]} alt={`Course image ${index + 1}`} />
          {images.length > 1 && (
            <>
              <button
                className="carousel-nav prev"
                onClick={() =>
                  setIndex((i) => (i - 1 + images.length) % images.length)
                }
              >
                ‹
              </button>
              <button
                className="carousel-nav next"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
              >
                ›
              </button>
            </>
          )}
        </div>

        <h2>{course.title}</h2>
        <p>
          <strong>Category:</strong> {course.category}
        </p>
        <p>
          <strong>Difficulty:</strong> {course.difficulty}
        </p>
        <p>
          <strong>Description:</strong> {course.description}
        </p>
        <p>
          <strong>Progress:</strong> {course.progress}%
        </p>

        <h4>Lessons</h4>
        {loading ? (
          <p>Loading lessons...</p>
        ) : lessons.length > 0 ? (
          <ul className="lessons-list">
            {lessons.map((lesson) => (
              <li key={lesson.id}>📘 {lesson.title}</li>
            ))}
          </ul>
        ) : (
          <p>No lessons available</p>
        )}

        <button
          className="go-to-class"
          onClick={() => navigate(`/class/${course.slug}`)}
        >
          ▶️ Start Course
        </button>
      </div>
    </div>
  );
};

export default CourseModal;

