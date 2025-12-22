
// components/useLessonForm.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { prepareFormData, validateFiles } from "../utils/uploadUtils";
import { toast } from "react-toastify";

export const useLessonForm = (courseId) => {
  const [formData, setFormData] = useState({
    title: "",
    content_type: "text",
    content: "",
    video_url: "",
    is_preview: false,
    is_unit_header: false,
    unit_id: "",
    order_index: 0,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [units, setUnits] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch units for this course
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axiosInstance.get(`/courses/${courseId}/units`);
        setUnits(res.data.units || []);
      } catch {
        toast.error("Failed to load units");
      }
    };

    if (courseId) fetchUnits();
  }, [courseId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle multiple file selection
  const handleFileChange = (files) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    const { validFiles, errors } = validateFiles(fileArray);

    if (errors.length) {
      toast.warning(`Some files rejected: ${errors.join(", ")}`);
    }

    if (validFiles.length) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);

      // Auto-detect content type
      const hasPdf = validFiles.some((f) => f.type === "application/pdf");
      const hasVideo = validFiles.some((f) => f.type.startsWith("video/"));

      if (hasPdf) {
        setFormData((prev) => ({ ...prev, content_type: "pdf" }));
      } else if (hasVideo) {
        setFormData((prev) => ({ ...prev, content_type: "video" }));
      } else if (validFiles.length > 1) {
        setFormData((prev) => ({ ...prev, content_type: "mixed" }));
      }
    }
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit lesson with multiple files
  const handleSubmit = async (onSuccess) => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const submitData = prepareFormData(
        {
          ...formData,
          course_id: courseId,
        },
        selectedFiles
      );

      const response = await axiosInstance.post(
        `/courses/${courseId}/lessons`,
        submitData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );

      if (response.data?.success && onSuccess) {
        onSuccess(response.data.lesson);
      }

      // Reset form
      setSelectedFiles([]);
      setFormData({
        title: "",
        content_type: "text",
        content: "",
        video_url: "",
        is_preview: false,
        is_unit_header: false,
        unit_id: "",
        order_index: 0,
      });

      toast.success("Lesson created successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to create lesson");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    formData,
    setFormData,
    selectedFiles,
    handleFileChange,
    removeFile,
    units,
    uploading,
    uploadProgress,
    loading,
    setLoading,
    handleChange,
    handleSubmit,
    clearFiles: () => setSelectedFiles([]),
  };
};
