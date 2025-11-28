// src/pages/teachers/UnitAccordion.jsx
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { ExpandMore, Add, Description } from "@mui/icons-material";
import LessonList from "./LessonList";

const UnitAccordion = ({ unit, onAddLesson, onLessonUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{unit.title}</Typography>
            {unit.description && (
              <Typography variant="body2" color="textSecondary">
                {unit.description}
              </Typography>
            )}
          </Box>

          <Chip
            label={`${unit.lessons?.length || 0} lessons`}
            size="small"
            variant="outlined"
          />

          <Button
            size="small"
            startIcon={<Add />}
            onClick={(e) => {
              e.stopPropagation();
              onAddLesson(unit);
            }}
            variant="outlined"
          >
            Add Lesson
          </Button>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        {unit.lessons && unit.lessons.length > 0 ? (
          <LessonList
            lessons={unit.lessons}
            unitId={unit.id}
            onLessonUpdate={onLessonUpdate}
          />
        ) : (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Description sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography>No lessons in this unit yet</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => onAddLesson(unit)}
              sx={{ mt: 1 }}
            >
              Add First Lesson
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default UnitAccordion;
