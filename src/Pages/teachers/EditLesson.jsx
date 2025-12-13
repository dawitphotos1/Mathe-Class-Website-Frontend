// //pages/teachers/EditLesson.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import "./EditLesson.css";
// import { AiOutlineUpload } from "react-icons/ai";

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
//   const [activeTab, setActiveTab] = useState("text");

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

//         setActiveTab(lesson.content_type || "text");
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

//   if (loading)
//     return (
//       <div className="edit-lesson-page">
//         <p className="loading-text">Loading...</p>
//       </div>
//     );

//   return (
//     <div className="edit-lesson-page">
//       <div className="edit-lesson-card">
//         <h2>Edit Lesson</h2>

//         <form className="edit-lesson-form" onSubmit={handleSubmit}>
//           <label>Title</label>
//           <input
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             placeholder="Enter lesson title"
//             required
//           />

//           {/* ===== Tabs ===== */}
//           <div className="tab-header">
//             {["text", "video", "pdf"].map((type) => (
//               <button
//                 type="button"
//                 key={type}
//                 className={`tab-btn ${activeTab === type ? "active" : ""}`}
//                 onClick={() => {
//                   setActiveTab(type);
//                   setForm({ ...form, content_type: type });
//                 }}
//               >
//                 {type === "text" ? "Text" : type === "video" ? "Video" : "File"}
//               </button>
//             ))}
//           </div>

//           {/* ===== Tab Content ===== */}
//           <div className="tab-content">
//             {activeTab === "text" && (
//               <>
//                 <label>Content</label>
//                 <ReactQuill
//                   theme="snow"
//                   value={form.content}
//                   onChange={(value) => setForm({ ...form, content: value })}
//                 />
//               </>
//             )}

//             {activeTab === "video" && (
//               <>
//                 <label>Video URL</label>
//                 <input
//                   value={form.video_url}
//                   onChange={(e) =>
//                     setForm({ ...form, video_url: e.target.value })
//                   }
//                   placeholder="https://example.com/video"
//                 />
//               </>
//             )}

//             {activeTab === "pdf" && (
//               <>
//                 <label>Upload File</label>
//                 <div className="file-upload-wrapper">
//                   <label htmlFor="file-upload" className="file-upload-btn">
//                     <AiOutlineUpload className="upload-icon" />{" "}
//                     {file ? file.name : "Choose a file"}
//                   </label>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.png"
//                     onChange={handleFileChange}
//                     hidden
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           <label>Order Index</label>
//           <input
//             type="number"
//             value={form.order_index}
//             onChange={(e) => setForm({ ...form, order_index: e.target.value })}
//             min={0}
//           />

//           <label className="preview-checkbox">
//             <input
//               type="checkbox"
//               checked={form.is_preview}
//               onChange={(e) =>
//                 setForm({ ...form, is_preview: e.target.checked })
//               }
//             />
//             Make Preview
//           </label>

//           <button type="submit" className="save-btn">
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditLesson;




import db from "../models/index.js";
import upload from "../middleware/uploadMiddleware.js";

const { Lesson, Course } = db;

/* -------------------------
   Helpers
------------------------- */

const getBackendUrl = () => {
  if (process.env.BACKEND_URL)
    return process.env.BACKEND_URL.replace(/\/$/, "");
  if (process.env.RENDER_EXTERNAL_URL)
    return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  return `http://localhost:${process.env.PORT || 5000}`;
};

export const buildFileUrls = (lesson) => {
  if (!lesson) return null;
  const raw = lesson.toJSON ? lesson.toJSON() : lesson;

  const normalize = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${getBackendUrl()}/api/v1/files/${encodeURIComponent(
      url.replace(/^\/?Uploads\//, "")
    )}`;
  };

  return {
    id: raw.id,
    title: raw.title,
    contentType: raw.content_type,
    textContent: raw.content,
    fileUrl: normalize(raw.file_url),
    videoUrl: normalize(raw.video_url),
    isPreview: !!raw.is_preview,
    orderIndex: raw.order_index,
    unitId: raw.unit_id,
    courseId: raw.course_id,
  };
};

/* -------------------------
   CRUD — LESSON
------------------------- */

// GET /lessons/:id
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, error: "Lesson not found" });

    res.json({ success: true, lesson: buildFileUrls(lesson) });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to load lesson" });
  }
};

// POST /course/:courseId/lessons
export const createLesson = async (req, res) => {
  try {
    await upload.processUploadedFiles(req);
    const uploads = req.processedUploads;

    const lesson = await Lesson.create({
      ...req.body,
      course_id: req.params.courseId,
      file_url: uploads.fileUrl,
      video_url: uploads.videoUrl,
    });

    res.status(201).json({
      success: true,
      lesson: buildFileUrls(lesson),
    });
  } catch (err) {
    console.error("Create lesson error:", err);
    res.status(500).json({ success: false, error: "Create lesson failed" });
  }
};

// PUT /lessons/:lessonId  ✅ FIXED
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, error: "Lesson not found" });

    // 🔥 THIS WAS MISSING
    await upload.processUploadedFiles(req);
    const uploads = req.processedUploads;

    await lesson.update({
      title: req.body.title,
      content: req.body.content,
      content_type: req.body.content_type,
      is_preview: req.body.is_preview,

      file_url: uploads.fileUrl ?? lesson.file_url,
      video_url: uploads.videoUrl ?? lesson.video_url,
    });

    res.json({
      success: true,
      lesson: buildFileUrls(lesson),
    });
  } catch (err) {
    console.error("Update lesson error:", err);
    res.status(500).json({ success: false, error: "Update lesson failed" });
  }
};

// DELETE /lessons/:lessonId
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, error: "Lesson not found" });

    await lesson.destroy();
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Delete lesson failed" });
  }
};

/* -------------------------
   LISTING
------------------------- */

export const getLessonsByUnit = async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      where: { unit_id: req.params.unitId },
      order: [["order_index", "ASC"]],
    });

    res.json({
      success: true,
      lessons: lessons.map(buildFileUrls),
    });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to load unit lessons" });
  }
};

export const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      where: { course_id: req.params.courseId },
      order: [
        ["unit_id", "ASC"],
        ["order_index", "ASC"],
      ],
    });

    res.json({
      success: true,
      lessons: lessons.map(buildFileUrls),
    });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to load course lessons" });
  }
};

/* -------------------------
   PREVIEW
------------------------- */

export const getPreviewLessonForCourse = async (req, res) => {
  try {
    const lesson =
      (await Lesson.findOne({
        where: { course_id: req.params.courseId, is_preview: true },
        order: [["order_index", "ASC"]],
      })) ||
      (await Lesson.findOne({
        where: { course_id: req.params.courseId },
        order: [["order_index", "ASC"]],
      }));

    if (!lesson)
      return res
        .status(404)
        .json({ success: false, error: "No lessons found" });

    const course = await Course.findByPk(req.params.courseId, {
      attributes: ["id", "title", "slug"],
    });

    res.json({
      success: true,
      lesson: buildFileUrls(lesson),
      course,
    });
  } catch {
    res.status(500).json({ success: false, error: "Preview lesson failed" });
  }
};

export const getPublicPreviewByLessonId = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, error: "Lesson not found" });

    const course = await Course.findByPk(lesson.course_id, {
      attributes: ["id", "title", "slug"],
    });

    res.json({
      success: true,
      lesson: buildFileUrls(lesson),
      course,
    });
  } catch {
    res.status(500).json({ success: false, error: "Public preview failed" });
  }
};

export default {
  buildFileUrls,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsByUnit,
  getLessonsByCourse,
  getPreviewLessonForCourse,
  getPublicPreviewByLessonId,
};
