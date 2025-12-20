
// // src/pages/teachers/UnitAccordion.jsx - FINAL FIXED VERSION
// import React, { useState } from 'react';
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Box,
//   Chip,
//   IconButton,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Divider,
//   Tooltip
// } from '@mui/material';
// import {
//   ExpandMore,
//   Edit,
//   Add,
//   Description,
//   VideoLibrary,
//   PictureAsPdf
// } from '@mui/icons-material';
// import { Link } from 'react-router-dom';

// // Debug: Log when component is imported
// console.log('🔧 UnitAccordion component loaded');

// const UnitAccordion = ({ unit, onAddLesson, onLessonUpdate, previewButton }) => {
//   const [expanded, setExpanded] = useState(false);

//   const handleExpand = () => {
//     setExpanded(!expanded);
//   };

//   const getLessonIcon = (lesson) => {
//     const contentType = lesson.content_type || lesson.contentType;
    
//     switch (contentType) {
//       case 'pdf':
//       case 'file':
//         return <PictureAsPdf fontSize="small" color="error" />;
//       case 'video':
//         return <VideoLibrary fontSize="small" color="primary" />;
//       default:
//         return <Description fontSize="small" color="action" />;
//     }
//   };

//   const lessons = unit.lessons || [];

//   return (
//     <Accordion 
//       expanded={expanded} 
//       onChange={handleExpand}
//       sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}
//     >
//       <AccordionSummary expandIcon={<ExpandMore />}>
//         <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
//           <Box sx={{ flexGrow: 1 }}>
//             <Typography variant="h6" component="div">
//               {unit.title}
//             </Typography>
//             {unit.description && (
//               <Typography variant="body2" color="textSecondary" component="div">
//                 {unit.description}
//               </Typography>
//             )}
//           </Box>
          
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Chip 
//               label={`${lessons.length} lesson${lessons.length !== 1 ? 's' : ''}`}
//               size="small"
//               color="primary"
//               variant="outlined"
//             />
//           </Box>
//         </Box>
//       </AccordionSummary>
      
//       <AccordionDetails sx={{ p: 0 }}>
//         {lessons.length === 0 ? (
//           <Box sx={{ p: 3, textAlign: 'center' }}>
//             <Typography variant="body1" color="textSecondary" component="div">
//               No lessons in this unit
//             </Typography>
//             <Button
//               startIcon={<Add />}
//               onClick={() => onAddLesson(unit)}
//               variant="outlined"
//               sx={{ mt: 2 }}
//             >
//               Add Lesson
//             </Button>
//           </Box>
//         ) : (
//           <>
//             <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
//               <Button
//                 startIcon={<Add />}
//                 onClick={() => onAddLesson(unit)}
//                 variant="contained"
//                 size="small"
//               >
//                 Add Lesson to Unit
//               </Button>
//             </Box>
            
//             <Divider />
            
//             <List sx={{ p: 0 }}>
//               {lessons.map((lesson, index) => (
//                 <React.Fragment key={lesson.id}>
//                   <ListItem 
//                     sx={{ 
//                       p: 2,
//                       '&:hover': {
//                         backgroundColor: 'action.hover'
//                       }
//                     }}
//                   >
//                     <Box sx={{ mr: 2 }}>
//                       {getLessonIcon(lesson)}
//                     </Box>
                    
//                     <ListItemText
//                       primary={
//                         <Box component="div">
//                           <Typography variant="subtitle1" component="div">
//                             {lesson.title}
//                           </Typography>
//                           <Typography variant="body2" color="textSecondary" component="div">
//                             {lesson.content_type || lesson.contentType || 'text'} • Order: {lesson.order_index || 0}
//                             {lesson.is_preview && ' • Preview'}
//                           </Typography>
//                         </Box>
//                       }
//                       secondary={
//                         <Box component="div" sx={{ mt: 0.5 }}>
//                           {lesson.is_preview && (
//                             <Chip 
//                               label="Preview" 
//                               size="small" 
//                               color="success" 
//                               variant="outlined"
//                               sx={{ mr: 1 }}
//                             />
//                           )}
//                         </Box>
//                       }
//                     />
                    
//                     <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       {/* Preview Button */}
//                       <Box sx={{ mr: 1 }}>
//                         {previewButton && previewButton(lesson)}
//                       </Box>
                      
//                       {/* Edit Button - FIXED ROUTE */}
//                       <Tooltip title="Edit Lesson">
//                         <IconButton
//                           component={Link}
//                           to={`/lessons/${lesson.id}/edit`}
//                           size="small"
//                           onClick={() => console.log('Edit clicked for lesson:', lesson.id)}
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     </ListItemSecondaryAction>
//                   </ListItem>
                  
//                   {index < lessons.length - 1 && <Divider />}
//                 </React.Fragment>
//               ))}
//             </List>
//           </>
//         )}
//       </AccordionDetails>
//     </Accordion>
//   );
// };

// // ✅ MUST HAVE THIS EXPORT
// export default UnitAccordion;





