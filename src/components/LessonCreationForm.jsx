import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./LessonCreationForm.css";
import { API_BASE_URL } from "../config";

const LessonCreationForm = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    contentType: "text",
    videoUrl: "",
    isUnitHeader: false,
    isPreview: false,
    orderIndex: 0,
    unitId: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/lessons/${courseId}/units`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnits(response.data.units || []);
      } catch (err) {
        console.error("Error loading units", err);
      }
    };

    fetchUnits();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in first");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") form.append(key, value);
      });
      if (file) form.append("file", file);

      await axios.post(
        `${API_BASE_URL}/api/v1/lessons/${courseId}/lessons`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      setSuccess("✅ Lesson created successfully!");
      setFormData({
        title: "",
        content: "",
        contentType: "text",
        videoUrl: "",
        isUnitHeader: false,
        isPreview: false,
        orderIndex: 0,
        unitId: "",
      });
      setFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (err) {
      console.error("Lesson creation failed:", err);
      setError(err.response?.data?.error || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lesson-form-container">
      <h2>Create New Lesson</h2>

      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Content Type</label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
          >
            <option value="text">Text</option>
            <option value="video">Video URL</option>
            <option value="file">PDF File</option>
          </select>
        </div>

        {formData.contentType === "text" && (
          <div className="form-group">
            <label>Text Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
            />
          </div>
        )}

        {formData.contentType === "video" && (
          <div className="form-group">
            <label>Video URL</label>
            <input
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
            />
          </div>
        )}

        {formData.contentType === "file" && (
          <div className="form-group">
            <label>Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {uploadProgress > 0 && (
              <div style={{ marginTop: "0.5rem" }}>
                <progress value={uploadProgress} max="100" />
              </div>
            )}
            {previewUrl && (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                className="mt-4"
                style={{
                  width: "100%",
                  height: "300px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          </div>
        )}

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="isUnitHeader"
            checked={formData.isUnitHeader}
            onChange={handleChange}
          />
          <label>Is Unit Header</label>
        </div>

        {!formData.isUnitHeader && (
          <div className="form-group">
            <label>Assign to Unit</label>
            <select
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
            >
              <option value="">-- Select Unit --</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Order Index</label>
          <input
            type="number"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="isPreview"
            checked={formData.isPreview}
            onChange={handleChange}
          />
          <label>Enable Free Preview</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
};

export default LessonCreationForm;
