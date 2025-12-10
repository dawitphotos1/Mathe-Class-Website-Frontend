// // src/pages/teachers/EditLesson.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditLesson = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     content_type: "text",
//     video_url: "",
//     order_index: 0,
//     is_preview: false,
//     unit_id: null,
//   });

//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     const loadLesson = async () => {
//       try {
//         const res = await axiosInstance.get(`/lessons/${lessonId}`);
//         const lesson = res.data.lesson;

//         setForm({
//           title: lesson.title,
//           content: lesson.content || "",
//           content_type: lesson.content_type,
//           video_url: lesson.video_url || "",
//           order_index: lesson.order_index,
//           is_preview: lesson.is_preview,
//           unit_id: lesson.unit_id,
//         });
//       } catch {
//         toast.error("Failed to load lesson");
//         navigate(-1);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadLesson();
//   }, [lessonId, navigate]);

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
//     if (file) formData.append("file", file);

//     try {
//       await axiosInstance.put(`/lessons/${lessonId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Lesson updated successfully");
//       navigate(-1);
//     } catch {
//       toast.error("Failed to update lesson");
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="edit-lesson-page">
//       <h2>Edit Lesson</h2>

//       <form onSubmit={handleSubmit}>
//         <label>Title</label>
//         <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

//         <label>Content Type</label>
//         <select
//           value={form.content_type}
//           onChange={(e) => setForm({ ...form, content_type: e.target.value })}
//         >
//           <option value="text">Text</option>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//         </select>

//         {form.content_type === "text" && (
//           <>
//             <label>Content</label>
//             <ReactQuill value={form.content} onChange={(value) => setForm({ ...form, content: value })} />
//           </>
//         )}

//         {form.content_type === "video" && (
//           <>
//             <label>Video URL</label>
//             <input
//               value={form.video_url}
//               onChange={(e) => setForm({ ...form, video_url: e.target.value })}
//               placeholder="https://example.com/video"
//             />
//           </>
//         )}

//         {form.content_type === "pdf" && (
//           <>
//             <label>Upload PDF</label>
//             <input type="file" accept="application/pdf" onChange={handleFileChange} />
//           </>
//         )}

//         <label>Order Index</label>
//         <input
//           type="number"
//           value={form.order_index}
//           onChange={(e) => setForm({ ...form, order_index: e.target.value })}
//         />

//         <label>
//           <input
//             type="checkbox"
//             checked={form.is_preview}
//             onChange={(e) => setForm({ ...form, is_preview: e.target.checked })}
//           />
//           Make Preview
//         </label>

//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// };

// export default EditLesson;




// src/pages/teachers/EditLesson.jsx - UPDATED VERSION
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loading from "../../components/Loading";
import LessonErrorHandler from "../../components/LessonErrorHandler";

const EditLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get courseId from location state or params
  const courseId = location.state?.courseId || new URLSearchParams(location.search).get('courseId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    contentType: "text",
    videoUrl: "",
    orderIndex: 0,
    isPreview: false,
    unitId: null,
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        console.log(`📖 Loading lesson ${lessonId}...`);
        
        const res = await axiosInstance.get(`/lessons/${lessonId}`);
        
        if (res.data.success) {
          const lesson = res.data.lesson;
          console.log(`✅ Lesson loaded: ${lesson.title}`);
          
          setForm({
            title: lesson.title || "",
            content: lesson.content || "",
            contentType: lesson.content_type || "text",
            videoUrl: lesson.video_url || "",
            orderIndex: lesson.order_index || 0,
            isPreview: lesson.is_preview || false,
            unitId: lesson.unit_id || null,
          });
          
          setCurrentFileUrl(lesson.file_url || "");
          
          // Store courseId if not already set
          if (lesson.course_id && !courseId) {
            localStorage.setItem('currentCourseId', lesson.course_id);
          }
        } else {
          throw new Error(res.data.error || "Failed to load lesson");
        }
      } catch (err) {
        console.error("❌ Failed to load lesson:", err);
        setError(err);
        
        toast.error(err.response?.data?.error || "Failed to load lesson");
        
        // If lesson doesn't exist, redirect after a delay
        if (err.response?.status === 404) {
          setTimeout(() => {
            if (courseId) {
              navigate(`/courses/${courseId}/manage-lessons`);
            } else {
              navigate(-1);
            }
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, navigate, courseId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'video/mp4', 'video/mpeg', 'video/quicktime'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please select a PDF or video file");
        return;
      }
      
      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }
      
      setFile(selectedFile);
      toast.info(`Selected file: ${selectedFile.name}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log("📤 Submitting lesson update...");
      
      const formData = new FormData();
      
      // Append form fields
      formData.append("title", form.title.trim());
      formData.append("content", form.content);
      formData.append("contentType", form.contentType);
      formData.append("orderIndex", form.orderIndex);
      formData.append("isPreview", form.isPreview);
      if (form.unitId) formData.append("unitId", form.unitId);
      if (form.videoUrl) formData.append("videoUrl", form.videoUrl.trim());
      
      // Append file if selected
      if (file) {
        if (form.contentType === "pdf") {
          formData.append("pdf", file);
        } else if (form.contentType === "video") {
          formData.append("video", file);
        } else {
          formData.append("file", file);
        }
      }

      const res = await axiosInstance.put(`/lessons/${lessonId}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("✅ Lesson updated successfully!");
        
        // Store success in localStorage for page refresh handling
        localStorage.setItem('lessonUpdateSuccess', 'true');
        localStorage.setItem('updatedLessonId', lessonId);
        
        // Redirect back to lessons management
        setTimeout(() => {
          if (courseId) {
            navigate(`/courses/${courseId}/manage-lessons`);
          } else if (res.data.lesson?.course_id) {
            navigate(`/courses/${res.data.lesson.course_id}/manage-lessons`);
          } else {
            navigate(-1);
          }
        }, 1500);
      } else {
        throw new Error(res.data.error || "Update failed");
      }
    } catch (err) {
      console.error("❌ Failed to update lesson:", err);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details || 
                          "Failed to update lesson. Please try again.";
      
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (courseId) {
      navigate(`/courses/${courseId}/manage-lessons`);
    } else {
      navigate(-1);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message="Loading lesson data..." />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LessonErrorHandler error={error} lessonId={lessonId} courseId={courseId} />
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Lesson</h2>
            <p className="text-gray-600 mb-6">
              {error.response?.status === 404 
                ? 'This lesson was not found. It may have been deleted or the lesson ID is incorrect.'
                : 'There was an error loading the lesson data. Please try again later.'
              }
            </p>
            
            <div className="space-x-4">
              <button
                onClick={() => courseId ? navigate(`/courses/${courseId}/manage-lessons`) : navigate(-1)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Back to Lessons
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Edit Lesson</h1>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Lessons
            </button>
          </div>
          <p className="text-gray-600">
            Update lesson details, content, and files. Lesson ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{lessonId}</span>
          </p>
        </div>

        {/* Error Handler */}
        <LessonErrorHandler error={error} lessonId={lessonId} courseId={courseId} />

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter lesson title"
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                value={form.contentType}
                onChange={(e) => setForm({ ...form, contentType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="text">📝 Text Content</option>
                <option value="pdf">📄 PDF Document</option>
                <option value="video">🎥 Video Lesson</option>
              </select>
            </div>

            {/* Content based on type */}
            {form.contentType === "text" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill 
                    value={form.content} 
                    onChange={(value) => setForm({ ...form, content: value })}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    className="h-64"
                  />
                </div>
              </div>
            )}

            {form.contentType === "video" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Upload Video File
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Supported formats: MP4, WebM, MOV. Max size: 50MB
                  </p>
                </div>
                
                {form.videoUrl && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Current video URL: <a href={form.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">{form.videoUrl.substring(0, 50)}...</a>
                    </p>
                  </div>
                )}
              </div>
            )}

            {form.contentType === "pdf" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF Document
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Max file size: 50MB. Existing PDF will be replaced.
                  </p>
                </div>
                
                {currentFileUrl && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      Current PDF: <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="underline">View Current PDF</a>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Index */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                min="0"
                value={form.orderIndex}
                onChange={(e) => setForm({ ...form, orderIndex: parseInt(e.target.value) || 0 })}
                className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
              <p className="mt-2 text-sm text-gray-500">
                Determines the display order of lessons. Lower numbers appear first.
              </p>
            </div>

            {/* Preview Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPreview"
                checked={form.isPreview}
                onChange={(e) => setForm({ ...form, isPreview: e.target.checked })}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPreview" className="ml-3 text-gray-700">
                <span className="font-medium">Make this a preview lesson</span>
                <p className="text-sm text-gray-500 mt-1">
                  Preview lessons are visible to all users without enrollment.
                </p>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                disabled={uploading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={uploading || !form.title.trim()}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Make sure to save your changes before leaving this page</li>
            <li>• Preview lessons are visible to all website visitors</li>
            <li>• For large files, upload may take a few moments</li>
            <li>• You can link to YouTube/Vimeo videos or upload your own</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditLesson;