// // components/FileUpload.jsx
// import React, { useRef, useState } from "react";
// import "../styles/useLessonForm.css";

// const FileUpload = ({ uploading, uploadProgress, previewFile, onUpload }) => {
//   const dropRef = useRef(null);
//   const [localPreview, setLocalPreview] = useState(null);

//   const handleFile = (file) => {
//     if (!file) return;

//     // Generate local preview URL for PDFs/videos
//     const previewUrl = URL.createObjectURL(file);
//     setLocalPreview(previewUrl);

//     // Send file back to parent component
//     onUpload(file);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     handleFile(file);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     handleFile(file);
//   };

//   const handleDragOver = (e) => e.preventDefault();

//   const previewToUse = previewFile || localPreview;

//   return (
//     <div
//       className="form-group dropzone"
//       ref={dropRef}
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//     >
//       <label htmlFor="fileInput">
//         📄 Drag & Drop File Here or Click to Browse
//       </label>
//       <input
//         type="file"
//         id="fileInput"
//         accept=".pdf,.doc,.docx,.ppt,.pptx,video/*"
//         onChange={handleFileChange}
//       />

//       {uploading && (
//         <div className="upload-status">
//           <p>Uploading... {uploadProgress}%</p>
//           <progress value={uploadProgress} max="100" />
//         </div>
//       )}

//       {previewToUse && (
//         <div style={{ marginTop: "1rem" }}>
//           <p><strong>Preview:</strong></p>
//           {previewToUse.includes(".mp4") || previewToUse.includes("video") ? (
//             <video width="100%" controls>
//               <source src={previewToUse} />
//             </video>
//           ) : (
//             <iframe
//               title="File Preview"
//               src={previewToUse}
//               style={{
//                 width: "100%",
//                 height: "400px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;




// components/FileUpload.jsx - UPDATED FOR MULTIPLE FILES
import React, { useRef, useState } from "react";
import "../styles/useLessonForm.css";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";

const FileUpload = ({ uploading, uploadProgress, previewFiles, onUpload }) => {
  const dropRef = useRef(null);
  const [localFiles, setLocalFiles] = useState([]);
  const [localPreviews, setLocalPreviews] = useState([]);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    
    // Generate preview URLs
    const newPreviews = newFiles.map(file => ({
      file,
      previewUrl: file.type.includes('image') || file.type.includes('video') 
        ? URL.createObjectURL(file) 
        : null
    }));

    // Add to existing files
    setLocalFiles(prev => [...prev, ...newFiles]);
    setLocalPreviews(prev => [...prev, ...newPreviews]);

    // Send files back to parent component
    onUpload(newFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeFile = (index) => {
    setLocalFiles(prev => prev.filter((_, i) => i !== index));
    setLocalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const allPreviews = previewFiles || localPreviews;

  return (
    <div className="form-group">
      <div
        className="dropzone"
        ref={dropRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#fafafa',
          marginBottom: '1rem'
        }}
      >
        <CloudUpload style={{ fontSize: 48, color: '#666', marginBottom: '1rem' }} />
        <Typography variant="h6" gutterBottom>
          📄 Drag & Drop Files Here
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          or click to browse
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Supports PDF, DOC, PPT, Images, Videos (Multiple files)
        </Typography>
        
        <input
          type="file"
          id="fileInput"
          multiple // ✅ ADD THIS
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,image/*,video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="fileInput" style={{ 
          display: 'inline-block', 
          padding: '8px 16px',
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}>
          Browse Files
        </label>
      </div>

      {/* File List */}
      {localFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files ({localFiles.length}):
          </Typography>
          <List dense>
            {localFiles.map((file, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB - ${file.type}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeFile(index)} size="small">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {uploading && (
        <div className="upload-status">
          <p>Uploading... {uploadProgress}%</p>
          <progress value={uploadProgress} max="100" />
        </div>
      )}

      {/* Previews */}
      {allPreviews.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>Previews:</strong>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {allPreviews.map((preview, index) => (
              <Box key={index} sx={{ width: '200px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                {preview.previewUrl ? (
                  preview.file.type.includes('image') ? (
                    <img src={preview.previewUrl} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  ) : preview.file.type.includes('video') ? (
                    <video src={preview.previewUrl} style={{ width: '100%', height: '150px', objectFit: 'cover' }} controls />
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption">📄 {preview.file.name}</Typography>
                    </Box>
                  )
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption">📄 {preview.file.name}</Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default FileUpload;