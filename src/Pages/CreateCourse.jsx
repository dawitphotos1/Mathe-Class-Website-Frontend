
// // src/pages/CreateCourse.jsx - COMPLETE FIXED VERSION WITH MULTIPLE FILES
// import React, { useState } from "react";
// import axiosInstance from '../utils/axiosInstance';
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import "./CreateCourse.css";

// const CreateCourse = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [slug, setSlug] = useState("");
//   const [customSlug, setCustomSlug] = useState("");
//   const [useCustomSlug, setUseCustomSlug] = useState(false);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [introVideo, setIntroVideo] = useState(null);
//   const [attachments, setAttachments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Available slugs that are NOT taken yet
//   const availableSlugs = [
//     { value: "algebra-1-beginners", label: "algebra-1-beginners" },
//     { value: "algebra-2-advanced", label: "algebra-2-advanced" },
//     { value: "pre-calculus-foundations", label: "pre-calculus-foundations" },
//     { value: "calculus-essentials", label: "calculus-essentials" },
//     { value: "geometry-trigonometry-basics", label: "geometry-trigonometry-basics" },
//     { value: "statistics-probability-intro", label: "statistics-probability-intro" },
//     { value: "linear-algebra-fundamentals", label: "linear-algebra-fundamentals" },
//     { value: "differential-equations-intro", label: "differential-equations-intro" },
//     { value: "discrete-mathematics-basics", label: "discrete-mathematics-basics" },
//     { value: "number-theory-concepts", label: "number-theory-concepts" },
//     { value: "math-test-prep", label: "math-test-prep" },
//     { value: "advanced-math-concepts", label: "advanced-math-concepts" },
//   ];

//   // Auto-generate unique slug from title
//   const handleTitleChange = (e) => {
//     const newTitle = e.target.value;
//     setTitle(newTitle);
    
//     if (!useCustomSlug && newTitle) {
//       // Generate a unique slug by adding random numbers
//       const baseSlug = newTitle
//         .toLowerCase()
//         .replace(/\s+/g, '-')
//         .replace(/[^\w\-]+/g, '')
//         .replace(/\-\-+/g, '-')
//         .replace(/^-+/, '')
//         .replace(/-+$/, '');
      
//       // Add random numbers to make it unique
//       const randomSuffix = Math.floor(1000 + Math.random() * 9000);
//       const uniqueSlug = `${baseSlug}-${randomSuffix}`;
      
//       setSlug(uniqueSlug);
//     }
//   };

//   // Handle predefined slug selection
//   const handleSlugChange = (e) => {
//     setSlug(e.target.value);
//     setUseCustomSlug(false);
//   };

//   // Handle custom slug input
//   const handleCustomSlugChange = (e) => {
//     const customSlugValue = e.target.value
//       .toLowerCase()
//       .replace(/\s+/g, '-')
//       .replace(/[^\w\-]+/g, '')
//       .replace(/\-\-+/g, '-')
//       .replace(/^-+/, '')
//       .replace(/-+$/, '');
    
//     setCustomSlug(customSlugValue);
//     setSlug(customSlugValue);
//     setUseCustomSlug(true);
//   };

//   // Toggle between dropdown and custom input
//   const toggleSlugInput = () => {
//     setUseCustomSlug(!useCustomSlug);
//     if (!useCustomSlug) {
//       // Switching to custom input
//       setCustomSlug("");
//       setSlug("");
//     } else {
//       // Switching back to dropdown - generate unique slug
//       if (title) {
//         const baseSlug = title
//           .toLowerCase()
//           .replace(/\s+/g, '-')
//           .replace(/[^\w\-]+/g, '')
//           .replace(/\-\-+/g, '-')
//           .replace(/^-+/, '')
//           .replace(/-+$/, '');
        
//         const randomSuffix = Math.floor(1000 + Math.random() * 9000);
//         const uniqueSlug = `${baseSlug}-${randomSuffix}`;
//         setSlug(uniqueSlug);
//       }
//     }
//   };

//   // Generate a completely unique slug
//   const generateUniqueSlug = () => {
//     if (title) {
//       const baseSlug = title
//         .toLowerCase()
//         .replace(/\s+/g, '-')
//         .replace(/[^\w\-]+/g, '')
//         .replace(/\-\-+/g, '-')
//         .replace(/^-+/, '')
//         .replace(/-+$/, '');
      
//       const randomSuffix = Math.floor(1000 + Math.random() * 9000);
//       const uniqueSlug = `${baseSlug}-${randomSuffix}`;
      
//       if (useCustomSlug) {
//         setCustomSlug(uniqueSlug);
//       }
//       setSlug(uniqueSlug);
      
//       toast.info("🔄 Generated unique slug for you!");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validate required fields
//     if (!title || !slug) {
//       toast.error("❌ Title and slug are required");
//       setLoading(false);
//       return;
//     }

//     const formData = new FormData();

//     formData.append("title", title);
//     formData.append("slug", slug);
//     formData.append("description", description);
//     formData.append("category", category);
//     formData.append("price", price || "0");
    
//     if (thumbnail) formData.append("thumbnail", thumbnail);
//     if (introVideo) formData.append("introVideo", introVideo);
    
//     // ✅ FIX: Append MULTIPLE files with array notation
//     attachments.forEach((file, index) => {
//       formData.append("attachments[]", file); // CRITICAL: Use [] for array
//     });

