// src/pages/teachers/ManageLessons.jsx - DEBUG VERSION
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from '../../utils/axiosInstance';
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
  Tooltip,
  Collapse,
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
  AttachFile,
  Download,
  OpenInNew,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

// ✅ ADD CSS IMPORT
import "./ManageLessons.css";

const TeachersManageLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ NEW: Debug function to check lesson structure
  const debugLessonStructure = (lesson, lessonIndex) => {
    console.log(`🔍 DEBUG Lesson ${lessonIndex}: "${lesson.title}"`);
    console.log("Full lesson object:", lesson);
    
    // Check all possible attachment fields
    console.log("📌 Checking attachment fields:");
    console.log("1. attachments array:", lesson.attachments);
    console.log("2. file_url:", lesson.file_url);
    console.log("3. fileUrl:", lesson.fileUrl);
    console.log("4. video_url:", lesson.video_url);
    console.log("5. videoUrl:", lesson.videoUrl);
    console.log("6. content:", lesson.content ? `Has content (${lesson.content.length} chars)` : "No content");
    console.log("7. contentType:", lesson.contentType);
    console.log("8. content_type:", lesson.content_type);
    
    // Calculate hasAttachments manually
    let hasAttachmentsCalc = false;
    let attachmentCountCalc = 0;
    
    if (Array.isArray(lesson.attachments) && lesson.attachments.length > 0) {
      attachmentCountCalc = lesson.attachments.length;
      hasAttachmentsCalc = true;
      console.log("✅ Found attachments array with", attachmentCountCalc, "items");
    }
    
    if (lesson.file_url || lesson.fileUrl) {
      attachmentCountCalc++;
      hasAttachmentsCalc = true;
      console.log("✅ Found file_url/fileUrl");
    }
    
    if (lesson.video_url || lesson.videoUrl) {
      attachmentCountCalc++;
      hasAttachmentsCalc = true;
      console.log("✅ Found video_url/videoUrl");
    }
    
    console.log("📊 Calculated: hasAttachments =", hasAttachmentsCalc, "count =", attachmentCountCalc);
    console.log("---");
  };

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`📥 Fetching lessons for course: ${courseId}`);
      
      // Try multiple endpoints
      let res;
      let endpointUsed = '';
      
      try {
        res = await axios.get(`/lessons/course/${courseId}/all`);
        endpointUsed = '/lessons/course/:courseId/all';
      } catch (err) {
        console.log("First endpoint failed, trying alternative...");
        try {
          res = await axios.get(`/courses/${courseId}/lessons`);
          endpointUsed = '/courses/:courseId/lessons';
        } catch (err2) {
          console.log("Second endpoint failed, trying third...");
          res = await axios.get(`/teacher/courses/${courseId}/lessons`);
          endpointUsed = '/teacher/courses/:courseId/lessons';
        }
      }
      
      console.log(`📚 API Response from ${endpointUsed}:`, res.data);
      
      let lessonsData = [];
      
      // Parse response based on different possible structures
      if (res.data.success) {
        lessonsData = res.data.lessons || [];
      } else if (Array.isArray(res.data)) {
        lessonsData = res.data;
      } else if (res.data.lessons) {
        lessonsData = res.data.lessons;
      } else if (res.data.course && Array.isArray(res.data.course.lessons)) {
        lessonsData = res.data.course.lessons;
      }
      
      console.log(`📦 Raw lessons data (${lessonsData.length} lessons):`, lessonsData);
      
      // Process each lesson individually
      const processedLessons = lessonsData.map((lesson, index) => {
        // Log the raw lesson data for debugging
        console.log(`\n📝 Processing lesson ${index}: "${lesson.title || 'Untitled'}"`);
        console.log("Raw lesson data:", lesson);
        
        // Method 1: Check attachments array
        let attachments = [];
        if (Array.isArray(lesson.attachments)) {
          attachments = lesson.attachments;
          console.log(`  Found ${attachments.length} attachments in array`);
        }
        
        // Method 2: Check for single file (legacy format)
        let legacyFiles = [];
        if (lesson.file_url || lesson.fileUrl) {
          const fileUrl = lesson.file_url || lesson.fileUrl;
          legacyFiles.push({
            id: 'legacy-file',
            url: fileUrl,
            name: fileUrl.split('/').pop() || 'File',
            type: lesson.content_type || lesson.contentType || 'file'
          });
          console.log(`  Found file_url: ${fileUrl}`);
        }
        
        // Method 3: Check for video
        if (lesson.video_url || lesson.videoUrl) {
          const videoUrl = lesson.video_url || lesson.videoUrl;
          legacyFiles.push({
            id: 'video',
            url: videoUrl,
            name: 'Video Lesson',
            type: 'video'
          });
          console.log(`  Found video_url: ${videoUrl}`);
        }
        
        // Combine all attachments
        const allAttachments = [...attachments, ...legacyFiles];
        const hasAttachments = allAttachments.length > 0;
        const attachmentCount = allAttachments.length;
        
        console.log(`  Total attachments: ${attachmentCount}, hasAttachments: ${hasAttachments}`);
        
        // Check for content
        const hasContent = !!(lesson.content || lesson.textContent);
        console.log(`  Has text content: ${hasContent}`);
        
        return {
          id: lesson.id || lesson._id,
          title: lesson.title || 'Untitled Lesson',
          content_type: lesson.content_type || lesson.contentType || 'text',
          isPreview: lesson.is_preview || lesson.isPreview || false,
          order_index: lesson.order_index || lesson.orderIndex || 0,
          unit_id: lesson.unit_id,
          subunit_id: lesson.subunit_id,
          attachments: allAttachments,
          hasAttachments: hasAttachments,
          attachmentCount: attachmentCount,
          hasContent: hasContent,
          content: lesson.content || lesson.textContent,
          file_url: lesson.file_url || lesson.fileUrl,
          video_url: lesson.video_url || lesson.videoUrl,
          // Store original for debugging
          _raw: lesson
        };
      });
      
      console.log("\n✅ FINAL Processed lessons:");
      processedLessons.forEach((lesson, index) => {
        console.log(`${index}. "${lesson.title}" - Attachments: ${lesson.attachmentCount}, HasContent: ${lesson.hasContent}`);
      });
      
      setLessons(processedLessons);
      
    } catch (err) {
      console.error("❌ Error fetching lessons:", err);
      toast.error("Failed to fetch lessons: " + (err.message || 'Unknown error'));
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [courseId, fetchLessons]);

  const toggleLessonDetails = (lessonId) => {
    setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("Lesson deleted successfully");
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error(err.response?.data?.error || "Failed to delete lesson");
    }
  };

  // ✅ FIXED: Enhanced preview function
  const handlePreview = (lesson) => {
    console.log(`👁️ Preview clicked for: "${lesson.title}"`);
    console.log("Lesson preview data:", {
      hasAttachments: lesson.hasAttachments,
      attachmentCount: lesson.attachmentCount,
      hasContent: lesson.hasContent,
      attachments: lesson.attachments,
      file_url: lesson.file_url,
      video_url: lesson.video_url
    });
    
    if (lesson.hasAttachments) {
      // Try attachments first
      if (lesson.attachments.length > 0) {
        const firstAttachment = lesson.attachments[0];
        console.log("Opening first attachment:", firstAttachment);
        openFileInNewWindow(firstAttachment.url, firstAttachment.type || 'file');
      } else if (lesson.file_url) {
        console.log("Opening file_url:", lesson.file_url);
        openFileInNewWindow(lesson.file_url, lesson.content_type || 'file');
      } else if (lesson.video_url) {
        console.log("Opening video_url:", lesson.video_url);
        openFileInNewWindow(lesson.video_url, 'video');
      }
    } else if (lesson.hasContent) {
      // Show text content in alert for debugging
      alert(`Text content preview for: ${lesson.title}\n\n${lesson.content?.substring(0, 500)}...`);
    } else {
      toast.info("No content or files available for preview");
    }
  };

  const openFileInNewWindow = (url, type) => {
    if (!url) {
      toast.error("No URL provided");
      return;
    }
    
    try {
      if (type === 'pdf' || url.includes('.pdf')) {
        // Use Google Docs Viewer
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        window.open(viewerUrl, '_blank', 'noopener,noreferrer,width=1000,height=700');
      } else if (type === 'video' || url.includes('.mp4') || url.includes('.mov')) {
        // Create video player page
        const videoHtml = `
          <html>
            <head><title>Video Preview</title></head>
            <body style="margin:0;background:#000">
              <video controls autoplay style="width:100%;height:100vh">
                <source src="${url}" type="video/mp4">
              </video>
            </body>
          </html>
        `;
        const win = window.open('', '_blank', 'noopener,noreferrer,width=1000,height=700');
        win.document.write(videoHtml);
      } else {
        // Open directly
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Failed to open file");
    }
  };

  const handleViewAttachments = (lesson) => {
    console.log(`📎 View attachments for: "${lesson.title}"`);
    console.log("Attachments:", lesson.attachments);
    
    if (!lesson.hasAttachments) {
      toast.info("No attachments found for this lesson");
      return;
    }
    
    if (lesson.attachments.length === 1) {
      // If only one attachment, open it directly
      const attachment = lesson.attachments[0];
      openFileInNewWindow(attachment.url, attachment.type);
    } else {
      // Show list in alert for now
      const fileList = lesson.attachments.map((att, idx) => 
        `${idx + 1}. ${att.name || 'File'} (${att.type || 'unknown'})`
      ).join('\n');
      
      alert(`Attachments for "${lesson.title}":\n\n${fileList}\n\nClick Preview to open the first file.`);
    }
  };

  // ✅ Check if button should be enabled
  const isPreviewEnabled = (lesson) => {
    return lesson.hasAttachments || lesson.hasContent;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading lessons...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Debug Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            📚 Manage Lessons
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Course ID: {courseId} • {lessons.length} lessons
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              console.log("=== DEBUG: ALL LESSONS DATA ===");
              lessons.forEach((lesson, index) => debugLessonStructure(lesson, index));
              toast.info("Check console for lesson data");
            }}
          >
            Debug Data
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to={`/courses/${courseId}/lessons/new`}
          >
            Create Lesson
          </Button>
        </Box>
      </Box>

      {lessons.length === 0 ? (
        <Alert severity="info">
          <Typography>No lessons found for this course.</Typography>
        </Alert>
      ) : (
        <Paper sx={{ overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '300px' }}>Title & Details</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attachments</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Preview</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((lesson) => (
                  <React.Fragment key={lesson.id}>
                    <TableRow hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => toggleLessonDetails(lesson.id)}
                          >
                            {expandedLessonId === lesson.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                          <Box>
                            <Typography fontWeight="medium">
                              {lesson.title}
                              {lesson.isPreview && (
                                <Chip label="Preview" size="small" color="info" sx={{ ml: 1 }} />
                              )}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {lesson.id} • Order: {lesson.order_index}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip 
                          label={lesson.content_type} 
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AttachFile />}
                          onClick={() => handleViewAttachments(lesson)}
                          disabled={!lesson.hasAttachments}
                          sx={{ 
                            minWidth: '100px',
                            opacity: lesson.hasAttachments ? 1 : 0.6
                          }}
                        >
                          {lesson.attachmentCount} file{lesson.attachmentCount !== 1 ? 's' : ''}
                        </Button>
                      </TableCell>
                      
                      <TableCell>
                        <IconButton
                          color={isPreviewEnabled(lesson) ? "primary" : "default"}
                          onClick={() => handlePreview(lesson)}
                          disabled={!isPreviewEnabled(lesson)}
                          sx={{ 
                            opacity: isPreviewEnabled(lesson) ? 1 : 0.6,
                            bgcolor: isPreviewEnabled(lesson) ? 'primary.light' : 'transparent'
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/teacher/courses/${courseId}/lessons/${lesson.id}/edit`)}
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
                    
                    {/* Expanded Details Row */}
                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 0, bgcolor: 'grey.50' }}>
                        <Collapse in={expandedLessonId === lesson.id}>
                          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              📊 Lesson Details
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">Has Attachments:</Typography>
                                <Typography variant="body2">
                                  {lesson.hasAttachments ? '✅ Yes' : '❌ No'} 
                                  {lesson.hasAttachments && ` (${lesson.attachmentCount})`}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">Has Content:</Typography>
                                <Typography variant="body2">
                                  {lesson.hasContent ? '✅ Yes' : '❌ No'}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">Unit/Subunit:</Typography>
                                <Typography variant="body2">
                                  Unit: {lesson.unit_id || 'N/A'}, Subunit: {lesson.subunit_id || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                            
                            {lesson.attachments.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">Attachment URLs:</Typography>
                                <Box component="ul" sx={{ pl: 2, mt: 0.5, fontSize: '0.8rem' }}>
                                  {lesson.attachments.map((att, idx) => (
                                    <li key={idx}>
                                      {att.name}: {att.url ? '✅ URL exists' : '❌ No URL'}
                                    </li>
                                  ))}
                                </Box>
                              </Box>
                            )}
                            
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => debugLessonStructure(lesson, lessons.indexOf(lesson))}
                              sx={{ mt: 1 }}
                            >
                              Debug This Lesson
                            </Button>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {/* Debug Info Panel */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.100' }}>
        <Typography variant="subtitle2" gutterBottom>
          🐛 Debug Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Total lessons: {lessons.length}<br/>
          • Lessons with attachments: {lessons.filter(l => l.hasAttachments).length}<br/>
          • Lessons with content: {lessons.filter(l => l.hasContent).length}<br/>
          • Click "Debug Data" button to see detailed lesson information in console
        </Typography>
      </Paper>
    </Box>
  );
};

export default TeachersManageLessons;





// // src/pages/teachers/ManageLessons.jsx - FIXED VERSION
// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from '../../utils/axiosInstance';
// import { toast } from "react-toastify";
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   CircularProgress,
//   Alert,
//   Tooltip,
//   Collapse,
// } from "@mui/material";
// import {
//   Visibility,
//   Edit,
//   Delete,
//   Add,
//   AttachFile,
//   ExpandMore,
//   ExpandLess,
// } from "@mui/icons-material";

// import "./ManageLessons.css";

// const TeachersManageLessons = () => {
//   const { courseId } = useParams();
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedLessonId, setExpandedLessonId] = useState(null);
//   const navigate = useNavigate();

//   // Debug function to check lesson structure
//   const debugLessonStructure = (lesson, lessonIndex) => {
//     console.log(`🔍 DEBUG Lesson ${lessonIndex}: "${lesson.title}"`);
//     console.log("📊 Lesson structure analysis:", {
//       id: lesson.id,
//       title: lesson.title,
//       attachmentsCount: lesson.attachments?.length || 0,
//       hasFileUrl: !!(lesson.file_url || lesson.fileUrl),
//       hasVideoUrl: !!(lesson.video_url || lesson.videoUrl),
//       hasContent: !!lesson.content,
//       contentLength: lesson.content?.length || 0,
//       contentType: lesson.content_type || lesson.contentType,
//       isPreview: lesson.is_preview || lesson.isPreview,
//     });
    
//     if (lesson.attachments && lesson.attachments.length > 0) {
//       console.log("📎 Attachments details:");
//       lesson.attachments.forEach((att, idx) => {
//         console.log(`  ${idx + 1}. ${att.name || att.fileName || 'Unnamed'} - ${att.type || att.fileType || 'unknown'}`);
//       });
//     }
//   };

//   const fetchLessons = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log(`📥 Fetching lessons for course: ${courseId}`);
      
//       // Try multiple endpoints in order
//       let response;
//       let endpointUsed = '';
      
//       const endpoints = [
//         `/lessons/course/${courseId}/all`,
//         `/courses/${courseId}/lessons`,
//         `/teacher/courses/${courseId}/lessons`,
//         `/api/v1/courses/${courseId}/lessons`,
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           response = await axios.get(endpoint);
//           endpointUsed = endpoint;
//           console.log(`✅ Success with endpoint: ${endpointUsed}`);
//           break;
//         } catch (err) {
//           console.log(`❌ Failed with ${endpoint}:`, err.message);
//           continue;
//         }
//       }
      
//       if (!response) {
//         throw new Error("All lesson endpoints failed");
//       }
      
//       console.log(`📚 API Response from ${endpointUsed}:`, response.data);
      
//       // Parse response based on different possible structures
//       let lessonsData = [];
      
//       if (response.data.success && response.data.lessons) {
//         lessonsData = response.data.lessons;
//       } else if (response.data.success && response.data.course?.lessons) {
//         lessonsData = response.data.course.lessons;
//       } else if (Array.isArray(response.data)) {
//         lessonsData = response.data;
//       } else if (response.data.lessons) {
//         lessonsData = response.data.lessons;
//       }
      
//       console.log(`📦 Found ${lessonsData.length} raw lessons`);
      
//       // Process each lesson for consistent structure
//       const processedLessons = lessonsData.map((lesson, index) => {
//         // Extract all possible file sources
//         const extractedAttachments = [];
        
//         // 1. Main file_url (legacy format)
//         const fileUrl = lesson.file_url || lesson.fileUrl;
//         if (fileUrl) {
//           extractedAttachments.push({
//             id: `file_${Date.now()}_${index}`,
//             url: fileUrl,
//             name: lesson.title ? `${lesson.title} (Document)` : 'Document',
//             type: 'file',
//             fileName: fileUrl.split('/').pop() || 'document',
//             source: 'file_url'
//           });
//         }
        
//         // 2. Video URL
//         const videoUrl = lesson.video_url || lesson.videoUrl;
//         if (videoUrl) {
//           extractedAttachments.push({
//             id: `video_${Date.now()}_${index}`,
//             url: videoUrl,
//             name: 'Video Lesson',
//             type: 'video',
//             fileName: videoUrl.split('/').pop() || 'video',
//             source: 'video_url'
//           });
//         }
        
//         // 3. Attachments array (new format)
//         if (Array.isArray(lesson.attachments)) {
//           lesson.attachments.forEach((att, idx) => {
//             if (att.url || att.file_path || att.filePath) {
//               extractedAttachments.push({
//                 id: att.id || `att_${Date.now()}_${index}_${idx}`,
//                 url: att.url || att.file_path || att.filePath,
//                 name: att.name || att.fileName || att.originalname || `Attachment ${idx + 1}`,
//                 type: att.type || att.fileType || att.mimetype || 'file',
//                 fileName: att.fileName || att.originalname || 'file',
//                 fileSize: att.fileSize || att.size,
//                 source: 'attachments_array'
//               });
//             }
//           });
//         }
        
//         // 4. Check for nested attachments structure
//         if (lesson.files && Array.isArray(lesson.files)) {
//           lesson.files.forEach((file, idx) => {
//             if (file.url || file.path) {
//               extractedAttachments.push({
//                 id: `nested_${Date.now()}_${index}_${idx}`,
//                 url: file.url || file.path,
//                 name: file.name || file.originalname || `File ${idx + 1}`,
//                 type: file.type || file.mimetype || 'file',
//                 source: 'nested_files'
//               });
//             }
//           });
//         }
        
//         const totalAttachments = extractedAttachments.length;
//         const hasAttachments = totalAttachments > 0;
//         const hasContent = !!(lesson.content || lesson.textContent || lesson.description);
        
//         return {
//           id: lesson.id || lesson._id || `lesson_${index}`,
//           title: lesson.title || 'Untitled Lesson',
//           content_type: lesson.content_type || lesson.contentType || 'text',
//           is_preview: lesson.is_preview || lesson.isPreview || false,
//           order_index: lesson.order_index || lesson.orderIndex || index,
//           unit_id: lesson.unit_id,
//           content: lesson.content || lesson.textContent || lesson.description,
          
//           // File URLs (legacy support)
//           file_url: fileUrl,
//           video_url: videoUrl,
          
//           // Processed attachments
//           attachments: extractedAttachments,
//           hasAttachments: hasAttachments,
//           attachmentCount: totalAttachments,
//           hasContent: hasContent,
          
//           // Store original for debugging
//           _raw: lesson,
//           _processing: {
//             totalAttachments,
//             sources: extractedAttachments.map(a => a.source),
//             extractedAt: new Date().toISOString()
//           }
//         };
//       });
      
//       console.log("\n✅ FINAL Processed lessons:");
//       processedLessons.forEach((lesson, index) => {
//         console.log(`${index}. "${lesson.title}" - ${lesson.attachmentCount} attachments - ${lesson.hasContent ? 'Has content' : 'No content'}`);
//       });
      
//       setLessons(processedLessons);
      
//     } catch (err) {
//       console.error("❌ Error fetching lessons:", err);
//       toast.error("Failed to load lessons: " + (err.message || 'Unknown error'));
//       setLessons([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [courseId]);

//   useEffect(() => {
//     fetchLessons();
//   }, [courseId, fetchLessons]);

//   const toggleLessonDetails = (lessonId) => {
//     setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
//   };

//   const handleDelete = async (lessonId) => {
//     if (!window.confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) return;
//     try {
//       await axios.delete(`/lessons/${lessonId}`);
//       setLessons(prev => prev.filter(l => l.id !== lessonId));
//       toast.success("Lesson deleted successfully");
//     } catch (err) {
//       console.error("❌ Delete error:", err);
//       toast.error(err.response?.data?.error || "Failed to delete lesson");
//     }
//   };

//   // ✅ FIXED: Enhanced preview check function
//   const isPreviewEnabled = (lesson) => {
//     if (!lesson) return false;
    
//     const hasFileUrl = !!(lesson.file_url || lesson.fileUrl);
//     const hasVideoUrl = !!(lesson.video_url || lesson.videoUrl);
//     const hasAttachmentsArray = Array.isArray(lesson.attachments) && lesson.attachments.length > 0;
//     const hasContent = !!(lesson.content || lesson.textContent);
//     const hasAnyRawAttachments = !!(lesson._raw?.attachments && lesson._raw.attachments.length > 0);
    
//     const isEnabled = hasFileUrl || hasVideoUrl || hasAttachmentsArray || hasContent || hasAnyRawAttachments;
    
//     // Debug log for disabled previews
//     if (!isEnabled) {
//       console.warn(`⚠️ Preview disabled for "${lesson.title}":`, {
//         hasFileUrl,
//         hasVideoUrl,
//         attachmentsCount: lesson.attachments?.length || 0,
//         hasContent,
//         rawAttachments: lesson._raw?.attachments?.length || 0
//       });
//     }
    
//     return isEnabled;
//   };

//   // ✅ FIXED: Enhanced preview function
//   const handlePreview = (lesson) => {
//     console.log(`👁️ Preview clicked for: "${lesson.title}"`);
//     console.log("📋 Lesson data:", {
//       id: lesson.id,
//       title: lesson.title,
//       attachments: lesson.attachments,
//       file_url: lesson.file_url,
//       video_url: lesson.video_url,
//       contentLength: lesson.content?.length || 0
//     });
    
//     // Collect ALL possible files
//     const allFiles = [];
    
//     // 1. Check file_url (legacy)
//     if (lesson.file_url || lesson.fileUrl) {
//       const url = lesson.file_url || lesson.fileUrl;
//       const fileName = url.split('/').pop() || `${lesson.title}.pdf`;
//       allFiles.push({
//         url,
//         name: fileName,
//         type: lesson.content_type === 'pdf' ? 'pdf' : 'file',
//         source: 'file_url'
//       });
//     }
    
//     // 2. Check video_url
//     if (lesson.video_url || lesson.videoUrl) {
//       const url = lesson.video_url || lesson.videoUrl;
//       allFiles.push({
//         url,
//         name: `${lesson.title} (Video)`,
//         type: 'video',
//         source: 'video_url'
//       });
//     }
    
//     // 3. Check attachments array
//     if (Array.isArray(lesson.attachments) && lesson.attachments.length > 0) {
//       lesson.attachments.forEach((att, idx) => {
//         if (att.url) {
//           allFiles.push({
//             url: att.url,
//             name: att.name || att.fileName || `Attachment ${idx + 1}`,
//             type: att.type || 'file',
//             source: 'attachments_array'
//           });
//         }
//       });
//     }
    
//     // 4. Check raw attachments
//     if (lesson._raw?.attachments && Array.isArray(lesson._raw.attachments)) {
//       lesson._raw.attachments.forEach((att, idx) => {
//         if (att.file_path || att.url) {
//           allFiles.push({
//             url: att.file_path || att.url,
//             name: att.file_name || att.name || `Raw Attachment ${idx + 1}`,
//             type: att.file_type || 'file',
//             source: 'raw_attachments'
//           });
//         }
//       });
//     }
    
//     console.log(`📦 Found ${allFiles.length} files for preview:`, allFiles);
    
//     // Handle preview based on available files
//     if (allFiles.length === 0 && !lesson.content) {
//       toast.info("No preview content available for this lesson");
//       return;
//     }
    
//     if (allFiles.length > 0) {
//       // Open first file
//       const firstFile = allFiles[0];
//       console.log(`🚀 Opening first file: ${firstFile.name} (${firstFile.type})`);
      
//       openFileInNewWindow(firstFile.url, firstFile.type);
      
//       // Show notification for multiple files
//       if (allFiles.length > 1) {
//         toast.info(`Opening first of ${allFiles.length} files. Check browser console for full list.`);
//       }
//     } else if (lesson.content) {
//       // Show text content in modal
//       showTextContentPreview(lesson.title, lesson.content);
//     }
//   };

//   const openFileInNewWindow = (url, type = 'file') => {
//     if (!url) {
//       toast.error("No file URL provided");
//       return;
//     }
    
//     try {
//       // Fix Cloudinary URLs if needed
//       let finalUrl = url;
//       if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
//         if (url.includes('.pdf') || url.includes('/pdfs/')) {
//           finalUrl = url.replace('/image/upload/', '/raw/upload/');
//           console.log(`🔧 Fixed Cloudinary URL: ${finalUrl.substring(0, 100)}...`);
//         }
//       }
      
//       if (type === 'pdf' || url.includes('.pdf')) {
//         // Use Google Docs Viewer for better compatibility
//         const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(finalUrl)}&embedded=true`;
//         window.open(viewerUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
//       } else if (type === 'video') {
//         // Open in video player
//         const videoHtml = `
//           <!DOCTYPE html>
//           <html>
//             <head>
//               <title>Video Preview</title>
//               <style>
//                 body { margin: 0; background: #000; }
//                 video { width: 100%; height: 100vh; }
//               </style>
//             </head>
//             <body>
//               <video controls autoplay>
//                 <source src="${finalUrl}" type="video/mp4">
//                 Your browser does not support video playback.
//               </video>
//             </body>
//           </html>
//         `;
//         const win = window.open('', '_blank', 'noopener,noreferrer,width=1000,height=700');
//         win.document.write(videoHtml);
//       } else {
//         // Open directly
//         window.open(finalUrl, '_blank', 'noopener,noreferrer');
//       }
//     } catch (error) {
//       console.error("❌ Error opening file:", error);
//       toast.error("Failed to open file. Please check the URL.");
//     }
//   };

//   const showTextContentPreview = (title, content) => {
//     const previewWindow = window.open('', '_blank', 'noopener,noreferrer,width=800,height=600');
//     previewWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Preview: ${title}</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
//             h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
//             .content { margin-top: 20px; }
//             .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
//           </style>
//         </head>
//         <body>
//           <h1>${title}</h1>
//           <div class="meta">Text Content Preview</div>
//           <div class="content">${content}</div>
//         </body>
//       </html>
//     `);
//   };

//   const handleViewAttachments = (lesson) => {
//     if (!lesson.hasAttachments) {
//       toast.info("No attachments found for this lesson");
//       return;
//     }
    
//     if (lesson.attachments.length === 1) {
//       const attachment = lesson.attachments[0];
//       openFileInNewWindow(attachment.url, attachment.type);
//     } else {
//       const fileList = lesson.attachments.map((att, idx) => 
//         `${idx + 1}. ${att.name} (${att.type})`
//       ).join('\n');
      
//       const confirmOpen = window.confirm(
//         `This lesson has ${lesson.attachments.length} files:\n\n${fileList}\n\nOpen the first file?`
//       );
      
//       if (confirmOpen && lesson.attachments.length > 0) {
//         openFileInNewWindow(lesson.attachments[0].url, lesson.attachments[0].type);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>Loading lessons...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//         <Box>
//           <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             📚 Manage Lessons
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Course ID: {courseId} • {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button
//             variant="outlined"
//             onClick={() => {
//               console.log("=== DEBUG: ALL LESSONS DATA ===");
//               lessons.forEach((lesson, index) => debugLessonStructure(lesson, index));
//               toast.info(`Debug data logged for ${lessons.length} lessons`);
//             }}
//           >
//             Debug Data
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             component={Link}
//             to={`/courses/${courseId}/lessons/new`}
//           >
//             Create Lesson
//           </Button>
//         </Box>
//       </Box>

//       {lessons.length === 0 ? (
//         <Alert severity="info">
//           <Typography>No lessons found for this course. Create your first lesson!</Typography>
//         </Alert>
//       ) : (
//         <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
//           <TableContainer>
//             <Table>
//               <TableHead sx={{ bgcolor: 'primary.main' }}>
//                 <TableRow>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '300px' }}>Lesson Details</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Files</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Preview</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {lessons.map((lesson) => (
//                   <React.Fragment key={lesson.id}>
//                     <TableRow hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <IconButton
//                             size="small"
//                             onClick={() => toggleLessonDetails(lesson.id)}
//                             sx={{ color: 'primary.main' }}
//                           >
//                             {expandedLessonId === lesson.id ? <ExpandLess /> : <ExpandMore />}
//                           </IconButton>
//                           <Box sx={{ flex: 1 }}>
//                             <Typography fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               {lesson.title}
//                               {lesson.is_preview && (
//                                 <Chip 
//                                   label="Preview" 
//                                   size="small" 
//                                   color="info"
//                                   sx={{ height: 20, fontSize: '0.7rem' }}
//                                 />
//                               )}
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               ID: {lesson.id} • Order: {lesson.order_index}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </TableCell>
                      
//                       <TableCell>
//                         <Chip 
//                           label={lesson.content_type || 'text'} 
//                           size="small"
//                           color="primary"
//                           variant="outlined"
//                           sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}
//                         />
//                       </TableCell>
                      
//                       <TableCell>
//                         <Tooltip 
//                           title={lesson.hasAttachments ? 
//                             `Click to view ${lesson.attachmentCount} file${lesson.attachmentCount !== 1 ? 's' : ''}` : 
//                             "No files attached"
//                           }
//                         >
//                           <Button
//                             variant="outlined"
//                             size="small"
//                             startIcon={<AttachFile />}
//                             onClick={() => handleViewAttachments(lesson)}
//                             disabled={!lesson.hasAttachments}
//                             sx={{ 
//                               minWidth: '100px',
//                               opacity: lesson.hasAttachments ? 1 : 0.5,
//                               '&:hover': {
//                                 bgcolor: lesson.hasAttachments ? 'primary.light' : 'transparent'
//                               }
//                             }}
//                           >
//                             {lesson.attachmentCount} file{lesson.attachmentCount !== 1 ? 's' : ''}
//                           </Button>
//                         </Tooltip>
//                       </TableCell>
                      
//                       <TableCell>
//                         <Tooltip 
//                           title={isPreviewEnabled(lesson) ? 
//                             `Preview lesson content${lesson.attachmentCount > 0 ? ` (${lesson.attachmentCount} files)` : ''}` : 
//                             "No preview content available"
//                           }
//                         >
//                           <span>
//                             <IconButton
//                               color={isPreviewEnabled(lesson) ? "primary" : "default"}
//                               onClick={() => handlePreview(lesson)}
//                               disabled={!isPreviewEnabled(lesson)}
//                               sx={{ 
//                                 position: 'relative',
//                                 opacity: isPreviewEnabled(lesson) ? 1 : 0.4,
//                                 bgcolor: isPreviewEnabled(lesson) ? 'primary.light' : 'transparent',
//                                 '&:hover': {
//                                   bgcolor: isPreviewEnabled(lesson) ? 'primary.main' : 'transparent',
//                                   color: isPreviewEnabled(lesson) ? 'white' : 'inherit'
//                                 }
//                               }}
//                             >
//                               <Visibility />
//                               {lesson.attachmentCount > 0 && (
//                                 <Chip 
//                                   label={lesson.attachmentCount} 
//                                   size="small" 
//                                   sx={{ 
//                                     position: 'absolute', 
//                                     top: -6, 
//                                     right: -6, 
//                                     height: 18, 
//                                     fontSize: '0.65rem',
//                                     minWidth: 18,
//                                     bgcolor: 'secondary.main',
//                                     color: 'white'
//                                   }} 
//                                 />
//                               )}
//                             </IconButton>
//                           </span>
//                         </Tooltip>
//                       </TableCell>
                      
//                       <TableCell>
//                         <Box sx={{ display: "flex", gap: 1 }}>
//                           <Tooltip title="Edit Lesson">
//                             <IconButton
//                               color="primary"
//                               onClick={() => navigate(`/teacher/courses/${courseId}/lessons/${lesson.id}/edit`)}
//                             >
//                               <Edit />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete Lesson">
//                             <IconButton
//                               color="error"
//                               onClick={() => handleDelete(lesson.id)}
//                             >
//                               <Delete />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
                    
//                     {/* Expanded Details Row */}
//                     <TableRow>
//                       <TableCell colSpan={5} sx={{ py: 0, bgcolor: 'grey.50' }}>
//                         <Collapse in={expandedLessonId === lesson.id}>
//                           <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
//                             <Typography variant="subtitle2" gutterBottom>
//                               📊 Lesson Details
//                             </Typography>
//                             <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 2 }}>
//                               <Box>
//                                 <Typography variant="caption" color="text.secondary">Attachments:</Typography>
//                                 <Typography variant="body2" fontWeight="medium">
//                                   {lesson.hasAttachments ? '✅ Yes' : '❌ No'} 
//                                   {lesson.hasAttachments && ` (${lesson.attachmentCount})`}
//                                 </Typography>
//                               </Box>
//                               <Box>
//                                 <Typography variant="caption" color="text.secondary">Content:</Typography>
//                                 <Typography variant="body2" fontWeight="medium">
//                                   {lesson.hasContent ? '✅ Yes' : '❌ No'}
//                                   {lesson.hasContent && ` (${lesson.content?.length || 0} chars)`}
//                                 </Typography>
//                               </Box>
//                               <Box>
//                                 <Typography variant="caption" color="text.secondary">Preview Status:</Typography>
//                                 <Typography variant="body2" fontWeight="medium">
//                                   {lesson.is_preview ? '✅ Preview Lesson' : '📝 Regular Lesson'}
//                                 </Typography>
//                               </Box>
//                             </Box>
                            
//                             {lesson.hasAttachments && (
//                               <Box sx={{ mt: 2 }}>
//                                 <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
//                                   Attachment Details:
//                                 </Typography>
//                                 <Box component="ul" sx={{ pl: 2, mt: 0.5, fontSize: '0.8rem', mb: 2 }}>
//                                   {lesson.attachments.map((att, idx) => (
//                                     <li key={idx} style={{ marginBottom: '4px' }}>
//                                       <strong>{att.name}:</strong> {att.type} • {att.url ? '✅ URL valid' : '❌ No URL'}
//                                     </li>
//                                   ))}
//                                 </Box>
//                               </Box>
//                             )}
                            
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               onClick={() => debugLessonStructure(lesson, lessons.indexOf(lesson))}
//                               sx={{ mt: 1 }}
//                             >
//                               Debug This Lesson
//                             </Button>
//                           </Box>
//                         </Collapse>
//                       </TableCell>
//                     </TableRow>
//                   </React.Fragment>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       )}
      
//       {/* Stats Panel */}
//       <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
//         <Typography variant="subtitle2" gutterBottom fontWeight="bold">
//           📈 Lesson Statistics
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
//           <Typography variant="body2" color="text.secondary">
//             • Total Lessons: <strong>{lessons.length}</strong>
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             • With Attachments: <strong>{lessons.filter(l => l.hasAttachments).length}</strong>
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             • With Content: <strong>{lessons.filter(l => l.hasContent).length}</strong>
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             • Preview Lessons: <strong>{lessons.filter(l => l.is_preview).length}</strong>
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             • Total Files: <strong>{lessons.reduce((sum, l) => sum + l.attachmentCount, 0)}</strong>
//           </Typography>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default TeachersManageLessons;