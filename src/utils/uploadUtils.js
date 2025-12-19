// // src/utils/uploadUtils.js
// import axiosInstance from "./axiosInstance";

// /**
//  * Prepare FormData with consistent field names
//  */
// export const prepareFormData = (fields = {}, files = []) => {
//   const formData = new FormData();

//   // Append text fields
//   Object.entries(fields).forEach(([key, value]) => {
//     if (value !== null && value !== undefined && value !== "") {
//       // Convert field names to snake_case for backend consistency
//       const backendKey = key
//         .replace(/([A-Z])/g, "_$1")
//         .toLowerCase()
//         .replace(/^_/, "");
//       formData.append(backendKey, value);
//     }
//   });

//   // Append files consistently - use 'attachments' for multiple files
//   if (files && files.length > 0) {
//     files.forEach((file) => {
//       formData.append("attachments", file); // ✅ Consistent field name
//     });
//   }

//   return formData;
// };

// /**
//  * Upload files with progress tracking
//  */
// export const uploadFiles = async (endpoint, formData, options = {}) => {
//   const {
//     onProgress,
//     method = "POST",
//     timeout = 120000,
//     maxRetries = 2,
//   } = options;

//   let retries = 0;

//   while (retries <= maxRetries) {
//     try {
//       const response = await axiosInstance({
//         method,
//         url: endpoint,
//         data: formData,
//         timeout,
//         onUploadProgress: onProgress
//           ? (progressEvent) => {
//               const percentCompleted = progressEvent.total
//                 ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
//                 : 0;
//               onProgress(percentCompleted);
//             }
//           : undefined,
//       });

//       return response.data;
//     } catch (error) {
//       if (retries >= maxRetries) {
//         throw error;
//       }
//       retries++;
//       console.log(`Retry ${retries}/${maxRetries} after error:`, error.message);
//       await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
//     }
//   }
// };

// /**
//  * Validate files before upload
//  */
// export const validateFiles = (files, options = {}) => {
//   const {
//     maxSize = 50 * 1024 * 1024, // 50MB default
//     allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/gif",
//       "image/webp",
//       "application/pdf",
//       "video/mp4",
//       "video/mpeg",
//       "video/webm",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "text/plain",
//     ],
//     allowedExtensions = [
//       ".pdf",
//       ".doc",
//       ".docx",
//       ".ppt",
//       ".pptx",
//       ".txt",
//       ".jpg",
//       ".jpeg",
//       ".png",
//       ".gif",
//       ".mp4",
//       ".mov",
//       ".avi",
//     ],
//   } = options;

//   const errors = [];
//   const validFiles = [];

//   files.forEach((file) => {
//     // Check file size
//     if (file.size > maxSize) {
//       errors.push(`${file.name} exceeds ${maxSize / (1024 * 1024)}MB limit`);
//       return;
//     }

//     // Check file type
//     const hasValidType = allowedTypes.includes(file.type);
//     const hasValidExtension = allowedExtensions.some((ext) =>
//       file.name.toLowerCase().endsWith(ext)
//     );

//     if (!hasValidType && !hasValidExtension) {
//       errors.push(`${file.name} type not allowed`);
//       return;
//     }

//     validFiles.push(file);
//   });

//   return { validFiles, errors };
// };

// /**
//  * Extract file extension and type info
//  */
// export const getFileInfo = (file) => {
//   const extension = file.name.split(".").pop().toLowerCase();
//   let type = "file";
//   let icon = "📄";

//   if (file.type.includes("image")) {
//     type = "image";
//     icon = "🖼️";
//   } else if (file.type.includes("video")) {
//     type = "video";
//     icon = "🎥";
//   } else if (file.type.includes("pdf") || extension === "pdf") {
//     type = "pdf";
//     icon = "📕";
//   } else if (["doc", "docx"].includes(extension)) {
//     type = "document";
//     icon = "📝";
//   } else if (["ppt", "pptx"].includes(extension)) {
//     type = "presentation";
//     icon = "📊";
//   }

//   return {
//     name: file.name,
//     size: file.size,
//     type,
//     extension,
//     icon,
//     mimeType: file.type,
//   };
// };

// src/utils/uploadUtils.js - COMPLETE & CLEAN
import axiosInstance from "./axiosInstance";

/**
 * Prepare FormData with consistent field names for backend
 */
export const prepareFormData = (fields = {}, files = []) => {
  const formData = new FormData();

  // Append text fields (convert camelCase to snake_case for backend)
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      const backendKey = key
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");

      formData.append(backendKey, value);
    }
  });

  // Append files consistently - use 'attachments' for multiple files
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("attachments", file); // ✅ Consistent field name
    });
  }

  return formData;
};

/**
 * Upload files with progress tracking
 */
export const uploadFiles = async (endpoint, formData, options = {}) => {
  const {
    onProgress,
    method = "POST",
    timeout = 120000,
    maxRetries = 2,
  } = options;

  let retries = 0;

  while (retries <= maxRetries) {
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data: formData,
        timeout,
        onUploadProgress: onProgress
          ? (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress(percentCompleted);
              }
            }
          : undefined,
      });

      return response.data;
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }

      retries++;
      console.log(`Retry ${retries}/${maxRetries} after error:`, error.message);
      await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
    }
  }
};

/**
 * Validate files before upload
 */
export const validateFiles = (files, options = {}) => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "video/mp4",
      "video/mpeg",
      "video/webm",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
    allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".txt",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".mp4",
      ".mov",
      ".avi",
    ],
  } = options;

  const errors = [];
  const validFiles = [];

  files.forEach((file) => {
    // Check file size
    if (file.size > maxSize) {
      errors.push(`${file.name} exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return;
    }

    // Check file type or extension
    const hasValidType = allowedTypes.includes(file.type);
    const hasValidExtension = allowedExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidType && !hasValidExtension) {
      errors.push(`${file.name} type not allowed`);
      return;
    }

    validFiles.push(file);
  });

  return { validFiles, errors };
};

/**
 * Get file information for display
 */
export const getFileInfo = (file) => {
  const extension = file.name.split(".").pop().toLowerCase();
  let type = "file";
  let icon = "📄";

  if (file.type.includes("image")) {
    type = "image";
    icon = "🖼️";
  } else if (file.type.includes("video")) {
    type = "video";
    icon = "🎥";
  } else if (file.type.includes("pdf") || extension === "pdf") {
    type = "pdf";
    icon = "📕";
  } else if (["doc", "docx"].includes(extension)) {
    type = "document";
    icon = "📝";
  } else if (["ppt", "pptx"].includes(extension)) {
    type = "presentation";
    icon = "📊";
  }

  return {
    name: file.name,
    size: file.size,
    type,
    extension,
    icon,
    mimeType: file.type,
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
