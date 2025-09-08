// src/pages/EditLesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateLesson.css"; // reuse styling from CreateLesson

const EditLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    contentType: "text",
    videoUrl: "",
    contentUrl: "",
    isUnitHeader: false,
    isPreview: false,
    unitId: null,
    orderIndex: 0,
  });

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/v1/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data.lesson);
      } catch (err) {
        toast.error("Failed to load lesson");
        navigate(-1);
      }
    };

    const fetchUnits = async () => {
      try {
        const res = await axios.get(`/api/v1/courses/${courseId}/lessons`);
        const unitHeaders =
          res.data.units?.map((u) => ({ id: u.unitName, title: u.unitName })) ||
          [];
        setUnits(unitHeaders);
      } catch {}
    };

    fetchLesson();
    fetchUnits();
    setLoading(false);
  }, [courseId, lessonId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = formData.contentType;
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    setUploadProgress(0);
    try {
      const res = await axios.post("/api/v1/upload", form, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        },
      });
      if (type === "video") {
        setFormData((prev) => ({ ...prev, videoUrl: res.data.url }));
      } else {
        setFormData((prev) => ({ ...prev, contentUrl: res.data.url }));
      }
      toast.success("Upload successful");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/v1/lessons/${lessonId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Lesson updated");
      navigate(`/courses/${courseId}/manage-lessons`);
    } catch {
      toast.error("Failed to update lesson");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="create-lesson-container">
      <h2>Edit Lesson</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Content Type *</label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            required
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
        </div>

        {formData.contentType === "text" && (
          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              required
            />
          </div>
        )}

        {(formData.contentType === "video" ||
          formData.contentType === "document") && (
          <div className="form-group">
            <label>Upload File *</label>
            <input
              type="file"
              accept={
                formData.contentType === "video"
                  ? "video/*"
                  : ".pdf,.doc,.docx,.zip"
              }
              onChange={handleFileUpload}
            />
            {uploading && (
              <div className="upload-progress">
                <p>Uploading... {uploadProgress}%</p>
                <progress value={uploadProgress} max="100" />
              </div>
            )}
          </div>
        )}

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isUnitHeader"
              checked={formData.isUnitHeader}
              onChange={handleChange}
            />{" "}
            Is Unit Header?
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isPreview"
              checked={formData.isPreview}
              onChange={handleChange}
            />{" "}
            Is Preview?
          </label>
        </div>

        {!formData.isUnitHeader && units.length > 0 && (
          <div className="form-group">
            <label>Assign to Unit</label>
            <select
              name="unitId"
              value={formData.unitId || ""}
              onChange={handleChange}
            >
              <option value="">-- Select Unit --</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Order Index *</label>
          <input
            type="number"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Update Lesson
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLesson;
