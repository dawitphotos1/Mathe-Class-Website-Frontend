// // src/pages/FileManager.jsx - COMPLETE FIXED VERSION WITH MULTIPLE UPLOADS
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
//   Chip,
//   LinearProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   Snackbar,
//   Card,
//   CardContent,
//   Grid,
//   Badge,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   Download as DownloadIcon,
//   Visibility as ViewIcon,
//   Refresh as RefreshIcon,
//   CloudUpload as UploadIcon,
//   InsertDriveFile as FileIcon,
//   Image as ImageIcon,
//   PictureAsPdf as PdfIcon,
//   VideoLibrary as VideoIcon,
//   AudioFile as AudioIcon,
//   Description as TextIcon,
//   AttachFile as AttachIcon,
// } from "@mui/icons-material";
// import { useTheme } from "../context/ThemeContext";
// import axiosInstance from '../utils/axiosInstance';
// import "./FileManager.css";

// const FileManager = () => {
//   const [files, setFiles] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [deleteDialog, setDeleteDialog] = useState({ open: false, file: null });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   useEffect(() => {
//     loadFiles();
//     loadStats();
//   }, []);

//   const loadFiles = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get("/files");
//       console.log("📂 Files response:", response);
//       if (response.data?.success) {
//         setFiles(response.data.files || []);
//       } else {
//         console.error("Failed to load files:", response.data);
//         showSnackbar("Failed to load files", "error");
//       }
//     } catch (error) {
//       console.error("❌ Error loading files:", error);
//       showSnackbar("Error loading files: " + error.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadStats = async () => {
//     try {
//       const response = await axiosInstance.get("/files/stats");
//       console.log("📊 Stats response:", response);
//       if (response.data?.success) {
//         setStats(response.data.stats);
//       }
//     } catch (error) {
//       console.error("❌ Error loading stats:", error);
//     }
//   };

//   const handleDownload = async (filename) => {
//     try {
//       const downloadUrl = `${axiosInstance.defaults.baseURL}/files/download/${filename}`;
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       showSnackbar("File downloaded successfully", "success");
//     } catch (error) {
//       console.error("❌ Download error:", error);
//       showSnackbar("Error downloading file", "error");
//     }
//   };

//   const handlePreview = (file) => {
//     if ([".pdf", ".jpg", ".jpeg", ".png", ".gif", ".mp4", ".webm"].some(ext => file.name.toLowerCase().endsWith(ext))) {
//       window.open(
//         `${axiosInstance.defaults.baseURL}/files/preview/${file.name}`,
//         "_blank"
//       );
//     } else {
//       showSnackbar("Preview not available for this file type", "info");
//     }
//   };

//   const handleDelete = async (filename) => {
//     try {
//       const response = await axiosInstance.delete(`/files/delete/${filename}`);
//       console.log("🗑️ Delete response:", response);
//       if (response.data?.success) {
//         setFiles(files.filter((f) => f.name !== filename));
//         showSnackbar("File deleted successfully", "success");
//         loadStats(); // Refresh stats
//       } else {
//         showSnackbar("Failed to delete file", "error");
//       }
//     } catch (error) {
//       console.error("❌ Delete error:", error);
//       showSnackbar("Error deleting file: " + error.message, "error");
//     }
//   };

//   // ✅ UPDATED: Handle MULTIPLE file uploads
//   const handleFileUpload = async (event) => {
//     const files = Array.from(event.target.files);
    
//     if (files.length === 0) return;

//     console.log(`📤 Selected ${files.length} files for upload`);

//     // Check each file
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/gif",
//       "application/pdf",
//       "text/plain",
//       "video/mp4",
//       "video/webm",
//       "audio/mpeg",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "application/vnd.ms-powerpoint",
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     ];

//     // Filter valid files
//     const validFiles = [];
//     const invalidFiles = [];

//     files.forEach(file => {
//       // Check file size (50MB limit)
//       if (file.size > 50 * 1024 * 1024) {
//         invalidFiles.push(`${file.name} exceeds 50MB limit`);
//         return;
//       }
      
