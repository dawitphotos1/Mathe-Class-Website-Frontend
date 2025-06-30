// components/StudentCourseView.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const StudentCourseView = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Organize lessons into units
        const lessons = response.data.lessons || [];
        const unitHeaders = lessons.filter((lesson) => lesson.isUnitHeader);

        const organizedUnits = unitHeaders.map((header) => ({
          ...header,
          lessons: lessons.filter(
            (lesson) => lesson.unitId === header.id && !lesson.isUnitHeader
          ),
        }));

        setCourse(response.data);
        setUnits(organizedUnits);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-container">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        {course.introVideoUrl && (
          <div className="intro-video">
            <video controls src={course.introVideoUrl} />
          </div>
        )}
      </div>

      <div className="units-container">
        {units.map((unit) => (
          <div key={unit.id} className="unit-section">
            <h2>{unit.title}</h2>
            <div className="lessons-list">
              {unit.lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-card">
                  <h3>{lesson.title}</h3>

                  {lesson.contentType === "text" && (
                    <div className="text-content">{lesson.content}</div>
                  )}

                  {lesson.contentType === "video" && (
                    <div className="video-content">
                      {lesson.videoUrl ? (
                        <video controls src={lesson.videoUrl} />
                      ) : (
                        <p>Video content not available</p>
                      )}
                    </div>
                  )}

                  {lesson.contentType === "file" && (
                    <div className="file-content">
                      <a
                        href={lesson.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download File
                      </a>
                    </div>
                  )}

                  <div className="lesson-actions">
                    <button className="complete-btn">Mark as Complete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourseView;
