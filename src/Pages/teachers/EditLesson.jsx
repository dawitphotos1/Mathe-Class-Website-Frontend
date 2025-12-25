// src/pages/teachers/EditLesson.jsx - COMPLETE & UPDATED
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useFileUpload } from "../../hooks/useFileUpload";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import "./EditLesson.css";

const EditLesson = () => {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actualCourseId, setActualCourseId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState("text");
  const [activeFileTab, setActiveFileTab] = useState("documents");
  const [units, setUnits] = useState([]);
  const [fileToView, setFileToView] = useState(null);

  // Lesson data
  const [form, setForm] = useState({
    title: "",
    content: "",
    content_type: "text",
    order_index: 0,
    is_preview: false,
    unit_id: null,
  });

  // File states
  const [existingFiles, setExistingFiles] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  // File upload hooks for different types
  const {
    files: newFiles,
    addFiles: addNewFiles,
    removeFile: removeNewFile,
    clearFiles: clearNewFiles,
    uploading: uploadingFiles,
    progress: filesProgress,
  } = useFileUpload({
    endpoint: `/lessons/${lessonId}`,
    fileType: 'files',
    maxFiles: 10,
    allowedTypes: ['application/pdf', 'application/msword', 
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'text/plain', 'image/*'],
  });

  const {
    files: newVideos,
    addFiles: addNewVideos,
    removeFile: removeNewVideo,
    clearFiles: clearNewVideos,
    uploading: uploadingVideos,
    progress: videosProgress,
  } = useFileUpload({
    endpoint: `/lessons/${lessonId}`,
    fileType: 'videos',
    maxFiles: 5,
    allowedTypes: ['video/*'],
  });

  const {
    files: newAttachments,
    addFiles: addNewAttachments,
    removeFile: removeNewAttachment,
    clearFiles: clearNewAttachments,
    uploading: uploadingAttachments,
    progress: attachmentsProgress,
  } = useFileUpload({
    endpoint: `/lessons/${lessonId}`,
    fileType: 'attachments',
    maxFiles: 20,
  });

  // Debug logging
  useEffect(() => {
    console.log("🚀 EditLesson Component Mounted:", {
      lessonId,
      courseId,
      pathname: location.pathname,
      state: location.state,
    });
  }, [lessonId, courseId, location]);

  // Load lesson data
  useEffect(() => {
    const loadLessonData = async () => {
      try {
        setLoading(true);
        
        // Determine course ID from multiple sources
        let targetCourseId = courseId || 
                            location.state?.courseId || 
                            location.state?.course?.id;

        // Load lesson details
        console.log(`📥 Loading lesson ${lessonId}`);
        const lessonRes = await axiosInstance.get(`/lessons/${lessonId}`);
        const lesson = lessonRes.data.lesson;

        // Get course ID from lesson if not provided
        if (!targetCourseId && lesson.courseId) {
          targetCourseId = lesson.courseId;
        } else if (!targetCourseId && lesson.course_id) {
          targetCourseId = lesson.course_id;
        }
        
        setActualCourseId(targetCourseId);

        // Load units for this course
        if (targetCourseId) {
          try {
            const unitsRes = await axiosInstance.get(`/courses/${targetCourseId}/units`);
            if (unitsRes.data.success) {
              setUnits(unitsRes.data.units || []);
            }
          } catch (unitsError) {
            console.log("No units found or error loading units");
          }
        }

        // Set form data
        setForm({
          title: lesson.title || "",
          content: lesson.content || "",
          content_type: lesson.contentType || "text",
          order_index: lesson.orderIndex || 0,
          is_preview: lesson.isPreview || false,
          unit_id: lesson.unitId || null,
        });

        setActiveContentTab(lesson.contentType || "text");

        // Process and set existing files
        if (lesson.fileUrls && Array.isArray(lesson.fileUrls)) {
          const fileObjects = lesson.fileUrls.map((url, index) => ({
            id: `file-${Date.now()}-${index}`,
            url,
            name: decodeURIComponent(url.split("/").pop().split("?")[0]),
            type: url.includes(".pdf") ? "application/pdf" : 
                  url.match(/\.(doc|docx)$/) ? "application/msword" :
                  url.match(/\.(jpg|jpeg|png|gif)$/) ? "image/*" : 
                  "application/octet-stream",
            size: null,
            index,
          }));
          setExistingFiles(fileObjects);
        }

        if (lesson.videoUrls && Array.isArray(lesson.videoUrls)) {
          const videoObjects = lesson.videoUrls.map((url, index) => ({
            id: `video-${Date.now()}-${index}`,
            url,
            name: decodeURIComponent(url.split("/").pop().split("?")[0]),
            type: "video/mp4",
            size: null,
            index,
          }));
          setExistingVideos(videoObjects);
        }

        if (lesson.attachments && Array.isArray(lesson.attachments)) {
          const attachmentObjects = lesson.attachments.map((att, index) => ({
            id: att.id || `attachment-${Date.now()}-${index}`,
            url: att.filePath,
            name: att.fileName || decodeURIComponent(att.filePath?.split("/").pop().split("?")[0] || `attachment-${index}`),
            type: att.fileType || "application/octet-stream",
            size: att.fileSize,
            createdAt: att.createdAt,
            index,
          }));
          setExistingAttachments(attachmentObjects);
        }

        console.log("✅ Lesson loaded successfully:", {
          title: lesson.title,
          files: lesson.fileUrls?.length || 0,
          videos: lesson.videoUrls?.length || 0,
          attachments: lesson.attachments?.length || 0,
        });

      } catch (err) {
        console.error("❌ Failed to load lesson:", err);
        toast.error("Failed to load lesson. Please check the lesson ID.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      loadLessonData();
    }
  }, [lessonId, courseId, navigate, location.state]);

  // Handle form changes
  const handleFormChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (field === "content_type") {
      setActiveContentTab(value);
    }
  };

  // Handle file upload for different types
  const handleFileUpload = (event, fileType) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    switch (fileType) {
      case 'files':
        addNewFiles(files);
        break;
      case 'videos':
        addNewVideos(files);
        break;
      case 'attachments':
        addNewAttachments(files);
        break;
      default:
        console.warn(`Unknown file type: ${fileType}`);
    }
    
    // Reset input
    event.target.value = '';
  };

  // Delete existing file
  const handleDeleteExistingFile = async (fileId, fileType, index) => {
    try {
      console.log(`Deleting ${fileType} at index ${index}, id: ${fileId}`);
      
      // Call API to delete file from server
      if (fileType === 'file') {
        await axiosInstance.delete(`/lessons/${lessonId}/files/file/${index}`);
        setExistingFiles(prev => prev.filter((_, i) => i !== index));
      } else if (fileType === 'video') {
        await axiosInstance.delete(`/lessons/${lessonId}/files/video/${index}`);
        setExistingVideos(prev => prev.filter((_, i) => i !== index));
      } else if (fileType === 'attachment') {
        await axiosInstance.delete(`/attachments/${fileId}`);
        setExistingAttachments(prev => prev.filter(att => att.id !== fileId));
      }
      
      toast.success("File deleted successfully");
    } catch (err) {
      console.error("Failed to delete file:", err);
      toast.error("Failed to delete file");
    }
  };

  // Download file
  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || decodeURIComponent(url.split("/").pop().split("?")[0]);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  // View file in new tab
  const handleView = (url) => {
    window.open(url, "_blank");
  };

  // Preview PDF in modal
  const handlePreviewPdf = (url, name) => {
    setFileToView({ url, name, type: 'pdf' });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    try {
      setSaving(true);

      // Prepare form data
      const formData = new FormData();
      
      // Add lesson data
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });
      
      // Add new files
      newFiles.forEach(file => {
        formData.append("files", file);
      });
      
      newVideos.forEach(video => {
        formData.append("videos", video);
      });
      
      newAttachments.forEach(attachment => {
        formData.append("attachments", attachment);
      });

      console.log("💾 Updating lesson:", {
        lessonId,
        title: form.title,
        newFiles: newFiles.length,
        newVideos: newVideos.length,
        newAttachments: newAttachments.length,
      });

      const response = await axiosInstance.put(
        `/lessons/${lessonId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success("✅ Lesson updated successfully!");
        
        // Clear uploaded files
        clearNewFiles();
        clearNewVideos();
        clearNewAttachments();
        
        // Navigate back
        setTimeout(() => {
          if (actualCourseId) {
            navigate(`/courses/${actualCourseId}/manage-lessons`);
          } else {
            navigate(-1);
          }
        }, 1000);
      } else {
        throw new Error(response.data.error || "Update failed");
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error(err.response?.data?.error || "Failed to update lesson");
    } finally {
      setSaving(false);
    }
  };

  // Delete entire lesson
  const handleDeleteLesson = async () => {
    try {
      await axiosInstance.delete(`/lessons/${lessonId}`);
      toast.success("✅ Lesson deleted successfully");
      setDeleteDialog(false);
      
      if (actualCourseId) {
        navigate(`/courses/${actualCourseId}/manage-lessons`);
      } else {
        navigate("/courses");
      }
    } catch (err) {
      toast.error("Failed to delete lesson");
    }
  };

  // Helper functions
  const getFileIcon = (fileName, fileType) => {
    const name = (fileName || "").toLowerCase();
    const type = (fileType || "").toLowerCase();

    if (name.endsWith(".pdf") || type.includes("pdf")) {
      return <PdfIcon color="error" />;
    }
    if (type.startsWith("video/") || name.match(/\.(mp4|mov|avi|webm|wmv)$/)) {
      return <VideoIcon color="secondary" />;
    }
    if (type.startsWith("image/") || name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      return <ImageIcon color="primary" />;
    }
    if (name.match(/\.(doc|docx)$/)) return <DescriptionIcon color="info" />;
    if (name.match(/\.(ppt|pptx)$/)) return <DescriptionIcon color="warning" />;
    if (name.match(/\.(xls|xlsx)$/)) return <DescriptionIcon color="success" />;
    if (name.match(/\.(zip|rar|7z)$/)) return <FolderIcon color="action" />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeName = (fileName, fileType) => {
    const name = (fileName || "").toLowerCase();
    if (name.endsWith(".pdf")) return "PDF Document";
    if (name.endsWith(".doc") || name.endsWith(".docx")) return "Word Document";
    if (name.endsWith(".ppt") || name.endsWith(".pptx")) return "Presentation";
    if (name.endsWith(".xls") || name.endsWith(".xlsx")) return "Spreadsheet";
    if (name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "Image";
    if (name.match(/\.(mp4|mov|avi|webm|wmv)$/)) return "Video";
    if (name.match(/\.(zip|rar|7z)$/)) return "Archive";
    return fileType || "File";
  };

  // Calculate totals
  const totalNewFiles = newFiles.length + newVideos.length + newAttachments.length;
  const totalExistingFiles = existingFiles.length + existingVideos.length + existingAttachments.length;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">Loading lesson...</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Lesson ID: {lessonId}<br />
          Course ID: {actualCourseId || "Loading..."}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            ✏️ Edit Lesson
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog(true)}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Lesson ID: <strong>{lessonId}</strong> • Course ID: <strong>{actualCourseId || "Not specified"}</strong>
        </Typography>
      </Paper>

      {/* Upload Progress Indicators */}
      {(uploadingFiles || uploadingVideos || uploadingAttachments) && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Uploading Files...
          </Typography>
          {uploadingFiles && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Documents: {filesProgress}%</Typography>
              <LinearProgress variant="determinate" value={filesProgress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}
          {uploadingVideos && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Videos: {videosProgress}%</Typography>
              <LinearProgress variant="determinate" value={videosProgress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}
          {uploadingAttachments && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Attachments: {attachmentsProgress}%</Typography>
              <LinearProgress variant="determinate" value={attachmentsProgress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}
        </Paper>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Left Column - Lesson Details */}
          <Grid item xs={12} md={8}>
            {/* Lesson Details Card */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Lesson Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Lesson Title *"
                      value={form.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      required
                      disabled={saving}
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Order Index"
                      type="number"
                      value={form.order_index}
                      onChange={(e) => handleFormChange("order_index", parseInt(e.target.value) || 0)}
                      disabled={saving}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.is_preview}
                          onChange={(e) => handleFormChange("is_preview", e.target.checked)}
                          disabled={saving}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Mark as Preview Lesson
                          <Typography variant="caption" display="block" color="text.secondary">
                            (Free for students to view)
                          </Typography>
                        </Typography>
                      }
                    />
                  </Grid>
                  
                  {units.length > 0 && (
                    <Grid item xs={12}>
                      <InputLabel>Unit</InputLabel>
                      <Select
                        fullWidth
                        value={form.unit_id || ''}
                        onChange={(e) => handleFormChange("unit_id", e.target.value)}
                        disabled={saving}
                        variant="outlined"
                      >
                        <MenuItem value="">No Unit</MenuItem>
                        {units.map(unit => (
                          <MenuItem key={unit.id} value={unit.id}>
                            {unit.title} (Order: {unit.order_index})
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Content Type Card */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Content Type
                </Typography>
                
                <Tabs 
                  value={activeContentTab} 
                  onChange={(e, newValue) => {
                    setActiveContentTab(newValue);
                    handleFormChange("content_type", newValue);
                  }}
                  sx={{ mb: 3 }}
                  variant="fullWidth"
                >
                  <Tab label="Text" value="text" icon={<DescriptionIcon />} iconPosition="start" />
                  <Tab label="Video" value="video" icon={<VideoIcon />} iconPosition="start" />
                  <Tab label="PDF" value="pdf" icon={<PdfIcon />} iconPosition="start" />
                  <Tab label="Mixed" value="mixed" icon={<FolderIcon />} iconPosition="start" />
                </Tabs>
                
                {activeContentTab === "text" && (
                  <Box className="quill-editor-container">
                    <ReactQuill
                      value={form.content}
                      onChange={(value) => handleFormChange("content", value)}
                      theme="snow"
                      placeholder="Enter lesson content here..."
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                    />
                  </Box>
                )}
                
                {activeContentTab === "video" && (
                  <Box>
                    <TextField
                      fullWidth
                      label="Video URL or Embed Code"
                      value={form.content}
                      onChange={(e) => handleFormChange("content", e.target.value)}
                      placeholder="Enter YouTube URL, Vimeo URL, or direct video link"
                      multiline
                      rows={3}
                      disabled={saving}
                      variant="outlined"
                      helperText="Supports YouTube, Vimeo, or direct MP4 links"
                    />
                  </Box>
                )}
                
                {(activeContentTab === "pdf" || activeContentTab === "mixed") && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Upload your files in the "File Management" section below. 
                      {activeContentTab === "pdf" ? " PDF files will be displayed here." : " All file types will be available for students."}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - File Management */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📁 File Management
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {totalNewFiles} new files, {totalExistingFiles} existing files
                </Typography>

                {/* File Type Tabs */}
                <Tabs 
                  value={activeFileTab} 
                  onChange={(e, newValue) => setActiveFileTab(newValue)}
                  sx={{ mb: 2 }}
                  variant="fullWidth"
                >
                  <Tab label="Documents" value="documents" />
                  <Tab label="Videos" value="videos" />
                  <Tab label="Attachments" value="attachments" />
                </Tabs>

                {/* File Upload Section */}
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    disabled={saving}
                    sx={{ mb: 2 }}
                  >
                    Upload {activeFileTab === 'documents' ? 'Documents' : 
                           activeFileTab === 'videos' ? 'Videos' : 'Attachments'}
                    <input
                      type="file"
                      hidden
                      multiple
                      accept={
                        activeFileTab === 'documents' ? ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" :
                        activeFileTab === 'videos' ? "video/*" : "*/*"
                      }
                      onChange={(e) => handleFileUpload(e, 
                        activeFileTab === 'documents' ? 'files' :
                        activeFileTab === 'videos' ? 'videos' : 'attachments'
                      )}
                    />
                  </Button>
                  
                  <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                    {activeFileTab === 'documents' ? 'PDF, Word, Images, Text' :
                     activeFileTab === 'videos' ? 'MP4, MOV, AVI, WebM' :
                     'Any file type'}
                  </Typography>
                </Box>

                {/* File Lists */}
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {/* New Files */}
                  {((activeFileTab === 'documents' && newFiles.length > 0) ||
                    (activeFileTab === 'videos' && newVideos.length > 0) ||
                    (activeFileTab === 'attachments' && newAttachments.length > 0)) && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        New Files to Upload
                      </Typography>
                      <List dense>
                        {(activeFileTab === 'documents' ? newFiles :
                          activeFileTab === 'videos' ? newVideos : newAttachments).map((file, index) => (
                          <ListItem
                            key={index}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={() => {
                                  if (activeFileTab === 'documents') removeNewFile(index);
                                  else if (activeFileTab === 'videos') removeNewVideo(index);
                                  else removeNewAttachment(index);
                                }}
                                disabled={saving}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            }
                            sx={{ py: 0.5 }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {getFileIcon(file.name, file.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" noWrap>
                                  {file.name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {formatFileSize(file.size)}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Existing Files */}
                  {((activeFileTab === 'documents' && existingFiles.length > 0) ||
                    (activeFileTab === 'videos' && existingVideos.length > 0) ||
                    (activeFileTab === 'attachments' && existingAttachments.length > 0)) && (
                    <Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Existing Files
                      </Typography>
                      <List dense>
                        {(activeFileTab === 'documents' ? existingFiles :
                          activeFileTab === 'videos' ? existingVideos : existingAttachments).map((file, index) => (
                          <ListItem
                            key={file.id}
                            secondaryAction={
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownload(file.url, file.name)}
                                  sx={{ mr: 0.5 }}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteExistingFile(
                                    file.id,
                                    activeFileTab === 'documents' ? 'file' :
                                    activeFileTab === 'videos' ? 'video' : 'attachment',
                                    index
                                  )}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                            sx={{ py: 0.5 }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {getFileIcon(file.name, file.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" noWrap>
                                  {file.name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {getFileTypeName(file.name, file.type)}
                                  {file.size && ` • ${formatFileSize(file.size)}`}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* No Files Message */}
                  {((activeFileTab === 'documents' && newFiles.length === 0 && existingFiles.length === 0) ||
                    (activeFileTab === 'videos' && newVideos.length === 0 && existingVideos.length === 0) ||
                    (activeFileTab === 'attachments' && newAttachments.length === 0 && existingAttachments.length === 0)) && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <FileIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        No {activeFileTab} uploaded yet
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Clear All Button */}
                {totalNewFiles > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    fullWidth
                    onClick={() => {
                      clearNewFiles();
                      clearNewVideos();
                      clearNewAttachments();
                    }}
                    disabled={saving}
                    sx={{ mt: 2 }}
                  >
                    Clear All New Files
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            disabled={saving}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={saving || uploadingFiles || uploadingVideos || uploadingAttachments}
            startIcon={saving ? <CircularProgress size={24} /> : <SaveIcon />}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </form>

      {/* PDF Viewer Modal */}
      <Dialog
        open={!!fileToView}
        onClose={() => setFileToView(null)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {fileToView?.name || 'PDF Viewer'}
            </Typography>
            <IconButton onClick={() => setFileToView(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {fileToView?.type === 'pdf' && (
            <iframe
              src={fileToView.url}
              style={{
                width: '100%',
                height: '80vh',
                border: 'none',
              }}
              title="PDF Viewer"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDownload(fileToView?.url, fileToView?.name)}>
            Download
          </Button>
          <Button onClick={() => setFileToView(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
      >
        <DialogTitle>Delete Lesson</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All lesson content and files will be permanently deleted.
          </Alert>
          <Typography variant="body2">
            Are you sure you want to delete the lesson "{form.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteLesson}
            color="error"
            variant="contained"
            disabled={saving}
            startIcon={<DeleteIcon />}
          >
            Delete Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditLesson;