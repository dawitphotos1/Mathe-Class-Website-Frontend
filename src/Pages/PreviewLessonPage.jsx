// // src/pages/PreviewLessonPage.jsx - UPDATED & FIXED VERSION
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext";
// import axiosInstance from '../utils/axiosInstance';
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Button,
//   Container,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   LinearProgress,
//   Chip,
//   Card,
//   CardContent,
// } from "@mui/material";
// import {
//   ArrowBack,
//   PictureAsPdf,
//   VideoLibrary,
//   Description,
//   Close,
//   Download,
//   OpenInNew,
//   School,
//   Error as ErrorIcon,
//   Dashboard,
//   MenuBook,
//   Login,
//   PersonAdd,
//   Lock,
//   CheckCircle,
// } from "@mui/icons-material";
// import "./PreviewLessonPage.css";

// const PreviewLessonPage = () => {
//   const { lessonId, courseId: urlCourseId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, isAuthenticated } = useAuth();
  
//   const [lesson, setLesson] = useState(null);
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [isUserEnrolled, setIsUserEnrolled] = useState(false);
//   const [isUserTeacher, setIsUserTeacher] = useState(false);
//   const [isCourseOwner, setIsCourseOwner] = useState(false);
//   const [enrollmentChecking, setEnrollmentChecking] = useState(false);
//   const [isPreviewLesson, setIsPreviewLesson] = useState(false);

//   // Get courseId from multiple possible sources
//   const getCourseId = () => {
//     if (course?.id) return course.id;
//     if (urlCourseId) return urlCourseId;
//     if (lesson?.course_id || lesson?.courseId) return lesson.course_id || lesson.courseId;
//     return null;
//   };

//   const currentCourseId = getCourseId();

//   // Check if user is enrolled or is teacher
//   useEffect(() => {
//     const checkUserAccess = async () => {
//       if (!user || !currentCourseId) return;
      
//       try {
//         setEnrollmentChecking(true);
        
//         // Check if user is enrolled (for students only)
//         if (user.role === "student") {
//           try {
//             const enrollmentRes = await axiosInstance.get(
//               `/enrollments/check/${currentCourseId}`
//             );
//             setIsUserEnrolled(enrollmentRes.data.enrolled || false);
//           } catch (err) {
//             console.error("Error checking enrollment:", err);
//             setIsUserEnrolled(false);
//           }
//         }
        
//         // Check if user is teacher or admin
//         setIsUserTeacher(user.role === "teacher" || user.role === "admin");
        
//         // Check if user owns this course
//         if (course && course.teacher_id) {
//           setIsCourseOwner(user.id === course.teacher_id);
//         }
//       } catch (err) {
//         console.error("Error checking user access:", err);
//       } finally {
//         setEnrollmentChecking(false);
//       }
//     };
    
//     checkUserAccess();
//   }, [user, currentCourseId, course]);

//   useEffect(() => {
//     const fetchPreviewData = async () => {
//       try {
//         setLoading(true);
//         setError("");
        
//         console.log(`🔍 Preview Mode:`, {
//           urlCourseId,
//           lessonId,
//           locationState: location.state,
//           userRole: user?.role,
//         });

//         // CASE 1: If lesson data was passed via state, use it
//         if (location.state?.lesson) {
//           console.log("📦 Using lesson from state:", location.state.lesson);
//           setLesson(location.state.lesson);
//           setIsPreviewLesson(location.state.lesson.isPreview || location.state.lesson.is_preview || false);
          
//           if (location.state.course) {
//             setCourse(location.state.course);
//           }
//           setLoading(false);
//           return;
//         }

//         // CASE 2: We have a lessonId - fetch specific lesson
//         if (lessonId) {
//           console.log(`📖 Fetching lesson ${lessonId}...`);
//           try {
//             const response = await axiosInstance.get(`/lessons/${lessonId}`);
//             if (response.data.success && response.data.lesson) {
//               const lessonData = response.data.lesson;
//               setLesson(lessonData);
//               setIsPreviewLesson(lessonData.isPreview || lessonData.is_preview || false);
//               console.log("✅ Lesson loaded:", lessonData);
              
//               // If we have a courseId from the lesson, fetch course details
//               if (lessonData.courseId || lessonData.course_id) {
//                 const courseIdToFetch = lessonData.courseId || lessonData.course_id;
//                 try {
//                   const courseResponse = await axiosInstance.get(`/courses/id/${courseIdToFetch}`);
//                   if (courseResponse.data.success && courseResponse.data.course) {
//                     setCourse(courseResponse.data.course);
//                     console.log("✅ Course loaded from lesson:", courseResponse.data.course);
//                   }
//                 } catch (courseError) {
//                   console.error("Error fetching course from lesson:", courseError);
//                 }
//               }
//             } else {
//               throw new Error(response.data.error || "Lesson not found");
//             }
//           } catch (lessonError) {
//             console.error("Error fetching lesson:", lessonError);
//             throw lessonError;
//           }
//         }

