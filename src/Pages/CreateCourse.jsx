// //src/pages/CreateCourse.jsx
// import React, { useState } from "react";
// import axiosInstance from "../utils/axiosInstance"; // adjust path as needed
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import "./CreateCourse.css";

// const CreateCourse = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [introVideo, setIntroVideo] = useState(null);
//   const [attachments, setAttachments] = useState([]);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("category", category);
//     if (thumbnail) formData.append("thumbnail", thumbnail);
//     if (introVideo) formData.append("introVideo", introVideo);
//     attachments.forEach((file) => formData.append("attachments", file));

//     try {
//       await axiosInstance.post("/courses/create", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true, // optional, keep if your backend requires cookies
//       });

//       toast.success("✅ Course created successfully!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Course creation error:", err);
//       let message = "❌ Failed to create course.";
//       if (err.response?.data?.details?.includes("slug")) {
//         message =
//           "❌ A course with a similar title already exists. Please use a different name.";
//       } else if (err.response?.data?.error) {
//         message = err.response.data.error;
//       }
//       toast.error(message);
//     }
//   };

//   return (
//     <div className="create-course-container">
//       <motion.div
//         className="create-course-card"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h2>Create New Course</h2>
//         <form onSubmit={handleSubmit}>
//           <label>Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />

//           <label>Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />

//           <label>Category</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             required
//           >
//             <option value="">-- Select Category --</option>
//             <option value="Algebra 1">Algebra 1</option>
//             <option value="Algebra 2">Algebra 2</option>
//             <option value="Pre-Calculus">Pre-Calculus</option>
//             <option value="Calculus">Calculus</option>
//             <option value="Geometry & Trigonometry">
//               Geometry & Trigonometry
//             </option>
//             <option value="Statistics & Probability">
//               Statistics & Probability
//             </option>
//           </select>

//           <label>Thumbnail Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               setThumbnail(e.target.files[0]);
//               setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
//             }}
//           />
//           {thumbnailPreview && (
//             <div className="file-preview">
//               <strong>Preview:</strong>
//               <br />
//               <img src={thumbnailPreview} alt="Preview" width="200" />
//             </div>
//           )}

//           <label>Intro Video (Optional)</label>
//           <input
//             type="file"
//             accept="video/*"
//             onChange={(e) => setIntroVideo(e.target.files[0])}
//           />

//           <label>Attachments (PDF, Docs, etc.)</label>
//           <input
//             type="file"
//             multiple
//             onChange={(e) => setAttachments(Array.from(e.target.files))}
//           />
//           {attachments.length > 0 && (
//             <div className="file-preview">
//               <strong>Files:</strong>
//               <ul>
//                 {attachments.map((file, index) => (
//                   <li key={index}>{file.name}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <button type="submit" className="btn-submit">
//             Create Course
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default CreateCourse;



