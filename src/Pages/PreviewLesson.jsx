
// src/pages/teachers/PreviewLesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonId}/preview`);
        if (res.data?.success) setLesson(res.data.lesson);
      } catch (err) {
        console.error("Preview load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (!lesson)
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Lesson not found
        </Typography>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {lesson.title}
      </Typography>

      {lesson.content_type === "text" && (
        <Box dangerouslySetInnerHTML={{ __html: lesson.content }} />
      )}

      {lesson.content_type === "video" && lesson.video_url && (
        <video width="100%" controls>
          <source src={lesson.video_url} />
        </video>
      )}

      {lesson.content_type === "pdf" && lesson.file_url && (
        <iframe
          src={lesson.file_url}
          style={{ width: "100%", height: "80vh", border: "none" }}
        />
      )}
    </Box>
  );
};

export default PreviewLesson;
