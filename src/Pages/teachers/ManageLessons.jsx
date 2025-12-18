// // src/pages/teachers/ManageLessons.jsx
// import React from "react";
// import { useParams } from "react-router-dom";
// import ManageLessons from "../ManageLessons"; // Import from the correct location

// const TeachersManageLessons = () => {
//   const { courseId } = useParams();

//   return <ManageLessons />;
// };

// export default TeachersManageLessons;




// src/pages/teachers/ManageLessons.jsx - COMPLETE FIXED VERSION
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Add,
  PictureAsPdf,
  VideoLibrary,
  Description,
  InsertDriveFile,
} from "@mui/icons-material";

const TeachersManageLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewType, setPreviewType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchLessons = useCallback(async () => {
    try {
      const res = await axios.get(`/lessons/course/${courseId}/all`);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      toast.error("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchLessons();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, fetchLessons]);

  useEffect(() => {
    fetchLessons();
  }, [courseId, fetchLessons]);

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("Lesson deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete lesson");
    }
  };

  const handlePreview = (lesson) => {
    // Check for attachments
    if (lesson.attachments && Array.isArray(lesson.attachments) && lesson.attachments.length > 0) {
      const firstAttachment = lesson.attachments[0];
      setPreviewContent(firstAttachment.url || firstAttachment.fileUrl || firstAttachment.filePath);
      setPreviewType(firstAttachment.type || "file");
    } else if (lesson.fileUrl || lesson.file_url) {
      setPreviewContent(lesson.fileUrl || lesson.file_url);
      setPreviewType(lesson.contentType || "file");
    } else if (lesson.videoUrl || lesson.video_url) {
      setPreviewContent(lesson.videoUrl || lesson.video_url);
      setPreviewType("video");
    } else if (lesson.content) {
      setPreviewContent(lesson.content);
      setPreviewType("text");
    }
    setPreviewOpen(true);
  };

  const renderPreview = () => {
    if (!previewContent) return null;

    switch (previewType.toLowerCase()) {
      case "pdf":
      case "file":
        return (
          <iframe
            src={previewContent}
            title="Preview"
            style={{ width: "100%", height: "600px", border: "none" }}
          />
        );
      case "video":
        return (
          <video controls style={{ width: "100%", maxHeight: "600px" }}>
            <source src={previewContent} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "text":
        return (
          <Box sx={{ p: 3, maxHeight: "600px", overflow: "auto" }}>
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography>Preview not available for this file type</Typography>
            <Button
              component="a"
              href={previewContent}
              target="_blank"
              sx={{ mt: 2 }}
            >
              Open in New Tab
            </Button>
          </Box>
        );
    }
  };

  const getFileIcon = (contentType) => {
    const type = contentType?.toLowerCase() || "";
    if (type.includes("pdf")) return <PictureAsPdf color="error" />;
    if (type.includes("video")) return <VideoLibrary color="secondary" />;
    if (type.includes("text")) return <Description color="primary" />;
    return <InsertDriveFile color="action" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">📚 Manage Lessons</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to={`/courses/${courseId}/lessons/new`}
        >
          Create New Lesson
        </Button>
      </Box>

      {lessons.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>No lessons found for this course.</Typography>
          <Button
            component={Link}
            to={`/courses/${courseId}/lessons/new`}
            sx={{ mt: 1 }}
          >
            Create Your First Lesson
          </Button>
        </Alert>
      ) : (
        <Paper sx={{ overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Attachments</TableCell>
                  <TableCell>Preview</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {lesson.title}
                      </Typography>
                      {lesson.isPreview && (
                        <Chip label="Preview" size="small" color="info" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getFileIcon(lesson.contentType)}
                        <Chip
                          label={lesson.contentType || "text"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {lesson.attachments && Array.isArray(lesson.attachments) ? (
                        <Chip
                          label={`${lesson.attachments.length} files`}
                          size="small"
                          icon={<InsertDriveFile />}
                        />
                      ) : lesson.fileUrl || lesson.file_url ? (
                        <Chip label="1 file" size="small" />
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          None
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handlePreview(lesson)}
                        color="primary"
                        disabled={!lesson.fileUrl && !lesson.file_url && !lesson.attachments && !lesson.content}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/courses/${courseId}/lessons/${lesson.id}/edit`)
                          }
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(lesson.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Lesson Preview
          <IconButton
            aria-label="close"
            onClick={() => setPreviewOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {renderPreview()}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TeachersManageLessons;