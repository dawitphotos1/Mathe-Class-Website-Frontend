// src/pages/PreviewLesson.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const response = await axiosInstance.get(`/lessons/${lessonId}`);
      if (response.data.success) {
        setLesson(response.data.lesson);
      } else {
        toast.error("Failed to load lesson");
        navigate("/courses");
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      toast.error("Unable to load lesson");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container">
        <div className="error">Lesson not found</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{lesson.title}</h1>
      <div className="lesson-content">
        {lesson.content_type === "video" && lesson.video_url && (
          <video controls className="lesson-video">
            <source src={lesson.video_url} type="video/mp4" />
          </video>
        )}
        {lesson.content_type === "text" && (
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        )}
        {lesson.content_type === "pdf" && lesson.file_url && (
          <iframe src={lesson.file_url} className="lesson-pdf" title="PDF" />
        )}
      </div>
      <button onClick={() => navigate(-1)} className="btn-back">
        Go Back
      </button>
    </div>
  );
};

export default PreviewLesson;