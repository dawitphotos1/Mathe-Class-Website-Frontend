import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";

const FileUploader = ({ onUploadSuccess, accept = "*/*" }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    setUploadProgress(0);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const res = await axios.post("/api/v1/upload", form, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        },
      });

      onUploadSuccess(res.data.url);
      toast.success("✅ File uploaded");
    } catch {
      toast.error("❌ Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const onChange = (e) => {
    handleFile(e.target.files[0]);
  };

  return (
    <div
      className="dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <p>📄 Drag and drop a file here or click to browse</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={onChange}
      />

      {uploading && (
        <div style={{ marginTop: "1rem" }}>
          Uploading... {uploadProgress}%
          <progress value={uploadProgress} max="100" />
        </div>
      )}

      {previewUrl && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Preview:</strong>
          {previewUrl.includes("video") ? (
            <video width="100%" controls>
              <source src={previewUrl} />
            </video>
          ) : (
            <iframe
              src={previewUrl}
              title="Preview"
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

FileUploader.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
  accept: PropTypes.string,
};

export default FileUploader;
