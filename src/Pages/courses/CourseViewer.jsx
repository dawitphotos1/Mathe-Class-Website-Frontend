// src/pages/CourseViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./CourseViewer.css";

const BACKEND_BASE =
  process.env.REACT_APP_API_BASE_URL || "https://mathe-class-website-backend-1.onrender.com";

const CourseViewer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEnrolledCourse = async () => {
      try {
        if (!token) {
          toast.error("You must be logged in to view this course.");
          return navigate("/login");
        }

        // ✅ Fetch enrolled course directly
        const res = await axios.get(
          `${BACKEND_BASE}/api/v1/courses/slug/${slug}/enrolled`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedCourse = res.data?.course || res.data;
        if (!fetchedCourse || !fetchedCourse.id) {
          throw new Error("Invalid course data received.");
        }

        setCourse(fetchedCourse);
      } catch (err) {
        console.error("❌ Failed to fetch enrolled course:", err);
        const status = err.response?.status;

        if (status === 404) {
          toast.error("❌ Course not found.");
        } else if (status === 403 || status === 401) {
          toast.error("❌ You're not authorized or not enrolled in this course.");
        } else {
          toast.error("❌ Failed to load the course.");
        }

        navigate("/my-courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourse();
  }, [slug, navigate, token]);

  if (loading) return <p>Loading course lessons...</p>;
  if (!course) return null;

  return (
    <div className="course-viewer">
      <h2>{course.title}</h2>

      <ul className="lesson-list">
        {Array.isArray(course.lessons) && course.lessons.length > 0 ? (
          course.lessons.map((lesson) => (
            <li key={lesson.id} className="lesson">
              <h4>{lesson.title}</h4>

              {lesson.contentType === "text" && lesson.content && (
                <div
                  className="lesson-content"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              )}

              {lesson.contentType === "file" && lesson.contentUrl && (
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
