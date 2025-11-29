// src/pages/teachers/CourseContent.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { Add, Description, Visibility } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import UnitAccordion from "./UnitAccordion";
import LessonForm from "./LessonForm";

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    if (courseId) fetchCourseStructure();
  }, [courseId]);

  const fetchCourseStructure = async () => {
    try {
      setLoading(true);
      const response = await courseService.getTeacherCourseFull(courseId);

      if (!response.success) throw new Error(response.error);

      setCourse(response.course);
    } catch (error) {
      setError(error.message || "Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = (unit = null) => {
    setSelectedUnit(unit);
    setShowLessonForm(true);
  };

  const handleLessonCreated = () => {
    setShowLessonForm(false);
    setSelectedUnit(null);
    fetchCourseStructure();
  };

  const handleLessonFormCancel = () => {
    setShowLessonForm(false);
    setSelectedUnit(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!course) {
    return <Alert severity="warning">Course not found</Alert>;
  }

  const units = course.units || [];

  return (
    <Box>
      {/* Course Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4">{course.title}</Typography>
          <Typography variant="body1" color="textSecondary">
            {course.description}
          </Typography>

          <Box display="flex" gap={1} mt={1}>
            <Chip label={`${units.length} Units`} variant="outlined" size="small" />
            <Chip
              label={`${units.reduce(
                (total, unit) => total + (unit.lessons?.length || 0),
                0
              )} Lessons`}
              variant="outlined"
              size="small"
            />
          </Box>

          <Button variant="contained" startIcon={<Add />} onClick={() => handleCreateLesson()} sx={{ mt: 2 }}>
            Add Lesson
          </Button>
        </CardContent>
      </Card>

      {/* Lesson Form */}
      {showLessonForm && (
        <LessonForm
          courseId={course.id}
          unitId={selectedUnit?.id}
          onSuccess={handleLessonCreated}
          onCancel={handleLessonFormCancel}
        />
      )}

      {/* Units */}
      {units.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Description sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6">No Content Yet</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleCreateLesson()} sx={{ mt: 2 }}>
              Create First Lesson
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {units.map((unit) => (
            <UnitAccordion
              key={unit.id}
              unit={unit}
              onAddLesson={() => handleCreateLesson(unit)}
              onLessonUpdate={fetchCourseStructure}
              previewButton={(lesson) => (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/lessons/${lesson.id}/preview`);
                  }}
                >
                  Preview
                </Button>
              )}
            />
          ))}
        </Box>
      )}

      {/* Standalone Lessons */}
      <Box mt={4}>
        <Typography variant="h6">Additional Lessons</Typography>

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
