//components/Debug/FileDebug.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import axiosInstance from '../../utils/axiosInstance';

const FileDebug = ({ lessonId }) => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testFileAccess = async () => {
    try {
      setLoading(true);
      setError("");

      // Test 1: Get lesson data
      const lessonResponse = await axiosInstance.get(`/lessons/${lessonId}`);
      console.log("📋 Lesson data:", lessonResponse.data);

      // Test 2: Check if file exists on server
      if (lessonResponse.data.lesson?.file_url) {
        const filename = lessonResponse.data.lesson.file_url.split("/").pop();
        const fileCheckResponse = await axiosInstance.get(
          `/files/debug/file/${filename}`
        );
        console.log("📁 File check:", fileCheckResponse.data);

        // Test 3: Try to access the file
        try {
          const fileAccessResponse = await axiosInstance.get(
            lessonResponse.data.lesson.file_url,
            {
              responseType: "blob",
            }
          );
          console.log("🔗 File access:", fileAccessResponse);
        } catch (fileError) {
          console.error("❌ File access failed:", fileError);
        }
      }

      setDebugInfo({
        lesson: lessonResponse.data.lesson,
        fileUrl: lessonResponse.data.lesson?.file_url,
        backendUrl: process.env.REACT_APP_BACKEND_URL,
      });
    } catch (error) {
      console.error("❌ Debug error:", error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔧 File Debug Tool
        </Typography>

        <Button variant="outlined" onClick={testFileAccess} disabled={loading}>
          {loading ? "Testing..." : "Test File Access"}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {debugInfo && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" component="pre">
              {JSON.stringify(debugInfo, null, 2)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FileDebug;