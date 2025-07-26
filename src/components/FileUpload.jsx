// components/FileUpload.jsx
import React, { useRef, useState } from "react";
import "../styles/useLessonForm.css";

const FileUpload = ({ uploading, uploadProgress, previewFile, onUpload }) => {
  const dropRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;

    // Generate local preview URL for PDFs/videos
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    // Send file back to parent component
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const previewToUse = previewFile || localPreview;

  return (
    <div
      className="form-group dropzone"
      ref={dropRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label htmlFor="fileInput">
        📄 Drag & Drop File Here or Click to Browse
      </label>
      <input
        type="file"
        id="fileInput"
        accept=".pdf,.doc,.docx,.ppt,.pptx,video/*"
        onChange={handleFileChange}
      />

      {uploading && (
        <div className="upload-status">
          <p>Uploading... {uploadProgress}%</p>
          <progress value={uploadProgress} max="100" />
        </div>
      )}

      {previewToUse && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Preview:</strong></p>
          {previewToUse.includes(".mp4") || previewToUse.includes("video") ? (
            <video width="100%" controls>
              <source src={previewToUse} />
            </video>
          ) : (
            <iframe
              title="File Preview"
              src={previewToUse}
              style={{
                width: "100%",
                height: "400px",
                border: "1px solid #ccc",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
