// // src/pages/teachers/ManageLessons.jsx - DEBUG VERSION
// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
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
//   Dialog,
//   DialogTitle,
//   DialogContent,
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
//   PictureAsPdf,
//   VideoLibrary,
//   Description,
//   InsertDriveFile,
//   AttachFile,
//   Download,
//   OpenInNew,
//   ExpandMore,
//   ExpandLess,
// } from "@mui/icons-material";

// // ✅ ADD CSS IMPORT
// import "./ManageLessons.css";

// const TeachersManageLessons = () => {
//   const { courseId } = useParams();
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedLessonId, setExpandedLessonId] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ NEW: Debug function to check lesson structure
//   const debugLessonStructure = (lesson, lessonIndex) => {
//     console.log(`🔍 DEBUG Lesson ${lessonIndex}: "${lesson.title}"`);
//     console.log("Full lesson object:", lesson);
    
//     // Check all possible attachment fields
//     console.log("📌 Checking attachment fields:");
//     console.log("1. attachments array:", lesson.attachments);
//     console.log("2. file_url:", lesson.file_url);
//     console.log("3. fileUrl:", lesson.fileUrl);
//     console.log("4. video_url:", lesson.video_url);
//     console.log("5. videoUrl:", lesson.videoUrl);
//     console.log("6. content:", lesson.content ? `Has content (${lesson.content.length} chars)` : "No content");
//     console.log("7. contentType:", lesson.contentType);
//     console.log("8. content_type:", lesson.content_type);
    
//     // Calculate hasAttachments manually
//     let hasAttachmentsCalc = false;
//     let attachmentCountCalc = 0;
    
//     if (Array.isArray(lesson.attachments) && lesson.attachments.length > 0) {
//       attachmentCountCalc = lesson.attachments.length;
//       hasAttachmentsCalc = true;
//       console.log("✅ Found attachments array with", attachmentCountCalc, "items");
//     }
    
//     if (lesson.file_url || lesson.fileUrl) {
//       attachmentCountCalc++;
//       hasAttachmentsCalc = true;
//       console.log("✅ Found file_url/fileUrl");
//     }
    
//     if (lesson.video_url || lesson.videoUrl) {
//       attachmentCountCalc++;
//       hasAttachmentsCalc = true;
//       console.log("✅ Found video_url/videoUrl");
//     }
    
//     console.log("📊 Calculated: hasAttachments =", hasAttachmentsCalc, "count =", attachmentCountCalc);
//     console.log("---");
//   };

//   const fetchLessons = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log(`📥 Fetching lessons for course: ${courseId}`);
      
//       // Try multiple endpoints
//       let res;
//       let endpointUsed = '';
      
//       try {
//         res = await axios.get(`/lessons/course/${courseId}/all`);
//         endpointUsed = '/lessons/course/:courseId/all';
//       } catch (err) {
//         console.log("First endpoint failed, trying alternative...");
//         try {
//           res = await axios.get(`/courses/${courseId}/lessons`);
//           endpointUsed = '/courses/:courseId/lessons';
//         } catch (err2) {
//           console.log("Second endpoint failed, trying third...");
//           res = await axios.get(`/teacher/courses/${courseId}/lessons`);
//           endpointUsed = '/teacher/courses/:courseId/lessons';
//         }
//       }
      
//       console.log(`📚 API Response from ${endpointUsed}:`, res.data);
      
//       let lessonsData = [];
      
//       // Parse response based on different possible structures
//       if (res.data.success) {
//         lessonsData = res.data.lessons || [];
//       } else if (Array.isArray(res.data)) {
//         lessonsData = res.data;
//       } else if (res.data.lessons) {
//         lessonsData = res.data.lessons;
//       } else if (res.data.course && Array.isArray(res.data.course.lessons)) {
//         lessonsData = res.data.course.lessons;
//       }
      
//       console.log(`📦 Raw lessons data (${lessonsData.length} lessons):`, lessonsData);
      
