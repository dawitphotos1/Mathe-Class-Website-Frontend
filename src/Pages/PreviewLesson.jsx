// src/pages/PreviewLesson.jsx - UPDATED WITH MULTI-FILE SUPPORT
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../utils/axiosInstance';
import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  ArrowBack as BackIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import "./PreviewLesson.css";

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewingPdf, setViewingPdf] = useState(null);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/lessons/${lessonId}`);
      
      if (response.data.success) {
        setLesson(response.data.lesson);
        console.log("📚 Lesson loaded:", response.data.lesson);
      } else {
        setError("Failed to load lesson");
        toast.error("Failed to load lesson");
        navigate("/courses");
      }
    } catch (error) {
      console.error("❌ Error loading lesson:", error);
      setError("Unable to load lesson");
      toast.error("Unable to load lesson");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName, fileType) => {
    const name = (fileName || "").toLowerCase();
    const type = (fileType || "").toLowerCase();

    if (name.endsWith(".pdf") || type.includes("pdf")) {
      return <PdfIcon color="error" />;
    }
    if (type.startsWith("video/") || name.match(/\.(mp4|mov|avi|webm|wmv)$/)) {
      return <VideoIcon color="secondary" />;
    }
    if (type.startsWith("image/") || name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return <ImageIcon color="primary" />;
    }
    if (name.match(/\.(doc|docx)$/)) return <FileIcon color="info" />;
    if (name.match(/\.(ppt|pptx)$/)) return <FileIcon color="warning" />;
    if (name.match(/\.(xls|xlsx)$/)) return <FileIcon color="success" />;
    return <FileIcon />;
  };

  const getFileTypeName = (url, fileType) => {
    if (!url) return fileType || "File";
    const extension = url.split(".").pop().toLowerCase();
    if (extension === "pdf") return "PDF Document";
    if (["doc", "docx"].includes(extension)) return "Word Document";
    if (["ppt", "pptx"].includes(extension)) return "PowerPoint";
    if (["xls", "xlsx"].includes(extension)) return "Excel Spreadsheet";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "Image";
    if (["mp4", "mov", "avi", "webm", "wmv"].includes(extension)) return "Video";
    return fileType || "File";
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading lesson content...
        </Typography>
      </Container>
    );
  }

  if (error || !lesson) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Lesson not found"}
        </Alert>
        <Button
          variant="contained"
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back to Courses
        </Button>
      </Container>
    );
  }

  // Check if we have any files to show
  const hasFiles = lesson.fileUrls?.length > 0 || lesson.videoUrls?.length > 0 || lesson.attachments?.length > 0;
  const totalFiles = (lesson.fileUrls?.length || 0) + (lesson.videoUrls?.length || 0) + (lesson.attachments?.length || 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          {lesson.title}
        </Typography>
        
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {lesson.isPreview && (
            <Chip 
              label="FREE PREVIEW" 
              color="primary" 
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          )}
          <Chip 
            label={`Lesson ${lesson.orderIndex || 1}`} 
            variant="outlined" 
            size="small" 
          />
          {lesson.contentType && (
            <Chip 
              label={lesson.contentType.toUpperCase()} 
              variant="outlined" 
              size="small"
              color="secondary"
            />
          )}
          {totalFiles > 0 && (
            <Chip 
              label={`${totalFiles} Files`} 
              variant="outlined" 
              size="small"
              color="success"
            />
          )}
        </Box>
      </Box>

      {/* Lesson Content */}
      {lesson.content && (
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 2,
            backgroundColor: "background.paper",
            boxShadow: 3,
          }}
        >
          <Typography 
            variant="body1" 
            component="div"
            sx={{ 
              fontSize: "1.1rem",
              lineHeight: 1.8,
              '& p': { mb: 3 },
              '& h1, & h2, & h3, & h4': { mt: 3, mb: 2, fontWeight: 600 },
              '& ul, & ol': { pl: 4, mb: 3 },
              '& li': { mb: 1.5 },
              '& img': { maxWidth: "100%", height: "auto", borderRadius: 1 },
              '& blockquote': { 
                borderLeft: "4px solid #1976d2", 
                pl: 3, 
                py: 1, 
                my: 3,
                backgroundColor: "action.hover",
                fontStyle: "italic",
              },
            }}
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </Paper>
      )}

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            p: 3,
          }}
          onClick={() => setViewingPdf(null)}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                color: "white",
              }}
            >
              <Typography variant="h6">
                {viewingPdf.name || "PDF Viewer"}
              </Typography>
              <IconButton onClick={() => setViewingPdf(null)} sx={{ color: "white" }}>
                <Typography>✕</Typography>
              </IconButton>
            </Box>
            <iframe
              src={viewingPdf.url}
              style={{
                flex: 1,
                width: "100%",
                border: "none",
                borderRadius: 8,
              }}
              title="PDF Viewer"
            />
          </Box>
        </Box>
      )}

      {/* Files Tabs - Only show if we have files */}
      {hasFiles && (
        <Paper sx={{ mb: 4, borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ 
              borderBottom: 1, 
              borderColor: "divider",
              backgroundColor: "background.default",
            }}
            variant="fullWidth"
          >
            {lesson.fileUrls?.length > 0 && (
              <Tab 
                icon={<PdfIcon />}
                iconPosition="start"
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Documents
                    <Chip 
                      label={lesson.fileUrls.length}
                      size="small" 
                      sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
                    />
                  </Box>
                } 
              />
            )}
            {lesson.videoUrls?.length > 0 && (
              <Tab 
                icon={<VideoIcon />}
                iconPosition="start"
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Videos
                    <Chip 
                      label={lesson.videoUrls.length}
                      size="small" 
                      sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
                    />
                  </Box>
                } 
              />
            )}
            {lesson.attachments?.length > 0 && (
              <Tab 
                icon={<FileIcon />}
                iconPosition="start"
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Attachments
                    <Chip 
                      label={lesson.attachments.length}
                      size="small" 
                      sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
                    />
                  </Box>
                } 
              />
            )}
          </Tabs>
          
          {/* Documents Tab */}
          {activeTab === 0 && lesson.fileUrls?.length > 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {lesson.fileUrls.map((url, index) => {
                  const fileName = url.split("/").pop();
                  const isPdf = fileName.toLowerCase().endsWith(".pdf");
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card 
                        sx={{ 
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s",
                          '&:hover': {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            {getFileIcon(fileName)}
                            <Typography variant="h6" sx={{ ml: 1, fontSize: "1rem" }} noWrap>
                              {getFileTypeName(url)}
                            </Typography>
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {fileName}
                          </Typography>
                          
                          <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ViewIcon />}
                              onClick={() => isPdf ? setViewingPdf({ url, name: fileName }) : handleView(url)}
                              fullWidth
                            >
                              {isPdf ? "View PDF" : "View"}
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownload(url, fileName)}
                              fullWidth
                            >
                              Download
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
          
          {/* Videos Tab */}
          {activeTab === (lesson.fileUrls?.length > 0 ? 1 : 0) && lesson.videoUrls?.length > 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {lesson.videoUrls.map((url, index) => {
                  const fileName = url.split("/").pop();
                  
                  return (
                    <Grid item xs={12} key={index}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <VideoIcon sx={{ mr: 1, color: "secondary.main" }} />
                            <Typography variant="h6">
                              Video {index + 1}: {fileName}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ position: "relative", paddingTop: "56.25%", mb: 3 }}>
                            {url.includes("youtube.com") || url.includes("youtu.be") ? (
                              <iframe
                                src={url.includes("embed") ? url : `https://www.youtube.com/embed/${url.split("v=")[1]?.split("&")[0]}`}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                  borderRadius: "8px",
                                }}
                                title={`Video ${index + 1}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                controls
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "8px",
                                }}
                              >
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </Box>
                          
                          <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownload(url, fileName)}
                            fullWidth
                          >
                            Download Video
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
          
          {/* Attachments Tab */}
          {activeTab === (lesson.fileUrls?.length > 0 && lesson.videoUrls?.length > 0 ? 2 : 
                         lesson.fileUrls?.length > 0 || lesson.videoUrls?.length > 0 ? 1 : 0) && 
           lesson.attachments?.length > 0 && (
            <Box sx={{ p: 3 }}>
              <List>
                {lesson.attachments.map((attachment, index) => {
                  const fileName = attachment.fileName || attachment.name || attachment.filePath?.split("/").pop();
                  const fileUrl = attachment.filePath || attachment.url;
                  const fileSize = attachment.fileSize || attachment.size;
                  const fileType = attachment.fileType || attachment.type;
                  
                  return (
                    <React.Fragment key={attachment.id || index}>
                      <ListItem
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            onClick={() => handleDownload(fileUrl, fileName)}
                            color="primary"
                          >
                            <DownloadIcon />
                          </IconButton>
                        }
                        sx={{
                          backgroundColor: index % 2 === 0 ? "action.hover" : "transparent",
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemIcon>
                          {getFileIcon(fileName, fileType)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {fileName}
                            </Typography>
                          }
                          secondary={
                            <span>
                              {getFileTypeName(fileUrl, fileType)}
                              {fileSize && ` • ${formatFileSize(fileSize)}`}
                              {attachment.createdAt && ` • ${new Date(attachment.createdAt).toLocaleDateString()}`}
                            </span>
                          }
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleView(fileUrl)}
                          sx={{ ml: 2 }}
                        >
                          View
                        </Button>
                      </ListItem>
                      {index < lesson.attachments.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          )}
        </Paper>
      )}

      {/* No Files Message */}
      {!hasFiles && (
        <Paper sx={{ p: 4, textAlign: "center", mb: 4, borderRadius: 2 }}>
          <FileIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Files Attached
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This lesson doesn't have any attached files, videos, or documents.
          </Typography>
        </Paper>
      )}

      {/* Lesson Stats */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Lesson Resources: {lesson.fileUrls?.length || 0} documents, {lesson.videoUrls?.length || 0} videos, {lesson.attachments?.length || 0} attachments
        </Typography>
      </Paper>
    </Container>
  );
};

export default PreviewLesson;