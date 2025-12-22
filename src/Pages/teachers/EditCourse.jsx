// pages/teachers/EditCourse.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import {
  prepareFormData,
  validateFiles,
  formatFileSize,
} from "../../utils/uploadUtils";
import "./EditCourse.css";

function EditCourse() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [attachmentFiles, setAttachmentFiles] = useState([]); // new uploads
  const [existingAttachments, setExistingAttachments] = useState([]); // backend files

  const [renaming, setRenaming] = useState({ index: null, name: "" });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/courses/${slug}`);
      const courseData = res.data.course;

      setCourse(courseData);
      setFormData({
        title: courseData.title || "",
        description: courseData.description || "",
        price: courseData.price || "",
      });

      setThumbnailPreview(courseData.thumbnail || "");
      setExistingAttachments(courseData.attachments || []);
    } catch (err) {
      toast.error("Failed to fetch course");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const { validFiles, errors } = validateFiles(files);

    if (errors.length) {
      toast.warning(errors.join(", "));
    }

    if (validFiles.length) {
      setAttachmentFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = async (attachmentId) => {
    if (!window.confirm("Delete this attachment?")) return;

    try {
      await axiosInstance.delete(`/api/v1/attachments/${attachmentId}`);
      setExistingAttachments((prev) =>
        prev.filter((att) => att.id !== attachmentId)
      );
      toast.success("Attachment deleted");
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  const startRenaming = (index, currentName) => {
    setRenaming({ index, name: currentName });
  };

  const confirmRename = async () => {
    if (!renaming.name.trim()) {
      toast.error("Filename cannot be empty");
      return;
    }

    try {
      const attachment = existingAttachments[renaming.index];

      await axiosInstance.patch(`/api/v1/attachments/${attachment.id}`, {
        name: renaming.name,
      });

      const updated = [...existingAttachments];
      updated[renaming.index].name = renaming.name;
      setExistingAttachments(updated);

      setRenaming({ index: null, name: "" });
      toast.success("File renamed");
    } catch (err) {
      toast.error("Rename failed");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      const submitData = prepareFormData(formData, attachmentFiles);

      if (thumbnailFile) {
        submitData.append("thumbnail", thumbnailFile);
      }

      await axiosInstance.patch(
        `/api/v1/courses/${course.id}`,
        submitData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );

      toast.success("Course updated successfully");
      setAttachmentFiles([]);
      setThumbnailFile(null);
      fetchCourse();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!course) return <div className="loading">Loading course...</div>;

  return (
    <div className="edit-course-container">
      <h2>Edit Course: {course.title}</h2>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="upload-progress">
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-course-form">
        {/* Title */}
        <div className="form-section">
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>

        {/* Description */}
        <div className="form-section">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        {/* Thumbnail */}
        <div className="form-section">
          <label>Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            disabled={loading}
          />
          {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Preview" width="200" />
          )}
        </div>

        {/* New Attachments */}
        <div className="form-section">
          <label>Add Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleAttachmentChange}
            disabled={loading}
          />

          {attachmentFiles.length > 0 && (
            <ul className="file-list">
              {attachmentFiles.map((file, i) => (
                <li key={i}>
                  {file.name} ({formatFileSize(file.size)})
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Existing Attachments */}
        <div className="form-section">
          <label>Existing Attachments</label>
          {existingAttachments.map((att, index) => (
            <div key={att.id} className="attachment-item">
              {renaming.index === index ? (
                <>
                  <input
                    value={renaming.name}
                    onChange={(e) =>
                      setRenaming((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <button type="button" onClick={confirmRename}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenaming({ index: null, name: "" })}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{att.name}</span>
                  <span>{formatFileSize(att.size)}</span>
                  <a href={att.url} target="_blank" rel="noreferrer">
                    Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => startRenaming(index, att.name)}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExistingAttachment(att.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCourse;
