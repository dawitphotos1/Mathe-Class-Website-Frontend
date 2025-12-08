// components/LessonDisplay.jsx
import React from 'react';

const LessonDisplay = ({ lesson }) => {
  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return null;
    if (fileUrl.startsWith('http')) return fileUrl;
    
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${API_BASE_URL}${fileUrl}`;
  };

  const renderFileContent = () => {
    if (!lesson) {
      return (
        <div className="no-content">
          <p>No lesson data available.</p>
        </div>
      );
    }

    const fileUrl = getFileUrl(lesson.file_url);
    const videoUrl = getFileUrl(lesson.video_url);

    console.log('Rendering lesson content:', {
      type: lesson.content_type,
      fileUrl,
      videoUrl,
      hasContent: !!lesson.content
    });

    if (lesson.content_type === 'pdf' && fileUrl) {
      return (
        <div className="file-display">
          <h3>PDF Document</h3>
          <iframe
            src={fileUrl}
            width="100%"
            height="600px"
            title={lesson.title}
            style={{ border: '1px solid #ddd', borderRadius: '8px' }}
          />
          <div className="mt-3">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Download PDF
            </a>
          </div>
        </div>
      );
    }

    if (lesson.content_type === 'video' && videoUrl) {
      return (
        <div className="video-display">
          <h3>Video Lesson</h3>
          <video
            controls
            width="100%"
            style={{ maxWidth: '800px', borderRadius: '8px' }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (lesson.content_type === 'text' && lesson.content) {
      return (
        <div className="text-content">
          <h3>Lesson Content</h3>
          <div
            className="content-box"
            style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              whiteSpace: 'pre-wrap'
            }}
          >
            {lesson.content}
          </div>
        </div>
      );
    }

    return (
      <div className="no-content">
        <p>No content available for this lesson.</p>
        {fileUrl && (
          <div className="mt-3">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    );
  };

  if (!lesson) {
    return (
      <div className="lesson-display">
        <div className="alert alert-warning">
          No lesson selected or lesson not found.
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-display">
      <h2>{lesson.title}</h2>
      {renderFileContent()}
      
      {/* File attachments for non-PDF content */}
      {lesson.file_url && lesson.content_type !== 'pdf' && (
        <div className="attachments mt-4">
          <h4>Attachments</h4>
          <a
            href={getFileUrl(lesson.file_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary"
          >
            Download File
          </a>
        </div>
      )}
    </div>
  );
};

export default LessonDisplay;