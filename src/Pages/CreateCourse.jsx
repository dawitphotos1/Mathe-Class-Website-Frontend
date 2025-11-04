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
import axiosInstance from "../utils/axiosInstance";
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
  const [customSlug, setCustomSlug] = useState("");
  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Available slugs that are NOT taken yet
  const availableSlugs = [
    { value: "algebra-1-beginners", label: "algebra-1-beginners" },
    { value: "algebra-2-advanced", label: "algebra-2-advanced" },
    { value: "pre-calculus-foundations", label: "pre-calculus-foundations" },
    { value: "calculus-essentials", label: "calculus-essentials" },
    { value: "geometry-trigonometry-basics", label: "geometry-trigonometry-basics" },
    { value: "statistics-probability-intro", label: "statistics-probability-intro" },
    { value: "linear-algebra-fundamentals", label: "linear-algebra-fundamentals" },
    { value: "differential-equations-intro", label: "differential-equations-intro" },
    { value: "discrete-mathematics-basics", label: "discrete-mathematics-basics" },
    { value: "number-theory-concepts", label: "number-theory-concepts" },
    { value: "math-test-prep", label: "math-test-prep" },
    { value: "advanced-math-concepts", label: "advanced-math-concepts" },
  ];

  // Auto-generate unique slug from title
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!useCustomSlug && newTitle) {
      // Generate a unique slug by adding random numbers
      const baseSlug = newTitle
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      
      // Add random numbers to make it unique
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const uniqueSlug = `${baseSlug}-${randomSuffix}`;
      
      setSlug(uniqueSlug);
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
      // Switching to custom input
      setCustomSlug("");
      setSlug("");
    } else {
      // Switching back to dropdown - generate unique slug
      if (title) {
        const baseSlug = title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
        
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const uniqueSlug = `${baseSlug}-${randomSuffix}`;
        setSlug(uniqueSlug);
      }
    }
  };

  // Generate a completely unique slug
  const generateUniqueSlug = () => {
    if (title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const uniqueSlug = `${baseSlug}-${randomSuffix}`;
      
      if (useCustomSlug) {
        setCustomSlug(uniqueSlug);
      }
      setSlug(uniqueSlug);
      
      toast.info("🔄 Generated unique slug for you!");
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
      
      if (err.response?.data?.error?.includes("slug already exists")) {
        // Slug conflict - suggest new unique slug
        toast.error("❌ This URL slug is already taken. Try a different one!");
        
        // Auto-generate a new unique slug
        setTimeout(() => {
          generateUniqueSlug();
        }, 1000);
        
      } else if (err.response?.data?.error) {
        toast.error(`❌ ${err.response.data.error}`);
      } else {
        toast.error("❌ Failed to create course. Please try again.");
      }
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
        
        <div className="info-box">
          <strong>💡 Tip:</strong> The common slugs (algebra-1, algebra-2, etc.) are already taken. 
          Use the suggested available slugs or create a custom one with unique numbers.
        </div>

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
                  <option value="">-- Select an Available URL Slug --</option>
                  {availableSlugs.map((slugOption) => (
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
              <div className="custom-slug-input">
                <input
                  type="text"
                  value={customSlug}
                  onChange={handleCustomSlugChange}
                  required
                  disabled={loading}
                  placeholder="your-unique-course-slug"
                />
                <button 
                  type="button" 
                  className="generate-slug-btn"
                  onClick={generateUniqueSlug}
                  disabled={loading || !title}
                >
                  🔄 Generate Unique
                </button>
              </div>
            )}
            
            <div className="slug-actions">
              <button 
                type="button" 
                className="toggle-slug-btn"
                onClick={toggleSlugInput}
                disabled={loading}
              >
                {useCustomSlug ? "← Use Available Slugs" : "Use Custom Slug →"}
              </button>
            </div>
          </div>

          <small style={{color: '#666', fontSize: '0.8rem', marginTop: '-0.5rem'}}>
            Choose from available slugs or create a custom one. Common slugs are already taken.
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
          >
            Cancel
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCourse;