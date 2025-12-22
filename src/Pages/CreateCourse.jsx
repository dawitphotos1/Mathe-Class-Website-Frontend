// src/pages/CreateCourse.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { prepareFormData, validateFiles, formatFileSize } from "../utils/uploadUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CreateCourse.css";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    price: "0",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [introVideoFile, setIntroVideoFile] = useState(null);
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const [useCustomSlug, setUseCustomSlug] = useState(false);

  // Available slugs (predefined)
  const availableSlugs = [
    "algebra-1-beginners",
    "algebra-2-advanced",
    "pre-calculus-foundations",
    "calculus-essentials",
    "geometry-trigonometry-basics",
    "statistics-probability-intro",
    "linear-algebra-fundamentals",
    "differential-equations-intro",
    "discrete-mathematics-basics",
    "number-theory-concepts",
    "math-test-prep",
    "advanced-math-concepts",
  ];

  /** Handle title change and auto-generate slug if not custom */
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({ ...prev, title }));

    if (!useCustomSlug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  /** Handle slug selection from dropdown */
  const handleSlugSelect = (e) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
    setUseCustomSlug(false);
  };

  /** Handle custom slug input */
  const handleCustomSlugChange = (e) => {
    const customSlug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    setFormData((prev) => ({ ...prev, slug: customSlug }));
  };

  /** Toggle between predefined and custom slug */
  const toggleSlugInput = () => {
    setUseCustomSlug(!useCustomSlug);
    if (!useCustomSlug) {
      setFormData((prev) => ({ ...prev, slug: "" }));
    } else if (formData.title) {
      // Restore auto-generated slug
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  /** Generate unique slug */
  const generateUniqueSlug = () => {
    if (!formData.title) return;
    const baseSlug = formData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData((prev) => ({ ...prev, slug: uniqueSlug }));
    toast.info("Generated unique slug!");
  };

  /** Thumbnail change */
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  /** Intro video change */
  const handleIntroVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIntroVideoFile(file);
  };

  /** Multiple attachments */
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const { validFiles, errors } = validateFiles(files);
    if (errors.length) toast.warning(`Some files rejected: ${errors.join(", ")}`);
    if (validFiles.length) setAttachmentFiles((prev) => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /** Submit form */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const submitData = prepareFormData(formData, attachmentFiles);

      if (thumbnailFile) submitData.append("thumbnail", thumbnailFile);
      if (introVideoFile) submitData.append("introVideo", introVideoFile);

      const response = await axiosInstance.post("/courses/create", submitData, {
        onUploadProgress: (event) => {
          if (event.total) setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      toast.success("Course created successfully!");
      navigate("/teacher/dashboard");
    } catch (err) {
      console.error("Error creating course:", err);
      if (err.response?.data?.error?.includes("slug")) {
        toast.error("Slug already exists. Generating a new one...");
        generateUniqueSlug();
      } else {
        toast.error(err.response?.data?.error || "Failed to create course");
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="create-course-container">
      <div className="create-course-card">
        <h2>Create New Course</h2>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress">
            <p>Uploading: {uploadProgress}%</p>
            <progress value={uploadProgress} max="100" />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            disabled={loading}
            required
          />

          {/* Slug */}
          <label>Slug *</label>
          <div className="slug-section">
            {!useCustomSlug ? (
              <select value={formData.slug} onChange={handleSlugSelect} disabled={loading}>
                <option value="">-- Select Available Slug --</option>
                {availableSlugs.map((slug) => (
                  <option key={slug} value={slug}>{slug}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.slug}
                onChange={handleCustomSlugChange}
                disabled={loading}
              />
            )}
            <button type="button" onClick={generateUniqueSlug} disabled={loading || !formData.title} className="generate-slug-btn">
              🔄 Generate Unique
            </button>
            <button type="button" onClick={toggleSlugInput} disabled={loading} className="toggle-slug-btn">
              {useCustomSlug ? "← Use Available Slugs" : "Use Custom Slug →"}
            </button>
          </div>

          {/* Description */}
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            disabled={loading}
            rows="4"
          />

          {/* Price */}
          <label>Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            min="0"
            step="0.01"
            disabled={loading}
          />

          {/* Category */}
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            disabled={loading}
          >
            <option value="">-- Select Category --</option>
            <option value="Algebra 1">Algebra 1</option>
            <option value="Algebra 2">Algebra 2</option>
            <option value="Pre-Calculus">Pre-Calculus</option>
            <option value="Calculus">Calculus</option>
            <option value="Geometry & Trigonometry">Geometry & Trigonometry</option>
            <option value="Statistics & Probability">Statistics & Probability</option>
          </select>

          {/* Thumbnail */}
          <label>Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} disabled={loading} />
          {thumbnailPreview && <div className="file-preview"><img src={thumbnailPreview} alt="Thumbnail" width="200" /></div>}

          {/* Intro Video */}
          <label>Intro Video (Optional)</label>
          <input type="file" accept="video/*" onChange={handleIntroVideoChange} disabled={loading} />

          {/* Attachments */}
          <label>Attachments (Multiple Files)</label>
          <input type="file" multiple onChange={handleAttachmentChange} disabled={loading} />
          {attachmentFiles.length > 0 && (
            <ul className="file-list">
              {attachmentFiles.map((file, idx) => (
                <li key={idx}>
                  {file.name} ({formatFileSize(file.size)})
                  <button type="button" onClick={() => removeAttachment(idx)} disabled={loading}>✕</button>
                </li>
              ))}
            </ul>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading || !formData.title || !formData.slug}>
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