//         // CASE 3: We have a courseId from URL - fetch preview lesson
//         if (urlCourseId && !lesson) {
//           console.log(`🏫 Fetching preview for course ${urlCourseId}...`);
          
//           // Step 1: Get course details
//           try {
//             const courseResponse = await axiosInstance.get(`/courses/id/${urlCourseId}`);
//             if (courseResponse.data.success && courseResponse.data.course) {
//               const courseData = courseResponse.data.course;
//               setCourse(courseData);
//               console.log("✅ Course loaded:", courseData);
              
//               // Check if current user is the course owner
//               if (user && courseData.teacher_id) {
//                 setIsCourseOwner(user.id === courseData.teacher_id);
//               }
//             }
//           } catch (courseError) {
//             console.error("Error fetching course:", courseError);
//           }
          
//           // Step 2: Fetch preview lesson using the dedicated endpoint
//           try {
//             console.log("🔍 Trying /courses/:id/preview-lesson endpoint...");
//             const previewResponse = await axiosInstance.get(
//               `/courses/${urlCourseId}/preview-lesson`
//             );
            
//             if (previewResponse.data.success && previewResponse.data.lesson) {
//               const previewLesson = previewResponse.data.lesson;
//               setLesson(previewLesson);
//               setIsPreviewLesson(previewLesson.isPreview || previewLesson.is_preview || false);
//               console.log("✅ Found preview via /preview-lesson endpoint:", previewLesson);
              
//               // Also update course data if not already set
//               if (previewResponse.data.course && !course) {
//                 setCourse(previewResponse.data.course);
//               }
//             } else {
//               throw new Error(previewResponse.data.error || "No preview available");
//             }
//           } catch (previewError) {
//             console.error("Preview endpoint failed:", previewError.message);
            
//             // Fallback: Try to get all lessons and use first one
//             try {
//               console.log("🔄 Fallback: Trying to get all lessons...");
//               const lessonsResponse = await axiosInstance.get(
//                 `/courses/${urlCourseId}/lessons`
//               );
              
//               if (lessonsResponse.data.success && lessonsResponse.data.lessons?.length > 0) {
//                 const firstLesson = lessonsResponse.data.lessons[0];
//                 setLesson(firstLesson);
//                 setIsPreviewLesson(false); // Not explicitly marked as preview
//                 console.log("📋 Using first lesson as fallback:", firstLesson);
                
//                 toast.info("Showing first lesson as preview (no designated preview lesson found)");
//               } else {
//                 throw new Error("No lessons found for this course");
//               }
//             } catch (lessonsError) {
//               console.error("Lessons endpoint failed:", lessonsError);
//               throw new Error("Unable to load any lesson content for this course");
//             }
//           }
//         }
//       } catch (error) {
//         console.error("❌ Error loading preview:", error);
//         setError(
//           error.message ||
//           "Unable to load the preview. Please try again or contact support."
//         );
//         toast.error("Failed to load preview content");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchPreviewData();
//   }, [lessonId, urlCourseId, location.state, user]);

//   // Determine if we should show enrollment messaging
//   const shouldShowEnrollmentMessaging = () => {
//     // Don't show enrollment messaging for:
//     // 1. Enrolled students
//     // 2. Course owners (teachers who own the course)
//     // 3. Admins
//     if (!user) return true; // Show for non-logged in users
//     if (isUserEnrolled) return false;
//     if (isCourseOwner) return false;
//     if (user.role === "admin") return false;
    
//     return true; // Show for non-enrolled students and non-owning teachers
//   };

//   const handleBackToCourses = () => {
//     navigate("/courses");
//   };

//   const handleAccessCourse = () => {
//     const courseIdToUse = currentCourseId;
//     if (!courseIdToUse) {
//       console.error("Course ID is missing:", { currentCourseId, course, lesson });
//       toast.error("Course information missing. Please try again.");
//       return;
//     }
    
//     console.log("Access Course clicked:", {
//       courseId: courseIdToUse,
//       userRole: user?.role,
//       isEnrolled: isUserEnrolled,
//       isCourseOwner: isCourseOwner,
//     });
    
//     if (isUserEnrolled) {
//       // Enrolled student: Navigate to course viewer
//       navigate(`/courses/${courseIdToUse}/view-lessons`);
//     } else if (isCourseOwner || (isUserTeacher && user.role === "admin")) {
//       // Teacher or course owner: Navigate to appropriate view
//       if (isCourseOwner) {
//         // Teacher owns the course - go to course management
//         navigate(`/courses/${courseIdToUse}/manage-lessons`);
//       } else {
//         // Teacher doesn't own this course - go to teacher view
//         navigate(`/teacher/courses/${courseIdToUse}/view`);
//       }
//     } else {
//       // Not enrolled, not a teacher - navigate to enrollment
//       handleEnrollNow();
//     }
//   };

