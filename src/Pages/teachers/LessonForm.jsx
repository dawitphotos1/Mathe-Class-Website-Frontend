
// // src/pages/teachers/LessonForm.jsx
// import React, { useState } from 'react';
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
// } from '@mui/material';
// import { CloudUpload, Save, Cancel } from '@mui/icons-material';
// import axiosInstance from '../../utils/axiosInstance';

// const LessonForm = ({ courseId, unitId, onSuccess, onCancel }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     contentType: 'text',
//     orderIndex: '',
//     videoUrl: '',
//     isPreview: false,
//   });

//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);

//     if (!file) return;

//     if (file.type === "application/pdf") {
//       setFormData((prev) => ({ ...prev, contentType: "pdf" }));
//     } else if (file.type.startsWith("video/")) {
//       setFormData((prev) => ({ ...prev, contentType: "video" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const submitData = new FormData();

//       Object.keys(formData).forEach((key) => {
//         submitData.append(key, formData[key]);
//       });

//       submitData.append("courseId", courseId);
//       if (unitId) submitData.append("unitId", unitId);
//       if (selectedFile) submitData.append("file", selectedFile);

//       const response = await axiosInstance.post(
//         `/courses/${courseId}/lessons`,
//         submitData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (!response.data.success) throw new Error(response.data.error);

//       onSuccess(response.data.lesson);

//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
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

//         {error && <Alert severity="error">{error}</Alert>}

//         <form onSubmit={handleSubmit}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             <TextField required label="Lesson Title" name="title" value={formData.title} onChange={handleInputChange} />

//             <FormControl fullWidth>
//               <InputLabel>Content Type</InputLabel>
//               <Select name="contentType" value={formData.contentType} onChange={handleInputChange}>
//                 <MenuItem value="text">Text</MenuItem>
//                 <MenuItem value="pdf">PDF</MenuItem>
//                 <MenuItem value="video">Video</MenuItem>
//                 <MenuItem value="mixed">Mixed</MenuItem>
//               </Select>
//             </FormControl>

//             <Button component="label" variant="outlined" startIcon={<CloudUpload />} fullWidth>
//               {selectedFile ? selectedFile.name : "Choose File"}
//               <input type="file" hidden onChange={handleFileChange} accept=".pdf, video/*" />
//             </Button>

//             <TextField label="Video URL" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} fullWidth />

//             <TextField label="Lesson Content" name="content" multiline rows={4} value={formData.content} onChange={handleInputChange} />

//             <TextField label="Order Index" name="orderIndex" type="number" value={formData.orderIndex} onChange={handleInputChange} />

//             <FormControlLabel control={<Checkbox name="isPreview" checked={formData.isPreview} onChange={handleInputChange} />} label="Make Preview" />

//             <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//               <Button onClick={onCancel} startIcon={<Cancel />} disabled={loading}>Cancel</Button>

//               <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} /> : <Save />} disabled={loading}>
//                 {loading ? "Saving..." : "Create Lesson"}
//               </Button>
//             </Box>
//           </Box>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default LessonForm;






// src/pages/teachers/LessonForm.jsx - UPDATED FOR MULTIPLE FILES
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
} from '@mui/material';
import { CloudUpload, Save, Cancel, Delete, InsertDriveFile } from '@mui/icons-material';
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

  // ✅ CHANGED: from selectedFile to selectedFiles array
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ✅ CHANGED: Handle multiple files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Add new files to existing ones
    setSelectedFiles(prev => [...prev, ...files]);

    // Auto-detect content type if first file
    if (selectedFiles.length === 0 && files.length > 0) {
      const firstFile = files[0];
      if (firstFile.type === "application/pdf") {
        setFormData(prev => ({ ...prev, contentType: "pdf" }));
      } else if (firstFile.type.startsWith("video/")) {
        setFormData(prev => ({ ...prev, contentType: "video" }));
      }
    }
  };

  // ✅ NEW: Remove a file from the list
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      submitData.append("courseId", courseId);
      if (unitId) submitData.append("unitId", unitId);
      
      // ✅ CHANGED: Append multiple files as "attachments" field
      selectedFiles.forEach((file, index) => {
        submitData.append("attachments", file); // Important: use "attachments" not "file"
      });

      console.log(`Uploading ${selectedFiles.length} files...`);

      const response = await axiosInstance.post(
        `/courses/${courseId}/lessons`,
        submitData,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
          } 
        }
      );

      if (!response.data.success) throw new Error(response.data.error);

      onSuccess(response.data.lesson);

    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || err.message || "Upload failed");
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
            <TextField 
              required 
              label="Lesson Title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
            />

            <FormControl fullWidth>
              <InputLabel>Content Type</InputLabel>
              <Select name="contentType" value={formData.contentType} onChange={handleInputChange}>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="mixed">Mixed</MenuItem>
              </Select>
            </FormControl>

            {/* ✅ UPDATED: File upload for multiple files */}
            <Box>
              <Button 
                component="label" 
                variant="outlined" 
                startIcon={<CloudUpload />} 
                fullWidth
              >
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''} Selected` 
                  : "Choose Files"}
                <input 
                  type="file" 
                  hidden 
                  onChange={handleFileChange} 
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*,video/*"
                  multiple // ✅ ADD THIS: Allows multiple selection
                />
              </Button>
              
              {/* File list */}
              {selectedFiles.length > 0 && (
                <List dense sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                  {selectedFiles.map((file, index) => (
                    <ListItem key={index} divider>
                      <InsertDriveFile sx={{ mr: 1 }} />
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(1)} KB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => removeFile(index)} size="small">
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
              
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Select multiple files (PDFs, Documents, Images, Videos)
              </Typography>
            </Box>

            <TextField 
              label="Video URL" 
              name="videoUrl" 
              value={formData.videoUrl} 
              onChange={handleInputChange} 
              fullWidth 
              placeholder="Optional: Direct video link"
            />

            <TextField 
              label="Lesson Content" 
              name="content" 
              multiline 
              rows={4} 
              value={formData.content} 
              onChange={handleInputChange} 
              placeholder="Enter lesson description or text content"
            />

            <TextField 
              label="Order Index" 
              name="orderIndex" 
              type="number" 
              value={formData.orderIndex} 
              onChange={handleInputChange} 
              helperText="Order in which lesson appears"
            />

            <FormControlLabel 
              control={
                <Checkbox 
                  name="isPreview" 
                  checked={formData.isPreview} 
                  onChange={handleInputChange} 
                />
              } 
              label="Make this lesson available as preview" 
            />

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
                {loading ? "Creating..." : "Create Lesson"}
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default LessonForm;