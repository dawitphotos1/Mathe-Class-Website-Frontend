// // src/pages/courses/CourseCard.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
// import axiosInstance from "../../utils/axiosInstance";
// import "./CourseCard.css";

// const CourseCard = ({ course, onCourseDeleted }) => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();

//   const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   // Check enrollment status
//   useEffect(() => {
//     let isMounted = true;

//     const checkEnrollmentStatus = async () => {
//       if (!user || !course?.id) return;
//       try {
//         setIsCheckingEnrollment(true);
//         const res = await axiosInstance.get(`/enrollments/check/${course.id}`);
//         if (isMounted) setIsEnrolled(res.data.enrolled || false);
//       } catch (err) {
//         if (isMounted) setIsEnrolled(false);
//         console.error("Error checking enrollment:", err);
//       } finally {
//         if (isMounted) setIsCheckingEnrollment(false);
//       }
//     };

//     checkEnrollmentStatus();
//     return () => (isMounted = false);
//   }, [user, course?.id]);

//   // Get display price
//   const getDisplayPrice = () => {
//     if (!course) return "0.00";

//     const price = course.price;
    
//     if (price === undefined || price === null) {
//       return "0.00";
//     }

//     return parseFloat(price).toFixed(2);
//   };

//   const displayPrice = getDisplayPrice();

//   const handleFreePreview = () => {
//     // Navigate to course preview page with course ID
//     navigate(`/courses/${course.id}/preview`);
//   };

//   const handleStartCourse = () => {
//     if (!isAuthenticated) {
//       toast.error("Please log in to access the course.");
//       navigate("/login", { state: { from: `/courses/${course.id}` } });
//       return;
//     }

//     if (user?.id === course.teacher_id) {
//       navigate(`/courses/${course.id}/manage`);
//       return;
//     }

//     if (isEnrolled) {
//       navigate(`/courses/${course.id}/view-lessons`);
//     } else {
//       toast.error("You are not enrolled in this course.");
//     }
//   };

//   const handleDelete = async () => {
//     setIsDeleting(true);
//     try {
//       await axiosInstance.delete(`/courses/${course.id}`);
//       toast.success("Course deleted successfully");
//       if (onCourseDeleted) onCourseDeleted(course.id);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to delete course");
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteModal(false);
//     }
//   };

//   const canAccessCourse = isEnrolled || user?.id === course.teacher_id;
//   const isTeacher = user?.role === "teacher";

//   // Get course image based on title
//   const getCourseImage = (courseTitle) => {
//     const images = {
//       "Algebra 1": "/images/math-logos/algebra1.jpeg",
//       "Algebra 2": "/images/math-logos/algebra2.png",
//       "Pre-Calculus": "/images/math-logos/Pre-calculus.jpeg",
//       Calculus: "/images/math-logos/Calculus.jpeg",
//       "Geometry & Trigonometry": "/images/math-logos/geometry.jpeg",
//       "Statistics & Probability": "/images/math-logos/statistic.png",
//     };

//     return images[courseTitle] || "/images/default-course.jpg";
//   };

//   return (
//     <div className="course-card">
//       <div className="course-image-container">
//         <img
//           src={getCourseImage(course.title)}
//           alt={course.title}
//           className="course-image"
//           onError={(e) => {
//             e.target.src = "/images/default-course.jpg";
//           }}
//         />
        
//         {isEnrolled && <div className="enrolled-badge">Enrolled</div>}
//       </div>

//       <div className="course-content">
//         <h3 className="course-title">{course.title}</h3>
//         <p className="course-description">
//           {course.description ||
//             "Learn essential mathematical concepts and techniques."}
//         </p>

//         {course.teacher && (
//           <div className="course-meta">
//             <span className="course-teacher">
//               👨‍🏫 {course.teacher.name}
//             </span>
//             <span className="course-price">${displayPrice}</span>
//           </div>
//         )}

//         {/* Free Preview Button - Always visible */}
//         <div className="preview-section">
//           <button 
//             className="preview-btn"
//             onClick={handleFreePreview}
//           >
//             🎬 Free Preview
//           </button>
//           <p className="preview-note">Explore course content before enrolling</p>
//         </div>

