import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import FileUpload from "../components/FileUpload";
import { useLessonForm } from "../hooks/useLessonForm";
import axios from "../utils/axios";
import "./CreateLesson.css";

const CreateLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    units,
    uploading,
    uploadProgress,
    previewFile,
    loading,
    setLoading,
    handleChange,
    handleFileUpload,
  } = useLessonForm(courseId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    if (!formData.fileUrl) {
      toast.error("Please upload a file");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in");
        navigate("/login");
        return;
      }

      const payload = {
        ...formData,
        courseId: parseInt(courseId),
        unitId: formData.unitId || null,
        orderIndex: parseInt(formData.orderIndex),
      };

      await axios.post("/lessons", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      toast.success("🎉 Lesson created successfully");
      navigate(`/courses/${courseId}/manage-lessons`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Lesson creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-lesson-container">
      <h2>Create a New Lesson</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">📖 Title *</label>
          <input
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter lesson title"
            required
          />
        </div>

        <FileUpload
          uploading={uploading}
          uploadProgress={uploadProgress}
          previewFile={previewFile}
          onUpload={handleFileUpload}
        />

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isUnitHeader"
              checked={formData.isUnitHeader}
              onChange={handleChange}
            />
            Mark as Unit Header
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isPreview"
              checked={formData.isPreview}
              onChange={handleChange}
            />
            Enable Free Preview
          </label>
        </div>

        {!formData.isUnitHeader && units.length > 0 && (
          <div className="form-group">
            <label htmlFor="unitId">📚 Assign to Unit</label>
            <select
              name="unitId"
              id="unitId"
              value={formData.unitId}
              onChange={handleChange}
            >
              <option value="">-- Select Unit --</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="orderIndex">⏳ Order Index *</label>
          <input
            type="number"
            name="orderIndex"
            id="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            ❌ Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "⏳ Creating..." : "✅ Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLesson;
