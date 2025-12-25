// src/pages/teachers/CreateLessonPage.jsx - UPDATED
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container,
  Paper,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useFileUpload } from '../../hooks/useFileUpload';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const CreateLessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Lesson data
  const [lesson, setLesson] = useState({
    title: '',
    content: '',
    content_type: 'text',
    is_preview: false,
    order_index: 0,
  });
  
  // File upload hooks for different file types
  const fileUpload = useFileUpload({
    endpoint: `/lessons/course/${courseId}`,
    fileType: 'files',
    maxFiles: 10,
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  });
  
  const videoUpload = useFileUpload({
    endpoint: `/lessons/course/${courseId}`,
    fileType: 'videos',
    maxFiles: 5,
    allowedTypes: ['video/*'],
  });
  
  const attachmentUpload = useFileUpload({
    endpoint: `/lessons/course/${courseId}`,
    fileType: 'attachments',
    maxFiles: 20,
  });

  const steps = ['Lesson Details', 'Add Content', 'Upload Files', 'Review & Create'];

  const handleLessonChange = (field, value) => {
    setLesson(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep === 0 && !lesson.title.trim()) {
      setError('Lesson title is required');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!lesson.title.trim()) {
      setError('Lesson title is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Create form data
      const formData = new FormData();
      
      // Add lesson data
      Object.keys(lesson).forEach(key => {
        if (lesson[key] !== null && lesson[key] !== undefined) {
          formData.append(key, lesson[key]);
        }
      });
      
      // Add files
      fileUpload.files.forEach(file => {
        formData.append('files', file);
      });
      
      videoUpload.files.forEach(video => {
        formData.append('videos', video);
      });
      
      attachmentUpload.files.forEach(attachment => {
        formData.append('attachments', attachment);
      });

      console.log('📤 Creating lesson with files:', {
        title: lesson.title,
        files: fileUpload.files.length,
        videos: videoUpload.files.length,
        attachments: attachmentUpload.files.length,
      });

      const response = await axiosInstance.post(
        `/lessons/course/${courseId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Lesson created successfully!');
        
        // Reset all states
        setLesson({
          title: '',
          content: '',
          content_type: 'text',
          is_preview: false,
          order_index: 0,
        });
        fileUpload.clearFiles();
        videoUpload.clearFiles();
        attachmentUpload.clearFiles();
        setActiveStep(0);
        
        // Navigate to course lessons page
        navigate(`/courses/${courseId}/manage-lessons`);
      } else {
        throw new Error(response.data.error || 'Failed to create lesson');
      }
    } catch (err) {
      console.error('❌ Create lesson error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create lesson');
      toast.error('Failed to create lesson');
    } finally {
      setSaving(false);
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
    if (name.match(/\.(doc|docx)$/)) return <FileIcon color="info" />;
    if (name.match(/\.(ppt|pptx)$/)) return <FileIcon color="warning" />;
    if (name.match(/\.(xls|xlsx)$/)) return <FileIcon color="success" />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalFiles = fileUpload.files.length + videoUpload.files.length + attachmentUpload.files.length;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lesson Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lesson Title *"
                  value={lesson.title}
                  onChange={(e) => handleLessonChange('title', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Order Index"
                  type="number"
                  value={lesson.order_index}
                  onChange={(e) => handleLessonChange('order_index', parseInt(e.target.value) || 0)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={lesson.is_preview}
                      onChange={(e) => handleLessonChange('is_preview', e.target.checked)}
                    />
                  }
                  label="Mark as Preview Lesson"
                />
              </Grid>
            </Grid>
          </Paper>
        );

      case 1:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lesson Content
            </Typography>
            
            <TextField
              fullWidth
              label="Content Type"
              select
              value={lesson.content_type}
              onChange={(e) => handleLessonChange('content_type', e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{ mb: 2 }}
            >
              <option value="text">Text</option>
              <option value="pdf">PDF Document</option>
              <option value="video">Video</option>
              <option value="mixed">Mixed Content</option>
            </TextField>
            
            <TextField
              fullWidth
              label="Lesson Content"
              multiline
              rows={8}
              value={lesson.content}
              onChange={(e) => handleLessonChange('content', e.target.value)}
              placeholder="Enter lesson content here..."
            />
          </Paper>
        );

      case 2:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Files ({totalFiles} files selected)
            </Typography>
            
            <Grid container spacing={3}>
              {/* PDF/Document Files */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PdfIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Documents & PDFs</Typography>
                      <Chip label={fileUpload.files.length} size="small" sx={{ ml: 1 }} />
                    </Box>
                    
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AddIcon />}
                      fullWidth
                      disabled={fileUpload.uploading}
                      sx={{ mb: 2 }}
                    >
                      Add Documents
                      <input
                        type="file"
                        hidden
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => fileUpload.addFiles(e.target.files)}
                      />
                    </Button>
                    
                    {fileUpload.files.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        {fileUpload.files.map((file, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              py: 1,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getFileIcon(file.name, file.type)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {file.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                {formatFileSize(file.size)}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => fileUpload.removeFile(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Video Files */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <VideoIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Videos</Typography>
                      <Chip label={videoUpload.files.length} size="small" sx={{ ml: 1 }} />
                    </Box>
                    
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AddIcon />}
                      fullWidth
                      disabled={videoUpload.uploading}
                      sx={{ mb: 2 }}
                    >
                      Add Videos
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="video/*"
                        onChange={(e) => videoUpload.addFiles(e.target.files)}
                      />
                    </Button>
                    
                    {videoUpload.files.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        {videoUpload.files.map((file, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              py: 1,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getFileIcon(file.name, file.type)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {file.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                {formatFileSize(file.size)}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => videoUpload.removeFile(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Attachments */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FileIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Additional Attachments</Typography>
                      <Chip label={attachmentUpload.files.length} size="small" sx={{ ml: 1 }} />
                    </Box>
                    
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<AddIcon />}
                      fullWidth
                      disabled={attachmentUpload.uploading}
                      sx={{ mb: 2 }}
                    >
                      Add Attachments
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="*/*"
                        onChange={(e) => attachmentUpload.addFiles(e.target.files)}
                      />
                    </Button>
                    
                    {attachmentUpload.files.length > 0 && (
                      <Grid container spacing={1} sx={{ mt: 2 }}>
                        {attachmentUpload.files.map((file, index) => (
                          <Grid item key={index}>
                            <Chip
                              icon={getFileIcon(file.name, file.type)}
                              label={`${file.name} (${formatFileSize(file.size)})`}
                              onDelete={() => attachmentUpload.removeFile(index)}
                              variant="outlined"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        );

      case 3:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Lesson
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1" paragraph>
                  {lesson.title}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Content Type
                </Typography>
                <Typography variant="body1" paragraph>
                  {lesson.content_type.toUpperCase()}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Preview Status
                </Typography>
                <Typography variant="body1" paragraph>
                  {lesson.is_preview ? 'Yes (Free Preview)' : 'No'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order Index
                </Typography>
                <Typography variant="body1" paragraph>
                  {lesson.order_index}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Files to Upload
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    icon={<PdfIcon />} 
                    label={`${fileUpload.files.length} Documents`} 
                    variant="outlined" 
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip 
                    icon={<VideoIcon />} 
                    label={`${videoUpload.files.length} Videos`} 
                    variant="outlined" 
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip 
                    icon={<FileIcon />} 
                    label={`${attachmentUpload.files.length} Attachments`} 
                    variant="outlined" 
                    sx={{ mb: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Create New Lesson
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Add engaging content with multiple files and media
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Step Content */}
      {renderStepContent(activeStep)}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0 || saving}
          startIcon={<CancelIcon />}
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {saving ? 'Creating...' : 'Create Lesson'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={saving}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CreateLessonPage;