//       // Check file type
//       if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt)$/)) {
//         invalidFiles.push(`${file.name} type not allowed`);
//         return;
//       }
      
//       validFiles.push(file);
//     });

//     // Show warnings for invalid files
//     if (invalidFiles.length > 0) {
//       showSnackbar(
//         `${invalidFiles.length} file(s) rejected: ${invalidFiles.join(', ')}`,
//         "warning"
//       );
//     }

//     if (validFiles.length === 0) {
//       showSnackbar("No valid files to upload", "error");
//       event.target.value = "";
//       return;
//     }

//     const formData = new FormData();
    
//     // ✅ Append all valid files with array notation
//     validFiles.forEach((file, index) => {
//       formData.append("attachments[]", file); // CRITICAL: Use [] for array
//     });

//     try {
//       setUploading(true);
//       console.log(`📤 Uploading ${validFiles.length} valid files`);

//       const response = await axiosInstance.post("/files/upload", formData, {
//         timeout: 120000, // 120 second timeout for large/multiple files
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           console.log(`Upload progress: ${percentCompleted}%`);
//         },
//       });

//       console.log("✅ Upload response:", response);

//       if (response.data?.success) {
//         const uploadedCount = response.data.uploadedFiles?.length || validFiles.length;
//         showSnackbar(`${uploadedCount} file(s) uploaded successfully`, "success");
//         // Refresh the file list and stats
//         await Promise.all([loadFiles(), loadStats()]);
//       } else {
//         showSnackbar(
//           "Upload failed: " + (response.data?.error || "Unknown error"),
//           "error"
//         );
//       }
//     } catch (error) {
//       console.error("❌ Upload error:", error);
//       const errorMessage =
//         error.response?.data?.error || error.message || "Upload failed";
//       showSnackbar("Error uploading files: " + errorMessage, "error");
//     } finally {
//       setUploading(false);
//       event.target.value = ""; // Reset file input
//     }
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const getFileIcon = (fileType, fileName) => {
//     const type = fileType.toLowerCase();
//     const name = fileName.toLowerCase();
    
//     if ([".jpg", ".jpeg", ".png", ".gif", "image/"].some(t => type.includes(t) || name.endsWith(t))) {
//       return <ImageIcon color="primary" />;
//     }
//     if (type.includes("pdf") || name.endsWith(".pdf")) {
//       return <PdfIcon color="error" />;
//     }
//     if ([".mp4", ".avi", ".mov", ".webm", "video/"].some(t => type.includes(t) || name.endsWith(t))) {
//       return <VideoIcon color="secondary" />;
//     }
//     if ([".mp3", ".wav", ".ogg", "audio/"].some(t => type.includes(t) || name.endsWith(t))) {
//       return <AudioIcon color="info" />;
//     }
//     if ([".txt", ".text/plain"].some(t => type.includes(t) || name.endsWith(t))) {
//       return <TextIcon color="action" />;
//     }
//     if ([".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"].some(t => name.endsWith(t))) {
//       return <AttachIcon color="warning" />;
//     }
//     return <FileIcon color="disabled" />;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Unknown";
//     const date = new Date(dateString);
//     return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0 || !bytes) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   if (loading && files.length === 0) {
//     return (
//       <Box sx={{ p: 3 }} className={isDark ? "dark-mode" : ""}>
//         <Typography variant="h4" gutterBottom>
//           File Manager
//         </Typography>
//         <LinearProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{ p: 3 }}
//       className={`file-manager-container ${isDark ? "dark-mode" : ""}`}
//     >
//       <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
//         📁 File Manager
//       </Typography>

//       {/* Statistics Cards */}
//       {stats && (
//         <Grid container spacing={2} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card className="stats-card">
//               <CardContent>
//                 <Typography color="textSecondary" gutterBottom>
//                   Total Files
//                 </Typography>
//                 <Typography variant="h4" component="div">
//                   {stats.totalFiles || files.length}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card className="stats-card">
//               <CardContent>
//                 <Typography color="textSecondary" gutterBottom>
//                   Total Size
//                 </Typography>
//                 <Typography variant="h6" component="div">
//                   {stats.totalSizeFormatted || formatFileSize(files.reduce((sum, f) => sum + (f.size || 0), 0))}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card className="stats-card">
//               <CardContent>
//                 <Typography color="textSecondary" gutterBottom>
//                   File Types
//                 </Typography>
//                 <Typography variant="h6" component="div">
//                   {stats.fileTypes ? Object.keys(stats.fileTypes).length : 
//                     new Set(files.map(f => f.type || f.name.split('.').pop())).size}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card className="stats-card">
//               <CardContent>
//                 <Typography color="textSecondary" gutterBottom>
//                   Storage
//                 </Typography>
//                 <Typography variant="body2" noWrap title={stats.directory || "Uploads directory"}>
//                   {stats.directory ? stats.directory.split("/").pop() : "Uploads"}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       )}

//       {/* Action Buttons */}
//       <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
//         {/* ✅ UPDATED: Upload button for MULTIPLE files */}
//         <Button
//           variant="contained"
//           component="label"
//           startIcon={<UploadIcon />}
//           disabled={uploading}
//           className="upload-button"
//         >
//           <Badge badgeContent={selectedFiles.length > 0 ? selectedFiles.length : 0} color="secondary">
//             {uploading ? "Uploading..." : "Upload Files"}
//           </Badge>
//           <input 
//             type="file" 
//             hidden 
//             multiple // ✅ CRITICAL: Allow multiple selection
//             onChange={handleFileUpload} 
//             accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*,video/*,audio/*"
//           />
//         </Button>

//         <Button
//           variant="outlined"
//           startIcon={<RefreshIcon />}
//           onClick={loadFiles}
//           className="refresh-button"
//           disabled={uploading}
//         >
//           Refresh
//         </Button>

//         {uploading && (
//           <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
//             <CircularProgress size={20} sx={{ mr: 1 }} />
//             <Typography variant="body2" color="textSecondary">
//               Uploading...
//             </Typography>
//           </Box>
//         )}
//       </Box>

//       {/* Selected Files Preview */}
//       {selectedFiles.length > 0 && (
//         <Card sx={{ mb: 2, backgroundColor: '#f8f9fa' }}>
//           <CardContent>
//             <Typography variant="subtitle1" gutterBottom>
//               📋 Selected Files ({selectedFiles.length})
//             </Typography>
//             <List dense>
//               {selectedFiles.map((file, index) => (
//                 <ListItem key={index}>
//                   <ListItemText
//                     primary={file.name}
//                     secondary={`${formatFileSize(file.size)} - ${file.type || 'Unknown type'}`}
//                   />
//                   <ListItemSecondaryAction>
//                     <IconButton 
//                       edge="end" 
//                       onClick={() => {
//                         setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//                       }}
//                       size="small"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </ListItemSecondaryAction>
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       )}

