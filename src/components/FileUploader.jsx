// components/FileUploader.jsx - NEW
import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const FileUploader = ({
  label = 'Upload Files',
  accept = '*/*',
  multiple = true,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  onFilesChange,
  existingFiles = [],
  fileType = 'attachments', // 'files', 'videos', 'attachments'
  disabled = false,
  showPreview = true,
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setError(null);

    // Validate number of files
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You have ${files.length} files, trying to add ${selectedFiles.length} more.`);
      return;
    }

    // Validate files
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach(file => {
      // Check size
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds ${maxSize / (1024 * 1024)}MB limit`);
        return;
      }

      // Check type if accept is specified
      if (accept !== '*/*') {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        let isAccepted = false;
        for (const type of acceptedTypes) {
          if (type.startsWith('.')) {
            // Extension check
            if (fileExtension === type.substring(1)) {
              isAccepted = true;
              break;
            }
          } else if (type.includes('/*')) {
            // MIME type category check
            const category = type.replace('/*', '');
            if (file.type.startsWith(category)) {
              isAccepted = true;
              break;
            }
          } else if (file.type === type) {
            // Exact MIME type check
            isAccepted = true;
            break;
          }
        }

        if (!isAccepted) {
          errors.push(`${file.name} type not allowed. Accepted: ${accept}`);
          return;
        }
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    }

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles];
      setFiles(newFiles);
      onFilesChange?.(newFiles, fileType);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles, fileType);
  };

  const removeExistingFile = (index, fileId) => {
    // This would typically call an API to delete from server
    console.log(`Remove existing file ${fileId || index}`);
    // Trigger callback if provided
    if (onFilesChange) {
      onFilesChange('delete', { index, fileId, fileType });
    }
  };

  const getFileIcon = (fileName, mimeType) => {
    const name = (fileName || '').toLowerCase();
    const type = (mimeType || '').toLowerCase();

    if (name.endsWith('.pdf') || type.includes('pdf')) {
      return <PdfIcon color="error" />;
    }
    if (type.startsWith('video/')) {
      return <VideoIcon color="secondary" />;
    }
    if (type.startsWith('image/')) {
      return <ImageIcon color="primary" />;
    }
    if (name.match(/\.(doc|docx)$/)) {
      return <FileIcon color="info" />;
    }
    if (name.match(/\.(ppt|pptx)$/)) {
      return <FileIcon color="warning" />;
    }
    if (name.match(/\.(xls|xlsx)$/)) {
      return <FileIcon color="success" />;
    }
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileTypeName = (fileName) => {
    const name = (fileName || '').toLowerCase();
    if (name.endsWith('.pdf')) return 'PDF';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'Document';
    if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'Presentation';
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'Spreadsheet';
    if (name.match(/\.(jpg|jpeg|png|gif|webp)$/)) return 'Image';
    if (name.match(/\.(mp4|mov|avi|webm|wmv)$/)) return 'Video';
    return 'File';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        {label} {files.length > 0 && `(${files.length}/${maxFiles})`}
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Existing Files Display */}
      {existingFiles.length > 0 && showPreview && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Existing Files ({existingFiles.length}):
          </Typography>
          <List dense>
            {existingFiles.map((file, index) => {
              const fileName = file.fileName || file.name || `File ${index + 1}`;
              const fileSize = file.fileSize || file.size;
              const fileType = file.fileType || file.type;
              const fileUrl = file.url || file.filePath;
              
              return (
                <ListItem key={`existing-${index}`}>
                  {getFileIcon(fileName, fileType)}
                  <ListItemText
                    primary={fileName}
                    secondary={
                      <span>
                        {getFileTypeName(fileName)}
                        {fileSize && ` • ${formatFileSize(fileSize)}`}
                        {fileUrl && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#666' }}>
                            {fileUrl.substring(fileUrl.lastIndexOf('/') + 1)}
                          </span>
                        )}
                      </span>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => removeExistingFile(index, file.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}

      {/* New Files Display */}
      {files.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Files to Upload ({files.length}):
          </Typography>
          <List dense>
            {files.map((file, index) => (
              <ListItem key={index}>
                {getFileIcon(file.name, file.type)}
                <ListItemText
                  primary={file.name}
                  secondary={`${getFileTypeName(file.name)} • ${formatFileSize(file.size)}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Uploading... {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {/* Upload Button */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        fullWidth
        disabled={disabled || files.length >= maxFiles}
        sx={{ mt: 1 }}
      >
        {files.length === 0 ? 'Select Files' : `Add More Files (${files.length}/${maxFiles})`}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled}
        />
      </Button>

      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        {multiple ? `Max ${maxFiles} files` : 'Single file'} • {maxSize / (1024 * 1024)}MB each • {accept !== '*/*' ? `Accepted: ${accept}` : 'All file types'}
      </Typography>
    </Box>
  );
};

export default FileUploader;