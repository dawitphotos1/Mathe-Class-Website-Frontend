
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import ConfirmModal from "../../components/ConfirmModal";
import "./MyTeachingCourses.css";

const normalizeUrl = (url) => url?.replace(/^\/uploads/i, "/Uploads");

const MyTeachingCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [courseLessons, setCourseLessons] = useState({});
  const [expandedUnits, setExpandedUnits] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState({ show: false });
  const [pdfPreview, setPdfPreview] = useState(null);
  const [renaming, setRenaming] = useState({});
  const [editingName, setEditingName] = useState({});

  // Dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));
  }, []);
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Fetch lessons per course
  const fetchLessonsForCourse = async (courseId) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}/lessons`);
      if (Array.isArray(res.data.lessons)) {
        return [{ unitName: "Ungrouped Lessons", lessons: res.data.lessons }];
      }
      return [];
    } catch (err) {
      console.error(`❌ Failed to fetch lessons for course ${courseId}:`, err);
      return [];
    }
  };

  // Fetch all teacher courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/courses");
      if (res.data.success && Array.isArray(res.data.courses)) {
        setCourses(res.data.courses);

        const lessonsMap = {};
        for (const course of res.data.courses) {
          const units = await fetchLessonsForCourse(course.id);
          lessonsMap[course.id] = units;
        }
        setCourseLessons(lessonsMap);

        const expandedMap = {};
        Object.keys(lessonsMap).forEach((courseId) => {
          lessonsMap[courseId].forEach((unit) => {
            expandedMap[`${courseId}-${unit.unitName}`] = true;
          });
        });
        setExpandedUnits(expandedMap);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
      toast.error("❌ Failed to fetch courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    const handleFocus = () => fetchCourses();
    window.addEventListener("focus", handleFocus);

    if (location.state?.refresh) {
      fetchCourses();
      window.history.replaceState({}, document.title);
    }

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const deleteCourse = (courseId) => {
    setModal({
      show: true,
      title: "Delete Course",
      message: "Are you sure you want to delete this course and its lessons?",
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/courses/${courseId}`);
          toast.success("✅ Course deleted");
          setCourses((prev) => prev.filter((c) => c.id !== courseId));
        } catch {
          toast.error("❌ Failed to delete course");
        } finally {
          setModal({ show: false });
        }
      },
    });
  };

  const deleteLesson = (lessonId) => {
    setModal({
      show: true,
      title: "Delete Lesson",
      message: "Are you sure you want to delete this lesson?",
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/lessons/${lessonId}`);
          toast.success("✅ Lesson deleted");
          fetchCourses();
        } catch {
          toast.error("❌ Failed to delete lesson");
        } finally {
          setModal({ show: false });
        }
      },
    });
  };

  const toggleUnit = (courseId, unitName) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [`${courseId}-${unitName}`]: !prev[`${courseId}-${unitName}`],
    }));
  };

  return (
    <div className={`my-teaching-courses ${darkMode ? "dark" : ""}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <h2>📘 My Teaching Courses</h2>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description || "No description available."}</p>

              {/* Lessons */}
              {courseLessons[course.id]?.length > 0 ? (
                <div className="lesson-list">
                  {courseLessons[course.id].map((unit) => {
                    const key = `${course.id}-${unit.unitName}`;
                    return (
                      <div key={key} className="unit-section">
                        <h4
                          onClick={() => toggleUnit(course.id, unit.unitName)}
                          style={{ cursor: "pointer" }}
                        >
                          📦 {unit.unitName} {expandedUnits[key] ? "🔽" : "▶️"}
                        </h4>
                        {expandedUnits[key] &&
                          unit.lessons.map((lesson) => (
                            <div key={lesson.id} className="lesson-item">
                              <strong>{lesson.title}</strong> —{" "}
                              {lesson.contentType}
                              <button
                                onClick={() =>
                                  navigate(
                                    `/courses/${course.id}/lessons/${lesson.id}/edit`
                                  )
                                }
                              >
                                📝 Edit
                              </button>
                              <button onClick={() => deleteLesson(lesson.id)}>
                                🗑️ Delete
                              </button>
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontStyle: "italic" }}>📭 No lessons yet.</p>
              )}

              <div className="course-actions">
                <Link to={`/courses/${course.id}/manage-lessons`}>
                  <button>🛠 Manage Lessons</button>
                </Link>
                <Link to={`/courses/${course.id}/lessons/new`}>
                  <button>➕ Create Lesson</button>
                </Link>
                <Link to={`/courses/${course.id}/edit`}>
                  <button>✏️ Edit Course</button>
                </Link>
                <button onClick={() => deleteCourse(course.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.show && (
        <ConfirmModal
          title={modal.title}
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal({ show: false })}
        />
      )}
    </div>
  );
};

export default MyTeachingCourses;
