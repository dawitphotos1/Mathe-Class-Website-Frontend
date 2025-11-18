// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Chip,
// } from "@mui/material";
// import {
//   ExpandMore,
//   Add,
//   VideoLibrary,
//   Description,
// } from "@mui/icons-material";
// import axiosInstance from "../../utils/axiosInstance";
// import UnitAccordion from "./UnitAccordion";
// import LessonForm from "../../pages/teachers/LessonForm";

// const CourseContent = ({ course }) => {
//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showLessonForm, setShowLessonForm] = useState(false);
//   const [selectedUnit, setSelectedUnit] = useState(null);

//   useEffect(() => {
//     fetchCourseStructure();
//   }, [course?.id]);

//   const fetchCourseStructure = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(
//         `/courses/teacher/${course.id}/full`
//       );

//       if (response.data.success) {
//         setUnits(response.data.course.units || []);
//         console.log("✅ Loaded course structure:", response.data.course);
//       } else {
//         throw new Error(response.data.error || "Failed to load course content");
//       }
//     } catch (error) {
//       console.error("❌ Error fetching course structure:", error);
//       setError(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to load course content"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateLesson = (unit = null) => {
//     setSelectedUnit(unit);
//     setShowLessonForm(true);
//   };

//   const handleLessonCreated = (newLesson) => {
//     console.log("✅ New lesson created:", newLesson);
//     setShowLessonForm(false);
//     setSelectedUnit(null);

//     // Refresh the course structure
//     fetchCourseStructure();
//   };

//   const handleLessonFormCancel = () => {
//     setShowLessonForm(false);
//     setSelectedUnit(null);
//   };

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight={200}
//       >
//         <CircularProgress />
//         <Typography variant="body1" sx={{ ml: 2 }}>
//           Loading course content...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ mb: 2 }}>
//         {error}
//       </Alert>
//     );
//   }

//   return (
//     <Box>
//       {/* Course Header */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Box>
//               <Typography variant="h4" gutterBottom>
//                 {course.title}
//               </Typography>
//               <Typography variant="body1" color="textSecondary" gutterBottom>
//                 {course.description}
//               </Typography>
//               <Box display="flex" gap={1} mt={1}>
//                 <Chip
//                   label={`${units.length} Units`}
//                   variant="outlined"
//                   size="small"
//                 />
//                 <Chip
//                   label={`${units.reduce(
//                     (total, unit) => total + (unit.lessons?.length || 0),
//                     0
//                   )} Lessons`}
//                   variant="outlined"
//                   size="small"
//                 />
//               </Box>
//             </Box>
//             <Button
//               variant="contained"
//               startIcon={<Add />}
//               onClick={() => handleCreateLesson()}
//             >
//               Add Lesson
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Lesson Creation Form */}
//       {showLessonForm && (
//         <LessonForm
//           courseId={course.id}
//           unitId={selectedUnit?.id}
//           onSuccess={handleLessonCreated}
//           onCancel={handleLessonFormCancel}
//         />
//       )}

//       {/* Course Units and Lessons */}
//       {units.length === 0 ? (
//         <Card>
//           <CardContent sx={{ textAlign: "center", py: 4 }}>
//             <Description
//               sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
//             />
//             <Typography variant="h6" gutterBottom>
//               No Content Yet
//             </Typography>
//             <Typography variant="body2" color="textSecondary" gutterBottom>
//               Start building your course by adding lessons and organizing them
//               into units.
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<Add />}
//               onClick={() => handleCreateLesson()}
//               sx={{ mt: 2 }}
//             >
//               Create Your First Lesson
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <Box>
//           {units.map((unit, index) => (
//             <UnitAccordion
//               key={unit.id}
//               unit={unit}
//               onAddLesson={() => handleCreateLesson(unit)}
//               onLessonUpdate={fetchCourseStructure}
//             />
//           ))}
//         </Box>
//       )}

//       {/* Standalone Lessons (without units) */}
//       <Box mt={4}>
//         <Typography variant="h6" gutterBottom>
//           Additional Lessons
//         </Typography>
//         <Typography variant="body2" color="textSecondary" gutterBottom>
//           Lessons not assigned to any specific unit.
//         </Typography>
//         <Button
//           variant="outlined"
//           startIcon={<Add />}
//           onClick={() => handleCreateLesson()}
//           sx={{ mt: 1 }}
//         >
//           Add Standalone Lesson
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CourseContent;




import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  VideoLibrary,
  Description,
} from "@mui/icons-material";
import axiosInstance from "../../utils/axiosInstance";
import UnitAccordion from "./UnitAccordion";
import LessonForm from "../../pages/teachers/LessonForm";

const CourseContent = ({ course }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    fetchCourseStructure();
  }, [course?.id]);

  const fetchCourseStructure = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/courses/teacher/${course.id}/full`
      );

      if (response.data.success) {
        setUnits(response.data.course.units || []);
        console.log("✅ Loaded course structure:", response.data.course);
      } else {
        throw new Error(response.data.error || "Failed to load course content");
      }
    } catch (error) {
      console.error("❌ Error fetching course structure:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to load course content"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = (unit = null) => {
    setSelectedUnit(unit);
    setShowLessonForm(true);
  };

  const handleLessonCreated = (newLesson) => {
    console.log("✅ New lesson created:", newLesson);
    setShowLessonForm(false);
    setSelectedUnit(null);

    // Refresh the course structure
    fetchCourseStructure();
  };

  const handleLessonFormCancel = () => {
    setShowLessonForm(false);
    setSelectedUnit(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading course content...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Course Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {course.description}
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip
                  label={`${units.length} Units`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`${units.reduce(
                    (total, unit) => total + (unit.lessons?.length || 0),
                    0
                  )} Lessons`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleCreateLesson()}
            >
              Add Lesson
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Lesson Creation Form */}
      {showLessonForm && (
        <LessonForm
          courseId={course.id}
          unitId={selectedUnit?.id}
          onSuccess={handleLessonCreated}
          onCancel={handleLessonFormCancel}
        />
      )}

      {/* Course Units and Lessons */}
      {units.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Description
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No Content Yet
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Start building your course by adding lessons and organizing them
              into units.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleCreateLesson()}
              sx={{ mt: 2 }}
            >
              Create Your First Lesson
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {units.map((unit, index) => (
            <UnitAccordion
              key={unit.id}
              unit={unit}
              onAddLesson={() => handleCreateLesson(unit)}
              onLessonUpdate={fetchCourseStructure}
            />
          ))}
        </Box>
      )}

      {/* Standalone Lessons (without units) */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Additional Lessons
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Lessons not assigned to any specific unit.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => handleCreateLesson()}
          sx={{ mt: 1 }}
        >
          Add Standalone Lesson
        </Button>
      </Box>
    </Box>
  );
};

export default CourseContent;