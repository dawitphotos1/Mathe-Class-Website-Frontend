import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance"; // Import your axiosInstance here
import "./EditCourse.css";

function EditCourse() {
  const { slug } = useParams(); // now using slug
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [attachmentUrls, setAttachmentUrls] = useState([]);

  const [renaming, setRenaming] = useState({}); // { courseId, index }
  const [editingName, setEditingName] = useState("");

  const [loadingAttachmentAction, setLoadingAttachmentAction] = useState(false);
  const [loadingCourseUpdate, setLoadingCourseUpdate] = useState(false);

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/courses/${slug}`);
      const courseData = res.data.course;
      setCourse(courseData);
      setTitle(courseData.title || "");
      setDescription(courseData.description || "");
      setThumbnailUrl(courseData.thumbnailUrl || "");
      setAttachmentUrls(courseData.attachmentUrls || []);
    } catch (err) {
      toast.error("Failed to fetch course");
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const preview = URL.createObjectURL(file);
      setThumbnailUrl(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingCourseUpdate(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await axiosInstance.patch(`/api/v1/courses/${course.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course updated successfully!");
      navigate("/my-teaching-courses");
    } catch (err) {
      toast.error("Failed to update course");
      console.error(err);
    } finally {
      setLoadingCourseUpdate(false);
    }
  };

  const handlePreviewPdf = (url) => {
    window.open(url, "_blank");
  };

  const startRenaming = (courseId, index, fileName) => {
    setRenaming({ courseId, index });
    setEditingName(fileName.replace(/\.[^/.]+$/, "")); // Remove extension
  };

  const confirmRename = async () => {
    if (!editingName.trim()) {
      toast.error("Filename cannot be empty");
      return;
    }

    setLoadingAttachmentAction(true);
    try {
      await axiosInstance.patch(
        `/api/v1/courses/${renaming.courseId}/attachments/${renaming.index}/rename`,
        { newName: editingName }
      );
      toast.success("File renamed!");
      setRenaming({});
      fetchCourse(); // Refresh attachments
    } catch (err) {
      toast.error("Rename failed");
      console.error(err);
    } finally {
      setLoadingAttachmentAction(false);
    }
  };

  const deleteAttachment = async (courseId, index) => {
    if (!window.confirm("Are you sure you want to delete this attachment?")) {
      return;
    }

    setLoadingAttachmentAction(true);
    try {
      await axiosInstance.patch(
        `/api/v1/courses/${courseId}/attachments/${index}/delete`
      );
      toast.success("Attachment deleted");
      fetchCourse(); // Refresh list
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    } finally {
      setLoadingAttachmentAction(false);
    }
  };

  if (!course) return <div className="loading">Loading course...</div>;

  return (
    <div className="edit-course-container">
      <h2>Edit Course</h2>
      <form className="edit-course-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loadingCourseUpdate}
          />
        </div>

        <div className="form-section">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loadingCourseUpdate}
          />
        </div>

        <div className="form-section">
          <label>Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loadingCourseUpdate}
          />
          {thumbnailUrl && (
            <div className="file-preview">
              <img src={thumbnailUrl} alt="Thumbnail Preview" />
            </div>
          )}
        </div>

        <div className="form-section">
          <label>Attachments</label>
          {attachmentUrls.length === 0 ? (
            <p>No attachments.</p>
          ) : (
            <ul className="attachments-list">
              {attachmentUrls.map((fileUrl, idx) => {
                const fileName = fileUrl.split("/").pop();

                return (
                  <li key={fileUrl} className="attachment-actions">
                    {renaming.courseId === course.id &&
                    renaming.index === idx ? (
                      <>
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="rename-input"
                          disabled={loadingAttachmentAction}
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            confirmRename();
                          }}
                          disabled={loadingAttachmentAction}
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setRenaming({});
                          }}
                          disabled={loadingAttachmentAction}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="attachment-name">{fileName}</span>
                        <button
                          type="button"
                          onClick={() => handlePreviewPdf(fileUrl)}
                          disabled={loadingAttachmentAction}
                        >
                          📄 Preview
                        </button>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          ⬇️ Download
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            startRenaming(course.id, idx, fileName)
                          }
                          disabled={loadingAttachmentAction}
                        >
                          ✏️ Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAttachment(course.id, idx)}
                          className="danger"
                          disabled={loadingAttachmentAction}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="save-button"
          disabled={loadingCourseUpdate}
        >
          {loadingCourseUpdate ? "Saving..." : "💾 Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditCourse;