// src/pages/teachers/UnitAccordion.jsx
import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  ExpandMore,
  Edit,
  Add,
  Description,
  VideoLibrary,
  PictureAsPdf,
  Delete,
  AttachFile,
  Visibility
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const UnitAccordion = ({ unit, onAddLesson, onLessonUpdate, previewButton }) => {
  const [expanded, setExpanded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewType, setPreviewType] = useState("");

  const lessons = unit.lessons || [];

  const handleExpand = () => setExpanded(!expanded);

  const getLessonIcon = (lesson) => {
    const type = lesson.content_type || lesson.contentType;
    switch (type) {
      case 'pdf':
      case 'file':
        return <PictureAsPdf fontSize="small" color="error" />;
      case 'video':
        return <VideoLibrary fontSize="small" color="primary" />;
      default:
        return <Description fontSize="small" color="action" />;
    }
  };

  const hasAttachments = (lesson) => lesson.attachments && lesson.attachments.length > 0;
  const getAttachmentCount = (lesson) => {
    if (lesson.attachments) return lesson.attachments.length;
    if (lesson.file_url) return 1;
    return 0;
  };

  const handlePreview = (file) => {
    // Determine preview type
    const url = file.filePath || file.fileUrl || file.url;
    if (!url) return;

    const type = (file.type || "").toLowerCase();
    setPreviewContent(url);
    setPreviewType(type.includes("video") ? "video" : type.includes("pdf") ? "pdf" : "text");
    setPreviewOpen(true);
  };

  const renderPreview = () => {
    if (!previewContent) return null;

    switch (previewType) {
      case 'pdf':
        return <iframe src={previewContent} style={{ width: "100%", height: "600px", border: "none" }} />;
      case 'video':
        return (
          <video controls style={{ width: "100%", maxHeight: "600px" }}>
            <source src={previewContent} type="video/mp4" />
            Your browser does not support video.
          </video>
        );
      case 'text':
        return <Box sx={{ p: 2, maxHeight: "600px", overflow: "auto" }} dangerouslySetInnerHTML={{ __html: previewContent }} />;
      default:
        return <Typography>Preview not available</Typography>;
    }
  };

  return (
    <>
      <Accordion 
        expanded={expanded} 
        onChange={handleExpand} 
        sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{unit.title}</Typography>
              {unit.description && (
                <Typography variant="body2" color="textSecondary">
                  {unit.description}
                </Typography>
              )}
            </Box>
            <Chip 
              label={`${lessons.length} lesson${lessons.length !== 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          {lessons.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">No lessons in this unit</Typography>
              <Button
                startIcon={<Add />}
                onClick={() => onAddLesson(unit)}
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Add Lesson
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<Add />}
                  onClick={() => onAddLesson(unit)}
                  variant="contained"
                  size="small"
                >
                  Add Lesson to Unit
                </Button>
              </Box>

              <Divider />

              <List sx={{ p: 0 }}>
                {lessons.map((lesson, index) => (
                  <React.Fragment key={lesson.id}>
                    <ListItem sx={{ p: 2, '&:hover': { backgroundColor: 'action.hover' } }}>
                      <Box sx={{ mr: 2 }}>{getLessonIcon(lesson)}</Box>

                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="subtitle1">{lesson.title}</Typography>

                            {/* Preview Button */}
                            {hasAttachments(lesson) && lesson.attachments.slice(0, 1).map((file, idx) => (
                              <Tooltip key={idx} title="Preview File">
                                <IconButton size="small" onClick={() => handlePreview(file)}>
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ))}

                            {previewButton && previewButton(lesson)}

                            {/* Attachment Badge */}
                            {getAttachmentCount(lesson) > 0 && (
                              <Chip 
                                icon={<AttachFile fontSize="small" />}
                                label={getAttachmentCount(lesson)}
                                size="small"
                                color="primary"
                              />
                            )}

                            {lesson.is_preview && (
                              <Chip label="Preview" color="success" size="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            <Chip
                              label={`Type: ${lesson.content_type || lesson.contentType || 'text'}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`Order: ${lesson.order_index || lesson.orderIndex || 0}`}
                              size="small"
                              variant="outlined"
                            />

                            {/* Display up to 3 attachments */}
                            {hasAttachments(lesson) && (
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {lesson.attachments.slice(0, 3).map((att, idx) => (
                                  <Chip
                                    key={idx}
                                    label={att.fileName || att.filePath?.split('/').pop() || 'File'}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => handlePreview(att)}
                                  />
                                ))}
                                {lesson.attachments.length > 3 && (
                                  <Chip
                                    label={`+${lesson.attachments.length - 3} more`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            )}
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Edit Button */}
                        <Tooltip title="Edit Lesson">
                          <IconButton
                            component={Link}
                            to={`/lessons/${lesson.id}/edit`}
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Delete Lesson">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onLessonUpdate('delete', lesson)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>

                    {index < lessons.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Preview
        </DialogTitle>
        <DialogContent>
          {renderPreview()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnitAccordion;
