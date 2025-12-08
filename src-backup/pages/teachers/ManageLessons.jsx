// src/pages/teachers/ManageLessons.jsx
import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CourseContent from "./CourseContent"; // ✅ Correct relative path

const ManageLessons = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to="/teacher-dashboard"
          sx={{ mb: 2 }}
        >
          Back to Courses
        </Button>
        <Typography variant="h3" component="h1" gutterBottom>
          Manage Course Content
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Organize and manage your lessons and units
        </Typography>
      </Box>

      {/* Course Content Component */}
      <CourseContent />
    </Container>
  );
};

export default ManageLessons;