// components/LessonCreationForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("/api/v1/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setFormData({
        ...formData,
        contentUrl: response.data.url,
        contentType: selectedFile.type.includes("video") ? "video" : "file",
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/v1/courses/${courseId}/lessons`, formData);
      alert("Lesson created successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  return (
    <div className="lesson-creation-container">
      <h2>Create New Lesson</h2>
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
            <option value="file">File (PDF, DOC, etc.)</option>
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
              placeholder="YouTube/Vimeo URL or upload file below"
            />
            <p>OR</p>
            <input type="file" accept="video/*" onChange={handleFileUpload} />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>
        )}

        {formData.contentType === "file" && (
          <div className="form-group">
            <label>Upload File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileUpload}
            />
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
            {/* You would fetch existing units here */}
            <select
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
            >
              <option value="">None</option>
              {/* Map through units */}
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
