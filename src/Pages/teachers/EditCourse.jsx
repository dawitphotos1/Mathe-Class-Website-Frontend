import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./EditCourse.css";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const [renaming, setRenaming] = useState({});
  const [editingName, setEditingName] = useState({ name: "" });

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/courses/${id}`);
      const courseData = res.data;
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
      const preview = URL.createObjectURL(file);
      setThumbnailUrl(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_BASE_URL}/api/v1/courses/${id}`, {
        title,
        description,
      });
      toast.success("Course updated successfully!");
      navigate("/my-teaching-courses");
    } catch (err) {
      toast.error("Failed to update course");
      console.error(err);
    }
  };

  const handlePreviewPdf = (url) => {
    window.open(url, "_blank");
  };

  const startRenaming = (courseId, index, fileName) => {
    setRenaming({ courseId, index });
    setEditingName({ name: fileName.replace(/\.[^/.]+$/, "") }); // Remove extension
  };

  const confirmRename = async () => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/v1/courses/${renaming.courseId}/attachments/${renaming.index}/rename`,
        { newName: editingName.name }
      );
      toast.success("File renamed!");
      setRenaming({});
      fetchCourse(); // Refresh attachments
    } catch (err) {
      toast.error("Rename failed");
    }
  };

  const deleteAttachment = async (courseId, index) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/v1/courses/${courseId}/attachments/${index}/delete`
      );
      toast.success("Attachment deleted");
      fetchCourse(); // Refresh list
    } catch (err) {
      toast.error("Delete failed");
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
          />
        </div>

        <div className="form-section">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label>Thumbnail</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
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
                  <li key={idx} className="attachment-actions">
                    {renaming.courseId === course.id &&
                    renaming.index === idx ? (
                      <>
                        <input
                          value={editingName.name}
                          onChange={(e) =>
                            setEditingName((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="rename-input"
                        />
                        <button onClick={confirmRename}>💾 Save</button>
                        <button onClick={() => setRenaming({})}>
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="attachment-name">{fileName}</span>
                        <button
                          type="button"
                          onClick={() => handlePreviewPdf(fileUrl)}
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
                        >
                          ✏️ Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAttachment(course.id, idx)}
                          className="danger"
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

        <button type="submit" className="save-button">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditCourse;
