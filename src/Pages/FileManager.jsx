
// import React, { useEffect, useState } from "react";
// import axios from "../utils/axiosInstance"; // updated import
// import { toast } from "react-toastify";

// const FileManager = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchFiles = async () => {
//     try {
//       const res = await axios.get("/files"); // removed /api/v1 prefix assuming axiosInstance baseURL handles it
//       setFiles(res.data.files);
//     } catch (err) {
//       toast.error("Failed to load files");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteFile = async (filename) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;
//     try {
//       await axios.delete(`/files/${filename}`);
//       toast.success("File deleted");
//       fetchFiles();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   React.useEffect(() => {
//     fetchFiles();
//   }, []);

//   return (
//     <div className="file-manager">
//       <h2>📁 Uploaded Files</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {files.map((file) => (
//             <li key={file}>
//               <a href={`/uploads/${file}`} target="_blank" rel="noreferrer">
//                 {file}
//               </a>
//               <button onClick={() => deleteFile(file)}>🗑️ Delete</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default FileManager;





//src/pages/FileManager.jsx
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
} from "@mui/icons-material";
import { axiosInstance } from "../utils/axiosInstance";
import { useTheme } from "../context/ThemeContext";
import "./FileManager.css";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, file: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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
      if (response.data.success) {
        setFiles(response.data.files);
      }
    } catch (error) {
      console.error("Error loading files:", error);
      showSnackbar("Error loading files", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axiosInstance.get("/files/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      // Create download link
      const downloadUrl = `${axiosInstance.defaults.baseURL}/files/download/${filename}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showSnackbar("File downloaded successfully", "success");
    } catch (error) {
      console.error("Download error:", error);
      showSnackbar("Error downloading file", "error");
    }
  };

  const handlePreview = (file) => {
    if ([".pdf", ".jpg", ".jpeg", ".png", ".gif"].includes(file.type)) {
      window.open(
        `${axiosInstance.defaults.baseURL}/files/preview/${file.name}`,
        "_blank"
      );
    } else {
      showSnackbar("Preview not available for this file type", "info");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/files/delete/${deleteDialog.file.name}`);
      setFiles(files.filter((f) => f.name !== deleteDialog.file.name));
      setDeleteDialog({ open: false, file: null });
      loadStats();
      showSnackbar("File deleted successfully", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showSnackbar("Error deleting file", "error");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axiosInstance.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showSnackbar("File uploaded successfully", "success");
        loadFiles();
        loadStats();
      }
    } catch (error) {
      console.error("Upload error:", error);
      showSnackbar("Error uploading file", "error");
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset file input
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif"].includes(type))
      return <ImageIcon color="primary" />;
    if (type === ".pdf") return <PdfIcon color="error" />;
    if ([".mp4", ".avi", ".mov"].includes(type))
      return <VideoIcon color="secondary" />;
    if ([".mp3", ".wav"].includes(type)) return <AudioIcon color="info" />;
    if ([".txt", ".doc", ".docx"].includes(type))
      return <TextIcon color="action" />;
    return <FileIcon color="disabled" />;
  };

  const formatDate = (dateString) => {
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString()
    );
  };

  if (loading && files.length === 0) {
    return (
      <Box sx={{ p: 3 }} className={isDark ? "dark-mode" : ""}>
        <Typography variant="h4" gutterBottom>
          File Manager
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: 3 }}
      className={`file-manager-container ${isDark ? "dark-mode" : ""}`}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        📁 File Manager
      </Typography>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stats-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Files
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.totalFiles}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stats-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Size
                </Typography>
                <Typography variant="h6" component="div">
                  {stats.totalSizeFormatted}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stats-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  File Types
                </Typography>
                <Typography variant="h6" component="div">
                  {Object.keys(stats.fileTypes).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stats-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Storage Directory
                </Typography>
                <Typography variant="body2" noWrap title={stats.directory}>
                  {stats.directory.split("/").pop()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? "Uploading..." : "Upload File"}
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadFiles}
          className="refresh-button"
        >
          Refresh
        </Button>
      </Box>

      {/* Files Table */}
      <TableContainer component={Paper} className="files-table-container">
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
            {files.map((file) => (
              <TableRow key={file.name} hover className="file-row">
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getFileIcon(file.type)}
                    <Typography
                      variant="body2"
                      title={file.name}
                      className="file-name"
                    >
                      {file.name.length > 30
                        ? `${file.name.substring(0, 30)}...`
                        : file.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={file.type || "Unknown"}
                    size="small"
                    variant="outlined"
                    className="file-type-chip"
                  />
                </TableCell>
                <TableCell className="file-size">
                  {file.sizeFormatted}
                </TableCell>
                <TableCell className="file-date">
                  {formatDate(file.modified)}
                </TableCell>
                <TableCell align="center" className="action-cells">
                  <IconButton
                    size="small"
                    onClick={() => handlePreview(file)}
                    title="Preview"
                    className="action-btn preview-btn"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(file.name)}
                    title="Download"
                    className="action-btn download-btn"
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, file })}
                    title="Delete"
                    className="action-btn delete-btn"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {files.length === 0 && !loading && (
          <Box sx={{ p: 4, textAlign: "center" }} className="no-files-message">
            <Typography variant="h6" color="textSecondary">
              No files uploaded yet
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Use the upload button to add files to the file manager
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, file: null })}
        className="delete-dialog"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.file?.name}"?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, file: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileManager;