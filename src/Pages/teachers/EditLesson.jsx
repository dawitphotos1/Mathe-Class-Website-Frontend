
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BASE_URL = "https://mathe-class-website-backend-1.onrender.com";

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    contentType: "text",
    content: "",
    videoUrl: "",
    orderIndex: 0,
    isPreview: false,
    isUnitHeader: false,
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${lessonId}`);
        const data = res.data.lesson || res.data;
        setLesson(data);
        setForm({
          title: data.title || "",
          contentType: data.contentType || "text",
          content: data.content || "",
          videoUrl: data.videoUrl || "",
          orderIndex: data.orderIndex || 0,
          isPreview: data.isPreview || false,
          isUnitHeader: data.isUnitHeader || false,
        });
      } catch (err) {
        toast.error("❌ Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (value) => {
    setForm((prev) => ({ ...prev, content: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.[0]) {
      setFile(acceptedFiles[0]);
      toast.success(`📄 File ready: ${acceptedFiles[0].name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [] },
    maxFiles: 1,
    onDrop,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    if (file) formData.append("file", file);

    try {
      await api.put(`/lessons/${lessonId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Lesson updated");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update lesson");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-lesson-page">
      <h2>✏️ Edit Lesson</h2>
      <form onSubmit={handleSubmit} className="edit-lesson-form">
        <div>
          <label>Title:</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Content Type:</label>
          <select
            name="contentType"
            value={form.contentType}
            onChange={handleChange}
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="file">PDF</option>
          </select>
        </div>

        {form.contentType === "text" && (
          <div>
            <label>Text Content:</label>
            <ReactQuill value={form.content} onChange={handleContentChange} />
          </div>
        )}

        {form.contentType === "video" && (
          <div>
            <label>Video URL:</label>
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="https://example.com/video"
            />
          </div>
        )}

        {form.contentType === "file" && (
          <div>
            <label>Upload PDF:</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>📥 Drop the PDF file here...</p>
              ) : (
                <p>📎 Drag and drop a PDF here, or click to browse</p>
              )}
            </div>

            {file && <p>Selected: {file.name}</p>}

            {lesson?.contentUrl && (
              <p>
                Current:{" "}
                <a
                  href={`${BASE_URL}${lesson.contentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 View Existing PDF
                </a>
              </p>
            )}
          </div>
        )}

        <div>
          <label>Order Index:</label>
          <input
            type="number"
            name="orderIndex"
            value={form.orderIndex}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isPreview"
              checked={form.isPreview}
              onChange={handleChange}
            />
            Make this a free preview lesson
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isUnitHeader"
              checked={form.isUnitHeader}
              onChange={handleChange}
            />
            Mark as unit header
          </label>
        </div>

        <button type="submit">💾 Save Changes</button>
      </form>
    </div>
  );
};

export default EditLesson;

