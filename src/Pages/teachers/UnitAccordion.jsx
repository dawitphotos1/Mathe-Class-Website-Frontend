// // src/pages/teachers/UnitAccordion.jsx
// import React from "react";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Box,
//   Button,
//   Chip,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import VideoIcon from "@mui/icons-material/VideoLibrary";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import TextIcon from "@mui/icons-material/TextSnippet";

// import { useNavigate } from "react-router-dom";

// const UnitAccordion = ({ unit, onAddLesson, onLessonUpdate }) => {
//   const navigate = useNavigate();

//   const getLessonIcon = (type) => {
//     switch (type) {
//       case "video":
//         return <VideoIcon color="primary" fontSize="small" />;
//       case "pdf":
//         return <PictureAsPdfIcon color="secondary" fontSize="small" />;
//       case "text":
//       default:
//         return <TextIcon color="action" fontSize="small" />;
//     }
//   };

//   return (
//     <Accordion sx={{ mb: 2 }}>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <Typography variant="h6">{unit.title}</Typography>

//           <Chip
//             label={`${unit.lessons?.length || 0} Lessons`}
//             size="small"
//             variant="outlined"
//           />
//         </Box>
//       </AccordionSummary>

//       <AccordionDetails>
//         {/* Add Lesson Button */}
//         <Box sx={{ textAlign: "right", mb: 2 }}>
//           <Button variant="contained" size="small" onClick={onAddLesson}>
//             Add Lesson
//           </Button>
//         </Box>

//         {/* LESSON LIST */}
//         {unit.lessons && unit.lessons.length > 0 ? (
//           <List dense>
//             {unit.lessons.map((lesson) => (
//               <ListItem
//                 key={lesson.id}
//                 sx={{
//                   borderBottom: "1px solid #eee",
//                   py: 1.5,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                     width: "100%",
//                   }}
//                 >
//                   {/* ICON */}
//                   {getLessonIcon(lesson.content_type)}

//                   {/* TEXT CONTENT */}
//                   <ListItemText
//                     primary={
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Typography variant="body1" fontWeight="medium">
//                           {lesson.title}
//                         </Typography>

//                         {/* PREVIEW BUTTON */}
//                         <Button
//                           size="small"
//                           startIcon={<VisibilityIcon />}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/lessons/${lesson.id}/preview`);
//                           }}
//                         >
//                           Preview
//                         </Button>

//                         {lesson.is_preview && (
//                           <Chip
//                             label="Free Preview"
//                             color="success"
//                             size="small"
//                           />
//                         )}
//                       </Box>
//                     }
//                     secondary={
//                       <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
//                         <Chip
//                           label={`Type: ${lesson.content_type}`}
//                           size="small"
//                           variant="outlined"
//                         />
//                         <Chip
//                           label={`Order: ${lesson.order_index}`}
//                           size="small"
//                           variant="outlined"
//                         />
//                       </Box>
//                     }
//                   />
//                 </Box>

//                 {/* ACTION ICONS */}
//                 <ListItemSecondaryAction>
//                   <IconButton
//                     edge="end"
//                     aria-label="edit"
//                     onClick={() => navigate(`/lessons/${lesson.id}/edit`)}
//                     size="small"
//                     sx={{ mr: 1 }}
//                   >
//                     <EditIcon />
//                   </IconButton>

//                   <IconButton
//                     edge="end"
//                     aria-label="delete"
//                     onClick={() => onLessonUpdate("delete", lesson)}
//                     size="small"
//                     color="error"
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </ListItemSecondaryAction>
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Typography variant="body2" color="textSecondary">
//             No lessons in this unit yet.
//           </Typography>
//         )}
//       </AccordionDetails>
//     </Accordion>
//   );
// };

// export default UnitAccordion;




// src/pages/teachers/UnitAccordion.jsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import VideoIcon from "@mui/icons-material/VideoLibrary";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextIcon from "@mui/icons-material/TextSnippet";

import { useNavigate } from "react-router-dom";

const UnitAccordion = ({ unit, onAddLesson, onLessonUpdate }) => {
  const navigate = useNavigate();

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoIcon color="primary" fontSize="small" />;
      case "pdf":
        return <PictureAsPdfIcon color="secondary" fontSize="small" />;
      case "text":
      default:
        return <TextIcon color="action" fontSize="small" />;
    }
  };

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6">{unit.title}</Typography>

          <Chip label={`${unit.lessons?.length || 0} Lessons`} size="small" variant="outlined" />
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button variant="contained" size="small" onClick={onAddLesson}>Add Lesson</Button>
        </Box>

        {unit.lessons && unit.lessons.length > 0 ? (
          <List dense>
            {unit.lessons.map((lesson) => (
              <ListItem key={lesson.id} sx={{ borderBottom: "1px solid #eee", py: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                  {getLessonIcon(lesson.content_type)}

                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body1" fontWeight="medium">{lesson.title}</Typography>

                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (lesson?.id) {
                              navigate(`/lessons/${lesson.id}/preview`);
                            }
                          }}
                        >
                          Preview
                        </Button>

                        {lesson.is_preview && <Chip label="Free Preview" color="success" size="small" />}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                        <Chip label={`Type: ${lesson.content_type}`} size="small" variant="outlined" />
                        <Chip label={`Order: ${lesson.order_index}`} size="small" variant="outlined" />
                      </Box>
                    }
                  />
                </Box>

                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => navigate(`/lessons/${lesson.id}/edit`)} size="small" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>

                  <IconButton edge="end" aria-label="delete" onClick={() => onLessonUpdate("delete", lesson)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">No lessons in this unit yet.</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default UnitAccordion;