//     console.log("📤 Creating course with attachments:", attachments.length);
    
//     try {
//       const response = await axiosInstance.post("/courses/create", formData, {
//         // NO Content-Type header needed - browser sets automatically
//         withCredentials: true,
//       });

//       console.log("✅ Course created successfully:", response.data);
//       toast.success("✅ Course created successfully!");
//       navigate("/teacher/dashboard");
//     } catch (err) {
//       console.error("Course creation error:", err);
      
//       if (err.response?.data?.error?.includes("slug already exists")) {
//         toast.error("❌ This URL slug is already taken. Try a different one!");
//         setTimeout(() => {
//           generateUniqueSlug();
//         }, 1000);
//       } else if (err.response?.data?.error) {
//         toast.error(`❌ ${err.response.data.error}`);
//       } else {
//         toast.error("❌ Failed to create course. Please try again.");
//       }
//     } finally {
//       setLoading(false);
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
        
//         <div className="info-box">
//           <strong>💡 Tip:</strong> The common slugs (algebra-1, algebra-2, etc.) are already taken. 
//           Use the suggested available slugs or create a custom one with unique numbers.
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* Title Field */}
//           <label>Title *</label>
//           <input
//             type="text"
//             value={title}
//             onChange={handleTitleChange}
//             required
//             disabled={loading}
//             placeholder="Enter course title"
//           />

//           {/* Slug Field with Dropdown */}
//           <label>Slug *</label>
//           <div className="slug-section">
//             {!useCustomSlug ? (
//               <>
//                 <select
//                   value={slug}
//                   onChange={handleSlugChange}
//                   required
//                   disabled={loading}
//                 >
//                   <option value="">-- Select an Available URL Slug --</option>
//                   {availableSlugs.map((slugOption) => (
//                     <option key={slugOption.value} value={slugOption.value}>
//                       {slugOption.label}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="slug-preview">
//                   {slug && (
//                     <span>URL will be: /courses/{slug}</span>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="custom-slug-input">
//                 <input
//                   type="text"
//                   value={customSlug}
//                   onChange={handleCustomSlugChange}
//                   required
//                   disabled={loading}
//                   placeholder="your-unique-course-slug"
//                 />
//                 <button 
//                   type="button" 
//                   className="generate-slug-btn"
//                   onClick={generateUniqueSlug}
//                   disabled={loading || !title}
//                 >
//                   🔄 Generate Unique
//                 </button>
//               </div>
//             )}
            
//             <div className="slug-actions">
//               <button 
//                 type="button" 
//                 className="toggle-slug-btn"
//                 onClick={toggleSlugInput}
//                 disabled={loading}
//               >
//                 {useCustomSlug ? "← Use Available Slugs" : "Use Custom Slug →"}
//               </button>
//             </div>
//           </div>

//           <small style={{color: '#666', fontSize: '0.8rem', marginTop: '-0.5rem'}}>
//             Choose from available slugs or create a custom one. Common slugs are already taken.
//           </small>

//           {/* Description Field */}
//           <label>Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             disabled={loading}
//             placeholder="Describe your course..."
//             rows="4"
//           />

//           {/* Price Field */}
//           <label>Price ($)</label>
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             disabled={loading}
//             placeholder="0.00"
//             min="0"
//             step="0.01"
//           />

//           {/* Category Field */}
//           <label>Category</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             disabled={loading}
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

//           {/* Thumbnail Field */}
//           <label>Thumbnail Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               setThumbnail(e.target.files[0]);
//               setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
//             }}
//             disabled={loading}
//           />
//           {thumbnailPreview && (
//             <div className="file-preview">
//               <strong>Preview:</strong>
//               <br />
//               <img src={thumbnailPreview} alt="Preview" width="200" />
//             </div>
//           )}

//           {/* Intro Video Field */}
//           <label>Intro Video (Optional)</label>
//           <input
//             type="file"
//             accept="video/*"
//             onChange={(e) => setIntroVideo(e.target.files[0])}
//             disabled={loading}
//           />

//           {/* ✅ FIXED: Attachments Field - MULTIPLE FILES */}
//           <label>Attachments (PDF, Docs, etc.) - Multiple</label>
//           <input
//             type="file"
//             multiple // ✅ ADD THIS
//             onChange={(e) => {
//               const files = Array.from(e.target.files);
//               setAttachments(files);
//             }}
//             disabled={loading}
//           />
//           {attachments.length > 0 && (
//             <div className="file-preview">
//               <strong>Files ({attachments.length}):</strong>
//               <ul>
//                 {attachments.map((file, index) => (
//                   <li key={index}>
//                     {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                     <button 
//                       type="button"
//                       onClick={() => {
//                         setAttachments(prev => prev.filter((_, i) => i !== index));
//                       }}
//                       style={{ 
//                         marginLeft: '10px', 
//                         color: 'red', 
//                         background: 'none', 
//                         border: 'none',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       ✕ Remove
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button 
//             type="submit" 
//             className="btn-submit"
//             disabled={loading || !title || !slug}
//           >
//             {loading ? "Creating Course..." : "Create Course"}
//           </button>

//           {/* Cancel Button */}
//           <button 
//             type="button" 
//             className="btn-cancel"
//             onClick={() => navigate(-1)}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default CreateCourse;





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
