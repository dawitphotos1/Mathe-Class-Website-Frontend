// hooks/useLessonForm.js
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useLessonForm = (courseId) => {
  const [formData, setFormData] = useState({
    title: "",
    contentType: "document",
    fileUrl: "",
    isUnitHeader: false,
    isPreview: false,
    unitId: "",
    orderIndex: 0,
  });

  const [units, setUnits] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.get(`/api/v1/courses/${courseId}/lessons`);
        const unitHeaders = res.data.filter((l) => l.isUnitHeader);
        setUnits(unitHeaders.map(({ id, title }) => ({ id, title })));
      } catch {
        toast.error("Failed to load units");
      }
    };
    fetchUnits();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    setUploadProgress(0);
    setPreviewFile(URL.createObjectURL(file));

    try {
      const res = await axios.post("/api/v1/upload", form, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        },
      });
      setFormData((prev) => ({ ...prev, fileUrl: res.data.url }));
      toast.success("File uploaded successfully");
    } catch {
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
