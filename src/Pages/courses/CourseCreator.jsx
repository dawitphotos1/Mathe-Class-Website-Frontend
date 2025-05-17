import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config"; // Add this line
import "./CourseCreator.css";

function CourseCreator() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    lessons: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...formData.lessons];
    newLessons[index][field] = value;
    setFormData({ ...formData, lessons: newLessons });
  };

  const addLesson = () => {
    setFormData({
      ...formData,
      lessons: [
        ...formData.lessons,
        {
          title: "",
          contentType: "video",
          contentUrl: "",
          order: formData.lessons.length + 1,
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/v1/courses`, // Correct usage
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data.error || "Course creation failed");
    }
  };

  return (
    <div className="course-creator">
      <form onSubmit={handleSubmit}>
        <h2>Create New Course</h2>
        {error && <div className="error">{error}</div>}

        <input
          placeholder="Course Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Course Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          step="0.01"
          required
        />

        <h3>Lessons</h3>
        {formData.lessons.map((lesson, index) => (
          <div key={index} className="lesson-form">
            <input
              placeholder="Lesson Title"
              value={lesson.title}
              onChange={(e) =>
                handleLessonChange(index, "title", e.target.value)
              }
              required
            />
            <select
              value={lesson.contentType}
              onChange={(e) =>
                handleLessonChange(index, "contentType", e.target.value)
              }
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="pdf">PDF</option>
              <option value="quiz">Quiz</option>
            </select>
            <input
              placeholder="Content URL"
              value={lesson.contentUrl}
              onChange={(e) =>
                handleLessonChange(index, "contentUrl", e.target.value)
              }
              required
            />
          </div>
        ))}

        <button type="button" className="add-lesson" onClick={addLesson}>
          Add Lesson
        </button>

        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}

export default CourseCreator;
