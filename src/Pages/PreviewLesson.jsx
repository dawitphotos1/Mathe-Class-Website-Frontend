// src/pages/PreviewLesson.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CircularProgress, Box, Typography, Button } from "@mui/material";

const PreviewLesson = () => {
  const { id } = useParams(); // expects /lessons/:id/preview route
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get(`/lessons/${id}`);
        if (res.data?.success && res.data.lesson) {
          setLesson(res.data.lesson);
        } else if (res.data?.lesson) {
          setLesson(res.data.lesson);
        } else {
          setError(res.data?.error || "Failed to load lesson");
        }
      } catch (err) {
        console.error("Preview load error:", err);
        // If unauthorized, navigate back with message or show error
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to load lesson (you might not be enrolled)"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No lesson data available.</Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    );
  }

  // Render content based on type
  const { content_type, file_url, video_url, content, title } = lesson;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {title}
      </Typography>

      {content_type === "pdf" && file_url && (
        // embed PDF; file_url should already be a fully-qualified URL from backend
        <Box sx={{ height: "80vh" }}>
          <iframe
            title="PDF Preview"
            src={file_url}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </Box>
      )}

      {content_type === "video" && video_url && (
        <Box sx={{ mb: 2 }}>
          {/* If it's a direct video file URL, use <video>. If it's an embed (youtube), render iframe. */}
          {video_url.includes("youtube.com") || video_url.includes("youtu.be") ? (
            <Box sx={{ position: "relative", pb: "56.25%", height: 0 }}>
              <iframe
                title="Video Preview"
                src={video_url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </Box>
          ) : (
            <video controls style={{ width: "100%" }}>
              <source src={video_url} />
              Your browser does not support the video tag.
            </video>
          )}
        </Box>
      )}

      {content_type === "text" && (
        <Box sx={{ mt: 1 }}>
          <div
            dangerouslySetInnerHTML={{
              __html: content || "<i>No text content for this lesson.</i>",
            }}
          />
        </Box>
      )}

      {/* fallback */}
      {!["pdf", "video", "text"].includes(content_type) && (
        <Box sx={{ mt: 2 }}>
          <Typography>Content type: {content_type}</Typography>
          {file_url && (
            <Box sx={{ height: "80vh", mt: 1 }}>
              <iframe title="File Preview" src={file_url} style={{ width: "100%", height: "100%", border: "none" }} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PreviewLesson;
