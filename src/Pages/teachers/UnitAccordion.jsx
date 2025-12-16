
// src/pages/teachers/UnitAccordion.jsx - FIXED DOM NESTING
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
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  Edit,
  Add,
  Description,
  VideoLibrary,
  PictureAsPdf
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const UnitAccordion = ({ unit, onAddLesson, onLessonUpdate, previewButton }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const getLessonIcon = (lesson) => {
    const contentType = lesson.content_type || lesson.contentType;
    
    switch (contentType) {
      case 'pdf':
      case 'file':
        return <PictureAsPdf fontSize="small" color="error" />;
      case 'video':
        return <VideoLibrary fontSize="small" color="primary" />;
      default:
        return <Description fontSize="small" color="action" />;
    }
  };

  const lessons = unit.lessons || [];

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleExpand}
      sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {unit.title}
            </Typography>
            {unit.description && (
              <Typography variant="body2" color="textSecondary" component="div">
                {unit.description}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${lessons.length} lesson${lessons.length !== 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 0 }}>
        {lessons.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" component="div">
              No lessons in this unit
            </Typography>
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
                  <ListItem 
                    sx={{ 
                      p: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      {getLessonIcon(lesson)}
                    </Box>
                    
                    <ListItemText
                      primary={
                        <Box component="div">
                          <Typography variant="subtitle1" component="div">
                            {lesson.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="div">
                            {lesson.content_type || lesson.contentType || 'text'} • Order: {lesson.order_index || 0}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box component="div" sx={{ mt: 0.5 }}>
                          {lesson.is_preview && (
                            <Chip 
                              label="Preview" 
                              size="small" 
                              color="success" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* Preview Button */}
                      <Box sx={{ mr: 1 }}>
                        {previewButton && previewButton(lesson)}
                      </Box>
                      
                      {/* Edit Button */}
                      <Tooltip title="Edit Lesson">
                        <IconButton
                          component={Link}
                          to={`/teacher/edit-lesson/${lesson.id}`}
                          size="small"
                        >
                          <Edit fontSize="small" />
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
  );
};

export default UnitAccordion;