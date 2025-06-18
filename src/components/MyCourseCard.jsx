
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import CourseModal from "./CourseModal";
import "./MyCourseCard.css";

const MyCourseCard = ({ course, tab, onGoToClass }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(course.isFavorite || false);

  const toggleFavorite = async () => {
    try {
      const updated = !isFavorite;
      setIsFavorite(updated);
      await axios.patch(`/api/v1/courses/${course.id}/favorite`, {
        favorite: updated,
      });
    } catch (err) {
      console.error("Failed to update favorite", err);
      setIsFavorite(!isFavorite); // revert if failed
    }
  };

  return (
    <>
      <motion.div
        className={`course-card ${tab}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="thumbnail-wrapper"
          onClick={() => setShowModal(true)}
          title="Click to view details"
        >
          {!imgLoaded && <div className="shimmer-box" />}
          <img
            src={course.thumbnail}
            alt={course.title}
            className={`course-thumbnail ${imgLoaded ? "" : "hidden"}`}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default.jpg";
              setImgLoaded(true);
            }}
          />
        </div>

        <div className="course-details">
          <h4>{course.title}</h4>
          <p>{course.description}</p>

          <span className="category-badge">{course.category}</span>

          <span
            className={`difficulty-badge ${
              course.difficulty?.toLowerCase() || "unknown"
            }`}
          >
            {course.difficulty || "N/A"}
          </span>

          {tab === "approved" ? (
            <div className="progress-wrapper">
              <span className="favorite-icon" onClick={toggleFavorite}>
                {isFavorite ? (
                  <AiFillStar color="#f1c40f" />
                ) : (
                  <AiOutlineStar />
                )}
              </span>
              <div className="linear-progress">
                <div
                  className="linear-fill"
                  style={{ width: `${course.progress}%` }}
                  title={`${course.progress}%`}
                ></div>
              </div>
              <button
                className="go-to-class"
                onClick={() => onGoToClass(course.slug)}
              >
                Go to Class
              </button>
            </div>
          ) : (
            <span className="badge">⏳ Awaiting Approval</span>
          )}

          <button className="go-to-class" onClick={() => setShowModal(true)}>
            <FaEye style={{ marginRight: 6 }} /> View Details
          </button>
        </div>
      </motion.div>

      {showModal && (
        <CourseModal course={course} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default MyCourseCard;