//       {/* Files Table */}
//       <TableContainer component={Paper} className="files-table-container">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>File Name</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell>Size</TableCell>
//               <TableCell>Modified</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {files.map((file) => (
//               <TableRow key={file.name} hover className="file-row">
//                 <TableCell>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     {getFileIcon(file.type, file.name)}
//                     <Typography
//                       variant="body2"
//                       title={file.name}
//                       className="file-name"
//                     >
//                       {file.name.length > 30
//                         ? `${file.name.substring(0, 30)}...`
//                         : file.name}
//                     </Typography>
//                   </Box>
//                 </TableCell>
//                 <TableCell>
//                   <Chip
//                     label={file.type || file.name.split('.').pop() || "Unknown"}
//                     size="small"
//                     variant="outlined"
//                     className="file-type-chip"
//                   />
//                 </TableCell>
//                 <TableCell className="file-size">
//                   {formatFileSize(file.size)}
//                 </TableCell>
//                 <TableCell className="file-date">
//                   {formatDate(file.modified || file.updatedAt || file.createdAt)}
//                 </TableCell>
//                 <TableCell align="center" className="action-cells">
//                   <IconButton
//                     size="small"
//                     onClick={() => handlePreview(file)}
//                     title="Preview"
//                     className="action-btn preview-btn"
//                   >
//                     <ViewIcon />
//                   </IconButton>
//                   <IconButton
//                     size="small"
//                     onClick={() => handleDownload(file.name)}
//                     title="Download"
//                     className="action-btn download-btn"
//                   >
//                     <DownloadIcon />
//                   </IconButton>
//                   <IconButton
//                     size="small"
//                     color="error"
//                     onClick={() => setDeleteDialog({ open: true, file })}
//                     title="Delete"
//                     className="action-btn delete-btn"
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         {files.length === 0 && !loading && (
//           <Box sx={{ p: 4, textAlign: "center" }} className="no-files-message">
//             <Typography variant="h6" color="textSecondary">
//               No files uploaded yet
//             </Typography>
//             <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//               Use the upload button to add files to the file manager
//             </Typography>
//           </Box>
//         )}
//       </TableContainer>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialog.open}
//         onClose={() => setDeleteDialog({ open: false, file: null })}
//         className="delete-dialog"
//       >
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete "{deleteDialog.file?.name}"?
//           </Typography>
//           <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//             This action cannot be undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialog({ open: false, file: null })}>
//             Cancel
//           </Button>
//           <Button
//             onClick={() => {
//               handleDelete(deleteDialog.file.name);
//               setDeleteDialog({ open: false, file: null });
//             }}
//             color="error"
//             variant="contained"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// // CircularProgress import if not already imported
// import { CircularProgress } from "@mui/material";

// export default FileManager;





// src/pages/FileManager.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  Description as TextIcon,
  AttachFile as AttachIcon,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../utils/axiosInstance";
import "./FileManager.css";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, file: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    loadFiles();
    loadStats();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/files");
      if (response.data?.success) setFiles(response.data.files || []);
      else showSnackbar("Failed to load files", "error");
    } catch (err) {
      showSnackbar("Error loading files: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axiosInstance.get("/files/stats");
      if (response.data?.success) setStats(response.data.stats);
    } catch (err) {
      console.error("Stats load error:", err);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType, fileName) => {
    const type = (fileType || "").toLowerCase();
    const name = (fileName || "").toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", "image/"].some(t => type.includes(t) || name.endsWith(t))) return <ImageIcon color="primary" />;
    if (type.includes("pdf") || name.endsWith(".pdf")) return <PdfIcon color="error" />;
    if ([".mp4", ".avi", ".mov", ".webm", "video/"].some(t => type.includes(t) || name.endsWith(t))) return <VideoIcon color="secondary" />;
    if ([".mp3", ".wav", ".ogg", "audio/"].some(t => type.includes(t) || name.endsWith(t))) return <AudioIcon color="info" />;
    if ([".txt", ".text/plain"].some(t => type.includes(t) || name.endsWith(t))) return <TextIcon color="action" />;
    if ([".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"].some(t => name.endsWith(t))) return <AttachIcon color="warning" />;
    return <FileIcon color="disabled" />;
  };

  const handleDownload = (filename) => {
    const url = `${axiosInstance.defaults.baseURL}/files/download/${filename}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePreview = (file) => {
    if ([".pdf", ".jpg", ".jpeg", ".png", ".gif", ".mp4", ".webm"].some(ext => file.name.toLowerCase().endsWith(ext))) {
      window.open(`${axiosInstance.defaults.baseURL}/files/preview/${file.name}`, "_blank");
    } else {
      showSnackbar("Preview not available for this file type", "info");
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await axiosInstance.delete(`/files/delete/${filename}`);
      if (response.data?.success) {
        setFiles(prev => prev.filter(f => f.name !== filename));
        showSnackbar("File deleted successfully", "success");
        loadStats();
      } else {
        showSnackbar("Failed to delete file", "error");
      }
    } catch (err) {
      showSnackbar("Error deleting file: " + err.message, "error");
    }
  };

  // ------------------- MULTIPLE FILE UPLOAD -------------------
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setSelectedFiles(files);
    setFileProgress({});
    setUploading(true);

    const allowedTypes = [
      "image/jpeg","image/png","image/gif","application/pdf","text/plain",
      "video/mp4","video/webm","audio/mpeg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > 50 * 1024 * 1024) invalidFiles.push(`${file.name} exceeds 50MB`);
      else if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|jpg|jpeg|png|gif|mp4|webm|mp3)$/))
        invalidFiles.push(`${file.name} type not allowed`);
      else validFiles.push(file);
    });

    if (invalidFiles.length) showSnackbar(`${invalidFiles.length} file(s) rejected: ${invalidFiles.join(", ")}`, "warning");
    if (!validFiles.length) {
      setUploading(false);
      event.target.value = "";
      return;
    }

    // Upload files **one by one** to track per-file progress
    for (const file of validFiles) {
      const formData = new FormData();
      formData.append("attachment", file);

      try {
        await axiosInstance.post("/files/upload", formData, {
          timeout: 120000,
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFileProgress(prev => ({ ...prev, [file.name]: percent }));
          },
        });
        showSnackbar(`Uploaded: ${file.name}`, "success");
      } catch (err) {
        showSnackbar(`Error uploading ${file.name}: ${err.message}`, "error");
      }
    }

    setSelectedFiles([]);
    setFileProgress({});
    setUploading(false);
    event.target.value = "";
    loadFiles();
    loadStats();
  };

  // ------------------- RENDER -------------------
  if (loading && files.length === 0) {
    return (
      <Box sx={{ p: 3 }} className={isDark ? "dark-mode" : ""}>
        <Typography variant="h4" gutterBottom>File Manager</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} className={`file-manager-container ${isDark ? "dark-mode" : ""}`}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>📁 File Manager</Typography>

      {/* Selected Files with per-file progress */}
      {selectedFiles.length > 0 && (
        <Card sx={{ mb: 2, backgroundColor: '#f8f9fa' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>📋 Selected Files ({selectedFiles.length})</Typography>
            <List dense>
              {selectedFiles.map((file, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={file.name} secondary={`${formatFileSize(file.size)} - ${file.type || 'Unknown'}`} />
                  {uploading && fileProgress[file.name] !== undefined && (
                    <Box sx={{ width: '100px', ml: 2 }}>
                      <LinearProgress variant="determinate" value={fileProgress[file.name]} />
                      <Typography variant="caption">{fileProgress[file.name]}%</Typography>
                    </Box>
                  )}
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Upload + Refresh */}
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="contained" component="label" startIcon={<UploadIcon />} disabled={uploading}>
          Upload Files
          <input type="file" hidden multiple onChange={handleFileUpload} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*,video/*,audio/*" />
        </Button>

        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadFiles} disabled={uploading}>
          Refresh
        </Button>

        {uploading && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" color="textSecondary">Uploading...</Typography>
          </Box>
        )}
      </Box>

      {/* Files Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map(file => (
              <TableRow key={file.name} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getFileIcon(file.type, file.name)}
                    <Typography title={file.name}>{file.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Chip label={file.type || 'Unknown'} size="small" /></TableCell>
                <TableCell>{formatFileSize(file.size)}</TableCell>
                <TableCell>{formatDate(file.modified || file.updatedAt || file.createdAt)}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handlePreview(file)}><ViewIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDownload(file.name)}><DownloadIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, file })}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, file: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{deleteDialog.file?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, file: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => { handleDelete(deleteDialog.file.name); setDeleteDialog({ open: false, file: null }); }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileManager;
