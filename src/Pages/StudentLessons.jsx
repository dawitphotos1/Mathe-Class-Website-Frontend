// src/pages/StudentLessons.jsx (renamed from ManageLessons.jsx)
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from '../utils/axiosInstance';
import { toast } from "react-toastify";
import "../pages/teachers/ManageLessons";

const StudentLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  // Student can only view lessons, not edit/delete
  const fetchLessons = useCallback(async () => {
    try {
      const res = await axios.get(`/lessons/course/${courseId}/all`);
      setLessons(res.data.lessons || []);
    } catch (err) {
      toast.error("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [courseId, fetchLessons]);

  const handlePreview = (lesson) => {
    // Student preview logic (simpler)
    if (lesson.fileUrl || lesson.file_url) {
      setPreviewFile(lesson.fileUrl || lesson.file_url);
    } else if (lesson.content) {
      // Show text content in alert
      alert(lesson.content.substring(0, 500) + "...");
    }
  };

  return (
    <div className="manage-lessons">
      <h2>📚 Course Lessons</h2>
      
      {/* Student view - no edit/delete buttons */}
      {lessons.map((lesson) => (
        <div key={lesson.id} className="lesson-card">
          <h3>{lesson.title}</h3>
          <button onClick={() => handlePreview(lesson)}>
            👁️ Preview
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentLessons;