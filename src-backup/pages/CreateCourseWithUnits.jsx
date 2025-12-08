// src/pages/CreateCourseWithUnits.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CreateCourseWithUnits.css";

const CreateCourseWithUnits = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Course, 2: Units, 3: Lessons

  // Course Data
  const [courseData, setCourseData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    price: "0"
  });

  // Units Data
  const [units, setUnits] = useState([
    { id: 1, title: "", slug: "", description: "", lessons: [] }
  ]);

  // Handle Course Data Changes
  const handleCourseChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title' && !courseData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      
      setCourseData(prev => ({
        ...prev,
        slug: generatedSlug
      }));
    }
  };

  // Handle Unit Changes
  const handleUnitChange = (unitId, field, value) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        // Auto-generate unit slug from title
        if (field === 'title' && !unit.slug) {
          const unitSlug = value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
          
          return { ...unit, [field]: value, slug: unitSlug };
        }
        return { ...unit, [field]: value };
      }
      return unit;
    }));
  };

  // Handle Lesson Changes
  const handleLessonChange = (unitId, lessonIndex, field, value) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        const updatedLessons = [...unit.lessons];
        // Auto-generate lesson slug from title
        if (field === 'title' && !updatedLessons[lessonIndex]?.slug) {
          const lessonSlug = value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
          
          updatedLessons[lessonIndex] = {
            ...updatedLessons[lessonIndex],
            [field]: value,
            slug: lessonSlug
          };
        } else {
          updatedLessons[lessonIndex] = {
            ...updatedLessons[lessonIndex],
            [field]: value
          };
        }
        return { ...unit, lessons: updatedLessons };
      }
      return unit;
    }));
  };

  // Add New Unit
  const addUnit = () => {
    const newUnitId = units.length > 0 ? Math.max(...units.map(u => u.id)) + 1 : 1;
    setUnits(prev => [
      ...prev,
      { id: newUnitId, title: "", slug: "", description: "", lessons: [] }
    ]);
  };

  // Remove Unit
  const removeUnit = (unitId) => {
    if (units.length > 1) {
      setUnits(prev => prev.filter(unit => unit.id !== unitId));
    } else {
      toast.error("You need at least one unit");
    }
  };

  // Add Lesson to Unit
  const addLesson = (unitId) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        const newLesson = {
          id: unit.lessons.length + 1,
          title: "",
          slug: "",
          content: "",
          video_url: "",
          order_index: unit.lessons.length + 1
        };
        return { ...unit, lessons: [...unit.lessons, newLesson] };
      }
      return unit;
    }));
  };

  // Remove Lesson from Unit
  const removeLesson = (unitId, lessonIndex) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        const updatedLessons = unit.lessons.filter((_, index) => index !== lessonIndex);
        // Reorder lessons
        const reorderedLessons = updatedLessons.map((lesson, index) => ({
          ...lesson,
          order_index: index + 1
        }));
        return { ...unit, lessons: reorderedLessons };
      }
      return unit;
    }));
  };

  // Generate Unique Slug
  const generateUniqueSlug = (type, baseTitle) => {
    const baseSlug = baseTitle
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${baseSlug}-${randomSuffix}`;
  };

  // Final Submission
  const handleSubmit = async () => {
    setLoading(true);

    // Validate course data
    if (!courseData.title || !courseData.slug) {
      toast.error("❌ Course title and slug are required");
      setLoading(false);
      return;
    }

    // Validate units
    const validUnits = units.filter(unit => unit.title && unit.slug);
    if (validUnits.length === 0) {
      toast.error("❌ At least one unit with title and slug is required");
      setLoading(false);
      return;
    }

    try {
      // First, create the course
      const courseFormData = new FormData();
      courseFormData.append("title", courseData.title);
      courseFormData.append("slug", courseData.slug);
      courseFormData.append("description", courseData.description);
      courseFormData.append("category", courseData.category);
      courseFormData.append("price", courseData.price);

      console.log("📤 Creating course:", {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        category: courseData.category,
        price: courseData.price
      });

      const courseResponse = await axiosInstance.post("/courses/create", courseFormData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const courseId = courseResponse.data.course.id;
      console.log("✅ Course created with ID:", courseId);

      // Then, create units and lessons
      for (const unit of validUnits) {
        // Create unit
        const unitData = {
          course_id: courseId,
          title: unit.title,
          slug: unit.slug,
          description: unit.description,
          isUnitHeader: true,
          order_index: unit.id
        };

        console.log("📤 Creating unit:", unitData);
        
        const unitResponse = await axiosInstance.post("/lessons", unitData);
        const unitId = unitResponse.data.lesson.id;
        console.log("✅ Unit created with ID:", unitId);

        // Create lessons for this unit
        for (const lesson of unit.lessons) {
          if (lesson.title && lesson.slug) {
            const lessonData = {
              course_id: courseId,
              title: lesson.title,
              slug: lesson.slug,
              content: lesson.content,
              video_url: lesson.video_url,
              order_index: lesson.order_index,
              unit_id: unitId
            };

            console.log("📤 Creating lesson:", lessonData);
            await axiosInstance.post("/lessons", lessonData);
            console.log("✅ Lesson created:", lesson.title);
          }
        }
      }

      toast.success("🎉 Course, units, and lessons created successfully!");
      navigate("/teacher/dashboard");

    } catch (err) {
      console.error("❌ Creation error:", err);
      if (err.response?.data?.error?.includes("slug already exists")) {
        toast.error("❌ A course with this slug already exists. Please change the course slug.");
        setCurrentStep(1);
      } else {
        toast.error(err.response?.data?.error || "Failed to create course");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render Steps
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="step-container"
    >
      <h3>Step 1: Course Information</h3>
      
      <div className="form-group">
        <label>Course Title *</label>
        <input
          type="text"
          value={courseData.title}
          onChange={(e) => handleCourseChange('title', e.target.value)}
          placeholder="Algebra 1 - Complete Course"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Course Slug *</label>
        <input
          type="text"
          value={courseData.slug}
          onChange={(e) => handleCourseChange('slug', e.target.value)}
          placeholder="algebra-1-complete"
          disabled={loading}
        />
        <small>URL: /courses/{courseData.slug || 'your-slug'}</small>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={courseData.description}
          onChange={(e) => handleCourseChange('description', e.target.value)}
          placeholder="Describe your course..."
          rows="4"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={courseData.category}
          onChange={(e) => handleCourseChange('category', e.target.value)}
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
      </div>

      <div className="form-group">
        <label>Price ($)</label>
        <input
          type="number"
          value={courseData.price}
          onChange={(e) => handleCourseChange('price', e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          disabled={loading}
        />
      </div>

      <button
        type="button"
        className="btn-next"
        onClick={() => setCurrentStep(2)}
        disabled={!courseData.title || !courseData.slug}
      >
        Next: Add Units →
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="step-container"
    >
      <h3>Step 2: Course Units</h3>
      <p>Add units to your course. Each unit can have its own custom slug.</p>

      {units.map((unit, index) => (
        <div key={unit.id} className="unit-card">
          <div className="unit-header">
            <h4>Unit {index + 1}</h4>
            {units.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeUnit(unit.id)}
                disabled={loading}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-group">
            <label>Unit Title *</label>
            <input
              type="text"
              value={unit.title}
              onChange={(e) => handleUnitChange(unit.id, 'title', e.target.value)}
              placeholder={`Unit ${index + 1}: Introduction to Algebra`}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Unit Slug *</label>
            <input
              type="text"
              value={unit.slug}
              onChange={(e) => handleUnitChange(unit.id, 'slug', e.target.value)}
              placeholder={`unit-${index + 1}-introduction`}
              disabled={loading}
            />
            <small>URL: /courses/{courseData.slug}/{unit.slug || 'unit-slug'}</small>
          </div>

          <div className="form-group">
            <label>Unit Description</label>
            <textarea
              value={unit.description}
              onChange={(e) => handleUnitChange(unit.id, 'description', e.target.value)}
              placeholder="Describe this unit..."
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Lessons for this unit */}
          <div className="lessons-section">
            <div className="lessons-header">
              <h5>Lessons in this Unit</h5>
              <button
                type="button"
                className="btn-add-lesson"
                onClick={() => addLesson(unit.id)}
                disabled={loading}
              >
                + Add Lesson
              </button>
            </div>

            {unit.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="lesson-card">
                <div className="lesson-header">
                  <h6>Lesson {lessonIndex + 1}</h6>
                  <button
                    type="button"
                    className="btn-remove-small"
                    onClick={() => removeLesson(unit.id, lessonIndex)}
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>

                <div className="form-group">
                  <label>Lesson Title *</label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(unit.id, lessonIndex, 'title', e.target.value)}
                    placeholder="Variables and Expressions"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Lesson Slug *</label>
                  <input
                    type="text"
                    value={lesson.slug}
                    onChange={(e) => handleLessonChange(unit.id, lessonIndex, 'slug', e.target.value)}
                    placeholder="variables-and-expressions"
                    disabled={loading}
                  />
                  <small>URL: /courses/{courseData.slug}/lesson/{lesson.slug || 'lesson-slug'}</small>
                </div>

                <div className="form-group">
                  <label>Lesson Content</label>
                  <textarea
                    value={lesson.content}
                    onChange={(e) => handleLessonChange(unit.id, lessonIndex, 'content', e.target.value)}
                    placeholder="Lesson content here..."
                    rows="3"
                    disabled={loading}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="step-actions">
        <button
          type="button"
          className="btn-add-unit"
          onClick={addUnit}
          disabled={loading}
        >
          + Add Another Unit
        </button>

        <div className="step-navigation">
          <button
            type="button"
            className="btn-prev"
            onClick={() => setCurrentStep(1)}
            disabled={loading}
          >
            ← Back to Course
          </button>
          
          <button
            type="button"
            className="btn-next"
            onClick={() => setCurrentStep(3)}
            disabled={loading || units.some(unit => !unit.title || !unit.slug)}
          >
            Next: Review & Create →
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="step-container"
    >
      <h3>Step 3: Review & Create</h3>
      
      <div className="review-section">
        <div className="review-course">
          <h4>Course</h4>
          <p><strong>Title:</strong> {courseData.title}</p>
          <p><strong>Slug:</strong> {courseData.slug}</p>
          <p><strong>URL:</strong> /courses/{courseData.slug}</p>
        </div>

        <div className="review-units">
          <h4>Units ({units.filter(u => u.title).length})</h4>
          {units.filter(unit => unit.title).map((unit, index) => (
            <div key={unit.id} className="review-unit">
              <p><strong>Unit {index + 1}:</strong> {unit.title}</p>
              <p><strong>Slug:</strong> {unit.slug}</p>
              <p><strong>URL:</strong> /courses/{courseData.slug}/{unit.slug}</p>
              <p><strong>Lessons:</strong> {unit.lessons.filter(l => l.title).length}</p>
              
              {unit.lessons.filter(lesson => lesson.title).map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="review-lesson">
                  <p>• {lesson.title} ({lesson.slug})</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="step-actions">
        <button
          type="button"
          className="btn-prev"
          onClick={() => setCurrentStep(2)}
          disabled={loading}
        >
          ← Back to Units
        </button>
        
        <button
          type="button"
          className="btn-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "🎉 Create Complete Course"}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="create-course-with-units-container">
      <div className="create-course-with-units-card">
        <h2>Create Course with Custom Slugs</h2>
        
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Course</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Units</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Create</div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateCourseWithUnits;