// services/uploadService.js - NEW
import axiosInstance from '../utils/axiosInstance';

const uploadService = {
  // Upload multiple files to lesson
  uploadLessonFiles: async (lessonId, filesData) => {
    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(filesData).forEach(key => {
        if (key !== 'files' && key !== 'videos' && key !== 'attachments') {
          if (filesData[key] !== null && filesData[key] !== undefined) {
            formData.append(key, filesData[key]);
          }
        }
      });
      
      // Append files in arrays
      if (filesData.files && Array.isArray(filesData.files)) {
        filesData.files.forEach(file => {
          formData.append('files', file);
        });
      }
      
      if (filesData.videos && Array.isArray(filesData.videos)) {
        filesData.videos.forEach(video => {
          formData.append('videos', video);
        });
      }
      
      if (filesData.attachments && Array.isArray(filesData.attachments)) {
        filesData.attachments.forEach(attachment => {
          formData.append('attachments', attachment);
        });
      }
      
      console.log('📤 Uploading files to lesson:', lessonId);
      
      const response = await axiosInstance.put(
        `/lessons/${lessonId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Upload service error:', error);
      throw error;
    }
  },
  
  // Create new lesson with files
  createLessonWithFiles: async (courseId, lessonData) => {
    try {
      const formData = new FormData();
      
      // Append lesson data
      Object.keys(lessonData).forEach(key => {
        if (key !== 'files' && key !== 'videos' && key !== 'attachments') {
          if (lessonData[key] !== null && lessonData[key] !== undefined) {
            formData.append(key, lessonData[key]);
          }
        }
      });
      
      // Append files
      if (lessonData.files && Array.isArray(lessonData.files)) {
        lessonData.files.forEach(file => {
          formData.append('files', file);
        });
      }
      
      if (lessonData.videos && Array.isArray(lessonData.videos)) {
        lessonData.videos.forEach(video => {
          formData.append('videos', video);
        });
      }
      
      if (lessonData.attachments && Array.isArray(lessonData.attachments)) {
        lessonData.attachments.forEach(attachment => {
          formData.append('attachments', attachment);
        });
      }
      
      console.log('📝 Creating lesson with files for course:', courseId);
      
      const response = await axiosInstance.post(
        `/lessons/course/${courseId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Create lesson with files error:', error);
      throw error;
    }
  },
  
  // Get lesson with all files
  getLessonWithFiles: async (lessonId) => {
    try {
      const response = await axiosInstance.get(`/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get lesson error:', error);
      throw error;
    }
  },
  
  // Delete specific file from lesson
  deleteLessonFile: async (lessonId, fileType, fileIndex) => {
    try {
      const response = await axiosInstance.delete(
        `/lessons/${lessonId}/files/${fileType}/${fileIndex}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Delete file error:', error);
      throw error;
    }
  },
  
  // Get preview lesson for course
  getPreviewLesson: async (courseId) => {
    try {
      const response = await axiosInstance.get(
        `/lessons/preview/course/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Get preview lesson error:', error);
      throw error;
    }
  },
  
  // Validate files before upload
  validateFiles: (files, options = {}) => {
    const {
      maxFiles = 20,
      maxSize = 100 * 1024 * 1024, // 100MB
      allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'video/mp4', 'video/mpeg', 'video/webm',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
      ],
    } = options;
    
    const errors = [];
    const validFiles = [];
    
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { validFiles, errors };
    }
    
    files.forEach(file => {
      // Check size
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds ${maxSize / (1024 * 1024)}MB limit`);
        return;
      }
      
      // Check type
      let typeValid = false;
      
      // Check MIME type
      if (allowedTypes.includes(file.type)) {
        typeValid = true;
      }
      
      // Check by extension as fallback
      if (!typeValid) {
        const extension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = [
          'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
          'txt', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'webm'
        ];
        
        if (allowedExtensions.includes(extension)) {
          typeValid = true;
        }
      }
      
      if (!typeValid) {
        errors.push(`${file.name} type not allowed`);
        return;
      }
      
      validFiles.push(file);
    });
    
    return { validFiles, errors };
  },
  
  // Format file size
  formatFileSize: (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },
  
  // Get file icon
  getFileIcon: (fileName, mimeType) => {
    const name = fileName.toLowerCase();
    const type = mimeType.toLowerCase();
    
    if (name.endsWith('.pdf') || type.includes('pdf')) return '📕';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('image/')) return '🖼️';
    if (name.match(/\.(doc|docx)$/)) return '📝';
    if (name.match(/\.(ppt|pptx)$/)) return '📊';
    if (name.match(/\.(xls|xlsx)$/)) return '📈';
    return '📄';
  },
};

export default uploadService;