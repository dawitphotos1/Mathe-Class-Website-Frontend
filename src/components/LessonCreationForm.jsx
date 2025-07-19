import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const LessonCreationForm = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    contentType: "text",
    videoUrl: "",
    isUnitHeader: false,
    isPreview: false,
    orderIndex: 0,
    unitId: "",
  });
  const [file, setFile] = useState(null);
  const [units, setUnits] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnitsLoading, setIsUnitsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  // Fetch units for the course
  useEffect(() => {
    const fetchUnits = async () => {
      setIsUnitsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to create a lesson");
          setIsUnitsLoading(false);
          return;
        }
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/lessons/${courseId}/units`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnits(response.data.units || []);
      } catch (err) {
        console.error("Failed to fetch units:", err);
        setError(
          "Failed to load units. You can still create a lesson without a unit."
        );
      } finally {
        setIsUnitsLoading(false);
      }
    };
    fetchUnits();
  }, [courseId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setFormErrors((prev) => ({
        ...prev,
        file: "Only PDF files are allowed",
      }));
      setFile(null);
    } else {
      setFile(selectedFile);
      setFormErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (formData.contentType === "text" && !formData.content.trim()) {
      errors.content = "Content is required for text type";
    }
    if (formData.contentType === "video" && !formData.videoUrl.trim()) {
      errors.videoUrl = "Video URL is required for video type";
    }
    if (formData.contentType === "file" && !file) {
      errors.file = "A PDF file is required for file type";
    }
    if (formData.orderIndex < 0) {
      errors.orderIndex = "Order index must be non-negative";
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("contentType", formData.contentType);
    data.append("videoUrl", formData.videoUrl);
    data.append("isUnitHeader", formData.isUnitHeader);
    data.append("isPreview", formData.isPreview);
    data.append("orderIndex", formData.orderIndex);
    if (formData.unitId) data.append("unitId", formData.unitId);
    if (file) data.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to create a lesson");
      }
      await axios.post(
        `${API_BASE_URL}/api/v1/lessons/${courseId}/lessons`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      setSuccess("Lesson created successfully!");
      setFormData({
        title: "",
        content: "",
        contentType: "text",
        videoUrl: "",
        isUnitHeader: false,
        isPreview: false,
        orderIndex: 0,
        unitId: "",
      });
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error creating lesson:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message ||
        "Failed to create lesson";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "672px",
        margin: "32px auto",
        padding: "24px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "24px",
          color: "#1F2937",
        }}
      >
        Create New Lesson
      </h2>

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "16px",
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            marginBottom: "16px",
            padding: "16px",
            backgroundColor: "#D1FAE5",
            color: "#065F46",
            borderRadius: "4px",
          }}
        >
          {success}
        </div>
      )}

      {isUnitsLoading && (
        <div
          style={{
            marginBottom: "16px",
            padding: "16px",
            backgroundColor: "#EFF6FF",
            color: "#1E40AF",
            borderRadius: "4px",
          }}
        >
          Loading units...
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "4px",
            }}
          >
            Lesson Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              border: formErrors.title
                ? "1px solid #B91C1C"
                : "1px solid #D1D5DB",
              borderRadius: "4px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
            placeholder="Enter lesson title"
            required
            disabled={isLoading}
          />
          {formErrors.title && (
            <p style={{ marginTop: "4px", color: "#B91C1C", fontSize: "12px" }}>
              {formErrors.title}
            </p>
          )}
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "4px",
            }}
          >
            Content Type
          </label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #D1D5DB",
              borderRadius: "4px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
            disabled={isLoading}
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="file">File (PDF)</option>
          </select>
        </div>

        {formData.contentType === "text" && (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Lesson Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              style={{
                width: "100%",
                padding: "8px",
                border: formErrors.content
                  ? "1px solid #B91C1C"
                  : "1px solid #D1D5DB",
                borderRadius: "4px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              placeholder="Enter lesson content"
              disabled={isLoading}
            />
            {formErrors.content && (
              <p
                style={{ marginTop: "4px", color: "#B91C1C", fontSize: "12px" }}
              >
                {formErrors.content}
              </p>
            )}
          </div>
        )}

        {formData.contentType === "video" && (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Video URL
            </label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: formErrors.videoUrl
                  ? "1px solid #B91C1C"
                  : "1px solid #D1D5DB",
                borderRadius: "4px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              placeholder="Enter YouTube/Vimeo URL"
              disabled={isLoading}
            />
            {formErrors.videoUrl && (
              <p
                style={{ marginTop: "4px", color: "#B91C1C", fontSize: "12px" }}
              >
                {formErrors.videoUrl}
              </p>
            )}
          </div>
        )}

        {formData.contentType === "file" && (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Upload PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #D1D5DB",
                borderRadius: "4px",
              }}
              disabled={isLoading}
            />
            {formErrors.file && (
              <p
                style={{ marginTop: "4px", color: "#B91C1C", fontSize: "12px" }}
              >
                {formErrors.file}
              </p>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div
                style={{
                  marginTop: "8px",
                  width: "100%",
                  backgroundColor: "#E5E7EB",
                  borderRadius: "9999px",
                  height: "10px",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: "#4F46E5",
                    height: "10px",
                    borderRadius: "9999px",
                  }}
                ></div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            name="isUnitHeader"
            checked={formData.isUnitHeader}
            onChange={handleChange}
            style={{
              width: "16px",
              height: "16px",
              border: "1px solid #D1D5DB",
              borderRadius: "4px",
            }}
            disabled={isLoading}
          />
          <label
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Is this a Unit Header?
          </label>
        </div>

        {!formData.isUnitHeader && (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
              }}
            >
              Unit (optional)
            </label>
            <select
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #D1D5DB",
                borderRadius: "4px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              disabled={isLoading || isUnitsLoading}
            >
              <option value="">None</option>
              {units.length > 0 ? (
                units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {isUnitsLoading ? "Loading units..." : "No units available"}
                </option>
              )}
            </select>
          </div>
        )}

        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "4px",
            }}
          >
            Order Index
          </label>
          <input
            type="number"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            min="0"
            style={{
              width: "100%",
              padding: "8px",
              border: formErrors.orderIndex
                ? "1px solid #B91C1C"
                : "1px solid #D1D5DB",
              borderRadius: "4px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
            disabled={isLoading}
          />
          {formErrors.orderIndex && (
            <p style={{ marginTop: "4px", color: "#B91C1C", fontSize: "12px" }}>
              {formErrors.orderIndex}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            name="isPreview"
            checked={formData.isPreview}
            onChange={handleChange}
            style={{
              width: "16px",
              height: "16px",
              border: "1px solid #D1D5DB",
              borderRadius: "4px",
            }}
            disabled={isLoading}
          />
          <label
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Make this a preview lesson (visible to all)
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isLoading ? "#9CA3AF" : "#4F46E5",
            color: "#fff",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {isLoading ? "Creating..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
};

export default LessonCreationForm;
