// src/pages/CourseViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./CourseViewer.css";

const BACKEND_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  "https://mathe-class-website-backend-1.onrender.com";

const CourseViewer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log("Fetching course with slug:", slug);
        const res = await axios.get(
          `${BACKEND_BASE}/api/v1/courses/slug/${slug}`
        );

        if (!res.data?.success) {
          console.warn("Unexpected response shape:", res.data);
          throw new Error("Course fetch failed");
        }

        setCourse(res.data.course);
      } catch (err) {
        console.error("Fetch course error:", err);
        if (err.response?.status === 404) {
          toast.error("Course not found."); // slug likely invalid/missing
        } else {
          toast.error("You are not enrolled in this course or it failed to load.");
        }
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

      <ul className="lesson-list">
        {course.lessons && course.lessons.length > 0 ? (
          course.lessons.map((lesson) => (
            <li key={lesson.id} className="lesson">
              <h4>{lesson.title}</h4>

              {lesson.contentType === "text" && lesson.content && (
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
                <video controls width="100%" className="lesson-video">
                  <source src={lesson.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </li>
          ))
        ) : (
          <li>No lessons available for this course.</li>
        )}
      </ul>
    </div>
  );
};

export default CourseViewer;
