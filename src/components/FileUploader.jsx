
// components/FileUpload.jsx
import React, { useRef } from "react";
import "../styles/useLessonForm.css"; // Make sure this file exists

const FileUpload = ({ uploading, uploadProgress, previewFile, onUpload }) => {
  const dropRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    onUpload(file);
  };

  const handleDragOver = (e) => e.preventDefault();

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
        onChange={(e) => onUpload(e.target.files[0])}
      />

      {uploading && (
        <div className="upload-status">
          <p>Uploading... {uploadProgress}%</p>
          <progress value={uploadProgress} max="100" />
        </div>
      )}

      {previewFile && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Preview:</strong></p>
          {previewFile.includes(".mp4") || previewFile.includes("video") ? (
            <video width="100%" controls>
              <source src={previewFile} />
            </video>
          ) : (
            <iframe
              title="File Preview"
              src={previewFile}
              style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