//   // Handle enrollment action
//   const handleEnrollNow = () => {
//     if (!currentCourseId) {
//       toast.error("Course information missing");
//       return;
//     }
    
//     if (!user) {
//       // For non-logged in users, redirect to login
//       navigate("/login", {
//         state: {
//           from: `/preview/${lessonId || urlCourseId}`,
//           redirectMessage: "Please log in to enroll in this course",
//           redirectTo: `/payment/${currentCourseId}`
//         }
//       });
//       return;
//     }
    
//     if (user.role !== "student") {
//       toast.info("Only students can enroll in courses.");
//       return;
//     }
    
//     // Navigate to payment page
//     navigate(`/payment/${currentCourseId}`);
//   };

//   const handleLoginForEnrollment = () => {
//     navigate("/login", {
//       state: {
//         from: `/preview/${lessonId || urlCourseId}`,
//         redirectMessage: "Please log in to enroll in this course",
//         redirectTo: `/payment/${currentCourseId}`
//       }
//     });
//   };

//   const handleRegisterForEnrollment = () => {
//     navigate("/register", {
//       state: {
//         from: `/preview/${lessonId || urlCourseId}`,
//         redirectMessage: "Register to enroll in this course",
//         redirectTo: `/payment/${currentCourseId}`
//       }
//     });
//   };

//   const handleOpenPdfDialog = () => {
//     if (lesson?.fileUrl || lesson?.file_url) {
//       const fileUrl = lesson.fileUrl || lesson.file_url;
      
//       // Use Google Docs Viewer for better compatibility
//       const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
//         fileUrl
//       )}&embedded=true`;
      
//       setPreviewUrl(googleViewerUrl);
//       setPdfDialogOpen(true);
//     } else {
//       toast.warning("No PDF available for this lesson");
//     }
//   };

//   const handleDownloadPdf = () => {
//     if (lesson?.fileUrl || lesson?.file_url) {
//       const fileUrl = lesson.fileUrl || lesson.file_url;
//       const link = document.createElement("a");
//       link.href = fileUrl;
//       link.download = `${lesson.title.replace(/[^a-z0-9]/gi, "_") || "preview"}.pdf`;
//       link.target = "_blank";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleOpenInNewTab = () => {
//     if (lesson?.fileUrl || lesson?.file_url) {
//       const fileUrl = lesson.fileUrl || lesson.file_url;
//       window.open(fileUrl, "_blank", "noopener,noreferrer");
//     }
//   };

//   const renderLessonContent = () => {
//     if (!lesson) {
//       return (
//         <Box sx={{ textAlign: "center", py: 4 }}>
//           <Description sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
//           <Typography variant="h6" color="textSecondary">
//             Preview content not available
//           </Typography>
//           <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//             This course doesn't have any preview content yet.
//           </Typography>
//         </Box>
//       );
//     }
    
//     const contentType = lesson.contentType || lesson.content_type || "text";
//     const fileUrl = lesson.fileUrl || lesson.file_url;
//     const videoUrl = lesson.videoUrl || lesson.video_url;
    
//     switch (contentType.toLowerCase()) {
//       case "video":
//         return (
//           <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
//             <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
//               🎬 Video Preview
//             </Typography>
//             {videoUrl ? (
//               <Box
//                 component="video"
//                 controls
//                 src={videoUrl}
//                 sx={{
//                   width: "100%",
//                   maxHeight: "500px",
//                   borderRadius: 1,
//                   backgroundColor: "#000",
//                 }}
//               />
//             ) : (
//               <Alert severity="info">
//                 <Typography>Video content not available for preview</Typography>
//               </Alert>
//             )}
//           </Box>
//         );
      
//       case "pdf":
//       case "file":
//         return (
//           <Box sx={{ width: "100%", textAlign: "center" }}>
//             <Box sx={{ mb: 3 }}>
//               <PictureAsPdf
//                 sx={{
//                   fontSize: 80,
//                   color: "#f44336",
//                   mb: 2,
//                 }}
//               />
//               <Typography variant="h6" gutterBottom>
//                 📄 {shouldShowEnrollmentMessaging() ? "PDF Preview Available" : "Course Material"}
//               </Typography>
//               <Typography variant="body2" color="textSecondary" paragraph>
//                 {shouldShowEnrollmentMessaging()
//                   ? "Click below to view the course material preview"
//                   : "Access the full course material below"}
//               </Typography>
//             </Box>
//             <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
//               <Button
//                 variant="contained"
//                 startIcon={<PictureAsPdf />}
//                 onClick={handleOpenPdfDialog}
//                 size="large"
//               >
//                 {shouldShowEnrollmentMessaging() ? "View PDF Preview" : "Open Material"}
//               </Button>
//               <Button
//                 variant="outlined"
//                 startIcon={<OpenInNew />}
//                 onClick={handleOpenInNewTab}
//                 size="large"
//               >
//                 Open in New Tab
//               </Button>
//             </Box>
//             <Typography variant="caption" color="textSecondary" sx={{ mt: 3, display: "block" }}>
//               {isPreviewLesson ? "Preview: " : ""}{lesson.title}
//             </Typography>
//           </Box>
//         );
      
