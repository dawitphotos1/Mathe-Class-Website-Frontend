//src/pages/students/ ViewLessons.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../../utils/axiosInstance';
import Loading from "../../components/Loading";

const ViewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);

      // 1. Get lesson details
      const { data: lessonRes } = await axios.get(`/api/lessons/${lessonId}`);
      const lessonData = lessonRes.lesson;

      setLesson(lessonData);

      // 2. Get all lessons for the course
      const { data: courseLessonsRes } = await axios.get(
        `/api/courses/${lessonData.course_id}/lessons`
      );

      setCourse(courseLessonsRes.course);
      setLessons(courseLessonsRes.lessons);

      setError("");
    } catch (err) {
      console.error("Error loading lesson:", err);
      setError("Unable to load this lesson.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold text-lg">
        {error}
      </div>
    );

  if (!lesson) return <div className="p-6 text-center">Lesson not found.</div>;

  // Find the current index
  const currentIndex = lessons.findIndex((l) => l.id === Number(lessonId));

  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];

  return (
    <div className="container mx-auto px-4 lg:px-10 py-10">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

      {/* ======================
          VIDEO CONTENT
      ======================= */}
      {lesson.video_url && (
        <div className="mb-6">
          <video
            src={lesson.video_url}
            controls
            className="w-full rounded-lg shadow"
          />
        </div>
      )}

      {/* ======================
          FILE DOWNLOAD
      ======================= */}
      {lesson.file_url && (
        <div className="mb-6">
          <a
            href={lesson.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold underline"
          >
            Download Lesson File
          </a>
        </div>
      )}

      {/* ======================
          TEXT CONTENT
      ======================= */}
      {lesson.content && (
        <div
          className="prose max-w-full mb-10"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}

      {/* ======================
          NAVIGATION BUTTONS
      ======================= */}
      <div className="flex justify-between mt-10">
        {prevLesson ? (
          <button
            onClick={() =>
              navigate(
                `/courses/${course.id}/view-lessons?lesson=${prevLesson.id}`
              )
            }
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Previous Lesson
          </button>
        ) : (
          <span />
        )}

        {nextLesson ? (
          <button
            onClick={() =>
              navigate(
                `/courses/${course.id}/view-lessons?lesson=${nextLesson.id}`
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next Lesson →
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export default ViewLesson;
