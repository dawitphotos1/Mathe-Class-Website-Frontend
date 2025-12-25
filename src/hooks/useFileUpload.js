// src/hooks/useFileUpload.js - UPDATED FOR MULTI-FILE UPLOAD
import { useState } from "react";
import {
  prepareFormData,
  validateFiles,
  getFileInfo,
} from "../utils/uploadUtils";
import axiosInstance from "../utils/axiosInstance";

export const useFileUpload = (options = {}) => {
  const {
    endpoint,
    maxFiles = 20, // Increased for multiple files
    maxSize = 100 * 1024 * 1024, // 100MB
    allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "video/mp4", "video/mpeg", "video/webm", "video/quicktime",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/zip",
      "application/x-rar-compressed",
    ],
    allowedExtensions = [
      ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
      ".txt", ".jpg", ".jpeg", ".png", ".gif", ".webp",
      ".mp4", ".mov", ".avi", ".webm", ".wmv",
      ".zip", ".rar",
    ],
    fileType = "attachments", // 'files', 'videos', 'attachments', or custom
  } = options;

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);

  const addFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);

    // Validate total files
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You have ${files.length} files, trying to add ${fileArray.length} more.`);
      return false;
    }

    // Validate each file
    const { validFiles, errors } = validateFiles(fileArray, {
      maxSize,
      allowedTypes,
      allowedExtensions,
    });

    if (errors.length > 0) {
      setError(`Some files rejected: ${errors.join(", ")}`);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      console.log(`📁 Added ${validFiles.length} files. Total: ${files.length + validFiles.length}`);
      return true;
    }

    return false;
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    console.log(`🗑️ Removed file at index ${index}. Remaining: ${files.length - 1}`);
  };

  const clearFiles = () => {
    setFiles([]);
    setError(null);
    console.log("🧹 Cleared all files");
  };

  const upload = async (additionalData = {}) => {
    if (files.length === 0) {
      setError("No files to upload");
      return null;
    }

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Prepare form data with array support
      const formData = new FormData();

      // Add additional data (non-file fields)
      Object.keys(additionalData).forEach((key) => {
        if (key !== 'files' && key !== 'videos' && key !== 'attachments') {
          if (additionalData[key] !== null && additionalData[key] !== undefined && additionalData[key] !== "") {
            formData.append(key, additionalData[key]);
          }
        }
      });

      // Add files with correct field name for array
      files.forEach((file) => {
        formData.append(fileType, file); // Use fileType for field name
      });

      console.log(`📤 Uploading ${files.length} files as '${fileType}' to ${endpoint}`);

      const response = await axiosInstance.post(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(percentCompleted);
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Store results
      setUploadResults(prev => [...prev, response.data]);
      setUploadedFiles((prev) => [...prev, ...files]);
      setFiles([]);

      console.log(`✅ Upload successful:`, response.data);

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Upload failed";
      setError(errorMsg);
      console.error("❌ Upload error:", err);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Upload multiple file types at once (for lesson creation)
  const uploadMultipleTypes = async (fileGroups = {}, additionalData = {}) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();

      // Add additional data
      Object.keys(additionalData).forEach((key) => {
        if (additionalData[key] !== null && additionalData[key] !== undefined && additionalData[key] !== "") {
          formData.append(key, additionalData[key]);
        }
      });

      // Add files by type
      Object.keys(fileGroups).forEach((type) => {
        const files = fileGroups[type];
        if (Array.isArray(files) && files.length > 0) {
          files.forEach((file) => {
            formData.append(type, file); // e.g., 'files', 'videos', 'attachments'
          });
          console.log(`📤 Added ${files.length} files as '${type}'`);
        }
      });

      const response = await axiosInstance.post(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(percentCompleted);
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResults(prev => [...prev, response.data]);
      console.log(`✅ Multi-type upload successful:`, response.data);

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Upload failed";
      setError(errorMsg);
      console.error("❌ Multi-type upload error:", err);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const getFileList = () => {
    return files.map((file) => getFileInfo(file));
  };

  const getStats = () => {
    return {
      totalFiles: files.length,
      totalUploaded: uploadedFiles.length,
      currentProgress: progress,
      isUploading: uploading,
      lastError: error,
      uploadHistory: uploadResults.length,
    };
  };

  const categorizeFiles = () => {
    const categories = {
      images: [],
      pdfs: [],
      videos: [],
      documents: [],
      others: [],
    };

    files.forEach(file => {
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();

      if (type.startsWith("image/")) {
        categories.images.push(file);
      } else if (type === "application/pdf" || name.endsWith(".pdf")) {
        categories.pdfs.push(file);
      } else if (type.startsWith("video/")) {
        categories.videos.push(file);
      } else if (
        name.endsWith(".doc") || name.endsWith(".docx") ||
        name.endsWith(".ppt") || name.endsWith(".pptx") ||
        name.endsWith(".xls") || name.endsWith(".xlsx") ||
        name.endsWith(".txt")
      ) {
        categories.documents.push(file);
      } else {
        categories.others.push(file);
      }
    });

    return categories;
  };

  return {
    // State
    files,
    uploading,
    progress,
    error,
    uploadedFiles,
    uploadResults,
    
    // Actions
    addFiles,
    removeFile,
    clearFiles,
    upload,
    uploadMultipleTypes,
    
    // Getters
    getFileList,
    getStats,
    categorizeFiles,
    
    // Setters
    setError,
    
    // Utilities
    formatFileSize: (bytes) => {
      if (!bytes) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
    
    getFileIcon: (fileName, mimeType) => {
      const name = (fileName || "").toLowerCase();
      const type = (mimeType || "").toLowerCase();
      
      if (name.endsWith(".pdf") || type.includes("pdf")) return "📕";
      if (type.startsWith("video/")) return "🎬";
      if (type.startsWith("image/")) return "🖼️";
      if (name.match(/\.(doc|docx)$/)) return "📝";
      if (name.match(/\.(ppt|pptx)$/)) return "📊";
      if (name.match(/\.(xls|xlsx)$/)) return "📈";
      return "📄";
    },
  };
};