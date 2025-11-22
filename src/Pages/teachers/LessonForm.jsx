// src/pages/teachers/LessonForm.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, Save, Cancel } from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';

const LessonForm = ({ courseId, unitId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentType: 'text',
    orderIndex: '',
    videoUrl: '',
    isPreview: false,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (!file) return;

    if (file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, contentType: "pdf" }));
    } else if (file.type.startsWith("video/")) {
      setFormData((prev) => ({ ...prev, contentType: "video" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();

      // Append main fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      // Course + unit
      submitData.append("courseId", courseId);
      if (unitId) submitData.append("unitId", unitId);

      // File
      if (selectedFile) {
        submitData.append("file", selectedFile);
      }

      console.log("📤 Creating lesson with:", {
        ...formData,
        courseId,
        unitId,
        file: selectedFile?.name,
      });

      const response = await axiosInstance.post(
        `/lessons/courses/${courseId}/lessons`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Unknown error");
      }

      onSuccess(response.data.lesson);

    } catch (err) {
      console.error("❌ Lesson create error:", err);
      setError(err.response?.data?.error || err.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create New Lesson
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Title */}
            <TextField
              required
              label="Lesson Title"
              name="title"
              onChange={handleInputChange}
              value={formData.title}
            />

            {/* Content Type */}
            <FormControl fullWidth>
              <InputLabel>Content Type</InputLabel>
              <Select
                name="contentType"
                value={formData.contentType}
                label="Content Type"
                onChange={handleInputChange}
              >
                <MenuItem value="text">Text Content</MenuItem>
                <MenuItem value="pdf">PDF Document</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="mixed">Mixed Content</MenuItem>
              </Select>
            </FormControl>

            {/* File upload */}
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
            >
              {selectedFile ? selectedFile.name : "Choose File"}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf, video/*"
              />
            </Button>

            {/* Video URL */}
            <TextField
              label="Video URL (Optional)"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              fullWidth
            />

            {/* Content */}
            <TextField
              label="Lesson Content"
              name="content"
              multiline
              rows={4}
              onChange={handleInputChange}
              value={formData.content}
              fullWidth
            />

            {/* Order index */}
            <TextField
              label="Order Index"
              name="orderIndex"
              type="number"
              value={formData.orderIndex}
              onChange={handleInputChange}
              fullWidth
            />

            {/* Preview */}
            <FormControlLabel
              control={
                <Checkbox
                  name="isPreview"
                  checked={formData.isPreview}
                  onChange={handleInputChange}
                />
              }
              label="Make this a preview (students can view without enrolling)"
            />

            {/* Buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                onClick={onCancel}
                startIcon={<Cancel />}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                disabled={loading || !formData.title}
              >
                {loading ? "Saving..." : "Create Lesson"}
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default LessonForm;
