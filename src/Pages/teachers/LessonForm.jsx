// // src/pages/teachers/LessonForm.jsx
// import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
//   Card,
//   CardContent,
//   Typography,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { CloudUpload, Save, Cancel } from "@mui/icons-material";
// import axiosInstance from "../../utils/axiosInstance";

// const LessonForm = ({ courseId, unitId, onSuccess, onCancel }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     contentType: "text",
//     orderIndex: "",
//     videoUrl: "",
//     isPreview: false,
//   });
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);

//     // Auto-set content type based on file
//     if (file) {
//       if (file.type === "application/pdf") {
//         setFormData((prev) => ({ ...prev, contentType: "pdf" }));
//       } else if (file.type.startsWith("video/")) {
//         setFormData((prev) => ({ ...prev, contentType: "video" }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const submitData = new FormData();

//       // Append form data
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] !== "" && formData[key] !== null) {
//           submitData.append(key, formData[key]);
//         }
//       });

//       // Append course and unit info
//       submitData.append("courseId", courseId);
//       if (unitId) {
//         submitData.append("unitId", unitId);
//       }

//       // Append file if selected
//       if (selectedFile) {
//         submitData.append("file", selectedFile);
//       }

//       console.log("📤 Submitting lesson data:", {
//         ...formData,
//         courseId,
//         unitId,
//         hasFile: !!selectedFile,
//       });

//       const response = await axiosInstance.post(
//         `/courses/${courseId}/lessons`,
//         submitData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         console.log("✅ Lesson created successfully:", response.data.lesson);
//         onSuccess(response.data.lesson);
//       } else {
//         throw new Error(response.data.error || "Failed to create lesson");
//       }
//     } catch (error) {
//       console.error("❌ Error creating lesson:", error);
//       setError(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to create lesson"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card sx={{ maxWidth: 800, margin: "auto", mt: 3 }}>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           Create New Lesson
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             {/* Lesson Title */}
//             <TextField
//               required
//               label="Lesson Title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               fullWidth
//               helperText="Enter a descriptive title for this lesson"
//             />

//             {/* Content Type */}
//             <FormControl fullWidth>
//               <InputLabel>Content Type</InputLabel>
//               <Select
//                 name="contentType"
//                 value={formData.contentType}
//                 label="Content Type"
//                 onChange={handleInputChange}
//               >
//                 <MenuItem value="text">Text Content</MenuItem>
//                 <MenuItem value="pdf">PDF Document</MenuItem>
//                 <MenuItem value="video">Video Lesson</MenuItem>
//                 <MenuItem value="mixed">Mixed Content</MenuItem>
//               </Select>
//             </FormControl>

//             {/* File Upload */}
//             <Box>
//               <Typography variant="subtitle1" gutterBottom>
//                 Upload File (PDF, Video, etc.)
//               </Typography>
//               <Button
//                 variant="outlined"
//                 component="label"
//                 startIcon={<CloudUpload />}
//                 fullWidth
//               >
//                 {selectedFile ? selectedFile.name : "Choose File"}
//                 <input
//                   type="file"
//                   hidden
//                   onChange={handleFileChange}
//                   accept=".pdf,.mp4,.mov,.avi,.doc,.docx"
//                 />
//               </Button>
//               {selectedFile && (
//                 <Typography
//                   variant="caption"
//                   color="textSecondary"
//                   sx={{ mt: 1, display: "block" }}
//                 >
//                   Selected: {selectedFile.name} (
//                   {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
//                 </Typography>
//               )}
//             </Box>

//             {/* Video URL (alternative to file upload) */}
//             <TextField
//               label="Video URL (Optional)"
//               name="videoUrl"
//               value={formData.videoUrl}
//               onChange={handleInputChange}
//               fullWidth
//               helperText="Or provide a video URL instead of uploading a file"
//             />

//             {/* Lesson Content */}
//             <TextField
//               label="Lesson Content"
//               name="content"
//               value={formData.content}
//               onChange={handleInputChange}
//               multiline
//               rows={4}
//               fullWidth
//               helperText="Enter the lesson content or description"
//             />

//             {/* Order Index */}
//             <TextField
//               label="Order Index"
//               name="orderIndex"
//               type="number"
//               value={formData.orderIndex}
//               onChange={handleInputChange}
//               fullWidth
//               helperText="Position in the course (lower numbers appear first)"
//             />

//             {/* Preview Lesson */}
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="isPreview"
//                   checked={formData.isPreview}
//                   onChange={handleInputChange}
//                 />
//               }
//               label="Mark as Preview Lesson (students can access without enrollment)"
//             />

//             {/* Action Buttons */}
//             <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
//               <Button
//                 onClick={onCancel}
//                 startIcon={<Cancel />}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 startIcon={loading ? <CircularProgress size={16} /> : <Save />}
//                 disabled={loading || !formData.title}
//               >
//                 {loading ? "Creating..." : "Create Lesson"}
//               </Button>
//             </Box>
//           </Box>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default LessonForm;






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

      // Append course and unit info
      submitData.append('courseId', courseId);
      if (unitId) {
        submitData.append('unitId', unitId);
      }

      // Append file if selected
      if (selectedFile) {
        submitData.append('file', selectedFile);
      }

      console.log('📤 Submitting lesson data:', {
        ...formData,
        courseId,
        unitId,
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
        onSuccess(response.data.lesson);
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

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create New Lesson
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
              rows={4}
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
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
                {loading ? 'Creating...' : 'Create Lesson'}
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default LessonForm;
