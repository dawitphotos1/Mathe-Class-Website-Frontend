// pages/teachers/EditLesson.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { prepareFormData, validateFiles } from "../../utils/uploadUtils";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditLesson.css";
import { AiOutlineUpload, AiOutlineDelete } from "react-icons/ai";

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    content: "",
    content_type: "text",
    video_url: "",
    order_index: 0,
    is_preview: false,
    unit_id: null,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [activeTab, setActiveTab] = useState("text");

  /* ---------------- load lesson ---------------- */

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${lessonId}`);
        const lesson = res.data.lesson;

        setForm({
          title: lesson.title || "",
          content: lesson.content || "",
          content_type: lesson.content_type || "text",
          video_url: lesson.video_url || "",
          order_index: lesson.order_index || 0,
          is_preview: lesson.is_preview || false,
          unit_id: lesson.unit_id || null,
        });

        setActiveTab(lesson.content_type || "text");

        if (Array.isArray(lesson.attachments)) {
          setExistingAttachments(lesson.attachments);
        } else if (lesson.file_url || lesson.fileUrl) {
          setExistingAttachments([
            {
              id: "legacy",
              url: lesson.file_url || lesson.fileUrl,
              name: (lesson.file_url || lesson.fileUrl).split("/").pop(),
            },
          ]);
        }
      } catch (err) {
        toast.error("Failed to load lesson");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, navigate]);

  /* ---------------- file handling ---------------- */

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const { validFiles, errors } = validateFiles(files);

    if (errors.length) {
      toast.warning(`Some files rejected: ${errors.join(", ")}`);
    }

    if (!validFiles.length) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    const hasPdf = validFiles.some((f) => f.type === "application/pdf");
    const hasVideo = validFiles.some((f) =>
      f.type.startsWith("video/")
    );

    if (hasPdf) {
      setForm((p) => ({ ...p, content_type: "pdf" }));
      setActiveTab("pdf");
    } else if (hasVideo) {
      setForm((p) => ({ ...p, content_type: "video" }));
      setActiveTab("video");
    } else if (validFiles.length > 1) {
      setForm((p) => ({ ...p, content_type: "mixed" }));
      setActiveTab("mixed");
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = async (attachmentId) => {
    try {
      await axiosInstance.delete(`/lessons/attachments/${attachmentId}`);
      setExistingAttachments((prev) =>
        prev.filter((a) => a.id !== attachmentId)
      );
      toast.success("Attachment deleted");
    } catch {
      toast.error("Failed to delete attachment");
    }
  };

  /* ---------------- submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploadProgress(0);

    try {
      const data = prepareFormData(form, selectedFiles);

      const response = await axiosInstance.put(
        `/lessons/${lessonId}`,
        data,
        {
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            setUploadProgress(
              Math.round((evt.loaded * 100) / evt.total)
            );
          },
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.error);
      }

      toast.success("Lesson updated successfully!");
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  /* ---------------- render ---------------- */

  if (loading) {
    return (
      <div className="edit-lesson-page">
        <p className="loading-text">Loading lesson...</p>
      </div>
    );
  }

  return (
    <div className="edit-lesson-page">
      <div className="edit-lesson-card">
        <h2>Edit Lesson</h2>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress">
            <p>Uploading: {uploadProgress}%</p>
            <progress value={uploadProgress} max="100" />
          </div>
        )}

        <form className="edit-lesson-form" onSubmit={handleSubmit}>
          <label>Title *</label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <div className="tab-header">
            {["text", "video", "pdf", "mixed"].map((t) => (
              <button
                key={t}
                type="button"
                className={activeTab === t ? "active" : ""}
                onClick={() => {
                  setActiveTab(t);
                  setForm({ ...form, content_type: t });
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === "text" && (
            <ReactQuill
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
            />
          )}

          {activeTab === "video" && (
            <input
              placeholder="Video URL"
              value={form.video_url}
              onChange={(e) =>
                setForm({ ...form, video_url: e.target.value })
              }
            />
          )}

          {(activeTab === "pdf" || activeTab === "mixed") && (
            <>
              <label className="file-upload-btn">
                <AiOutlineUpload />
                {selectedFiles.length
                  ? `${selectedFiles.length} file(s) selected`
                  : "Choose files"}
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </label>

              {selectedFiles.map((f, i) => (
                <div key={i} className="file-item">
                  {f.name}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              ))}

              {existingAttachments.map((a) => (
                <div key={a.id} className="attachment-item">
                  <a
                    href={a.url || a.fileUrl || a.filePath}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {a.name ||
                      a.fileName ||
                      a.filePath?.split("/").pop()}
                  </a>
                  {a.id !== "legacy" && (
                    <button
                      type="button"
                      onClick={() =>
                        removeExistingAttachment(a.id)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          <label>
            <input
              type="checkbox"
              checked={form.is_preview}
              onChange={(e) =>
                setForm({ ...form, is_preview: e.target.checked })
              }
            />
            Preview lesson
          </label>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLesson;



