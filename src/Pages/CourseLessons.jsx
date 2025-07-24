import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from '../api/axios'; 
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";

const CourseLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // %
  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const [lessonRes, progressRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/lessons/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/v1/progress/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLessons(lessonRes.data.lessons || []);
        const completedIds = new Set(progressRes.data.completedLessonIds || []);
        setCompletedLessons(completedIds);
        // Progress calculation
        if (lessonRes.data.lessons.length > 0) {
          const pct = (completedIds.size / lessonRes.data.lessons.length) * 100;
          setProgress(pct.toFixed(0));
        }
      } catch (err) {
        console.error("Failed to fetch lessons or progress", err);
        toast.error("Could not load lessons or progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndProgress();
  }, [courseId]);

  const markComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/api/v1/progress/complete`,
        { lessonId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Lesson marked as complete!");
      setCompletedLessons((prev) => new Set(prev).add(lessonId));
    } catch (err) {
      console.error("Failed to mark lesson complete", err);
      toast.error("Could not mark as complete.");
    }
  };

  return (
    <div className="student-lessons">
      <h2>Your Lessons</h2>
      {loading ? (
        <p>Loading...</p>
      ) : lessons.length === 0 ? (
        <p>No lessons found or access not approved yet.</p>
      ) : (
        <>
          {/* Progress bar goes here */}
          <div style={{ margin: "20px 0" }}>
            <label>Progress: {progress}%</label>
            <div
              style={{
                background: "#eee",
                borderRadius: "5px",
                height: "20px",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  background: "#28a745",
                  height: "100%",
                  borderRadius: "5px",
                  transition: "width 0.4s ease-in-out",
                }}
              ></div>
            </div>
          </div>

          <ul>
            {lessons.map((l) => (
              <li key={l.id}>{/* lesson display */}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default CourseLessons;
