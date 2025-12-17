
// src/pages/courses/CourseViewer.jsx - UPDATED VERSION
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "./CourseViewer.css";

const CourseViewer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCourseOwner, setIsCourseOwner] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) {
        toast.error("Course not found - invalid URL");
        navigate("/courses");
        return;
      }

      try {
        setLoading(true);
        console.log(`🔍 Fetching course with slug: ${slug}`);

        // Try multiple endpoints in sequence
        let fetchedCourse = null;
        let errorMessages = [];

        // 1. Try public endpoint
        try {
          console.log("🔄 Trying public endpoint...");
          const publicRes = await axiosInstance.get(`/courses/public/slug/${slug}`);
          if (publicRes.data?.success && publicRes.data?.course) {
            fetchedCourse = publicRes.data.course;
            console.log("✅ Course loaded via public endpoint");
          }
        } catch (publicErr) {
          errorMessages.push(`Public endpoint: ${publicErr.message}`);
          console.log("⚠️ Public endpoint failed");
        }

        // 2. Try ID endpoint (if slug is numeric)
        if (!fetchedCourse && !isNaN(slug)) {
          try {
            console.log("🔄 Trying ID endpoint...");
            const idRes = await axiosInstance.get(`/courses/id/${slug}`);
            if (idRes.data?.success && idRes.data?.course) {
              fetchedCourse = idRes.data.course;
              console.log("✅ Course loaded via ID endpoint");
            }
          } catch (idErr) {
            errorMessages.push(`ID endpoint: ${idErr.message}`);
            console.log("⚠️ ID endpoint failed");
          }
        }

        // 3. Try regular courses endpoint
        if (!fetchedCourse) {
          try {
            console.log("🔄 Trying regular endpoint...");
            const regularRes = await axiosInstance.get(`/courses/${slug}`);
            if (regularRes.data) {
              // Handle different response formats
              fetchedCourse = regularRes.data.course || regularRes.data;
              console.log("✅ Course loaded via regular endpoint");
            }
          } catch (regularErr) {
            errorMessages.push(`Regular endpoint: ${regularErr.message}`);
            console.log("⚠️ Regular endpoint failed");
          }
        }

        // 4. Try to find in courses list
        if (!fetchedCourse) {
          try {
            console.log("🔄 Searching in courses list...");
            const allCoursesRes = await axiosInstance.get("/courses");
            const coursesData = allCoursesRes.data?.courses || allCoursesRes.data;
            if (Array.isArray(coursesData)) {
              const foundCourse = coursesData.find(c => 
                c.slug === slug || c.id?.toString() === slug
              );
              if (foundCourse) {
                fetchedCourse = foundCourse;
                console.log("✅ Course found in courses list");
              }
            }
          } catch (listErr) {
            errorMessages.push(`Courses list: ${listErr.message}`);
            console.log("⚠️ Courses list endpoint failed");
          }
        }

        if (!fetchedCourse) {
          throw new Error(`Course not found. Tried: ${errorMessages.join(", ")}`);
        }

        setCourse(fetchedCourse);
        
        // Check if user is enrolled
        if (user && user.role === "student" && fetchedCourse.id) {
          await checkEnrollmentStatus(fetchedCourse.id);
        }

        // Check if user owns the course
        if (user && fetchedCourse.teacher_id) {
          setIsCourseOwner(user.id === fetchedCourse.teacher_id);
        }

      } catch (err) {
        console.error("❌ Failed to fetch course:", err);
        
        if (err.response?.status === 404) {
          toast.error("❌ Course not found.");
        } else {
          toast.error("❌ Failed to load the course.");
        }

        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, navigate, user]);

  const checkEnrollmentStatus = async (courseId) => {
    try {
      setCheckingAccess(true);
      const response = await axiosInstance.get(`/enrollments/check/${courseId}`);
      setIsEnrolled(response.data.enrolled || false);
    } catch (err) {
      console.error("Error checking enrollment:", err);
      setIsEnrolled(false);
    } finally {
      setCheckingAccess(false);
    }
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  // ============ FIXED: Redirect to REGISTER instead of LOGIN ============
  const handleEnrollNow = () => {
    if (!user) {
      // Redirect to REGISTER page, not login
      navigate("/register", { 
        state: { 
          from: `/courses/${slug}`,
          redirectMessage: "Please register as a student to enroll in this course",
          courseInfo: {
            id: course?.id,
            title: course?.title,
            price: course?.price
          }
        } 
      });
      return;
    }

    if (user.role !== "student") {
      toast.info("Only students can enroll in courses.");
      navigate("/register", {
        state: {
          redirectMessage: "Please register with a student account to enroll in courses",
          courseInfo: {
            id: course?.id,
            title: course?.title,
            price: course?.price
          }
        }
      });
      return;
    }

    if (course?.id) {
      navigate(`/payment/${course.id}`);
    } else {
      toast.error("Course information missing");
    }
  };

  const handleAccessCourse = () => {
    if (course?.id) {
      navigate(`/courses/${course.id}/view-lessons`);
    }
  };

  const handlePreviewLesson = async () => {
    if (!course?.id) {
      toast.error("Course information missing");
      return;
    }

    try {
      const response = await axiosInstance.get(`/courses/${course.id}/preview-lesson`);
      
      if (response.data.success && response.data.lesson) {
        navigate(`/preview/${response.data.lesson.id}`, {
          state: {
            lesson: response.data.lesson,
            courseId: course.id,
            courseTitle: course.title
          }
        });
      } else {
        toast.info("No preview available for this course");
      }
    } catch (err) {
      console.error("Error getting preview:", err);
      toast.error("Unable to load preview");
    }
  };

  if (loading) {
    return (
      <div className="course-viewer">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-viewer">
        <div className="error-container">
          <h2>Course Not Found</h2>
          <p>The requested course could not be found.</p>
          <button onClick={handleBackToCourses} className="btn-back">
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-viewer">
      <div className="course-header">
        <button onClick={handleBackToCourses} className="btn-back">
          ← Back to Courses
        </button>
        
        <div className="course-info">
          <h1>{course.title}</h1>
          <div className="course-meta">
            {course.teacher && (
              <span className="instructor">
                <strong>Instructor:</strong> {course.teacher.name}
              </span>
            )}
            <span className="price-tag">
              ${parseFloat(course.price || 0).toFixed(2)}
            </span>
            {isEnrolled && <span className="enrolled-badge">✓ Enrolled</span>}
            {isCourseOwner && <span className="owner-badge">👨‍🏫 Instructor</span>}
          </div>
        </div>

        <p className="course-description">{course.description || "No description available."}</p>

        <div className="course-actions">
          {isEnrolled ? (
            <button onClick={handleAccessCourse} className="btn-access" disabled={checkingAccess}>
              {checkingAccess ? "Checking..." : "Access Course"}
            </button>
          ) : (
            <>
              <button onClick={handleEnrollNow} className="btn-enroll" disabled={checkingAccess}>
                {checkingAccess ? "Checking..." : `Enroll Now - $${parseFloat(course.price || 0).toFixed(2)}`}
              </button>
              <button onClick={handlePreviewLesson} className="btn-preview">
                Free Preview
              </button>
            </>
          )}
          <button onClick={handleBackToCourses} className="btn-browse">
            Browse Other Courses
          </button>
        </div>
      </div>

      <div className="course-content">
        <h2>Course Content</h2>
        
        {course.lessons && course.lessons.length > 0 ? (
          <>
            <p className="content-info">
              {isEnrolled 
                ? `You have access to all ${course.lessons.length} lessons`
                : `Preview includes 1 lesson (${course.lessons.length} total lessons in full course)`
              }
            </p>

            <div className="lesson-list">
              {course.lessons.slice(0, isEnrolled ? course.lessons.length : 1).map((lesson, index) => (
                <div key={lesson.id || index} className={`lesson-item ${index === 0 && !isEnrolled ? 'preview-lesson' : ''}`}>
                  <div className="lesson-header">
                    <h3>
                      {lesson.title || `Lesson ${index + 1}`}
                      {index === 0 && !isEnrolled && <span className="preview-badge">Free Preview</span>}
                    </h3>
                    <span className="lesson-type">
                      {lesson.content_type === 'video' ? '🎬 Video' : 
                       lesson.content_type === 'pdf' ? '📄 PDF' : 
                       lesson.content_type === 'file' ? '📁 File' : 
                       '📝 Text'}
                    </span>
                  </div>
                  
                  {index === 0 && !isEnrolled && lesson.content && (
                    <div className="preview-content">
                      {lesson.content_type === 'text' ? (
                        <div 
                          className="lesson-content" 
                          dangerouslySetInnerHTML={{ __html: lesson.content }} 
                        />
                      ) : lesson.content_type === 'video' && lesson.video_url ? (
                        <video controls className="lesson-video">
                          <source src={lesson.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : lesson.content_type === 'pdf' && (lesson.file_url || lesson.contentUrl) ? (
                        <a 
                          href={lesson.file_url || lesson.contentUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="download-link"
                        >
                          📄 View PDF Preview
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!isEnrolled && course.lessons.length > 1 && (
              <div className="enrollment-prompt">
                <h3>🎓 Enroll to unlock all {course.lessons.length} lessons</h3>
                <p>Get full access to:</p>
                <ul>
                  <li>All lessons and exercises</li>
                  <li>Teacher support and feedback</li>
                  <li>Progress tracking and certificates</li>
                  <li>Community discussion forums</li>
                </ul>
                <button onClick={handleEnrollNow} className="btn-enroll-large">
                  Enroll Now - ${parseFloat(course.price || 0).toFixed(2)}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-lessons">
            <p>No lessons available for this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseViewer;