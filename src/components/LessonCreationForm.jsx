// // src/components/LessonCreationForm.jsx
// import React, { useState, useEffect } from "react";
// import axios from "../utils/axiosInstance"; // ✅ UPDATED
// import { useParams, useNavigate } from "react-router-dom";
// import "./LessonCreationForm.css";

// const LessonCreationForm = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     contentType: "text",
//     videoUrl: "",
//     isUnitHeader: false,
//     isPreview: false,
//     orderIndex: 0,
//     unitId: "",
//   });
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [units, setUnits] = useState([]);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         const response = await axios.get(
//           `/lessons/course/${courseId}/units`
//         );
//         setUnits(response.data.units || []);
//       } catch (err) {
//         console.error("Error loading units", err);
//       }
//     };

//     fetchUnits();
//   }, [courseId]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFile(file);
//     if (file) setPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);
//     setLoading(true);

//     try {
//       const form = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== "") form.append(key, value);
//       });
//       if (file) form.append("file", file);

//       await axios.post(
//         `/lessons/course/${courseId}/lessons`,
//         form,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           onUploadProgress: (progressEvent) => {
//             const percent = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percent);
//           },
//         }
//       );

//       setSuccess("✅ Lesson created successfully!");
//       setFormData({
//         title: "",
//         content: "",
//         contentType: "text",
//         videoUrl: "",
//         isUnitHeader: false,
//         isPreview: false,
//         orderIndex: 0,
//         unitId: "",
//       });
//       setFile(null);
//       setPreviewUrl(null);
//       setUploadProgress(0);

//       setTimeout(() => {
//         navigate("/my-teaching-courses", { state: { refresh: true } });
//       }, 1000);
//     } catch (err) {
//       console.error("Lesson creation failed:", err);
//       setError(err.response?.data?.error || "Failed to create lesson");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="lesson-form-container">
//       <h2>Create New Lesson</h2>

//       {error && <div className="error-alert">{error}</div>}
//       {success && <div className="success-message">{success}</div>}

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Title</label>
//           <input
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Content Type</label>
//           <select
//             name="contentType"
//             value={formData.contentType}
//             onChange={handleChange}
//           >
//             <option value="text">Text</option>
//             <option value="video">Video URL</option>
//             <option value="file">PDF File</option>
//           </select>
//         </div>

//         {formData.contentType === "text" && (
//           <div className="form-group">
//             <label>Text Content</label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               rows="4"
//             />
//           </div>
//         )}

//         {formData.contentType === "video" && (
//           <div className="form-group">
//             <label>Video URL</label>
//             <input
//               name="videoUrl"
//               value={formData.videoUrl}
//               onChange={handleChange}
//               placeholder="https://youtube.com/..."
//             />
//           </div>
//         )}

//         {formData.contentType === "file" && (
//           <div className="form-group">
//             <label>Upload PDF</label>
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={handleFileChange}
//             />
//             {uploadProgress > 0 && (
//               <div style={{ marginTop: "0.5rem" }}>
//                 <progress value={uploadProgress} max="100" />
//               </div>
//             )}
//             {previewUrl && (
//               <iframe
//                 src={previewUrl}
//                 title="PDF Preview"
//                 className="mt-4"
//                 style={{
//                   width: "100%",
//                   height: "300px",
//                   border: "1px solid #ccc",
//                 }}
//               />
//             )}
//           </div>
//         )}

//         <div className="checkbox-group">
//           <input
//             type="checkbox"
//             name="isUnitHeader"
//             checked={formData.isUnitHeader}
//             onChange={handleChange}
//           />
//           <label>Is Unit Header</label>
//         </div>

//         {!formData.isUnitHeader && (
//           <div className="form-group">
//             <label>Assign to Unit</label>
//             <select
//               name="unitId"
//               value={formData.unitId}
//               onChange={handleChange}
//             >
//               <option value="">-- Select Unit --</option>
//               {units.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.title}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <div className="form-group">
//           <label>Order Index</label>
//           <input
//             type="number"
//             name="orderIndex"
//             value={formData.orderIndex}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="checkbox-group">
//           <input
//             type="checkbox"
//             name="isPreview"
//             checked={formData.isPreview}
//             onChange={handleChange}
//           />
//           <label>Enable Free Preview</label>
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? "Creating..." : "Create Lesson"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LessonCreationForm;







// src/components/LessonCreationForm.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { CloudUpload, Save, Cancel, ArrowBack } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';

const LessonCreationForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Auto-set content type based on file
    if (file) {
      if (file.type === 'application/pdf') {
        setFormData(prev => ({ ...prev, contentType: 'pdf' }));
      } else if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, contentType: 'video' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      // Append course info
      submitData.append('courseId', courseId);

      // Append file if selected
      if (selectedFile) {
        submitData.append('file', selectedFile);
      }

      console.log('📤 Submitting lesson data:', {
        ...formData,
        courseId,
        hasFile: !!selectedFile
      });

      const response = await axiosInstance.post(
        `/courses/${courseId}/lessons`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        console.log('✅ Lesson created successfully:', response.data.lesson);
        navigate('/teacher-dashboard');
      } else {
        throw new Error(response.data.error || 'Failed to create lesson');
      }
    } catch (error) {
      console.error('❌ Error creating lesson:', error);
      setError(error.response?.data?.error || error.message || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/teacher-dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleCancel}
          sx={{ mr: 2 }}
        >
          Back to Courses
        </Button>
        <Typography variant="h4" component="h1">
          Create New Lesson
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Lesson Title */}
              <TextField
                required
                label="Lesson Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                helperText="Enter a descriptive title for this lesson"
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
                  <MenuItem value="video">Video Lesson</MenuItem>
                  <MenuItem value="mixed">Mixed Content</MenuItem>
                </Select>
              </FormControl>

              {/* File Upload */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload File (PDF, Video, etc.)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  {selectedFile ? selectedFile.name : 'Choose File'}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.mp4,.mov,.avi,.doc,.docx"
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
              </Box>

              {/* Video URL (alternative to file upload) */}
              <TextField
                label="Video URL (Optional)"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                fullWidth
                helperText="Or provide a video URL instead of uploading a file"
              />

              {/* Lesson Content */}
              <TextField
                label="Lesson Content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                multiline
                rows={6}
                fullWidth
                helperText="Enter the lesson content or description"
              />

              {/* Order Index */}
              <TextField
                label="Order Index"
                name="orderIndex"
                type="number"
                value={formData.orderIndex}
                onChange={handleInputChange}
                fullWidth
                helperText="Position in the course (lower numbers appear first)"
              />

              {/* Preview Lesson */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="isPreview"
                    checked={formData.isPreview}
                    onChange={handleInputChange}
                  />
                }
                label="Mark as Preview Lesson (students can access without enrollment)"
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                <Button
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                  disabled={loading}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                  disabled={loading || !formData.title}
                  size="large"
                >
                  {loading ? 'Creating...' : 'Create Lesson'}
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