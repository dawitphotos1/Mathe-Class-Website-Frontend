import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const LessonCreationForm = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    contentType: "text", // text, video, file
    contentUrl: "",
    videoUrl: "",
    isUnitHeader: false,
    isPreview: false,
    orderIndex: 0,
    unitId: null,
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("contentType", formData.contentType);
    data.append("videoUrl", formData.videoUrl);
    data.append("isUnitHeader", formData.isUnitHeader);
    data.append("isPreview", formData.isPreview);
    data.append("orderIndex", formData.orderIndex);
    if (formData.unitId) data.append("unitId", formData.unitId);
    if (file) data.append("file", file);

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/lessons/${courseId}/lessons`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      alert("Lesson created successfully!");
      setFormData({
        title: "",
        content: "",
        contentType: "text",
        contentUrl: "",
        videoUrl: "",
        isUnitHeader: false,
        isPreview: false,
        orderIndex: 0,
        unitId: null,
      });
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error creating lesson:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to create lesson"
      );
    }
  };

  return (
    <div className="lesson-creation-container">
      <h2>Create New Lesson</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Lesson Title</label>
          <input
            type="text"
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
            <option value="video">Video</option>
            <option value="file">File (PDF)</option>
          </select>
        </div>

        {formData.contentType === "text" && (
          <div className="form-group">
            <label>Lesson Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
            />
          </div>
        )}

        {formData.contentType === "video" && (
          <div className="form-group">
            <label>Video URL</label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="YouTube/Vimeo URL"
            />
          </div>
        )}

        {formData.contentType === "file" && (
          <div className="form-group">
            <label>Upload PDF</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>
        )}

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="isUnitHeader"
            checked={formData.isUnitHeader}
            onChange={(e) =>
              setFormData({
                ...formData,
                isUnitHeader: e.target.checked,
              })
            }
          />
          <label>Is this a Unit Header?</label>
        </div>

        {!formData.isUnitHeader && (
          <div className="form-group">
            <label>Unit (select if this belongs to a unit)</label>
            <select
              name="unitId"
              value={formData.unitId || ""}
              onChange={handleChange}
            >
              <option value="">None</option>
              {/* Add units here if fetched dynamically */}
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
            min="0"
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="isPreview"
            checked={formData.isPreview}
            onChange={(e) =>
              setFormData({
                ...formData,
                isPreview: e.target.checked,
              })
            }
          />
          <label>Make this a preview lesson (visible to all)</label>
        </div>

        <button type="submit" className="submit-btn">
          Create Lesson
        </button>
      </form>
    </div>
  );
};

export default LessonCreationForm;