//       case "text":
//       default:
//         return (
//           <Paper sx={{ p: 4, maxHeight: "500px", overflow: "auto" }}>
//             <Typography variant="h5" gutterBottom>
//               {lesson.title}
//               {isPreviewLesson && (
//                 <Chip 
//                   label="Free Preview" 
//                   color="primary" 
//                   size="small" 
//                   sx={{ ml: 2, verticalAlign: 'middle' }}
//                 />
//               )}
//             </Typography>
//             {lesson.textContent || lesson.content ? (
//               <Box
//                 component="div"
//                 sx={{
//                   "& h1, & h2, & h3": { mt: 2, mb: 1 },
//                   "& p": { mb: 2 },
//                   "& ul, & ol": { pl: 3, mb: 2 },
//                 }}
//                 dangerouslySetInnerHTML={{ 
//                   __html: lesson.textContent || lesson.content || "" 
//                 }}
//               />
//             ) : (
//               <Alert severity="info">
//                 <Typography>Text content not available for preview</Typography>
//               </Alert>
//             )}
//           </Paper>
//         );
//     }
//   };

//   // Render header based on user role
//   const renderHeader = () => {
//     if (shouldShowEnrollmentMessaging()) {
//       return (
//         <Paper sx={{ p: 3, backgroundColor: "#e3f2fd", mb: 3 }}>
//           <Typography variant="h4" gutterBottom>
//             {isPreviewLesson ? "🎬 Free Preview" : "👀 Course Preview"}
//           </Typography>
//           <Typography variant="body1" paragraph>
//             {isPreviewLesson 
//               ? "This is a free preview of the course content. Enroll for full access!"
//               : "Previewing course content. Enroll for full access to all lessons!"}
//           </Typography>
//           {!user && (
//             <Alert severity="info" sx={{ mt: 2 }}>
//               <Typography variant="body2">
//                 <strong>Note:</strong> You need to log in to enroll in this course.
//               </Typography>
//             </Alert>
//           )}
//         </Paper>
//       );
//     } else {
//       return (
//         <Paper sx={{ p: 3, backgroundColor: "#e8f5e9", mb: 3 }}>
//           <Typography variant="h4" gutterBottom>
//             📚 Course Material
//           </Typography>
//           <Typography variant="body1" paragraph>
//             {isUserEnrolled
//               ? "You have full access to this course."
//               : isCourseOwner
//               ? "You are the instructor for this course."
//               : "You have access to this material."}
//           </Typography>
//         </Paper>
//       );
//     }
//   };

//   // Render action buttons based on user role
//   const renderActionButtons = () => {
//     if (shouldShowEnrollmentMessaging()) {
//       // For users who should see enrollment messaging
//       if (!user) {
//         // Non-logged in users
//         return (
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             <Typography variant="body1" color="textSecondary" align="center">
//               Log in or register to enroll in this course
//             </Typography>
//             <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//               <Button
//                 variant="outlined"
//                 onClick={handleBackToCourses}
//                 startIcon={<School />}
//                 sx={{ flex: 1 }}
//               >
//                 Browse More Courses
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleLoginForEnrollment}
//                 startIcon={<Login />}
//                 sx={{ flex: 1 }}
//                 size="large"
//               >
//                 Log In to Enroll
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={handleRegisterForEnrollment}
//                 startIcon={<PersonAdd />}
//                 sx={{ flex: 1 }}
//                 size="large"
//               >
//                 Register
//               </Button>
//             </Box>
//           </Box>
//         );
//       } else if (user.role === "student" && !isUserEnrolled) {
//         // Logged in student (not enrolled)
//         return (
//           <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//             <Button
//               variant="outlined"
//               onClick={handleBackToCourses}
//               startIcon={<School />}
//             >
//               Browse More Courses
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleEnrollNow}
//               sx={{ flexGrow: 1 }}
//               size="large"
//             >
//               Enroll Now for Full Access
//             </Button>
//           </Box>
//         );
//       } else if (user.role !== "student") {
//         // Users who are not students (teachers/admins)
//         return (
//           <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//             <Button
//               variant="outlined"
//               onClick={handleBackToCourses}
//               startIcon={<School />}
//             >
//               Browse More Courses
//             </Button>
//             <Alert severity="info" sx={{ width: "100%" }}>
//               <Typography>
//                 <strong>Teacher/Admin Access:</strong> You can access course management features.
//               </Typography>
//             </Alert>
//           </Box>
//         );
//       }
//     } else {
//       // Users who should NOT see enrollment messaging
//       let buttonText = "View Course";
//       let buttonIcon = <MenuBook />;
      
