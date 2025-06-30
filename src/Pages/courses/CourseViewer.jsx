
// src/pages/CourseViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./CourseViewer.css";

const CourseViewer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/v1/courses/slug/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data.success) throw new Error("Unauthorized or not enrolled");
        setCourse(res.data);
      } catch (err) {
        toast.error("You are not enrolled in this course.");
        navigate("/my-courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug, navigate]);

  if (loading) return <p>Loading lessons...</p>;
  if (!course) return null;

  return (
    <div className="course-viewer">
      <h2>{course.title}</h2>
      {course.units.map((unit, i) => (
        <div key={i} className="unit">
          <h3>{unit.unitName}</h3>
          <ul className="lesson-list">
            {unit.lessons.map((lesson) => (
              <li key={lesson.id} className="lesson">
                <h4>{lesson.title}</h4>
                {lesson.contentType === "text" && (
                  <div
                    className="lesson-content"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                )}
                {lesson.contentType === "document" && lesson.contentUrl && (
                  <a
                    href={lesson.contentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="download-link"
                  >
                    📄 Download File
                  </a>
                )}
                {lesson.contentType === "video" && lesson.videoUrl && (
                  <video
                    controls
                    width="100%"
                    className="lesson-video"
                  >
                    <source src={lesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CourseViewer;

