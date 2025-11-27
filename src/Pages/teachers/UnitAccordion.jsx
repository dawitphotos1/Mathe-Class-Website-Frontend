
// //src/pages/teachers/UnitAccordion.jsx

// import React, { useState } from "react";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Box,
//   Button,
//   Chip,
// } from "@mui/material";
// import { ExpandMore, Add, Description } from "@mui/icons-material";
// import LessonList from "./LessonList";

// const UnitAccordion = ({ unit, onAddLesson, onLessonUpdate }) => {
//   const [expanded, setExpanded] = useState(false);

//   const handleExpand = () => {
//     setExpanded(!expanded);
//   };

//   return (
//     <Accordion expanded={expanded} onChange={handleExpand} sx={{ mb: 2 }}>
//       <AccordionSummary expandIcon={<ExpandMore />}>
//         <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
//           <Box sx={{ flex: 1 }}>
//             <Typography variant="h6" component="h3">
//               {unit.title}
//             </Typography>
//             {unit.description && (
//               <Typography variant="body2" color="textSecondary">
//                 {unit.description}
//               </Typography>
//             )}
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Chip
//               label={`${unit.lessons?.length || 0} lessons`}
//               size="small"
//               variant="outlined"
//             />
//             <Button
//               size="small"
//               startIcon={<Add />}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onAddLesson(unit);
//               }}
//               variant="outlined"
//             >
//               Add Lesson
//             </Button>
//           </Box>
//         </Box>
//       </AccordionSummary>

//       <AccordionDetails>
//         {unit.lessons && unit.lessons.length > 0 ? (
//           <LessonList
//             lessons={unit.lessons}
//             unitId={unit.id}
//             onLessonUpdate={onLessonUpdate}
//           />
//         ) : (
//           <Box sx={{ textAlign: "center", py: 3 }}>
//             <Description
//               sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
//             />
//             <Typography variant="body1" gutterBottom>
//               No lessons in this unit yet
//             </Typography>
//             <Typography variant="body2" color="textSecondary" gutterBottom>
//               Add your first lesson to start building this unit
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<Add />}
//               onClick={() => onAddLesson(unit)}
//               sx={{ mt: 1 }}
//             >
//               Add First Lesson
//             </Button>
//           </Box>
//         )}
//       </AccordionDetails>
//     </Accordion>
//   );
// };

// export default UnitAccordion;





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

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleExpand} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3">
              {unit.title}
            </Typography>
            {unit.description && (
              <Typography variant="body2" color="textSecondary">
                {unit.description}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        {unit.lessons && unit.lessons.length > 0 ? (
          <Box>
            {unit.lessons.map((lesson) => (
              <Box
                key={lesson.id}
                sx={{
                  p: 2,
                  mb: 1.5,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {lesson.title}
                </Typography>

                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  {/* PREVIEW BUTTON ADDED HERE */}
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/preview/${lesson.id}`;
                    }}
                  >
                    Preview
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLessonUpdate(lesson);
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Description
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="body1" gutterBottom>
              No lessons in this unit yet
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Add your first lesson to start building this unit
            </Typography>
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
