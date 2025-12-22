// src/pages/CreateLesson.jsx
import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import axiosInstance from "../utils/axiosInstance";
import { prepareFormData, validateFiles } from "../utils/uploadUtils";
import "./CreateLesson.css";

import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  LinearProgress,
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";

const CreateLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dropRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    contentType: "text",
    isUnitHeader: false,
    isPreview: false,
    unitId: "",
    orderIndex: 0,
  });

  // ✅ Multiple file support
  const [selectedFiles, setSelectedFiles] = useState([]);

  /* ------------------------- Handlers ------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const { validFiles, errors } = validateFiles(files);

    if (errors.length) {
      toast.warning(`Some files rejected: ${errors.join(", ")}`);
    }

    if (!validFiles.length) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Determine content type
    const hasPdf = validFiles.some(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
    );
    const hasVideo = validFiles.some((f) => f.type.startsWith("video/"));

    if (hasPdf) {
      setFormData((p) => ({ ...p, contentType: "pdf" }));
    } else if (hasVideo) {
      setFormData((p) => ({ ...p, contentType: "video" }));
    } else if (validFiles.length > 1) {
      setFormData((p) => ({ ...p, contentType: "mixed" }));
    } else {
      setFormData((p) => ({ ...p, contentType: "file" }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const { validFiles, errors } = validateFiles(files);
    if (errors.length) toast.warning(`Some files rejected: ${errors.join(", ")}`);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* ------------------------- Submit ------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    if (formData.contentType !== "text" && selectedFiles.length === 0) {
      toast.error("Please upload at least one file");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content || "");
      data.append("content_type", formData.contentType);
      data.append("is_unit_header", formData.isUnitHeader);
      data.append("is_preview", formData.isPreview);
      data.append("order_index", formData.orderIndex);
      if (formData.unitId) data.append("unit_id", formData.unitId);

      // ✅ Append all selected files using array notation
      selectedFiles.forEach((file) => data.append("attachments[]", file));

      const response = await axiosInstance.post(
        `/courses/${courseId}/lessons`,
        data,
        {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      if (response.data?.success) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        toast.success("🎉 Lesson created successfully");
        navigate("/teacher-dashboard", { state: { refresh: true } });
      } else {
        throw new Error(response.data?.error || "Lesson creation failed");
      }
    } catch (err) {
      console.error("Lesson creation failed:", err);
      toast.error(err?.response?.data?.error || "Lesson creation failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /* ------------------------- Render ------------------------- */
  return (
    <div className="create-lesson-container">
      <h2>Create a New Lesson</h2>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Uploading: {uploadProgress}%</Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>📖 Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter lesson title"
            required
          />
        </div>

        <div
          className="file-drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          ref={dropRef}
        >
          <CloudUpload fontSize="large" />
          <p>📤 Drag & drop files here, or click to browse (Multiple)</p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="file-input-hidden"
          />
        </div>

        {selectedFiles.length > 0 && (
          <List dense>
            {selectedFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton onClick={() => removeFile(index)}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                />
                <Chip
                  label={
                    file.type.includes("pdf") ? "PDF" : file.type.split("/")[0]
                  }
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        )}

        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter lesson content"
            rows={4}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isUnitHeader"
              checked={formData.isUnitHeader}
              onChange={handleChange}
            />
            Mark as Unit Header
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isPreview"
              checked={formData.isPreview}
              onChange={handleChange}
            />
            Enable Free Preview
          </label>
        </div>

        <div className="form-group">
          <label>⏳ Order Index</label>
          <input
            type="number"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            min={0}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            ❌ Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? `⏳ Creating... ${uploadProgress}%` : "✅ Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLesson;
