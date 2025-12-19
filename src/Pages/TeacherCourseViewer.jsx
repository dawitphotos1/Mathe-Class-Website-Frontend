// src/pages/teachers/TeacherCourseViewer.jsx - COMPLETE VERSION
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosInstance';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Container,
  Paper,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  MenuBook,
  Dashboard,
  Description,
} from "@mui/icons-material";

const TeacherCourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/courses/id/${courseId}`);
        
        if (response.data.success) {
          setCourse(response.data.course);
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading course...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">{error}</Typography>
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/teacher-dashboard")}
          startIcon={<ArrowBack />}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/teacher-dashboard")}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      {course && (
        <>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f0f7ff" }}>
            <Typography variant="h4" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {course.description || "No description available"}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Chip 
                  label="Teacher View" 
                  color="primary" 
                  variant="outlined" 
                />
              </Grid>
              {course.price && (
                <Grid item>
                  <Chip 
                    label={`Price: $${parseFloat(course.price).toFixed(2)}`} 
                    color="secondary" 
                    variant="outlined" 
                  />
                </Grid>
              )}
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Course Management
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Manage your course content and settings
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/courses/${courseId}/manage-lessons`)}
                    startIcon={<Edit />}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Manage Lessons
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Course Preview
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    View how students see your course
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/courses/${course.slug || courseId}`)}
                    startIcon={<Description />}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    View Public Page
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default TeacherCourseViewer;