//       // Process each lesson individually
//       const processedLessons = lessonsData.map((lesson, index) => {
//         // Log the raw lesson data for debugging
//         console.log(`\n📝 Processing lesson ${index}: "${lesson.title || 'Untitled'}"`);
//         console.log("Raw lesson data:", lesson);
        
//         // Method 1: Check attachments array
//         let attachments = [];
//         if (Array.isArray(lesson.attachments)) {
//           attachments = lesson.attachments;
//           console.log(`  Found ${attachments.length} attachments in array`);
//         }
        
//         // Method 2: Check for single file (legacy format)
//         let legacyFiles = [];
//         if (lesson.file_url || lesson.fileUrl) {
//           const fileUrl = lesson.file_url || lesson.fileUrl;
//           legacyFiles.push({
//             id: 'legacy-file',
//             url: fileUrl,
//             name: fileUrl.split('/').pop() || 'File',
//             type: lesson.content_type || lesson.contentType || 'file'
//           });
//           console.log(`  Found file_url: ${fileUrl}`);
//         }
        
//         // Method 3: Check for video
//         if (lesson.video_url || lesson.videoUrl) {
//           const videoUrl = lesson.video_url || lesson.videoUrl;
//           legacyFiles.push({
//             id: 'video',
//             url: videoUrl,
//             name: 'Video Lesson',
//             type: 'video'
//           });
//           console.log(`  Found video_url: ${videoUrl}`);
//         }
        
//         // Combine all attachments
//         const allAttachments = [...attachments, ...legacyFiles];
//         const hasAttachments = allAttachments.length > 0;
//         const attachmentCount = allAttachments.length;
        
//         console.log(`  Total attachments: ${attachmentCount}, hasAttachments: ${hasAttachments}`);
        
//         // Check for content
//         const hasContent = !!(lesson.content || lesson.textContent);
//         console.log(`  Has text content: ${hasContent}`);
        
//         return {
//           id: lesson.id || lesson._id,
//           title: lesson.title || 'Untitled Lesson',
//           content_type: lesson.content_type || lesson.contentType || 'text',
//           isPreview: lesson.is_preview || lesson.isPreview || false,
//           order_index: lesson.order_index || lesson.orderIndex || 0,
//           unit_id: lesson.unit_id,
//           subunit_id: lesson.subunit_id,
//           attachments: allAttachments,
//           hasAttachments: hasAttachments,
//           attachmentCount: attachmentCount,
//           hasContent: hasContent,
//           content: lesson.content || lesson.textContent,
//           file_url: lesson.file_url || lesson.fileUrl,
//           video_url: lesson.video_url || lesson.videoUrl,
//           // Store original for debugging
//           _raw: lesson
//         };
//       });
      
//       console.log("\n✅ FINAL Processed lessons:");
//       processedLessons.forEach((lesson, index) => {
//         console.log(`${index}. "${lesson.title}" - Attachments: ${lesson.attachmentCount}, HasContent: ${lesson.hasContent}`);
//       });
      
//       setLessons(processedLessons);
      
//     } catch (err) {
//       console.error("❌ Error fetching lessons:", err);
//       toast.error("Failed to fetch lessons: " + (err.message || 'Unknown error'));
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
//     if (!window.confirm("Are you sure you want to delete this lesson?")) return;
//     try {
//       await axios.delete(`/lessons/${lessonId}`);
//       setLessons((prev) => prev.filter((l) => l.id !== lessonId));
//       toast.success("Lesson deleted successfully");
//     } catch (err) {
//       console.error("❌ Delete error:", err);
//       toast.error(err.response?.data?.error || "Failed to delete lesson");
//     }
//   };

//   // ✅ FIXED: Enhanced preview function
//   const handlePreview = (lesson) => {
//     console.log(`👁️ Preview clicked for: "${lesson.title}"`);
//     console.log("Lesson preview data:", {
//       hasAttachments: lesson.hasAttachments,
//       attachmentCount: lesson.attachmentCount,
//       hasContent: lesson.hasContent,
//       attachments: lesson.attachments,
//       file_url: lesson.file_url,
//       video_url: lesson.video_url
//     });
    
//     if (lesson.hasAttachments) {
//       // Try attachments first
//       if (lesson.attachments.length > 0) {
//         const firstAttachment = lesson.attachments[0];
//         console.log("Opening first attachment:", firstAttachment);
//         openFileInNewWindow(firstAttachment.url, firstAttachment.type || 'file');
//       } else if (lesson.file_url) {
//         console.log("Opening file_url:", lesson.file_url);
//         openFileInNewWindow(lesson.file_url, lesson.content_type || 'file');
//       } else if (lesson.video_url) {
//         console.log("Opening video_url:", lesson.video_url);
//         openFileInNewWindow(lesson.video_url, 'video');
//       }
//     } else if (lesson.hasContent) {
//       // Show text content in alert for debugging
//       alert(`Text content preview for: ${lesson.title}\n\n${lesson.content?.substring(0, 500)}...`);
//     } else {
//       toast.info("No content or files available for preview");
//     }
//   };

//   const openFileInNewWindow = (url, type) => {
//     if (!url) {
//       toast.error("No URL provided");
//       return;
//     }
    
//     try {
//       if (type === 'pdf' || url.includes('.pdf')) {
//         // Use Google Docs Viewer
//         const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
//         window.open(viewerUrl, '_blank', 'noopener,noreferrer,width=1000,height=700');
//       } else if (type === 'video' || url.includes('.mp4') || url.includes('.mov')) {
//         // Create video player page
//         const videoHtml = `
//           <html>
//             <head><title>Video Preview</title></head>
//             <body style="margin:0;background:#000">
//               <video controls autoplay style="width:100%;height:100vh">
//                 <source src="${url}" type="video/mp4">
//               </video>
//             </body>
//           </html>
//         `;
//         const win = window.open('', '_blank', 'noopener,noreferrer,width=1000,height=700');
//         win.document.write(videoHtml);
//       } else {
//         // Open directly
//         window.open(url, '_blank', 'noopener,noreferrer');
//       }
//     } catch (error) {
//       console.error("Error opening file:", error);
//       toast.error("Failed to open file");
//     }
//   };

//   const handleViewAttachments = (lesson) => {
//     console.log(`📎 View attachments for: "${lesson.title}"`);
//     console.log("Attachments:", lesson.attachments);
    
//     if (!lesson.hasAttachments) {
//       toast.info("No attachments found for this lesson");
//       return;
//     }
    
//     if (lesson.attachments.length === 1) {
//       // If only one attachment, open it directly
//       const attachment = lesson.attachments[0];
//       openFileInNewWindow(attachment.url, attachment.type);
//     } else {
//       // Show list in alert for now
//       const fileList = lesson.attachments.map((att, idx) => 
//         `${idx + 1}. ${att.name || 'File'} (${att.type || 'unknown'})`
//       ).join('\n');
      
//       alert(`Attachments for "${lesson.title}":\n\n${fileList}\n\nClick Preview to open the first file.`);
//     }
//   };

//   // ✅ Check if button should be enabled
//   const isPreviewEnabled = (lesson) => {
//     return lesson.hasAttachments || lesson.hasContent;
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
//       {/* Header with Debug Button */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//         <Box>
//           <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             📚 Manage Lessons
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Course ID: {courseId} • {lessons.length} lessons
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button
//             variant="outlined"
//             onClick={() => {
//               console.log("=== DEBUG: ALL LESSONS DATA ===");
//               lessons.forEach((lesson, index) => debugLessonStructure(lesson, index));
//               toast.info("Check console for lesson data");
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
//           <Typography>No lessons found for this course.</Typography>
//         </Alert>
//       ) : (
//         <Paper sx={{ overflow: "hidden" }}>
//           <TableContainer>
//             <Table>
//               <TableHead sx={{ bgcolor: 'primary.main' }}>
//                 <TableRow>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '300px' }}>Title & Details</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attachments</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Preview</TableCell>
//                   <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {lessons.map((lesson) => (
//                   <React.Fragment key={lesson.id}>
//                     <TableRow hover>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <IconButton
//                             size="small"
//                             onClick={() => toggleLessonDetails(lesson.id)}
//                           >
//                             {expandedLessonId === lesson.id ? <ExpandLess /> : <ExpandMore />}
//                           </IconButton>
//                           <Box>
//                             <Typography fontWeight="medium">
//                               {lesson.title}
//                               {lesson.isPreview && (
//                                 <Chip label="Preview" size="small" color="info" sx={{ ml: 1 }} />
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
//                           label={lesson.content_type} 
//                           size="small"
//                           color="primary"
//                           variant="outlined"
//                         />
//                       </TableCell>
                      
//                       <TableCell>
//                         <Button
//                           variant="outlined"
//                           size="small"
//                           startIcon={<AttachFile />}
//                           onClick={() => handleViewAttachments(lesson)}
//                           disabled={!lesson.hasAttachments}
//                           sx={{ 
//                             minWidth: '100px',
//                             opacity: lesson.hasAttachments ? 1 : 0.6
//                           }}
//                         >
//                           {lesson.attachmentCount} file{lesson.attachmentCount !== 1 ? 's' : ''}
//                         </Button>
//                       </TableCell>
                      
//                       <TableCell>
//                         <IconButton
//                           color={isPreviewEnabled(lesson) ? "primary" : "default"}
//                           onClick={() => handlePreview(lesson)}
//                           disabled={!isPreviewEnabled(lesson)}
//                           sx={{ 
//                             opacity: isPreviewEnabled(lesson) ? 1 : 0.6,
//                             bgcolor: isPreviewEnabled(lesson) ? 'primary.light' : 'transparent'
//                           }}
//                         >
//                           <Visibility />
//                         </IconButton>
//                       </TableCell>
                      
//                       <TableCell>
//                         <Box sx={{ display: "flex", gap: 1 }}>
//                           <IconButton
//                             color="primary"
//                             onClick={() => navigate(`/teacher/courses/${courseId}/lessons/${lesson.id}/edit`)}
//                           >
//                             <Edit />
//                           </IconButton>
//                           <IconButton
//                             color="error"
//                             onClick={() => handleDelete(lesson.id)}
//                           >
//                             <Delete />
//                           </IconButton>
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
//                             <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
//                               <Box>
//                                 <Typography variant="caption" color="text.secondary">Has Attachments:</Typography>
//                                 <Typography variant="body2">
//                                   {lesson.hasAttachments ? '✅ Yes' : '❌ No'} 
//                                   {lesson.hasAttachments && ` (${lesson.attachmentCount})`}
//                                 </Typography>
//                               </Box>
//                               <Box>
//                                 <Typography variant="caption" color="text.secondary">Has Content:</Typography>
//                                 <Typography variant="body2">
//                                   {lesson.hasContent ? '✅ Yes' : '❌ No'}
//                                 </Typography>
//                               </Box>
//                               <Box>
//                                 <Typography variant="caption" color="text.secondary">Unit/Subunit:</Typography>
//                                 <Typography variant="body2">
//                                   Unit: {lesson.unit_id || 'N/A'}, Subunit: {lesson.subunit_id || 'N/A'}
//                                 </Typography>
//                               </Box>
//                             </Box>
                            
//                             {lesson.attachments.length > 0 && (
//                               <Box sx={{ mt: 2 }}>
//                                 <Typography variant="caption" color="text.secondary">Attachment URLs:</Typography>
//                                 <Box component="ul" sx={{ pl: 2, mt: 0.5, fontSize: '0.8rem' }}>
//                                   {lesson.attachments.map((att, idx) => (
//                                     <li key={idx}>
//                                       {att.name}: {att.url ? '✅ URL exists' : '❌ No URL'}
//                                     </li>
//                                   ))}
//                                 </Box>
//                               </Box>
//                             )}
                            
//                             <Button
//                               size="small"
//                               variant="text"
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
      
//       {/* Debug Info Panel */}
//       <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.100' }}>
//         <Typography variant="subtitle2" gutterBottom>
//           🐛 Debug Information
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           • Total lessons: {lessons.length}<br/>
//           • Lessons with attachments: {lessons.filter(l => l.hasAttachments).length}<br/>
//           • Lessons with content: {lessons.filter(l => l.hasContent).length}<br/>
//           • Click "Debug Data" button to see detailed lesson information in console
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default TeachersManageLessons;



// src/pages/teachers/ManageLessons.jsx - COMPLETE FIXED VERSION
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
  Close,
  BugReport,
} from "@mui/icons-material";

// Import the CSS file
import "./ManageLessons.css";

const TeachersManageLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Preview dialog state
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    title: '',
    url: '',
    type: '',
    content: ''
  });

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
      
      // Process each lesson
      const processedLessons = lessonsData.map((lesson) => {
        // Check attachments array
        let attachments = [];
        if (Array.isArray(lesson.attachments)) {
          attachments = lesson.attachments.map(att => ({
            id: att.id || 'attachment-' + Math.random(),
            url: att.filePath || att.url || att.file_url,
            name: att.fileName || att.name || 'Attachment',
            type: att.fileType || att.type || 'file'
          }));
        }
        
        // Check for file_url
        if (lesson.file_url || lesson.fileUrl) {
          const fileUrl = lesson.file_url || lesson.fileUrl;
          attachments.push({
            id: 'main-file',
            url: fileUrl,
            name: fileUrl.split('/').pop() || 'Main File',
            type: lesson.content_type || lesson.contentType || 'file'
          });
        }
        
        // Check for video_url
        if (lesson.video_url || lesson.videoUrl) {
          const videoUrl = lesson.video_url || lesson.videoUrl;
          attachments.push({
            id: 'video',
            url: videoUrl,
            name: 'Video Lesson',
            type: 'video'
          });
        }
        
        const hasAttachments = attachments.length > 0;
        const attachmentCount = attachments.length;
        const hasContent = !!(lesson.content || lesson.textContent);
        
        return {
          id: lesson.id || lesson._id,
          title: lesson.title || 'Untitled Lesson',
          content_type: lesson.content_type || lesson.contentType || 'text',
          isPreview: lesson.is_preview || lesson.isPreview || false,
          order_index: lesson.order_index || lesson.orderIndex || 0,
          unit_id: lesson.unit_id,
          subunit_id: lesson.subunit_id,
          attachments: attachments,
          hasAttachments: hasAttachments,
          attachmentCount: attachmentCount,
          hasContent: hasContent,
          content: lesson.content || lesson.textContent,
          file_url: lesson.file_url || lesson.fileUrl,
          video_url: lesson.video_url || lesson.videoUrl,
        };
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

  // Handle preview with PDF proxy
  const handlePreview = (lesson) => {
    if (lesson.hasAttachments) {
      // Try attachments first
      if (lesson.attachments.length > 0) {
        const firstAttachment = lesson.attachments[0];
        
        // Check if it's a PDF
        if (firstAttachment.url && firstAttachment.url.includes('.pdf')) {
          openPdfWithProxy(firstAttachment.url, lesson.title);
        } else if (firstAttachment.url && (firstAttachment.url.includes('.mp4') || firstAttachment.url.includes('.mov'))) {
          openVideoInDialog(firstAttachment.url, lesson.title);
        } else {
          openFileInNewWindow(firstAttachment.url, firstAttachment.type || 'file');
        }
      } else if (lesson.file_url) {
        if (lesson.file_url.includes('.pdf')) {
          openPdfWithProxy(lesson.file_url, lesson.title);
        } else {
          openFileInNewWindow(lesson.file_url, lesson.content_type || 'file');
        }
      }
    } else if (lesson.hasContent) {
      // Show text content in dialog
      setPreviewDialog({
        open: true,
        title: lesson.title,
        content: lesson.content,
        type: 'text'
      });
    } else {
      toast.info("No content or files available for preview");
    }
  };

  // PDF proxy function
  const openPdfWithProxy = (pdfUrl, title) => {
    try {
      const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
      const proxyUrl = `/api/v1/pdf-proxy?url=${encodeURIComponent(pdfUrl)}&filename=${encodeURIComponent(cleanTitle + '.pdf')}`;
      
      setPreviewDialog({
        open: true,
        title: `${title} - PDF Preview`,
        url: proxyUrl,
        type: 'pdf'
      });
      
    } catch (error) {
      console.error("Error with PDF proxy:", error);
      // Fallback to direct opening
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Video dialog function
  const openVideoInDialog = (videoUrl, title) => {
    setPreviewDialog({
      open: true,
      title: `${title} - Video Preview`,
      url: videoUrl,
      type: 'video'
    });
  };

  const openFileInNewWindow = (url, type) => {
    if (!url) {
      toast.error("No URL provided");
      return;
    }
    
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Failed to open file. Please try downloading it.");
    }
  };

  const handleViewAttachments = (lesson) => {
    if (!lesson.hasAttachments) {
      toast.info("No attachments found for this lesson");
      return;
    }
    
    if (lesson.attachments.length === 1) {
      const attachment = lesson.attachments[0];
      if (attachment.url && attachment.url.includes('.pdf')) {
        openPdfWithProxy(attachment.url, lesson.title);
      } else if (attachment.url && (attachment.url.includes('.mp4') || attachment.url.includes('.mov'))) {
        openVideoInDialog(attachment.url, lesson.title);
      } else {
        openFileInNewWindow(attachment.url, attachment.type);
      }
    } else {
      // Show attachment list in dialog
      setPreviewDialog({
        open: true,
        title: `Attachments for "${lesson.title}"`,
        attachments: lesson.attachments,
        type: 'attachments-list'
      });
    }
  };

  const handleClosePreviewDialog = () => {
    setPreviewDialog({
      open: false,
      title: '',
      url: '',
      type: '',
      content: '',
      attachments: []
    });
  };

  const handleDownloadAttachment = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDebugData = () => {
    console.log("=== DEBUG: ALL LESSONS DATA ===");
    lessons.forEach((lesson, index) => {
      console.log(`Lesson ${index}: "${lesson.title}"`, lesson);
    });
    toast.info("Check browser console for detailed lesson data");
  };

  const isPreviewEnabled = (lesson) => {
    return lesson.hasAttachments || lesson.hasContent;
  };

  // Debug statistics
  const getDebugStats = () => {
    const totalLessons = lessons.length;
    const lessonsWithAttachments = lessons.filter(l => l.hasAttachments).length;
    const lessonsWithContent = lessons.filter(l => l.hasContent).length;
    const totalAttachments = lessons.reduce((sum, lesson) => sum + lesson.attachmentCount, 0);
    
    return {
      totalLessons,
      lessonsWithAttachments,
      lessonsWithContent,
      totalAttachments
    };
  };

  if (loading) {
    return (
      <Box className="manage-lessons-container">
        <Box className="loading-state">
          <Box className="loading-spinner"></Box>
          <Typography>Loading lessons...</Typography>
        </Box>
      </Box>
    );
  }

  const debugStats = getDebugStats();

  return (
    <Box className="manage-lessons-container">
      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={handleClosePreviewDialog}
        maxWidth={previewDialog.type === 'pdf' ? 'lg' : 'md'}
        fullWidth
        PaperProps={{
          className: 'dialog-content'
        }}
      >
        <DialogTitle className="dialog-header">
          <Typography className="dialog-title">
            {previewDialog.type === 'pdf' ? '📄' : 
             previewDialog.type === 'video' ? '🎬' : 
             previewDialog.type === 'text' ? '📝' : '📎'}
            {previewDialog.title}
          </Typography>
          <IconButton className="close-btn" onClick={handleClosePreviewDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialog-body">
          {previewDialog.type === 'pdf' && previewDialog.url && (
            <iframe
              src={previewDialog.url}
              title={previewDialog.title}
              style={{
                width: '100%',
                height: '500px',
                border: 'none',
                borderRadius: '8px'
              }}
            />
          )}
          {previewDialog.type === 'video' && previewDialog.url && (
            <video
              controls
              autoPlay
              style={{
                width: '100%',
                maxHeight: '500px',
                borderRadius: '8px'
              }}
            >
              <source src={previewDialog.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {previewDialog.type === 'text' && previewDialog.content && (
            <Box sx={{ 
              p: 3, 
              bgcolor: '#f8f9fa', 
              borderRadius: '8px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <Typography variant="body1" whiteSpace="pre-wrap">
                {previewDialog.content}
              </Typography>
            </Box>
          )}
          {previewDialog.type === 'attachments-list' && previewDialog.attachments && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Select an attachment to view:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                {previewDialog.attachments.map((att, index) => (
                  <Paper 
                    key={att.id || index} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {att.url && att.url.includes('.pdf') ? <PictureAsPdf color="error" /> :
                       att.url && (att.url.includes('.mp4') || att.url.includes('.mov')) ? <VideoLibrary color="primary" /> :
                       <InsertDriveFile color="action" />}
                      <Typography variant="body2">
                        {att.name || `Attachment ${index + 1}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Preview">
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (att.url && att.url.includes('.pdf')) {
                              openPdfWithProxy(att.url, att.name || 'Attachment');
                            } else if (att.url && (att.url.includes('.mp4') || att.url.includes('.mov'))) {
                              openVideoInDialog(att.url, att.name || 'Attachment');
                            } else {
                              openFileInNewWindow(att.url, att.type);
                            }
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadAttachment(att.url, att.name)}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <Box className="manage-lessons-header">
        <Box>
          <Typography variant="h4" className="header-title">
            📚 Manage Lessons
          </Typography>
          <Typography className="course-info">
            Course ID: {courseId} • {lessons.length} lessons
          </Typography>
        </Box>
        <Box className="header-actions">
          <Button
            variant="contained"
            className="debug-btn"
            startIcon={<BugReport />}
            onClick={handleDebugData}
          >
            Debug Data
          </Button>
          <Button
            variant="contained"
            className="create-btn"
            startIcon={<Add />}
            component={Link}
            to={`/courses/${courseId}/lessons/new`}
          >
            Create Lesson
          </Button>
        </Box>
      </Box>

      {lessons.length === 0 ? (
        <Box className="empty-state">
          <Typography>No lessons found for this course.</Typography>
          <Button
            variant="contained"
            className="create-first-btn"
            startIcon={<Add />}
            component={Link}
            to={`/courses/${courseId}/lessons/new`}
          >
            Create Your First Lesson
          </Button>
        </Box>
      ) : (
        <>
          <Paper className="lessons-table-container">
            <TableContainer>
              <Table className="lessons-table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '300px' }}>Title & Details</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attachments</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Preview</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessons.map((lesson) => (
                    <React.Fragment key={lesson.id}>
                      <TableRow hover>
                        <TableCell>
                          <Box className="lesson-title-cell">
                            <IconButton
                              size="small"
                              className="expand-button"
                              onClick={() => toggleLessonDetails(lesson.id)}
                            >
                              {expandedLessonId === lesson.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                            <Box className="lesson-details">
                              <Typography className="lesson-title">
                                {lesson.title}
                                {lesson.isPreview && (
                                  <Chip label="Preview" size="small" color="info" className="preview-badge" />
                                )}
                              </Typography>
                              <Typography className="lesson-id">
                                ID: {lesson.id} • Order: {lesson.order_index}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip 
                            label={lesson.content_type} 
                            size="small"
                            className="content-type-badge"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            className="attachments-btn"
                            startIcon={<AttachFile />}
                            onClick={() => handleViewAttachments(lesson)}
                            disabled={!lesson.hasAttachments}
                          >
                            {lesson.attachmentCount} file{lesson.attachmentCount !== 1 ? 's' : ''}
                          </Button>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Tooltip title="Preview content">
                            <IconButton
                              className="preview-btn"
                              onClick={() => handlePreview(lesson)}
                              disabled={!isPreviewEnabled(lesson)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        
                        <TableCell>
                          <Box className="actions-cell">
                            <Tooltip title="Edit lesson">
                              <IconButton
                                className="edit-btn"
                                onClick={() => navigate(`/teacher/courses/${courseId}/lessons/${lesson.id}/edit`)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete lesson">
                              <IconButton
                                className="delete-btn"
                                onClick={() => handleDelete(lesson.id)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Details Row */}
                      <TableRow className={expandedLessonId === lesson.id ? 'expanded-details-row' : ''}>
                        <TableCell colSpan={5} sx={{ py: 0 }}>
                          <Collapse in={expandedLessonId === lesson.id}>
                            <Box className="expanded-content">
                              <Typography className="expanded-title">📊 Lesson Details</Typography>
                              <Box className="details-grid">
                                <Box className="detail-item">
                                  <Typography className="detail-label">Has Attachments:</Typography>
                                  <Typography className="detail-value">
                                    {lesson.hasAttachments ? '✅ Yes' : '❌ No'} 
                                    {lesson.hasAttachments && ` (${lesson.attachmentCount})`}
                                  </Typography>
                                </Box>
                                <Box className="detail-item">
                                  <Typography className="detail-label">Has Content:</Typography>
                                  <Typography className="detail-value">
                                    {lesson.hasContent ? '✅ Yes' : '❌ No'}
                                  </Typography>
                                </Box>
                                <Box className="detail-item">
                                  <Typography className="detail-label">Content Type:</Typography>
                                  <Typography className="detail-value">
                                    {lesson.content_type}
                                  </Typography>
                                </Box>
                                <Box className="detail-item">
                                  <Typography className="detail-label">Preview Lesson:</Typography>
                                  <Typography className="detail-value">
                                    {lesson.isPreview ? '✅ Yes' : '❌ No'}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              {lesson.attachments.length > 0 && (
                                <Box className="attachments-list" sx={{ mt: 2 }}>
                                  <Typography className="detail-label">Attachments:</Typography>
                                  <ul>
                                    {lesson.attachments.map((att, idx) => (
                                      <li key={idx}>
                                        {att.name || `File ${idx + 1}`} - {att.type || 'file'}
                                      </li>
                                    ))}
                                  </ul>
                                </Box>
                              )}
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

          {/* Debug Info Panel */}
          <Box className="debug-panel">
            <Typography className="debug-title">🐛 Debug Information</Typography>
            <Box className="debug-info">
              <Box className="debug-stat">
                <Typography className="debug-stat-label">Total Lessons:</Typography>
                <Typography className="debug-stat-value">{debugStats.totalLessons}</Typography>
              </Box>
              <Box className="debug-stat">
                <Typography className="debug-stat-label">Lessons with Attachments:</Typography>
                <Typography className="debug-stat-value">{debugStats.lessonsWithAttachments}</Typography>
              </Box>
              <Box className="debug-stat">
                <Typography className="debug-stat-label">Lessons with Content:</Typography>
                <Typography className="debug-stat-value">{debugStats.lessonsWithContent}</Typography>
              </Box>
              <Box className="debug-stat">
                <Typography className="debug-stat-label">Total Attachments:</Typography>
                <Typography className="debug-stat-value">{debugStats.totalAttachments}</Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TeachersManageLessons;