// src/components/LessonCreationForm.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Container,
} from "@mui/material";
import { CloudUpload, Save, Cancel, ArrowBack } from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstance";

const LessonCreationForm = () => {
  const { courseId, unitId } = useParams(); // <-- important
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    contentType: "text",
    orderIndex: "",
    videoUrl: "",
    isPreview: false,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      if (file.type === "application/pdf") {
        setFormData((prev) => ({ ...prev, contentType: "pdf" }));
      } else if (file.type.startsWith("video/")) {
        setFormData((prev) => ({ ...prev, contentType: "video" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();

      // Map frontend → backend fields
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value === "" || value === null) return;

        switch (key) {
          case "contentType":
            submitData.append("content_type", value);
            break;
          case "orderIndex":
            submitData.append("order_index", value);
            break;
          case "videoUrl":
            submitData.append("video_url", value);
            break;
          case "isPreview":
            submitData.append("is_preview", value);
            break;
          default:
            submitData.append(key, value);
        }
      });

      // Required fields
      submitData.append("course_id", courseId);

      if (unitId) {
        submitData.append("unit_id", unitId);
      }

      if (selectedFile) {
        submitData.append("file", selectedFile);
      }

      console.log("📤 Final submit payload:", Object.fromEntries(submitData));

      const response = await axiosInstance.post(
        `/lessons/courses/${courseId}/lessons`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        navigate("/teacher-dashboard");
      } else {
        throw new Error(response.data.error || "Failed to create lesson");
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/teacher-dashboard")}>
          Back to Courses
        </Button>
        <Typography variant="h4" sx={{ ml: 2 }}>
          Create New Lesson
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && <Alert severity="error">{error}</Alert>}

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
                  name="contentType"
                  value={formData.contentType}
                  label="Content Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography>Upload File</Typography>
                <Button variant="outlined" fullWidth startIcon={<CloudUpload />} component="label">
                  {selectedFile ? selectedFile.name : "Choose File"}
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </Box>

              <TextField
                label="Video URL"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
              />

              <TextField
                label="Content"
                name="content"
                multiline
                rows={4}
                value={formData.content}
                onChange={handleInputChange}
              />

              <TextField
                label="Order Index"
                type="number"
                name="orderIndex"
                value={formData.orderIndex}
                onChange={handleInputChange}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="isPreview"
                    checked={formData.isPreview}
                    onChange={handleInputChange}
                  />
                }
                label="Preview Lesson"
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button onClick={() => navigate("/teacher-dashboard")} startIcon={<Cancel />}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Lesson"}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LessonCreationForm;
