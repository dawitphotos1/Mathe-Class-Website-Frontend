// src/hooks/useLessonForm.js
import { useEffect, useState } from "react";
import axios from "../utils/axios"; // Make sure this uses baseURL
import { toast } from "react-toastify";

export const useLessonForm = (courseId) => {
  const [formData, setFormData] = useState({
    title: "",
    isUnitHeader: false,
    isPreview: false,
    unitId: "",
    orderIndex: 0,
    fileUrl: "",
    contentType: "", // will be set on upload
  });

  const [units, setUnits] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load available unit headers
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.get(`/courses/${courseId}/lessons`);
        const unitHeaders = Array.isArray(res.data)
          ? res.data.filter((l) => l.isUnitHeader)
          : [];

        setUnits(unitHeaders);
      } catch (err) {
        toast.error("Failed to load units");
      }
    };

    fetchUnits();
  }, [courseId]);

  // Basic form input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // File upload handler with progress and preview
  const handleFileUpload = async (file) => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const res = await axios.post("/upload", form, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        },
      });

      const fileUrl = res.data?.url;
      const isVideo = file.type.startsWith("video");

      setFormData((prev) => ({
        ...prev,
        fileUrl,
        contentType: isVideo ? "video" : "document",
      }));

      setPreviewFile(fileUrl);
      toast.success("File uploaded successfully");
    } catch (err) {
      console.error("Upload error", err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  return {
    formData,
    setFormData,
    units,
    uploading,
    uploadProgress,
    previewFile,
    loading,
    setLoading,
    handleChange,
    handleFileUpload,
  };
};
