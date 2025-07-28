import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmModal from "../../components/ConfirmModal";
import "./MyTeachingCourses.css";

const BASE_URL = "https://mathe-class-website-backend-1.onrender.com/api/v1";
const normalizeUrl = (url) => url?.replace(/^\/uploads/i, "/Uploads");

const MyTeachingCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseLessons, setCourseLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState({ show: false });
  const [pdfPreview, setPdfPreview] = useState(null);
  const [renaming, setRenaming] = useState({});
  const [editingName, setEditingName] = useState({});

  // ✅ Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // ✅ Fetch lessons for a specific course
  const fetchLessonsForCourse = async (courseId, token) => {
    try {
      const res = await axios.get(`${BASE_URL}/lessons/${courseId}/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return res.data.lessons || [];
    } catch (err) {
      console.error(`❌ Failed to fetch lessons for course ${courseId}:`, err);
      return [];
    }
  };

  // ✅ Fetch teacher's courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ Please log in first.");
        navigate("/login");
        return;
      }

      const res = await axios.get(`${BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success && Array.isArray(res.data.courses)) {
        setCourses(res.data.courses);

        // Fetch lessons for each course
        const lessonsMap = {};
        for (const course of res.data.courses) {
          const lessons = await fetchLessonsForCourse(course.id, token);
          lessonsMap[course.id] = lessons;
        }
        setCourseLessons(lessonsMap);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
      toast.error("❌ Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Delete a course
  const deleteCourse = (courseId) => {
    setModal({
      show: true,
      title: "Delete Course",
      message:
        "Are you sure you want to delete this course and all its lessons?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${BASE_URL}/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
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

  const handlePreviewPdf = (url) => setPdfPreview(url);
  const handleClosePdfPreview = () => setPdfPreview(null);

  const startRenaming = (courseId, index, oldName) => {
    setRenaming({ courseId, index });
    setEditingName({ name: oldName.replace(/\.[^/.]+$/, "") });
  };

  const confirmRename = async () => {
    const { courseId, index } = renaming;
    const { name } = editingName;
    if (!name.trim()) return toast.warning("Please enter a valid name");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${BASE_URL}/courses/${courseId}/attachments/${index}/rename`,
        { newName: name.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("✅ File renamed");

      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? {
                ...course,
                attachmentUrls: course.attachmentUrls.map((url, idx) =>
                  idx === Number(index) ? res.data.updatedUrl : url
                ),
              }
            : course
        )
      );
      setRenaming({});
      setEditingName({});
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to rename file");
    }
  };

  const deleteAttachment = async (courseId, index) => {
    setModal({
      show: true,
      title: "Delete Attachment",
      message: "Are you sure you want to delete this attachment?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.patch(
            `${BASE_URL}/courses/${courseId}`,
            { removeAttachmentIndex: index },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          toast.success("✅ Attachment deleted");

          setCourses((prev) =>
            prev.map((course) =>
              course.id === courseId
                ? { ...course, attachmentUrls: res.data.attachmentUrls }
                : course
            )
          );
        } catch {
          toast.error("❌ Failed to delete attachment");
        } finally {
          setModal({ show: false });
        }
      },
    });
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
              {course.thumbnailUrl && (
                <img
                  src={`${BASE_URL.replace("/api/v1", "")}${normalizeUrl(
                    course.thumbnailUrl
                  )}`}
                  alt="Course Thumbnail"
                  style={{
                    maxWidth: "100%",
                    marginBottom: "0.5rem",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              )}
              <h3>{course.title}</h3>
              <p>{course.description || "No description available."}</p>

              {/* Attachments */}
              {course.attachmentUrls?.length > 0 && (
                <div className="attachment-list">
                  <strong>📎 Attachments:</strong>
                  {course.attachmentUrls.map((url, idx) => {
                    const fileName = url.split("/").pop();
                    const fileUrl = `${BASE_URL.replace(
                      "/api/v1",
                      ""
                    )}${normalizeUrl(url)}`;

                    return (
                      <div key={idx} className="attachment-item">
                        {renaming.courseId === course.id &&
                        renaming.index === idx ? (
                          <>
                            <input
                              value={editingName.name}
                              onChange={(e) =>
                                setEditingName((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="rename-input"
                            />
                            <button onClick={confirmRename}>💾 Save</button>
                            <button onClick={() => setRenaming({})}>
                              ❌ Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{fileName}</span>
                            <button onClick={() => handlePreviewPdf(fileUrl)}>
                              📄 Preview
                            </button>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              ⬇️ Download
                            </a>
                            <button
                              onClick={() =>
                                startRenaming(course.id, idx, fileName)
                              }
                            >
                              ✏️ Rename
                            </button>
                            <button
                              onClick={() => deleteAttachment(course.id, idx)}
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Lessons */}
              {courseLessons[course.id]?.length > 0 && (
                <div className="lesson-list">
                  <strong>📚 Lessons:</strong>
                  <ul>
                    {courseLessons[course.id].map((lesson) => (
                      <li key={lesson.id}>
                        <strong>{lesson.title}</strong> — {lesson.contentType}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="course-actions">
                <Link to={`/courses/${course.id}/manage-lessons`}>
                  <button className="btn-manage">🛠 Manage Lessons</button>
                </Link>
                <Link to={`/courses/${course.id}/lessons/new`}>
                  <button className="btn-create">➕ Create Lesson</button>
                </Link>
                <Link to={`/courses/${course.id}/edit`}>
                  <button className="btn-edit">✏️ Edit Course</button>
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => deleteCourse(course.id)}
                >
                  🗑 Delete Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pdfPreview && (
        <div className="pdf-modal">
          <div className="pdf-modal-content">
            <button className="pdf-close" onClick={handleClosePdfPreview}>
              ❌ Close
            </button>
            <iframe
              src={pdfPreview}
              width="100%"
              height="600px"
              title="PDF Preview"
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ show: false })}
      />
    </div>
  );
};

export default MyTeachingCourses;
