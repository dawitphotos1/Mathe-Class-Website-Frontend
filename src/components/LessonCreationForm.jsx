// import React, { useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { API_BASE_URL } from "../config";

// const LessonCreationForm = () => {
//   const { courseId } = useParams();
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     contentType: "text", // text, video, file
//     contentUrl: "",
//     videoUrl: "",
//     isUnitHeader: false,
//     isPreview: false,
//     orderIndex: 0,
//     unitId: null,
//   });
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("content", formData.content);
//     data.append("contentType", formData.contentType);
//     data.append("videoUrl", formData.videoUrl);
//     data.append("isUnitHeader", formData.isUnitHeader);
//     data.append("isPreview", formData.isPreview);
//     data.append("orderIndex", formData.orderIndex);
//     if (formData.unitId) data.append("unitId", formData.unitId);
//     if (file) data.append("file", file);

//     try {
//       await axios.post(
//         `${API_BASE_URL}/api/v1/lessons/${courseId}/lessons`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(progress);
//           },
//         }
//       );
//       alert("Lesson created successfully!");
//       setFormData({
//         title: "",
//         content: "",
//         contentType: "text",
//         contentUrl: "",
//         videoUrl: "",
//         isUnitHeader: false,
//         isPreview: false,
//         orderIndex: 0,
//         unitId: null,
//       });
//       setFile(null);
//       setUploadProgress(0);
//     } catch (error) {
//       console.error("Error creating lesson:", error);
//       setError(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to create lesson"
//       );
//     }
//   };

//   return (
//     <div className="lesson-creation-container">
//       <h2>Create New Lesson</h2>
//       {error && <div className="error-message">{error}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Lesson Title</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Content Type</label>
//           <select
//             name="contentType"
//             value={formData.contentType}
//             onChange={handleChange}
//           >
//             <option value="text">Text</option>
//             <option value="video">Video</option>
//             <option value="file">File (PDF)</option>
//           </select>
//         </div>

//         {formData.contentType === "text" && (
//           <div className="form-group">
//             <label>Lesson Content</label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               rows="10"
//             />
//           </div>
//         )}

//         {formData.contentType === "video" && (
//           <div className="form-group">
//             <label>Video URL</label>
//             <input
//               type="text"
//               name="videoUrl"
//               value={formData.videoUrl}
//               onChange={handleChange}
//               placeholder="YouTube/Vimeo URL"
//             />
//           </div>
//         )}

//         {formData.contentType === "file" && (
//           <div className="form-group">
//             <label>Upload PDF</label>
//             <input type="file" accept=".pdf" onChange={handleFileChange} />
//             {uploadProgress > 0 && uploadProgress < 100 && (
//               <div className="progress-bar">
//                 <div style={{ width: `${uploadProgress}%` }}></div>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="form-group checkbox-group">
//           <input
//             type="checkbox"
//             name="isUnitHeader"
//             checked={formData.isUnitHeader}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 isUnitHeader: e.target.checked,
//               })
//             }
//           />
//           <label>Is this a Unit Header?</label>
//         </div>

//         {!formData.isUnitHeader && (
//           <div className="form-group">
//             <label>Unit (select if this belongs to a unit)</label>
//             <select
//               name="unitId"
//               value={formData.unitId || ""}
//               onChange={handleChange}
//             >
//               <option value="">None</option>
//               {/* Add units here if fetched dynamically */}
//             </select>
//           </div>
//         )}

//         <div className="form-group">
//           <label>Order Index</label>
//           <input
//             type="number"
//             name="orderIndex"
//             value={formData.orderIndex}
//             onChange={handleChange}
//             min="0"
//           />
//         </div>

//         <div className="form-group checkbox-group">
//           <input
//             type="checkbox"
//             name="isPreview"
//             checked={formData.isPreview}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 isPreview: e.target.checked,
//               })
//             }
//           />
//           <label>Make this a preview lesson (visible to all)</label>
//         </div>

//         <button type="submit" className="submit-btn">
//           Create Lesson
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LessonCreationForm;




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
  const [formErrors, setFormErrors] = useState({});

  // Fetch units for the course
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/lessons/${courseId}/units`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setUnits(response.data.units || []);
      } catch (err) {
        console.error("Failed to fetch units:", err);
        setError("Failed to load units");
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
      setFormErrors((prev) => ({ ...prev, file: "Only PDF files are allowed" }));
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
      await axios.post(
        `${API_BASE_URL}/api/v1/lessons/${courseId}/lessons`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      setError(
        error.response?.data?.error ||
          error.message ||
          "Failed to create lesson"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Lesson</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lesson Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              formErrors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter lesson title"
            required
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content Type
          </label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="file">File (PDF)</option>
          </select>
        </div>

        {formData.contentType === "text" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lesson Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                formErrors.content ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter lesson content"
            />
            {formErrors.content && (
              <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
            )}
          </div>
        )}

        {formData.contentType === "video" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video URL
            </label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                formErrors.videoUrl ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter YouTube/Vimeo URL"
            />
            {formErrors.videoUrl && (
              <p className="mt-1 text-sm text-red-600">{formErrors.videoUrl}</p>
            )}
          </div>
        )}

        {formData.contentType === "file" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {formErrors.file && (
              <p className="mt-1 text-sm text-red-600">{formErrors.file}</p>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isUnitHeader"
            checked={formData.isUnitHeader}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">
            Is this a Unit Header?
          </label>
        </div>

        {!formData.isUnitHeader && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit (optional)
            </label>
            <select
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">None</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order Index
          </label>
          <input
            type="number"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            min="0"
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              formErrors.orderIndex ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formErrors.orderIndex && (
            <p className="mt-1 text-sm text-red-600">{formErrors.orderIndex}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isPreview"
            checked={formData.isPreview}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">
            Make this a preview lesson (visible to all)
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
};

export default LessonCreationForm;