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
