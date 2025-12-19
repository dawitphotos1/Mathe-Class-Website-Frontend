// src/pages/CreateLesson.jsx - FIXED MULTIPLE FILES
import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import axiosInstance from '../utils/axiosInstance';
import "./CreateLesson.css";
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";

const CreateLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dropRef = useRef();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    contentType: "text",
    isUnitHeader: false,
    isPreview: false,
    unitId: "",
    orderIndex: 0,
    content: "",
  });

  // ✅ CHANGE TO ARRAY FOR MULTIPLE FILES
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      
      // Determine content type
      const hasPdf = files.some(f => f.type === "application/pdf");
      const hasVideo = files.some(f => f.type.startsWith("video/"));
      
      if (hasPdf) {
        setFormData(prev => ({ ...prev, contentType: "pdf" }));
      } else if (hasVideo) {
        setFormData(prev => ({ ...prev, contentType: "video" }));
      } else if (files.length > 1) {
        setFormData(prev => ({ ...prev, contentType: "mixed" }));
      } else {
        setFormData(prev => ({ ...prev, contentType: "file" }));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title?.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    if (selectedFiles.length === 0 && formData.contentType !== "text") {
      toast.error("Please upload at least one file");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content_type", formData.contentType);
      data.append("content", formData.content || "");
      data.append("is_preview", formData.isPreview);
      data.append("is_unit_header", formData.isUnitHeader);
      data.append("order_index", formData.orderIndex || 0);
      if (formData.unitId) data.append("unit_id", formData.unitId);

      // ✅ FIX: Append ALL files with array notation
      selectedFiles.forEach((file, index) => {
        data.append("attachments[]", file); // CRITICAL: Use [] for array
      });

      console.log("📤 Uploading files:", selectedFiles.map(f => f.name));

      const response = await axiosInstance.post(
        `/courses/${courseId}/lessons`, // Fixed endpoint
        data
        // NO headers - browser will set Content-Type
      );

      if (response.data.success) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        toast.success("🎉 Lesson created successfully");
        navigate("/teacher-dashboard", { state: { refresh: true } });
      } else {
        throw new Error(response.data.error || "Failed to create lesson");
      }
    } catch (err) {
      console.error("Lesson creation failed:", err);
      toast.error(err?.response?.data?.error || "Lesson creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-lesson-container">
      <h2>Create a New Lesson</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">📖 Title *</label>
          <input
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter lesson title"
            required
          />
        </div>

        {/* ✅ FIXED: MULTIPLE FILE UPLOAD */}
        <div
          className="file-drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          ref={dropRef}
        >
          <p>📤 Drag & drop files here, or click to browse (Multiple)</p>
          <input
            type="file"
            multiple // ✅ ADD THIS
            accept=".pdf,.doc,.docx,.ppt,.pptx,image/*,video/*,.txt"
            onChange={handleFileChange}
            className="file-input-hidden"
          />
        </div>

        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Files ({selectedFiles.length}):
            </Typography>
            <List dense>
              {selectedFiles.map((file, index) => (
                <ListItem 
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeFile(index)} size="small">
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText 
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(1)} KB`}
                  />
                  <Chip 
                    label={file.type.includes('pdf') ? 'PDF' : file.type.split('/')[0]} 
                    size="small" 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter lesson content"
            rows="4"
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
          <label htmlFor="orderIndex">⏳ Order Index *</label>
          <input
            type="number"
            name="orderIndex"
            id="orderIndex"
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
            disabled={loading}
          >
            ❌ Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "⏳ Creating..." : "✅ Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLesson;