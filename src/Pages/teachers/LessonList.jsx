
// //src / pages / teachers / LessonList.jsx

// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Chip,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Alert,
// } from "@mui/material";
// import {
//   MoreVert,
//   Edit,
//   Delete,
//   Visibility,
//   VideoLibrary,
//   Description,
//   PictureAsPdf,
//   TextFields,
// } from "@mui/icons-material";
// import lessonService from "../../services/lessonService";

// const LessonList = ({ lessons, unitId, onLessonUpdate }) => {
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleMenuOpen = (event, lesson) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedLesson(lesson);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedLesson(null);
//   };

//   const handleDeleteLesson = async () => {
//     if (!selectedLesson) return;

//     try {
//       setLoading(true);
//       setError("");

//       const response = await lessonService.deleteLesson(selectedLesson.id);

//       if (response.success) {
//         console.log("✅ Lesson deleted successfully");
//         onLessonUpdate(); // Refresh the list
//       } else {
//         throw new Error(response.error || "Failed to delete lesson");
//       }
//     } catch (error) {
//       console.error("❌ Error deleting lesson:", error);
//       setError(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to delete lesson"
//       );
//     } finally {
//       setLoading(false);
//       handleMenuClose();
//     }
//   };

//   const getLessonIcon = (contentType) => {
//     switch (contentType) {
//       case "video":
//         return <VideoLibrary color="primary" />;
//       case "pdf":
//         return <PictureAsPdf color="error" />;
//       case "text":
//         return <TextFields color="success" />;
//       default:
//         return <Description color="action" />;
//     }
//   };

//   const getContentTypeLabel = (contentType) => {
//     switch (contentType) {
//       case "video":
//         return "Video";
//       case "pdf":
//         return "PDF";
//       case "text":
//         return "Text";
//       case "unit_header":
//         return "Unit Header";
//       default:
//         return contentType || "Content";
//     }
//   };

//   const getContentTypeColor = (contentType) => {
//     switch (contentType) {
//       case "video":
//         return "primary";
//       case "pdf":
//         return "error";
//       case "text":
//         return "success";
//       case "unit_header":
//         return "secondary";
//       default:
//         return "default";
//     }
//   };

//   if (!lessons || lessons.length === 0) {
//     return (
//       <Box sx={{ textAlign: "center", py: 3 }}>
//         <Typography variant="body1" color="textSecondary">
//           No lessons available
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         {lessons.map((lesson) => (
//           <Card key={lesson.id} variant="outlined">
//             <CardContent>
//               <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
//                 {/* Lesson Icon */}
//                 <Box sx={{ mt: 0.5 }}>{getLessonIcon(lesson.content_type)}</Box>

//                 {/* Lesson Content */}
//                 <Box sx={{ flex: 1 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       mb: 1,
//                     }}
//                   >
//                     <Typography variant="h6" component="h4">
//                       {lesson.title}
//                     </Typography>

//                     <Chip
//                       label={getContentTypeLabel(lesson.content_type)}
//                       size="small"
//                       color={getContentTypeColor(lesson.content_type)}
//                       variant="outlined"
//                     />

//                     {lesson.is_preview && (
//                       <Chip
//                         label="Preview"
//                         size="small"
//                         color="warning"
//                         variant="outlined"
//                       />
//                     )}

//                     <Chip
//                       label={`Order: ${lesson.order_index}`}
//                       size="small"
//                       variant="outlined"
//                     />
//                   </Box>

//                   {lesson.content && (
//                     <Typography variant="body2" color="textSecondary" paragraph>
//                       {lesson.content.length > 150
//                         ? `${lesson.content.substring(0, 150)}...`
//                         : lesson.content}
//                     </Typography>
//                   )}

//                   {/* File Info */}
//                   <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                     {lesson.file_url && (
//                       <Chip
//                         icon={<PictureAsPdf />}
//                         label="PDF Attached"
//                         size="small"
//                         variant="outlined"
//                       />
//                     )}

//                     {lesson.video_url && (
//                       <Chip
//                         icon={<VideoLibrary />}
//                         label="Video Available"
//                         size="small"
//                         variant="outlined"
//                       />
//                     )}
//                   </Box>

//                   {/* Metadata */}
//                   <Typography
//                     variant="caption"
//                     color="textSecondary"
//                     sx={{ mt: 1, display: "block" }}
//                   >
//                     Created: {new Date(lesson.created_at).toLocaleDateString()}
//                   </Typography>
//                 </Box>

//                 {/* Actions Menu */}
//                 <IconButton
//                   size="small"
//                   onClick={(e) => handleMenuOpen(e, lesson)}
//                   disabled={loading}
//                 >
//                   <MoreVert />
//                 </IconButton>
//               </Box>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>

//       {/* Context Menu */}
//       <Menu
//         anchorEl={menuAnchor}
//         open={Boolean(menuAnchor)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleMenuClose}>
//           <ListItemIcon>
//             <Visibility fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>View Lesson</ListItemText>
//         </MenuItem>

//         <MenuItem onClick={handleMenuClose}>
//           <ListItemIcon>
//             <Edit fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Edit Lesson</ListItemText>
//         </MenuItem>

//         <MenuItem onClick={handleDeleteLesson} disabled={loading}>
//           <ListItemIcon>
//             <Delete fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>
//             {loading ? "Deleting..." : "Delete Lesson"}
//           </ListItemText>
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default LessonList;




import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VideoLibrary,
  Description,
  PictureAsPdf,
  TextFields,
} from "@mui/icons-material";
import lessonService from "../../services/lessonService";
import { useNavigate } from "react-router-dom";

const LessonList = ({ lessons, unitId, onLessonUpdate }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleMenuOpen = (event, lesson) => {
    setMenuAnchor(event.currentTarget);
    setSelectedLesson(lesson);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedLesson(null);
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      setLoading(true);
      setError("");

      const response = await lessonService.deleteLesson(selectedLesson.id);

      if (response.success) {
        console.log("✅ Lesson deleted successfully");
        onLessonUpdate();
      } else {
        throw new Error(response.error || "Failed to delete lesson");
      }
    } catch (error) {
      console.error("❌ Error deleting lesson:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to delete lesson"
      );
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  // ⭐ NEW: Working Preview
  const handlePreviewLesson = () => {
    if (!selectedLesson) return;

    const base = process.env.REACT_APP_API_URL || "";
    const url = `${base}/lessons/${selectedLesson.id}/preview`;

    window.open(url, "_blank");
    handleMenuClose();
  };

  // ⭐ NEW: Working Edit
  const handleEditLesson = () => {
    if (!selectedLesson) return;

    navigate(`/lessons/${selectedLesson.id}/edit`);
    handleMenuClose();
  };

  const getLessonIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <VideoLibrary color="primary" />;
      case "pdf":
        return <PictureAsPdf color="error" />;
      case "text":
        return <TextFields color="success" />;
      default:
        return <Description color="action" />;
    }
  };

  const getContentTypeLabel = (contentType) => {
    switch (contentType) {
      case "video":
        return "Video";
      case "pdf":
        return "PDF";
      case "text":
        return "Text";
      case "unit_header":
        return "Unit Header";
      default:
        return contentType || "Content";
    }
  };

  if (!lessons || lessons.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body1" color="textSecondary">
          No lessons available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {lessons.map((lesson) => (
          <Card key={lesson.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box sx={{ mt: 0.5 }}>{getLessonIcon(lesson.content_type)}</Box>

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" component="h4">
                      {lesson.title}
                    </Typography>

                    <Chip
                      label={getContentTypeLabel(lesson.content_type)}
                      size="small"
                    />

                    {lesson.is_preview && (
                      <Chip
                        label="Preview"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}

                    <Chip
                      label={`Order: ${lesson.order_index}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {lesson.content && (
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {lesson.content.length > 150
                        ? `${lesson.content.substring(0, 150)}...`
                        : lesson.content}
                    </Typography>
                  )}

                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Created: {new Date(lesson.created_at).toLocaleDateString()}
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, lesson)}
                  disabled={loading}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ⭐ FIXED MENU */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePreviewLesson}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Lesson</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleEditLesson}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Lesson</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteLesson} disabled={loading}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {loading ? "Deleting..." : "Delete Lesson"}
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LessonList;
