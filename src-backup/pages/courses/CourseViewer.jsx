
// CourseViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
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
        // ✅ Use the correct endpoint - try both public and regular endpoints
        let fetchedCourse;
        try {
          const res = await axiosInstance.get(`/courses/public/slug/${slug}`);
          fetchedCourse = res.data;
        } catch (publicErr) {
          // If public endpoint fails, try the regular endpoint
          console.log("Public endpoint failed, trying regular endpoint...");
          const res = await axiosInstance.get(`/courses/${slug}`);
          fetchedCourse = res.data;
        }

        if (!fetchedCourse || !fetchedCourse.id) {
          throw new Error("Invalid course data received.");
        }

        setCourse(fetchedCourse);
      } catch (err) {
        console.error("❌ Failed to fetch course:", err);
        const status = err.response?.status;

        if (status === 404) {
          toast.error("❌ Course not found.");
        } else {
          toast.error("❌ Failed to load the course.");
        }

        navigate("/courses"); // fallback to course list
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, navigate]);

  if (loading) return <p>Loading course lessons...</p>;
  if (!course) return null;

  return (
    <div className="course-viewer">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

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