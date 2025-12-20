// // src/hooks/useFileUpload.js
// import { useState } from "react";
// import {
//   prepareFormData,
//   validateFiles,
//   getFileInfo,
// } from "../utils/uploadUtils";
// import axiosInstance from "../utils/axiosInstance";

// export const useFileUpload = (options = {}) => {
//   const {
//     endpoint,
//     maxFiles = 10,
//     maxSize = 50 * 1024 * 1024,
//     allowedTypes = [],
//     allowedExtensions = [],
//   } = options;

//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState(null);
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   const addFiles = (newFiles) => {
//     const fileArray = Array.from(newFiles);

//     if (files.length + fileArray.length > maxFiles) {
//       setError(`Maximum ${maxFiles} files allowed`);
//       return false;
//     }

//     const { validFiles, errors } = validateFiles(fileArray, {
//       maxSize,
//       allowedTypes,
//       allowedExtensions,
//     });

//     if (errors.length > 0) {
//       setError(`Some files rejected: ${errors.join(", ")}`);
//     }

//     if (validFiles.length > 0) {
//       setFiles((prev) => [...prev, ...validFiles]);
//       return true;
//     }

//     return false;
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const clearFiles = () => {
//     setFiles([]);
//     setError(null);
//   };

//   const upload = async (additionalData = {}) => {
//     if (files.length === 0) {
//       setError("No files to upload");
//       return null;
//     }

//     try {
//       setUploading(true);
//       setProgress(0);
//       setError(null);

//       const formData = prepareFormData(additionalData, files);

//       const response = await axiosInstance.post(endpoint, formData, {
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = progressEvent.total
//             ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
//             : 0;
//           setProgress(percentCompleted);
//         },
//       });

//       setUploadedFiles((prev) => [...prev, ...files]);
//       setFiles([]);

//       return response.data;
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || "Upload failed");
//       return null;
//     } finally {
//       setUploading(false);
//       setProgress(0);
//     }
//   };

//   const getFileList = () => {
//     return files.map((file) => getFileInfo(file));
//   };

//   return {
//     files,
//     addFiles,
//     removeFile,
//     clearFiles,
//     upload,
//     uploading,
//     progress,
//     error,
//     setError,
//     uploadedFiles,
//     getFileList,
//   };
// };

// src/hooks/useFileUpload.js
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
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024,
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const addFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);

    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return false;
    }

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
      return true;
    }

    return false;
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
    setError(null);
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

      const formData = prepareFormData(additionalData, files);

      const response = await axiosInstance.post(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(percentCompleted);
        },
      });

      setUploadedFiles((prev) => [...prev, ...files]);
      setFiles([]);

      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const getFileList = () => {
    return files.map((file) => getFileInfo(file));
  };

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    upload,
    uploading,
    progress,
    error,
    setError,
    uploadedFiles,
    getFileList,
  };
};
