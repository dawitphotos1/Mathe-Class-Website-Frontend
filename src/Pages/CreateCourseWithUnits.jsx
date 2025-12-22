// src/pages/CreateCourseWithUnits.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { prepareFormData } from "../utils/uploadUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CreateCourseWithUnits.css";

const CreateCourseWithUnits = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);

  /* ===================== COURSE ===================== */
  const [courseData, setCourseData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    price: "0",
  });
  const [courseAttachments, setCourseAttachments] = useState([]);

  /* ===================== UNITS ===================== */
  const [units, setUnits] = useState([
    { id: 1, title: "", slug: "", description: "", lessons: [] },
  ]);
  const [unitAttachments, setUnitAttachments] = useState({});
  const [lessonAttachments, setLessonAttachments] = useState({});

  /* ===================== HELPERS ===================== */
  const slugify = (value) =>
    value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

  /* ===================== COURSE HANDLERS ===================== */
  const handleCourseChange = (field, value) => {
    setCourseData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !prev.slug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleCourseAttachments = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) setCourseAttachments((prev) => [...prev, ...files]);
  };

  /* ===================== UNIT HANDLERS ===================== */
  const addUnit = () => {
    const newId = Date.now();
    setUnits((prev) => [
      ...prev,
      { id: newId, title: "", slug: "", description: "", lessons: [] },
    ]);
  };

  const removeUnit = (unitId) => {
    if (units.length === 1) {
      toast.error("At least one unit is required");
      return;
    }
    setUnits((prev) => prev.filter((u) => u.id !== unitId));
    setUnitAttachments((prev) => {
      const { [unitId]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateUnit = (unitId, field, value) => {
    setUnits((prev) =>
      prev.map((unit) => {
        if (unit.id === unitId) {
          if (field === "title" && !unit.slug) {
            return { ...unit, title: value, slug: slugify(value) };
          }
          return { ...unit, [field]: value };
        }
        return unit;
      })
    );
  };

  const handleUnitAttachments = (unitId, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUnitAttachments((prev) => ({
      ...prev,
      [unitId]: [...(prev[unitId] || []), ...files],
    }));
  };

  /* ===================== LESSON HANDLERS ===================== */
  const addLesson = (unitId) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              lessons: [
                ...unit.lessons,
                {
                  id: `${unitId}-${Date.now()}`,
                  title: "",
                  slug: "",
                  content: "",
                  video_url: "",
                  order_index: unit.lessons.length + 1,
                },
              ],
            }
          : unit
      )
    );
  };

  const removeLesson = (unitId, lessonId) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              lessons: unit.lessons
                .filter((l) => l.id !== lessonId)
                .map((lesson, index) => ({ ...lesson, order_index: index + 1 })),
            }
          : unit
      )
    );

    setLessonAttachments((prev) => {
      const { [lessonId]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateLesson = (unitId, lessonId, field, value) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              lessons: unit.lessons.map((lesson) => {
                if (lesson.id === lessonId) {
                  if (field === "title" && !lesson.slug) {
                    return { ...lesson, title: value, slug: slugify(value) };
                  }
                  return { ...lesson, [field]: value };
                }
                return lesson;
              }),
            }
          : unit
      )
    );
  };

  const handleLessonAttachments = (lessonId, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLessonAttachments((prev) => ({
      ...prev,
      [lessonId]: [...(prev[lessonId] || []), ...files],
    }));
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async () => {
    if (!courseData.title || !courseData.slug) {
      toast.error("Course title and slug are required");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Create Course
      const courseForm = prepareFormData(courseData, courseAttachments);
      const courseRes = await axiosInstance.post("/courses/create", courseForm, {
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded * 25) / e.total));
        },
      });
      const courseId = courseRes.data.course.id;

      // Create Units & Lessons
      for (const [uIndex, unit] of units.entries()) {
        if (!unit.title || !unit.slug) continue;

        const unitForm = prepareFormData(
          { course_id: courseId, title: unit.title, slug: unit.slug, description: unit.description, order_index: uIndex + 1 },
          unitAttachments[unit.id] || []
        );
        const unitRes = await axiosInstance.post("/lessons", unitForm);
        const unitId = unitRes.data.lesson.id;

        for (const lesson of unit.lessons) {
          if (!lesson.title || !lesson.slug) continue;

          const lessonForm = prepareFormData(
            { course_id: courseId, unit_id: unitId, title: lesson.title, slug: lesson.slug, content: lesson.content, video_url: lesson.video_url, order_index: lesson.order_index },
            lessonAttachments[lesson.id] || []
          );
          await axiosInstance.post("/lessons", lessonForm);
        }
      }

      toast.success("🎉 Course, units & lessons created successfully!");
      navigate("/teacher/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Creation failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="create-course-with-units-container">
      <div className="create-course-with-units-card">
        <h2>Create Course with Units</h2>

        <div className="progress-steps">
          <div className={currentStep >= 1 ? "active" : ""}>1. Course</div>
          <div className={currentStep >= 2 ? "active" : ""}>2. Units</div>
          <div className={currentStep >= 3 ? "active" : ""}>3. Create</div>
        </div>

        {/* STEP 1: COURSE */}
        {currentStep === 1 && (
          <motion.div className="step-container">
            <div className="form-group">
              <label>Course Title *</label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => handleCourseChange("title", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Course Slug *</label>
              <input
                type="text"
                value={courseData.slug}
                onChange={(e) => handleCourseChange("slug", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={courseData.description}
                onChange={(e) =>
                  handleCourseChange("description", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Attachments</label>
              <input type="file" multiple onChange={handleCourseAttachments} />
            </div>
            <button onClick={() => setCurrentStep(2)}>Next →</button>
          </motion.div>
        )}

        {/* STEP 2: UNITS & LESSONS */}
        {currentStep === 2 && (
          <motion.div className="step-container">
            {units.map((unit, uIndex) => (
              <div key={unit.id} className="unit-card">
                <div className="unit-header">
                  <h4>Unit {uIndex + 1}</h4>
                  {units.length > 1 && (
                    <button onClick={() => removeUnit(unit.id)}>Remove</button>
                  )}
                </div>

                <div className="form-group">
                  <label>Unit Title *</label>
                  <input
                    type="text"
                    value={unit.title}
                    onChange={(e) =>
                      updateUnit(unit.id, "title", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Unit Slug *</label>
                  <input
                    type="text"
                    value={unit.slug}
                    onChange={(e) =>
                      updateUnit(unit.id, "slug", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Unit Description</label>
                  <textarea
                    value={unit.description}
                    onChange={(e) =>
                      updateUnit(unit.id, "description", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Unit Attachments</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleUnitAttachments(unit.id, e)}
                  />
                </div>

                <div className="lessons-section">
                  {unit.lessons.map((lesson, lIndex) => (
                    <div key={lesson.id} className="lesson-card">
                      <div className="lesson-header">
                        <h5>Lesson {lIndex + 1}</h5>
                        <button
                          onClick={() => removeLesson(unit.id, lesson.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="form-group">
                        <label>Lesson Title *</label>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            updateLesson(
                              unit.id,
                              lesson.id,
                              "title",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Lesson Slug *</label>
                        <input
                          type="text"
                          value={lesson.slug}
                          onChange={(e) =>
                            updateLesson(
                              unit.id,
                              lesson.id,
                              "slug",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Lesson Content</label>
                        <textarea
                          value={lesson.content}
                          onChange={(e) =>
                            updateLesson(
                              unit.id,
                              lesson.id,
                              "content",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Lesson Attachments</label>
                        <input
                          type="file"
                          multiple
                          onChange={(e) =>
                            handleLessonAttachments(lesson.id, e)
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <button onClick={() => addLesson(unit.id)}>+ Add Lesson</button>
                </div>
              </div>
            ))}

            <button onClick={addUnit}>+ Add Unit</button>
            <button onClick={() => setCurrentStep(3)}>Next →</button>
          </motion.div>
        )}

        {/* STEP 3: REVIEW & SUBMIT */}
        {currentStep === 3 && (
          <motion.div className="step-container">
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? `Creating... ${uploadProgress}%` : "Create Course"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateCourseWithUnits;
