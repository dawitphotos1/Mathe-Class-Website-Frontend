// src/pages/teachers/EditLesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    content_type: "text",
    video_url: "",
    order_index: 0,
    is_preview: false,
    unit_id: null,
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonId}`);
        const lesson = res.data.lesson;

        setForm({
          title: lesson.title,
          content: lesson.content || "",
          content_type: lesson.content_type,
          video_url: lesson.video_url || "",
          order_index: lesson.order_index,
          is_preview: lesson.is_preview,
          unit_id: lesson.unit_id,
        });
      } catch {
        toast.error("Failed to load lesson");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, navigate]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append("file", file);

    try {
      await axiosInstance.put(`/lessons/${lessonId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lesson updated successfully");
      navigate(-1);
    } catch {
      toast.error("Failed to update lesson");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-lesson-page">
      <h2>Edit Lesson</h2>

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

        <label>Content Type</label>
        <select
          value={form.content_type}
          onChange={(e) => setForm({ ...form, content_type: e.target.value })}
        >
          <option value="text">Text</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
        </select>

        {form.content_type === "text" && (
          <>
            <label>Content</label>
            <ReactQuill value={form.content} onChange={(value) => setForm({ ...form, content: value })} />
          </>
        )}

        {form.content_type === "video" && (
          <>
            <label>Video URL</label>
            <input
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://example.com/video"
            />
          </>
        )}

        {form.content_type === "pdf" && (
          <>
            <label>Upload PDF</label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </>
        )}

        <label>Order Index</label>
        <input
          type="number"
          value={form.order_index}
          onChange={(e) => setForm({ ...form, order_index: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.is_preview}
            onChange={(e) => setForm({ ...form, is_preview: e.target.checked })}
          />
          Make Preview
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditLesson;