// src/pages/CreateCourse.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // adjust path as needed
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CreateCourse.css";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [slug, setSlug] = useState("");
  const [customSlug, setCustomSlug] = useState(""); // For manual slug input
  const [useCustomSlug, setUseCustomSlug] = useState(false); // Toggle between dropdown and custom
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Predefined slugs for common math courses
  const predefinedSlugs = [
    { value: "algebra-1", label: "algebra-1" },
    { value: "algebra-2", label: "algebra-2" },
    { value: "pre-calculus", label: "pre-calculus" },
    { value: "calculus", label: "calculus" },
    { value: "geometry-trigonometry", label: "geometry-trigonometry" },
    { value: "statistics-probability", label: "statistics-probability" },
    { value: "linear-algebra", label: "linear-algebra" },
    { value: "differential-equations", label: "differential-equations" },
    { value: "discrete-mathematics", label: "discrete-mathematics" },
    { value: "number-theory", label: "number-theory" },
  ];

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!useCustomSlug) {
      // Auto-generate slug only if not using custom slug
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      
      setSlug(generatedSlug);
    }
  };

  // Handle predefined slug selection
  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setUseCustomSlug(false);
  };

  // Handle custom slug input
  const handleCustomSlugChange = (e) => {
    const customSlugValue = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    setCustomSlug(customSlugValue);
    setSlug(customSlugValue);
    setUseCustomSlug(true);
  };

  // Toggle between dropdown and custom input
  const toggleSlugInput = () => {
    setUseCustomSlug(!useCustomSlug);
    if (!useCustomSlug) {
      // Switching to custom input - clear the dropdown selection
      setSlug("");
    } else {
      // Switching back to dropdown - use auto-generated or empty
      const generatedSlug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!title || !slug) {
      toast.error("❌ Title and slug are required");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price || "0");
    
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (introVideo) formData.append("introVideo", introVideo);
    attachments.forEach((file) => formData.append("attachments", file));

    // DEBUG: Log what we're sending
    console.log("📤 Sending FormData:");
    console.log("  Title:", title);
    console.log("  Slug:", slug);
    console.log("  Description:", description);
    console.log("  Category:", category);
    console.log("  Price:", price || "0");

    try {
      const response = await axiosInstance.post("/courses/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("✅ Course created successfully:", response.data);
      toast.success("✅ Course created successfully!");
      navigate("/teacher/dashboard");
    } catch (err) {
      console.error("Course creation error:", err);
      let message = "❌ Failed to create course.";
      
      if (err.response?.data?.error) {
        message = err.response.data.error;
      } else if (err.response?.data?.details) {
        message = err.response.data.details;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-container">
      <motion.div
        className="create-course-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Create New Course</h2>
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
            disabled={loading}
            placeholder="Enter course title"
          />

          {/* Slug Field with Dropdown */}
          <label>Slug *</label>
          <div className="slug-section">
            {!useCustomSlug ? (
              <>
                <select
                  value={slug}
                  onChange={handleSlugChange}
                  required
                  disabled={loading}
                >
                  <option value="">-- Select a URL Slug --</option>
                  {predefinedSlugs.map((slugOption) => (
                    <option key={slugOption.value} value={slugOption.value}>
                      {slugOption.label}
                    </option>
                  ))}
                </select>
                <div className="slug-preview">
                  {slug && (
                    <span>URL will be: /courses/{slug}</span>
                  )}
                </div>
              </>
            ) : (
              <input
                type="text"
                value={customSlug}
                onChange={handleCustomSlugChange}
                required
                disabled={loading}
                placeholder="custom-url-slug"
              />
            )}
            
            <button 
              type="button" 
              className="toggle-slug-btn"
              onClick={toggleSlugInput}
              disabled={loading}
            >
              {useCustomSlug ? "← Use Predefined Slug" : "Use Custom Slug →"}
            </button>
          </div>

          <small style={{color: '#666', fontSize: '0.8rem', marginTop: '-0.5rem'}}>
            The slug is used in the course URL. Choose from common options or create a custom one.
          </small>

          {/* Description Field */}
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Describe your course..."
            rows="4"
          />

          {/* Price Field */}
          <label>Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
            placeholder="0.00"
            min="0"
            step="0.01"
          />

          {/* Category Field */}
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select Category --</option>
            <option value="Algebra 1">Algebra 1</option>
            <option value="Algebra 2">Algebra 2</option>
            <option value="Pre-Calculus">Pre-Calculus</option>
            <option value="Calculus">Calculus</option>
            <option value="Geometry & Trigonometry">
              Geometry & Trigonometry
            </option>
            <option value="Statistics & Probability">
              Statistics & Probability
            </option>
          </select>

          {/* Thumbnail Field */}
          <label>Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
              setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
            }}
            disabled={loading}
          />
          {thumbnailPreview && (
            <div className="file-preview">
              <strong>Preview:</strong>
              <br />
              <img src={thumbnailPreview} alt="Preview" width="200" />
            </div>
          )}

          {/* Intro Video Field */}
          <label>Intro Video (Optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setIntroVideo(e.target.files[0])}
            disabled={loading}
          />

          {/* Attachments Field */}
          <label>Attachments (PDF, Docs, etc.)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setAttachments(Array.from(e.target.files))}
            disabled={loading}
          />
          {attachments.length > 0 && (
            <div className="file-preview">
              <strong>Files:</strong>
              <ul>
                {attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading || !title || !slug}
          >
            {loading ? "Creating Course..." : "Create Course"}
          </button>

          {/* Cancel Button */}
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate(-1)}
            disabled={loading}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              width: '100%'
            }}
          >
            Cancel
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCourse;