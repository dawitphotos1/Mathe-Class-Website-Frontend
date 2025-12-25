// components/LessonEditor.jsx - NEW
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  Alert,
  Paper,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import FileUploader from './FileUploader';
import uploadService from '../services/uploadService';
import axiosInstance from '../utils/axiosInstance';

const LessonEditor = ({
  courseId,
  lessonId,
  onSave,
  onCancel,
  onDelete,
  showPreviewButton = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Lesson data
  const [lesson, setLesson] = useState({
    title: '',
    content: '',
    content_type: 'text',
    is_preview: false,
    order_index: 0,
  });
  
  // File states
  const [files, setFiles] = useState([]);        // PDF/Doc files
  const [videos, setVideos] = useState([]);      // Video files
  const [attachments, setAttachments] = useState([]); // Additional files
  
  // Existing files from server
  const [existingFiles, setExistingFiles] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  
  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  // Load lesson data if editing
  useEffect(() => {
    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);
  
  const loadLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await uploadService.getLessonWithFiles(lessonId);
      
      if (response.success && response.lesson) {
        const lessonData = response.lesson;
        
        // Set basic lesson data
        setLesson({
          title: lessonData.title || '',
          content: lessonData.content || '',
          content_type: lessonData.contentType || 'text',
          is_preview: lessonData.isPreview || false,
          order_index: lessonData.orderIndex || 0,
        });
        
        // Set existing files
        if (lessonData.fileUrls && Array.isArray(lessonData.fileUrls)) {
          setExistingFiles(lessonData.fileUrls.map((url, index) => ({
            id: `file-${index}`,
            url,
            name: url.substring(url.lastIndexOf('/') + 1),
            type: 'application/pdf',
          })));
        }
        
        if (lessonData.videoUrls && Array.isArray(lessonData.videoUrls)) {
          setExistingVideos(lessonData.videoUrls.map((url, index) => ({
            id: `video-${index}`,
            url,
            name: url.substring(url.lastIndexOf('/') + 1),
            type: 'video/mp4',
          })));
        }
        
        if (lessonData.attachments && Array.isArray(lessonData.attachments)) {
          setExistingAttachments(lessonData.attachments.map((att, index) => ({
            id: att.id || `att-${index}`,
            ...att,
          })));
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load lesson');
      console.error('Load lesson error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLessonChange = (field, value) => {
    setLesson(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleFilesChange = (newFiles, fileType) => {
    switch (fileType) {
      case 'files':
        setFiles(newFiles);
        break;
      case 'videos':
        setVideos(newFiles);
        break;
      case 'attachments':
        setAttachments(newFiles);
        break;
      default:
        break;
    }
  };
  
  const handleDeleteFile = (action, data) => {
    if (action === 'delete') {
      // Handle file deletion from server
      console.log('Delete file:', data);
      // You would call API to delete file here
    }
  };
  
  const handleSubmit = async () => {
    // Validate
    if (!lesson.title.trim()) {
      setError('Lesson title is required');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const lessonData = {
        ...lesson,
        files,
        videos,
        attachments,
      };
      
      let response;
      
      if (lessonId) {
        // Update existing lesson
        response = await uploadService.uploadLessonFiles(lessonId, lessonData);
      } else {
        // Create new lesson
        response = await uploadService.createLessonWithFiles(courseId, lessonData);
      }
      
      if (response.success) {
        setSuccess(lessonId ? 'Lesson updated successfully!' : 'Lesson created successfully!');
        
        // Clear file states
        setFiles([]);
        setVideos([]);
        setAttachments([]);
        
        // Call onSave callback
        if (onSave) {
          onSave(response.lesson);
        }
        
        // If creating new, reset form
        if (!lessonId) {
          setLesson({
            title: '',
            content: '',
            content_type: 'text',
            is_preview: false,
            order_index: 0,
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save lesson');
      console.error('Save lesson error:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const handlePreview = () => {
    if (lessonId) {
      window.open(`/lessons/preview/${lessonId}`, '_blank');
    } else if (courseId) {
      window.open(`/courses/${courseId}/preview`, '_blank');
    }
  };
  
  const handleDelete = async () => {
    if (!lessonId || !onDelete) return;
    
    try {
      setLoading(true);
      await onDelete(lessonId);
      setDeleteDialog(false);
    } catch (err) {
      setError('Failed to delete lesson');
    } finally {
      setLoading(false);
    }
  };
  
  const totalNewFiles = files.length + videos.length + attachments.length;
  
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading lesson...</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          {lessonId ? 'Edit Lesson' : 'Create New Lesson'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {showPreviewButton && lessonId && (
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
            >
              Preview
            </Button>
          )}
          
          {onDelete && lessonId && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog(true)}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      {/* Lesson Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lesson Title *"
                value={lesson.title}
                onChange={(e) => handleLessonChange('title', e.target.value)}
                disabled={saving}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={6}
                value={lesson.content}
                onChange={(e) => handleLessonChange('content', e.target.value)}
                disabled={saving}
                placeholder="Enter lesson content here..."
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Order Index"
                type="number"
                value={lesson.order_index}
                onChange={(e) => handleLessonChange('order_index', parseInt(e.target.value) || 0)}
                disabled={saving}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={lesson.is_preview}
                    onChange={(e) => handleLessonChange('is_preview', e.target.checked)}
                    disabled={saving}
                  />
                }
                label="Mark as Preview Lesson"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* File Upload Sections */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Upload Files
        {totalNewFiles > 0 && (
          <Chip 
            label={`${totalNewFiles} new files`} 
            size="small" 
            color="primary" 
            sx={{ ml: 1 }}
          />
        )}
      </Typography>
      
      <Grid container spacing={3}>
        {/* PDF/Document Files */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <FileUploader
              label="📄 Lesson Files (PDFs, Documents)"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              multiple={true}
              maxFiles={10}
              onFilesChange={(files) => handleFilesChange(files, 'files')}
              existingFiles={existingFiles}
              fileType="files"
              disabled={saving}
            />
          </Paper>
        </Grid>
        
        {/* Video Files */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <FileUploader
              label="🎬 Video Files"
              accept="video/*"
              multiple={true}
              maxFiles={5}
              onFilesChange={(files) => handleFilesChange(files, 'videos')}
              existingFiles={existingVideos}
              fileType="videos"
              disabled={saving}
            />
          </Paper>
        </Grid>
        
        {/* Additional Attachments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <FileUploader
              label="📎 Additional Attachments"
              accept="*/*"
              multiple={true}
              maxFiles={20}
              onFilesChange={(files) => handleFilesChange(files, 'attachments')}
              existingFiles={existingAttachments}
              fileType="attachments"
              disabled={saving}
            />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving || !lesson.title.trim()}
        >
          {saving ? 'Saving...' : lessonId ? 'Update Lesson' : 'Create Lesson'}
        </Button>
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Lesson</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this lesson? This action cannot be undone.
          All files associated with this lesson will also be deleted.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LessonEditor;