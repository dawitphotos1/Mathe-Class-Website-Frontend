// src/pages/PreviewLesson.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/${lessonId}`);

      if (res.data?.success) {
        setLesson(res.data.lesson);
      } else {
        setError("Lesson not found");
      }
    } catch (err) {
      setError("Unable to load lesson");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading preview...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );

  if (!lesson) return <Alert severity="warning">Lesson not found</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{lesson.title}</Typography>

      {/* TEXT */}
      {lesson.content_type === "text" && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </CardContent>
        </Card>
      )}

      {/* VIDEO */}
      {lesson.content_type === "video" && (
        <video
          src={lesson.video_url}
          controls
          style={{ width: "100%", marginTop: 20 }}
        />
      )}

      {/* PDF */}
      {lesson.content_type === "pdf" && (
        <iframe
          src={lesson.file_url}
          style={{
            width: "100%",
            height: "85vh",
            border: "1px solid #ddd",
            marginTop: 20,
          }}
          title="PDF Preview"
        />
      )}
    </Box>
  );
};

export default PreviewLesson;
