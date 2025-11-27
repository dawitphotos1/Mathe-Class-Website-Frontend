// // src/pages/teachers/LessonList.jsx
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
//   PictureAsPdf,
//   TextFields,
//   Description,
// } from "@mui/icons-material";
// import lessonService from "../../services/lessonService";
// import { useNavigate } from "react-router-dom";

// const LessonList = ({ lessons, unitId, onLessonUpdate }) => {
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   /* -----------------------------
//       OPEN CONTEXT MENU
//   ------------------------------*/
//   const handleMenuOpen = (event, lesson) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedLesson(lesson);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedLesson(null);
//   };

//   /* -----------------------------
//       FIXED: REACT ROUTER PREVIEW
//       Teacher Dashboard Preview 
//   ------------------------------*/
//   const handlePreviewLesson = () => {
//     if (!selectedLesson) return;
//     navigate(`/lessons/${selectedLesson.id}/preview`);
//     handleMenuClose();
//   };

//   /* -----------------------------
//       EDIT LESSON
//   ------------------------------*/
//   const handleEditLesson = () => {
//     navigate(`/lessons/${selectedLesson.id}/edit`);
//     handleMenuClose();
//   };

//   /* -----------------------------
//       DELETE LESSON
//   ------------------------------*/
//   const handleDeleteLesson = async () => {
//     if (!selectedLesson) return;

//     try {
//       setLoading(true);
//       setError("");

//       const res = await lessonService.deleteLesson(selectedLesson.id);

//       if (!res.success) throw new Error(res.error);

//       onLessonUpdate(); // refresh list
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       handleMenuClose();
//     }
//   };

//   /* -----------------------------
//       ICON PICKER
//   ------------------------------*/
//   const getIcon = (type) => {
//     switch (type) {
//       case "video":
//         return <VideoLibrary color="primary" />;
//       case "pdf":
//         return <PictureAsPdf color="error" />;
//       case "text":
//         return <TextFields color="success" />;
//       default:
//         return <Description />;
//     }
//   };

//   /* -----------------------------
//       RENDER COMPONENT
//   ------------------------------*/
//   return (
//     <Box>
//       {error && <Alert severity="error">{error}</Alert>}

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         {lessons.map((lesson) => (
//           <Card key={lesson.id} variant="outlined">
//             <CardContent>
//               <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
//                 {/* Icon */}
//                 {getIcon(lesson.content_type)}

//                 {/* Lesson Info */}
//                 <Box sx={{ flex: 1 }}>
//                   <Typography variant="h6">{lesson.title}</Typography>

//                   <Chip label={lesson.content_type} size="small" />

//                   {lesson.is_preview && (
//                     <Chip label="Preview" size="small" color="warning" />
//                   )}

//                   <Typography variant="caption">
//                     Order: {lesson.order_index}
//                   </Typography>

//                   {lesson.content && (
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                       {lesson.content.length > 150
//                         ? lesson.content.slice(0, 150) + "..."
//                         : lesson.content}
//                     </Typography>
//                   )}
//                 </Box>

//                 {/* Menu Button */}
//                 <IconButton onClick={(e) => handleMenuOpen(e, lesson)}>
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
//         <MenuItem onClick={handlePreviewLesson}>
//           <ListItemIcon>
//             <Visibility />
//           </ListItemIcon>
//           <ListItemText>Preview Lesson</ListItemText>
//         </MenuItem>

//         <MenuItem onClick={handleEditLesson}>
//           <ListItemIcon>
//             <Edit />
//           </ListItemIcon>
//           <ListItemText>Edit Lesson</ListItemText>
//         </MenuItem>

//         <MenuItem onClick={handleDeleteLesson} disabled={loading}>
//           <ListItemIcon>
//             <Delete />
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






// src/pages/teachers/LessonList.jsx
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
  PictureAsPdf,
  TextFields,
  Description,
} from "@mui/icons-material";
import lessonService from "../../services/lessonService";
import { useNavigate } from "react-router-dom";

const LessonList = ({ lessons, unitId, onLessonUpdate }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* -----------------------------
      OPEN MENU
  ------------------------------*/
  const handleMenuOpen = (event, lesson) => {
    setMenuAnchor(event.currentTarget);
    setSelectedLesson(lesson);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedLesson(null);
  };

  /* -----------------------------
      FIXED: CORRECT PREVIEW ROUTE
  ------------------------------*/
  const handlePreviewLesson = () => {
    if (!selectedLesson) return;
    navigate(`/lessons/${selectedLesson.id}/preview`);
    handleMenuClose();
  };

  /* -----------------------------
      EDIT LESSON
  ------------------------------*/
  const handleEditLesson = () => {
    navigate(`/lessons/${selectedLesson.id}/edit`);
    handleMenuClose();
  };

  /* -----------------------------
      DELETE LESSON
  ------------------------------*/
  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      setLoading(true);
      setError("");

      const res = await lessonService.deleteLesson(selectedLesson.id);

      if (!res.success) throw new Error(res.error);

      onLessonUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  /* -----------------------------
      ICON PICKER
  ------------------------------*/
  const getIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoLibrary color="primary" />;
      case "pdf":
        return <PictureAsPdf color="error" />;
      case "text":
        return <TextFields color="success" />;
      default:
        return <Description />;
    }
  };

  /* -----------------------------
      RENDER
  ------------------------------*/
  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {lessons.map((lesson) => (
          <Card key={lesson.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                {getIcon(lesson.content_type)}

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{lesson.title}</Typography>

                  <Chip label={lesson.content_type} size="small" />

                  {lesson.is_preview && (
                    <Chip label="Preview" size="small" color="warning" />
                  )}

                  <Typography variant="caption">
                    Order: {lesson.order_index}
                  </Typography>

                  {lesson.content && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {lesson.content.length > 150
                        ? lesson.content.slice(0, 150) + "..."
                        : lesson.content}
                    </Typography>
                  )}
                </Box>

                <IconButton onClick={(e) => handleMenuOpen(e, lesson)}>
                  <MoreVert />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* MENU */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePreviewLesson}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText>Preview Lesson</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleEditLesson}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Edit Lesson</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteLesson} disabled={loading}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>{loading ? "Deleting..." : "Delete Lesson"}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LessonList;
