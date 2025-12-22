
// src/pages/teachers/LessonForm.jsx

import React, { useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  Save,
  Cancel,
  Delete,
  InsertDriveFile,
} from "@mui/icons-material";

import axiosInstance from "../../utils/axiosInstance";
import { prepareFormData, validateFiles } from "../../utils/uploadUtils";

const LessonForm = ({ courseId, unitId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    content_type: "text",
    order_index: "",
    video_url: "",
    is_preview: false,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  /* ------------------------- handlers ------------------------- */

  const handleInputChange = (e) => {
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
      setError(`Some files rejected: ${errors.join(", ")}`);
    }

    if (!validFiles.length) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    const hasPdf = validFiles.some(
      (f) => f.type === "application/pdf"
    );
    const hasVideo = validFiles.some((f) =>
      f.type.startsWith("video/")
    );

    if (hasPdf) {
      setFormData((p) => ({ ...p, content_type: "pdf" }));
    } else if (hasVideo) {
      setFormData((p) => ({ ...p, content_type: "video" }));
    } else if (validFiles.length > 1) {
      setFormData((p) => ({ ...p, content_type: "mixed" }));
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploadProgress(0);

    if (!formData.title.trim()) {
      setError("Lesson title is required");
      setLoading(false);
      return;
    }

    try {
      const submitData = prepareFormData(
        {
          ...formData,
          course_id: courseId,
          unit_id: unitId || null,
        },
        selectedFiles
      );

      const response = await axiosInstance.post(
        `/courses/${courseId}/lessons`,
        submitData,
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

      if (!response.data?.success) {
        throw new Error(response.data?.error || "Lesson creation failed");
      }

      onSuccess(response.data.lesson);
      setSelectedFiles([]);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /* ------------------------- render ------------------------- */

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create New Lesson
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              Uploading: {uploadProgress}%
            </Typography>
            <CircularProgress
              variant="determinate"
              value={uploadProgress}
            />
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              required
              label="Lesson Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />

            <FormControl fullWidth>
              <InputLabel>Content Type</InputLabel>
              <Select
                name="content_type"
                value={formData.content_type}
                label="Content Type"
                onChange={handleInputChange}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="mixed">Mixed</MenuItem>
              </Select>
            </FormControl>

            {/* File upload */}
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
              >
                {selectedFiles.length
                  ? `${selectedFiles.length} file(s) selected`
                  : "Choose Files"}
                <input
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*,video/*"
                  onChange={handleFileChange}
                />
              </Button>

              {selectedFiles.length > 0 && (
                <List dense sx={{ mt: 2, maxHeight: 200, overflow: "auto" }}>
                  {selectedFiles.map((file, index) => (
                    <ListItem key={index} divider>
                      <InsertDriveFile sx={{ mr: 1 }} />
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(
                          1
                        )} KB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => removeFile(index)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <TextField
              label="Video URL"
              name="video_url"
              value={formData.video_url}
              onChange={handleInputChange}
            />

            <TextField
              label="Lesson Content"
              name="content"
              multiline
              rows={4}
              value={formData.content}
              onChange={handleInputChange}
            />

            <TextField
              label="Order Index"
              name="order_index"
              type="number"
              value={formData.order_index}
              onChange={handleInputChange}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="is_preview"
                  checked={formData.is_preview}
                  onChange={handleInputChange}
                />
              }
              label="Make Preview"
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={onCancel} startIcon={<Cancel />}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? <CircularProgress size={16} /> : <Save />
                }
                disabled={loading}
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