//       if (isUserEnrolled) {
//         buttonText = "Access Full Course";
//         buttonIcon = <MenuBook />;
//       } else if (isCourseOwner) {
//         buttonText = "Manage Course";
//         buttonIcon = <Dashboard />;
//       } else if (isUserTeacher) {
//         buttonText = "View Course Details";
//         buttonIcon = <Description />;
//       }
      
//       return (
//         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//           <Button
//             variant="outlined"
//             onClick={handleBackToCourses}
//             startIcon={<School />}
//           >
//             Back to Courses
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleAccessCourse}
//             sx={{ flexGrow: 1 }}
//             size="large"
//             startIcon={buttonIcon}
//             disabled={enrollmentChecking}
//           >
//             {enrollmentChecking ? "Checking Access..." : buttonText}
//           </Button>
//         </Box>
//       );
//     }
//   };

//   // Render user status badge
//   const renderUserStatus = () => {
//     if (!user) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
//           <Chip
//             label="Guest User"
//             color="default"
//             size="small"
//             variant="outlined"
//           />
//         </Box>
//       );
//     }
    
//     let statusText = "";
//     let color = "default";
    
//     if (isUserEnrolled) {
//       statusText = "Enrolled Student";
//       color = "success";
//     } else if (isCourseOwner) {
//       statusText = "Course Instructor";
//       color = "primary";
//     } else if (isUserTeacher) {
//       statusText = "Teacher/Admin";
//       color = "secondary";
//     } else if (user.role === "student") {
//       statusText = "Student (Not Enrolled)";
//       color = "info";
//     }
    
//     if (statusText) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
//           <Chip
//             label={statusText}
//             color={color}
//             size="small"
//             variant="outlined"
//           />
//         </Box>
//       );
//     }
    
//     return null;
//   };

//   // PDF Preview Dialog
//   const renderPdfDialog = () => (
//     <Dialog
//       open={pdfDialogOpen}
//       onClose={() => setPdfDialogOpen(false)}
//       maxWidth="lg"
//       fullWidth
//       PaperProps={{
//         sx: {
//           minHeight: "70vh",
//           maxHeight: "85vh",
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           m: 0,
//           p: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           borderBottom: "1px solid #e0e0e0",
//           backgroundColor: "#f5f5f5",
//         }}
//       >
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h6" noWrap>
//             📄 {lesson?.title || "PDF Preview"}
//           </Typography>
//           <Typography variant="caption" color="textSecondary">
//             {course?.title || "Course Preview"} • {shouldShowEnrollmentMessaging() ? "Free Preview" : "Full Access"}
//           </Typography>
//         </Box>
//         <IconButton
//           onClick={() => setPdfDialogOpen(false)}
//           size="small"
//           aria-label="close"
//         >
//           <Close />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent dividers sx={{ p: 0, position: "relative", height: "60vh" }}>
//         {previewUrl && (
//           <iframe
//             src={previewUrl}
//             title={`PDF Preview - ${lesson?.title || "Course Material"}`}
//             style={{
//               width: "100%",
//               height: "100%",
//               border: "none",
//             }}
//             sandbox="allow-same-origin allow-scripts allow-popups"
//             allow="fullscreen"
//             referrerPolicy="no-referrer"
//           />
//         )}
//       </DialogContent>
//       <Box
//         sx={{
//           p: 2,
//           borderTop: "1px solid #e0e0e0",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: 1,
//           backgroundColor: "#f5f5f5",
//         }}
//       >
//         <Typography variant="caption" color="textSecondary">
//           {shouldShowEnrollmentMessaging()
//             ? "Preview powered by Google Docs Viewer"
//             : "Full access material"}
//         </Typography>
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <Button
//             startIcon={<Download />}
//             onClick={handleDownloadPdf}
//             variant="contained"
//             color="primary"
//             size="small"
//           >
//             Download
//           </Button>
//           <Button
//             onClick={() => setPdfDialogOpen(false)}
//             variant="outlined"
//             size="small"
//           >
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Dialog>
//   );