//         {/* Action Buttons */}
//         <div className="course-actions">
//           <Link
//             to={`/courses/${course.slug || course.id}`}
//             className="btn-details"
//           >
//             View Details
//           </Link>

//           {canAccessCourse && (
//             <button onClick={handleStartCourse} className="btn-start">
//               {isTeacher ? "Manage Course" : "Start Learning"}
//             </button>
//           )}

//           {isTeacher && user?.id === course.teacher_id && (
//             <button
//               onClick={() => setShowDeleteModal(true)}
//               className="btn-delete"
//               disabled={isDeleting}
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </button>
//           )}
//         </div>
//       </div>

//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>Confirm Delete</h3>
//             <p>
//               Are you sure you want to delete "{course.title}"? This action
//               cannot be undone.
//             </p>
//             <div className="modal-actions">
//               <button onClick={handleDelete} className="btn-danger">
//                 {isDeleting ? "Deleting..." : "Delete"}
//               </button>
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="btn-secondary"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseCard;





// src/pages/courses/CourseCard.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert
} from "@mui/material";
import { Close, Download, OpenInNew, PictureAsPdf } from "@mui/icons-material";
import "./CourseCard.css";

const CourseCard = ({ course, onCourseDeleted }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // PDF Preview States
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [checkingPreview, setCheckingPreview] = useState(false);

  // Check enrollment status
  useEffect(() => {
    let isMounted = true;

    const checkEnrollmentStatus = async () => {
      if (!user || !course?.id) return;
      try {
        setIsCheckingEnrollment(true);
        const res = await axiosInstance.get(`/enrollments/check/${course.id}`);
        if (isMounted) setIsEnrolled(res.data.enrolled || false);
      } catch (err) {
        if (isMounted) setIsEnrolled(false);
        console.error("Error checking enrollment:", err);
      } finally {
        if (isMounted) setIsCheckingEnrollment(false);
      }
    };

    checkEnrollmentStatus();
    return () => (isMounted = false);
  }, [user, course?.id]);

  // Load preview lesson - FIXED FOR STUDENT VIEW
  useEffect(() => {
    const findPreviewLesson = async () => {
      if (!course?.id) {
        console.log("No course ID available");
        return;
      }
      
      // If we already found a preview lesson in course data, use it
      if (course.preview_lesson || course.previewLesson) {
        console.log("Found preview lesson in course data:", course.preview_lesson || course.previewLesson);
        setPreviewLesson(course.preview_lesson || course.previewLesson);
        return;
      }
      
      // Try to find preview in the course structure
      if (course.lessons && Array.isArray(course.lessons)) {
        const preview = course.lessons.find(lesson => 
          lesson.is_preview && (lesson.file_url || lesson.fileUrl)
        );
        if (preview) {
          console.log("Found preview in course.lessons:", preview);
          setPreviewLesson(preview);
          return;
        }
      }
      
      // If not found, fetch course preview data
      try {
        setCheckingPreview(true);
        console.log("Fetching preview for course ID:", course.id);
        
        // Try different endpoints for preview data
        let previewData = null;
        
        try {
          // Try public preview endpoint first
          const res = await axiosInstance.get(`/courses/${course.id}/preview`);
          previewData = res.data;
          console.log("Got preview from /preview endpoint:", previewData);
        } catch (err) {
          console.log("/preview endpoint failed, trying /full:", err.message);
          
          // Try full course endpoint (might require auth)
          if (isAuthenticated) {
            try {
              const res = await axiosInstance.get(`/courses/${course.id}/full`);
              previewData = res.data.course || res.data;
              console.log("Got preview from /full endpoint:", previewData);
            } catch (fullErr) {
              console.log("/full endpoint failed:", fullErr.message);
            }
          }
        }
        
        // Look for preview lesson in the fetched data
        if (previewData) {
          // Check various possible structures
          const findLessonInData = (data) => {
            // Direct preview_lesson property
            if (data.preview_lesson && (data.preview_lesson.file_url || data.preview_lesson.fileUrl)) {
              return data.preview_lesson;
            }
            
            // Check lessons array
            if (data.lessons && Array.isArray(data.lessons)) {
              const previewLesson = data.lessons.find(lesson => 
                lesson.is_preview && (lesson.file_url || lesson.fileUrl)
              );
              if (previewLesson) return previewLesson;
            }
            
            // Check units -> lessons structure
            if (data.units && Array.isArray(data.units)) {
              for (const unit of data.units) {
                if (unit.lessons && Array.isArray(unit.lessons)) {
                  const previewLesson = unit.lessons.find(lesson => 
                    lesson.is_preview && (lesson.file_url || lesson.fileUrl)
                  );
                  if (previewLesson) return previewLesson;
                }
              }
            }
            
            return null;
          };
          
          const foundLesson = findLessonInData(previewData);
          if (foundLesson) {
            console.log("Found preview lesson:", foundLesson);
            setPreviewLesson(foundLesson);
          } else {
            console.log("No preview lesson found in data");
            setPreviewLesson(null);
          }
        } else {
          console.log("No preview data available");
          setPreviewLesson(null);
        }
        
      } catch (error) {
        console.error("Error finding preview lesson:", error);
        setPreviewLesson(null);
      } finally {
        setCheckingPreview(false);
      }
    };

    findPreviewLesson();
  }, [course?.id, isAuthenticated, course]);

  // Get display price
  const getDisplayPrice = () => {
    if (!course) return "0.00";

    const price = course.price;
    
    if (price === undefined || price === null) {
      return "0.00";
    }

    return parseFloat(price).toFixed(2);
  };

  const displayPrice = getDisplayPrice();

  // Handle Free Preview Click - SIMPLIFIED VERSION
  const handleFreePreview = async () => {
    console.log("Free Preview clicked for course:", course.title);
    
    if (!previewLesson) {
      console.log("No preview lesson available");
      toast.info("No preview content available for this course yet.");
      return;
    }
    
    console.log("Preview lesson found:", previewLesson);
    
    // Get the file URL from the lesson
    const fileUrl = previewLesson.file_url || previewLesson.fileUrl;
    
    if (!fileUrl) {
      console.error("No file URL in preview lesson");
      toast.error("Preview file not found.");
      return;
    }
    
    console.log("Opening preview with file URL:", fileUrl);
    
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError(null);
    
    // Generate Google Docs Viewer URL for preview
    try {
      const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      console.log("Google Docs Viewer URL:", googleViewerUrl);
      setPreviewUrl(googleViewerUrl);
      
      // Auto-hide loading after timeout
      setTimeout(() => {
        setPreviewLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      setPreviewError("Failed to create preview. Please try again.");
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewLoading(false);
    setPreviewError(null);
    setPreviewUrl(null);
  };

  const handlePreviewDownload = () => {
    if (previewLesson) {
      const fileUrl = previewLesson.file_url || previewLesson.fileUrl;
      if (fileUrl) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `${previewLesson.title.replace(/[^a-z0-9]/gi, '_') || 'preview'}.pdf`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handlePreviewOpenInNewTab = () => {
    if (previewLesson) {
      const fileUrl = previewLesson.file_url || previewLesson.fileUrl;
      if (fileUrl) {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleIframeLoad = () => {
    console.log('✅ Preview loaded successfully');
    setPreviewLoading(false);
  };

  const handleIframeError = (e) => {
    console.error('❌ Preview loading error:', e);
    setPreviewError('Failed to load preview. Try opening in a new tab.');
    setPreviewLoading(false);
  };

  const handleStartCourse = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to access the course.");
      navigate("/login", { state: { from: `/courses/${course.id}` } });
      return;
    }

    if (user?.id === course.teacher_id) {
      navigate(`/courses/${course.id}/manage`);
      return;
    }

    if (isEnrolled) {
      navigate(`/courses/${course.id}/view-lessons`);
    } else {
      toast.error("You are not enrolled in this course.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/courses/${course.id}`);
      toast.success("Course deleted successfully");
      if (onCourseDeleted) onCourseDeleted(course.id);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete course");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const canAccessCourse = isEnrolled || user?.id === course.teacher_id;
  const isTeacher = user?.role === "teacher";

  // Get course image based on title
  const getCourseImage = (courseTitle) => {
    const images = {
      "Algebra 1": "/images/math-logos/algebra1.jpeg",
      "Algebra 2": "/images/math-logos/algebra2.png",
      "Pre-Calculus": "/images/math-logos/Pre-calculus.jpeg",
      Calculus: "/images/math-logos/Calculus.jpeg",
      "Geometry & Trigonometry": "/images/math-logos/geometry.jpeg",
      "Statistics & Probability": "/images/math-logos/statistic.png",
    };

    return images[courseTitle] || "/images/default-course.jpg";
  };

  // Debug: Log course data
  useEffect(() => {
    console.log("Course data for", course?.title, ":", course);
    console.log("Preview lesson state:", previewLesson);
  }, [course, previewLesson]);

  return (
    <div className="course-card">
      <div className="course-image-container">
        <img
          src={getCourseImage(course.title)}
          alt={course.title}
          className="course-image"
          onError={(e) => {
            e.target.src = "/images/default-course.jpg";
          }}
        />
        
        {isEnrolled && <div className="enrolled-badge">Enrolled</div>}
      </div>

      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description ||
            "Learn essential mathematical concepts and techniques."}
        </p>

        {course.teacher && (
          <div className="course-meta">
            <span className="course-teacher">
              👨‍🏫 {course.teacher.name}
            </span>
            <span className="course-price">${displayPrice}</span>
          </div>
        )}

        {/* Free Preview Button */}
        <div className="preview-section">
          <button 
            className="preview-btn"
            onClick={handleFreePreview}
            disabled={checkingPreview || !previewLesson}
          >
            {checkingPreview ? (
              <>
                <CircularProgress size={16} style={{ marginRight: '8px', color: 'white' }} />
                Checking...
              </>
            ) : previewLesson ? (
              <>
                <PictureAsPdf style={{ marginRight: '8px', fontSize: '18px' }} />
                Free PDF Preview
              </>
            ) : (
              "🎬 Free Preview"
            )}
          </button>
          <p className="preview-note">
            {previewLesson 
              ? "Preview course materials before enrolling" 
              : "No PDF preview available yet"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="course-actions">
          <Link
            to={`/courses/${course.slug || course.id}`}
            className="btn-details"
          >
            View Details
          </Link>

          {canAccessCourse && (
            <button onClick={handleStartCourse} className="btn-start">
              {isTeacher ? "Manage Course" : "Start Learning"}
            </button>
          )}

          {isTeacher && user?.id === course.teacher_id && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-delete"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '70vh',
            maxHeight: '85vh',
            '& .MuiDialogContent-root': {
              padding: 0
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          m: 0, 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Box component="div" sx={{ flex: 1 }}>
            <Typography variant="h6" noWrap>
              📄 {previewLesson?.title || 'Course Preview'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {course.title} • Free Preview
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClosePreview} 
            size="small"
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0, position: 'relative', minHeight: '60vh' }}>
          {previewLoading && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 10 
            }}>
              <CircularProgress size={50} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading Preview...
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Powered by Google Docs Viewer
              </Typography>
            </Box>
          )}

          {previewError && (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Alert severity="warning" sx={{ mb: 2, maxWidth: '400px' }}>
                <Typography variant="h6" gutterBottom>
                  Preview Unavailable
                </Typography>
                <Typography variant="body2">
                  {previewError}
                </Typography>
              </Alert>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  onClick={handlePreviewOpenInNewTab}
                  startIcon={<OpenInNew />}
                >
                  Open in New Tab
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleFreePreview}
                >
                  Try Again
                </Button>
              </Box>
            </Box>
          )}

          {/* PDF Preview Iframe */}
          {previewUrl && !previewError && (
            <iframe
              src={previewUrl}
              title={`PDF Preview - ${previewLesson?.title || 'Course Preview'}`}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '60vh',
                border: 'none',
                display: 'block'
              }}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-popups"
              allow="fullscreen"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          )}
        </DialogContent>

        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
            {previewLesson 
              ? `Previewing: ${previewLesson.title}` 
              : 'Course Material Preview'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              startIcon={<Download />}
              onClick={handlePreviewDownload}
              variant="contained"
              color="primary"
              size="small"
              disabled={!previewLesson}
            >
              Download
            </Button>
            <Button 
              onClick={handlePreviewOpenInNewTab}
              variant="outlined"
              size="small"
              startIcon={<OpenInNew />}
              disabled={!previewLesson}
            >
              Open Full
            </Button>
            <Button 
              onClick={handleClosePreview} 
              variant="outlined"
              size="small"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete "{course.title}"? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-danger">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;