//   if (loading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ mt: 3 }}>
//           Loading {shouldShowEnrollmentMessaging() ? "preview" : "material"}...
//         </Typography>
//         <LinearProgress sx={{ mt: 2, width: "50%", mx: "auto" }} />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         <Button
//           startIcon={<ArrowBack />}
//           onClick={handleBackToCourses}
//           sx={{ mb: 3 }}
//         >
//           Back to Courses
//         </Button>
//         <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             {shouldShowEnrollmentMessaging() ? "Preview" : "Content"} Unavailable
//           </Typography>
//           <Typography>{error}</Typography>
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* Back Button */}
//       <Button
//         startIcon={<ArrowBack />}
//         onClick={handleBackToCourses}
//         sx={{ mb: 2 }}
//       >
//         Back to Courses
//       </Button>

//       {/* User Status Badge */}
//       {renderUserStatus()}

//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         {renderHeader()}
        
//         {course && (
//           <Card sx={{ mb: 2 }}>
//             <CardContent>
//               <Typography variant="h5" gutterBottom>
//                 {course.title}
//                 {isPreviewLesson && (
//                   <Chip 
//                     label="Free Preview Available" 
//                     color="primary" 
//                     size="small" 
//                     sx={{ ml: 2, verticalAlign: 'middle' }}
//                   />
//                 )}
//               </Typography>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   {course.teacher && (
//                     <Typography variant="body2" color="textSecondary">
//                       Instructor: <strong>{course.teacher.name}</strong>
//                     </Typography>
//                   )}
//                   <Typography variant="body2" color="textSecondary">
//                     Price: <strong>${parseFloat(course.price || 0).toFixed(2)}</strong>
//                   </Typography>
//                   {lesson && (
//                     <Typography variant="body2" color="textSecondary">
//                       Preview: <strong>{lesson.title}</strong>
//                     </Typography>
//                   )}
//                 </Box>
//                 {!shouldShowEnrollmentMessaging() && !isUserEnrolled && (
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     size="small"
//                     onClick={() => navigate(`/courses/${course.slug || course.id}`)}
//                   >
//                     View Course Details
//                   </Button>
//                 )}
//               </Box>
//             </CardContent>
//           </Card>
//         )}
//       </Box>

//       {/* Preview Content */}
//       <Box sx={{ mb: 4 }}>
//         {renderLessonContent()}
//       </Box>

//       {/* Conditional Messaging */}
//       {shouldShowEnrollmentMessaging() ? (
//         <Paper sx={{ p: 4, backgroundColor: "#fff8e1", mb: 4 }}>
//           <Typography variant="h6" gutterBottom sx={{ color: "#e65100" }}>
//             ⚠️ Preview Limitations
//           </Typography>
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="body2" paragraph>
//               • {isPreviewLesson ? "Only one lesson is available for preview" : "Previewing available content"}
//             </Typography>
//             <Typography variant="body2" paragraph>
//               • Full course includes all lessons and exercises
//             </Typography>
//             <Typography variant="body2" paragraph>
//               • Enroll for complete access and teacher support
//             </Typography>
//             {!user && (
//               <Alert severity="warning" sx={{ mt: 2 }}>
//                 <Typography variant="body2">
//                   <strong>Important:</strong> You need to log in and make payment to get full access to this course.
//                 </Typography>
//               </Alert>
//             )}
//           </Box>
//           {renderActionButtons()}
//         </Paper>
//       ) : (
//         <Paper sx={{ p: 4, backgroundColor: "#f1f8e9", mb: 4 }}>
//           <Typography variant="h6" gutterBottom sx={{ color: "#2e7d32" }}>
//             ✅ Full Access Granted
//           </Typography>
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="body2" paragraph>
//               • You have full access to all course materials
//             </Typography>
//             <Typography variant="body2" paragraph>
//               • Access all lessons, exercises, and resources
//             </Typography>
//             <Typography variant="body2" paragraph>
//               • {isCourseOwner ? "Manage your course content" : "Get teacher support when needed"}
//             </Typography>
//           </Box>
//           {renderActionButtons()}
//         </Paper>
//       )}

//       {/* PDF Dialog */}
//       {renderPdfDialog()}
//     </Container>
//   );
// };

// export default PreviewLessonPage;




// src/pages/PreviewLessonPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance"; // ✅ Updated import
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import {
  Description,
  VideoLibrary,
  ArrowBack,
  Download,
  Visibility,
  School,
  Book,
  Error as ErrorIcon,
} from "@mui/icons-material";
import "./PreviewLessonPage.css";

const PreviewLessonPage = () => {
  const { courseId, slug, lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log("🔍 Preview Mode:", {
      courseId,
      slug,
      lessonId,
      userRole: user?.role,
      isTeacher: user?.role === "teacher",
      locationState: location.state,
      pathname: location.pathname,
    });
  }, [courseId, slug, lessonId, user, location]);

  useEffect(() => {
    fetchPreviewLesson();
  }, [courseId, slug, lessonId]);

  const fetchPreviewLesson = async () => {
    try {
      setLoading(true);
      setError("");

      let apiUrl = "";
      let params = {};

      // Determine API endpoint based on available parameters
      if (lessonId) {
        // Direct lesson preview
        apiUrl = `/lessons/${lessonId}/public-preview`;
        console.log(`📥 Fetching direct lesson preview: ${lessonId}`);
      } else if (courseId) {
        // Course preview
        apiUrl = `/courses/${courseId}/preview-lesson`;
        console.log(`📥 Fetching course preview for ID: ${courseId}`);
      } else if (slug) {
        // Get course ID from slug first
        try {
          const courseResponse = await axiosInstance.get(`/courses/slug/${slug}`);
          if (courseResponse.data.success) {
            const courseData = courseResponse.data.course;
            apiUrl = `/courses/${courseData.id}/preview-lesson`;
            console.log(`📥 Found course ID ${courseData.id} for slug: ${slug}`);
          }
        } catch (slugError) {
          console.error("Error getting course from slug:", slugError);
          // Try alternative endpoint
          apiUrl = `/courses/public/slug/${slug}/preview`;
        }
      }

      if (!apiUrl) {
        throw new Error("No valid preview endpoint found");
      }

      console.log(`🌐 Calling API: ${apiUrl}`);
      const response = await axiosInstance.get(apiUrl); // ✅ Updated to axiosInstance

      if (response.data.success) {
        const { lesson: lessonData, course: courseData } = response.data;
        
        console.log("📦 Preview Data Received:", {
          lessonTitle: lessonData?.title,
          lessonId: lessonData?.id,
          hasFile: !!lessonData?.fileUrl,
          hasVideo: !!lessonData?.videoUrl,
          isPreview: lessonData?.isPreview,
          courseTitle: courseData?.title,
        });

        setLesson(lessonData);
        setCourse(courseData);
        
        // Check if user is teacher viewing their own course
        if (user?.role === "teacher" && courseData?.teacher_id === user.id) {
          console.log("👨🏫 Teacher viewing own course - showing preview content");
          setIsPreviewMode(true); // Teachers CAN see previews
        } else if (user?.role === "teacher") {
          console.log("👨🏫 Teacher viewing other teacher's course");
          setIsPreviewMode(true); // Teachers CAN see all previews
        } else {
          setIsPreviewMode(true); // Everyone can see previews
        }
      } else {
        throw new Error(response.data.error || "Failed to load preview");
      }
    } catch (err) {
      console.error("❌ Error fetching preview:", err);
      setError(
        err.response?.data?.error || 
        err.message || 
        "Failed to load preview content"
      );
      
      // Try fallback for teachers
      if (user?.role === "teacher" && courseId) {
        try {
          console.log("🔄 Trying fallback for teacher...");
          const lessonsResponse = await axiosInstance.get(`/courses/${courseId}/lessons`);
          if (lessonsResponse.data.success && lessonsResponse.data.lessons.length > 0) {
            const firstLesson = lessonsResponse.data.lessons[0];
            setLesson({
              ...firstLesson,
              isPreview: true,
            });
            setCourse({ id: courseId, title: "Course Preview" });
            setError("");
            console.log("✅ Using first lesson as fallback preview");
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (courseId || slug) {
      navigate(`/courses/${courseId || slug}`);
    } else {
      navigate("/courses");
    }
  };

  const handleDownload = () => {
    if (lesson?.fileUrl) {
      window.open(lesson.fileUrl, "_blank");
    }
  };

  const handleViewFile = () => {
    if (lesson?.fileUrl) {
      // Open PDF in new tab for viewing
      window.open(lesson.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleEditLesson = () => {
    if (lesson?.id && user?.role === "teacher") {
      navigate(`/teacher/courses/${course?.id || courseId}/lessons/${lesson.id}/edit`);
    } else {
      navigate(`/teacher/courses/${course?.id || courseId}/lessons`);
    }
  };

  const handleManageLessons = () => {
    navigate(`/teacher/courses/${course?.id || courseId}/lessons`);
  };

  const renderContent = () => {
    if (!lesson) return null;

    // If it's a PDF file
    if (lesson.fileUrl && (lesson.contentType === "pdf" || lesson.fileUrl.includes(".pdf"))) {
      return (
        <Box className="preview-content">
          <Box className="file-preview-container">
            <Typography variant="h6" gutterBottom>
              📄 PDF Preview
            </Typography>
            
            <Box className="file-actions">
              <Button
                variant="contained"
                startIcon={<Visibility />}
                onClick={handleViewFile}
                className="view-btn"
              >
                View PDF in Browser
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownload}
                className="download-btn"
              >
                Download PDF
              </Button>
            </Box>
            
            <Box className="pdf-embed-container">
              <iframe
                src={`${lesson.fileUrl}#view=FitH`}
                title={lesson.title}
                className="pdf-iframe"
                style={{ border: "none" }}
              />
              <Typography variant="body2" color="textSecondary" className="pdf-note">
                💡 If the PDF doesn't load, try the "View PDF in Browser" button above.
              </Typography>
            </Box>
          </Box>
        </Box>
      );
    }

    // If it's a video
    if (lesson.videoUrl) {
      return (
        <Box className="preview-content">
          <Typography variant="h6" gutterBottom>
            🎬 Video Lesson
          </Typography>
          
          <Box className="video-container">
            <video
              controls
              className="video-player"
              poster={course?.thumbnail}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Box>
      );
    }

    // If it's text content
    if (lesson.textContent) {
      return (
        <Box className="preview-content">
          <Typography variant="h6" gutterBottom>
            📝 Lesson Content
          </Typography>
          
          <Paper elevation={0} className="text-content-paper">
            <Typography variant="body1" className="lesson-text-content">
              {lesson.textContent}
            </Typography>
          </Paper>
        </Box>
      );
    }

    // No content available
    return (
      <Box className="preview-content">
        <Alert severity="info" className="no-content-alert">
          <Typography variant="body1">
            This preview lesson doesn't have any content yet.
          </Typography>
          {user?.role === "teacher" && (
            <Button
              variant="contained"
              onClick={handleEditLesson}
              sx={{ mt: 2 }}
            >
              Add Content to This Lesson
            </Button>
          )}
        </Alert>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="preview-container">
        <Box className="loading-container">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading preview content...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="preview-container">
        <Card className="error-card">
          <CardContent>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Unable to Load Preview
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {error}
            </Typography>
            
            <Box className="error-actions">
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Back to Courses
              </Button>
              
              {user?.role === "teacher" && courseId && (
                <Button
                  variant="outlined"
                  startIcon={<Book />}
                  onClick={handleManageLessons}
                  sx={{ ml: 2 }}
                >
                  Manage Lessons
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="preview-container">
      <Card elevation={3} className="preview-card">
        <CardContent>
          {/* Header */}
          <Box className="preview-header">
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              className="back-button"
            >
              Back to Course
            </Button>
            
            <Box className="header-badges">
              <Chip
                icon={<Visibility />}
                label="Preview Mode"
                color="primary"
                variant="outlined"
              />
              
              {user?.role === "teacher" && (
                <Chip
                  icon={<School />}
                  label="Teacher View"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Course Info */}
          {course && (
            <Box className="course-info">
              <Typography variant="caption" color="textSecondary">
                COURSE PREVIEW
              </Typography>
              <Typography variant="h4" className="course-title">
                {course.title}
              </Typography>
              
              {lesson && (
                <>
                  <Typography variant="subtitle1" className="lesson-title">
                    📚 {lesson.title}
                  </Typography>
                  
                  <Box className="lesson-meta">
                    {lesson.contentType && (
                      <Chip
                        label={lesson.contentType.toUpperCase()}
                        size="small"
                        className="content-type-chip"
                      />
                    )}
                    
                    {lesson.isPreview && (
                      <Chip
                        icon={<Description />}
                        label="Preview Lesson"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </>
              )}
            </Box>
          )

          <Divider sx={{ my: 3 }} />

          {/* Preview Content */}
          <Box className="content-section">
            <Typography variant="h5" gutterBottom className="section-title">
              Preview Content
            </Typography>
            
            {renderContent()}
          </Box>

          {/* Teacher Actions */}
          {user?.role === "teacher" && course && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Box className="teacher-actions">
                <Typography variant="h6" gutterBottom>
                  👨🏫 Teacher Tools
                </Typography>
                
                <Box className="action-buttons">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditLesson}
                    startIcon={<Description />}
                  >
                    Edit This Lesson
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={handleManageLessons}
                    startIcon={<Book />}
                    sx={{ ml: 2 }}
                  >
                    Manage All Lessons
                  </Button>
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  💡 As a teacher, you can edit this lesson or manage all lessons in this course.
                </Typography>
              </Box>
            </>
          )}

          {/* Enrollment CTA for non-teachers */}
          {user?.role === "student" && course && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Box className="enrollment-cta">
                <Typography variant="h6" gutterBottom color="primary">
                  Want full access?
                </Typography>
                
                <Typography variant="body1" paragraph>
                  This is just a preview. Enroll in the full course to access all lessons,
                  exercises, and get instructor support.
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate(`/courses/${course.id || course.slug}`)}
                >
                  View Course Details & Enroll
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PreviewLessonPage;