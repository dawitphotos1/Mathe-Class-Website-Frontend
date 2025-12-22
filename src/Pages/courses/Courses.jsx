// // src/pages/courses/Courses.jsx - UPDATED VERSION
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";
// import axiosInstance from '../../utils/axiosInstance';
// import "./Courses.css";

// const CourseSkeleton = () => (
//   <div className="course-item skeleton">
//     <div className="skeleton-title"></div>
//     <div className="skeleton-text short"></div>
//     <div className="skeleton-text long"></div>
//     <div className="skeleton-btn"></div>
//   </div>
// );

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingEnrollments, setLoadingEnrollments] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();

//   const { user } = useAuth();
//   const fromPayment = location.state?.fromPayment || searchParams.get("fromPayment") === "true";

//   useEffect(() => {
//     fetchCourses();
//     if (user) {
//       fetchEnrolledCourses();
//     }
//   }, [user]);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get("/courses");
//       const data = res.data?.courses || res.data;
//       setCourses(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to load courses:", err);
//       toast.error("Failed to load courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEnrolledCourses = async () => {
//     if (!user) {
//       setLoadingEnrollments(false);
//       return;
//     }

//     try {
//       setLoadingEnrollments(true);
//       const res = await axiosInstance.get("/enrollments/my-courses");
//       if (res.data.success && res.data.courses) {
//         setEnrolledCourses(res.data.courses);
//       } else if (res.data.enrollments) {
//         const coursesFromEnrollments = res.data.enrollments
//           .filter(enrollment => enrollment.course)
//           .map(enrollment => enrollment.course);
//         setEnrolledCourses(coursesFromEnrollments);
//       }
//     } catch (err) {
//       console.error("Failed to load enrolled courses:", err);
//     } finally {
//       setLoadingEnrollments(false);
//     }
//   };

//   const isUserEnrolledInCourse = (courseId) => {
//     return enrolledCourses.some(course => course.id === courseId);
//   };

//   const handleCourseClick = (course) => {
//     // Use slug if available, otherwise use ID
//     if (course.slug) {
//       navigate(`/courses/${course.slug}`);
//     } else if (course.id) {
//       navigate(`/courses/id/${course.id}`);
//     } else {
//       toast.error("Course information missing");
//     }
//   };

//   // ============ FIXED: Redirect to REGISTER instead of LOGIN ============
//   const handleEnrollNow = (course) => {
//     // If user is not logged in, redirect to REGISTER page
//     if (!user) {
//       navigate("/register", { 
//         state: { 
//           from: `/courses`,
//           redirectMessage: "Please register as a student to enroll in this course",
//           redirectTo: `/payment/${course.id}`,
//           courseInfo: {
//             id: course.id,
//             title: course.title,
//             price: course.price
//           }
//         } 
//       });
//       return;
//     }
    
//     // Check if already enrolled
//     const isEnrolled = isUserEnrolledInCourse(course.id);
//     if (isEnrolled) {
//       toast.info("You are already enrolled in this course!");
//       navigate(`/courses/${course.id}/view-lessons`);
//       return;
//     }
    
//     // Check if user is a student
//     if (user.role !== "student") {
//       toast.info("Only students can enroll in courses. Please register as a student.");
//       navigate("/register", {
//         state: {
//           redirectMessage: "Please register with a student account to enroll in courses"
//         }
//       });
//       return;
//     }
    
//     // Navigate to payment page
//     navigate(`/payment/${course.id}`);
//   };

//   const handleFreePreview = async (course) => {
//     try {
//       if (!course?.id) {
//         toast.error("Invalid course");
//         return;
//       }
      
//       console.log(`Fetching preview for course ID: ${course.id}`);
      
//       // Check if user is already enrolled
//       const isEnrolled = isUserEnrolledInCourse(course.id);
//       if (isEnrolled) {
//         toast.info("You are already enrolled! Access full content.");
//         navigate(`/courses/${course.id}/view-lessons`);
//         return;
//       }
      
//       // For teachers/admins, show different access
//       if (user?.role === "teacher" || user?.role === "admin") {
//         if (user.id === course.teacher_id) {
//           navigate(`/courses/${course.id}/manage-lessons`);
//         } else {
//           navigate(`/teacher/courses/${course.id}/view`);
//         }
//         return;
//       }
      
//       // For everyone else, show preview
//       const res = await axiosInstance.get(`/courses/${course.id}/preview-lesson`);
      
//       console.log("Preview API Response:", res.data);

//       if (res.data.success && res.data.lesson) {
//         // Navigate to the preview page
//         navigate(`/preview/${res.data.lesson.id}`, {
//           state: {
//             lesson: res.data.lesson,
//             courseId: course.id,
//             courseTitle: course.title
//           }
//         });
//       } else if (res.data.error === "No preview lesson found for this course") {
//         // Try to get the first lesson instead
//         const lessonsRes = await axiosInstance.get(`/courses/${course.id}/lessons`);
//         if (lessonsRes.data.success && lessonsRes.data.lessons?.length > 0) {
//           const firstLesson = lessonsRes.data.lessons[0];
//           navigate(`/preview/${firstLesson.id}`, {
//             state: {
//               lesson: firstLesson,
//               courseId: course.id,
//               courseTitle: course.title
//             }
//           });
//         } else {
//           toast.error("No preview content available");
//         }
//       } else {
//         toast.error(res.data.error || "No free preview available");
//       }
//     } catch (error) {
//       console.error("Preview error:", error);
      
//       // Try alternative preview route
//       if (error.response?.status === 404) {
//         navigate(`/courses/${course.id}/preview`);
//       } else {
//         toast.error("Unable to load preview. Please try again.");
//       }
//     }
//   };

//   const getCourseActionButtons = (course) => {
//     const isEnrolled = isUserEnrolledInCourse(course.id);
//     const buttons = [];
    
//     // ALWAYS show "Enroll Now" button for public users and non-enrolled students
//     if (!isEnrolled) {
//       buttons.push({
//         text: `Enroll Now - $${parseFloat(course.price || 0).toFixed(2)}`,
//         className: "btn-enroll",
//         onClick: () => handleEnrollNow(course)
//       });
//     } else {
//       // Enrolled student - show Access Course
//       buttons.push({
//         text: "Access Course",
//         className: "btn-access",
//         onClick: () => navigate(`/courses/${course.id}/view-lessons`)
//       });
//     }
    
//     // Show Free Preview for non-enrolled users
//     if (!isEnrolled) {
//       buttons.push({
//         text: "Free Preview",
//         className: "btn-preview",
//         onClick: () => handleFreePreview(course)
//       });
//     }
    
//     // Show View Details for everyone
//     buttons.push({
//       text: "View Details",
//       className: "btn-details",
//       onClick: () => handleCourseClick(course)
//     });
    
//     return buttons;
//   };

//   const renderPaymentSuccessBanner = () => {
//     if (!fromPayment) return null;
    
//     return (
//       <div className="payment-success-navigation">
//         <div className="success-banner">
//           <h3>🎉 Payment Successful!</h3>
//           <p>Your enrollment is pending admin approval. You'll receive an email once approved.</p>
//         </div>
//         <div className="navigation-buttons">
//           <button onClick={() => navigate("/")} className="nav-btn home-btn">
//             ← Return to Home
//           </button>
//           <button onClick={() => navigate("/my-courses")} className="nav-btn courses-btn">
//             View My Courses
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const renderUserNotices = () => {
//     if (!user) {
//       return (
//         <div className="login-notice">
//           <p>
//             <strong>Note:</strong> Click "Enroll Now" to register as a student and enroll in courses. 
//             You need to create a student account first.
//           </p>
//         </div>
//       );
//     }

//     if (enrolledCourses.length > 0) {
//       return (
//         <div className="enrollment-notice">
//           <p>
//             <strong>Note:</strong> You are enrolled in {enrolledCourses.length} course(s). 
//             Enrolled courses show "Access Course" button.
//           </p>
//         </div>
//       );
//     }

//     return null;
//   };

//   const renderCourseItem = (course) => {
//     const isEnrolled = isUserEnrolledInCourse(course.id);
//     const actionButtons = getCourseActionButtons(course);
    
//     return (
//       <div key={course.id} className="course-item">
//         <div className="course-header" onClick={() => handleCourseClick(course)}>
//           <h2>{course.title}</h2>
//           <p className="course-description">{course.description}</p>
//         </div>

//         <div className="course-details">
//           <p className="course-price">
//             Price: ${parseFloat(course.price || 0).toFixed(2)}
//           </p>
//           {course.teacher && (
//             <p className="course-teacher">Instructor: {course.teacher.name}</p>
//           )}
          
//           {isEnrolled && (
//             <div className="enrollment-badge">
//               <span className="badge enrolled">✓ Enrolled</span>
//             </div>
//           )}
          
//           {user?.role === "teacher" && !isEnrolled && (
//             <div className="enrollment-badge">
//               <span className="badge teacher">👨‍🏫 Teacher View</span>
//             </div>
//           )}
//         </div>

//         <div className="course-actions">
//           {actionButtons.map((button, index) => (
//             <button
//               key={index}
//               className={button.className}
//               onClick={button.onClick}
//             >
//               {button.text}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   if (loading || (user && loadingEnrollments)) {
//     return (
//       <div className="courses">
//         {renderPaymentSuccessBanner()}
//         <h1>Available Courses</h1>
//         <div className="course-list">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <CourseSkeleton key={i} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!courses.length) {
//     return (
//       <div className="courses">
//         {renderPaymentSuccessBanner()}
//         <div className="error">No courses available</div>
//       </div>
//     );
//   }

//   return (
//     <div className="courses">
//       {renderPaymentSuccessBanner()}

//       <h1>Available Courses</h1>
//       <p className="courses-subtitle">Browse all available math courses</p>

//       {renderUserNotices()}

//       <div className="course-list">
//         {courses.map(renderCourseItem)}
//       </div>
//     </div>
//   );
// };

// export default Courses;



// src/pages/courses/Courses.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance"; // ✅ Updated import
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  School,
  AttachMoney,
  Person,
  Description,
  PlayCircle,
  Edit,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/courses"); // ✅ Updated to axiosInstance
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFreePreview = async (course) => {
    console.log(`🎯 Free Preview clicked for course: ${course.title} (ID: ${course.id})`);
    
    // For teachers, check if they own the course
    if (user?.role === "teacher") {
      // Check if teacher owns this course
      if (course.teacher_id === user.id) {
        console.log("👨🏫 Teacher owns this course - checking preview status");
        
        try {
          // Fetch preview lesson for this course
          const previewResponse = await axiosInstance.get(`/courses/${course.id}/preview-lesson`); // ✅ Updated
          
          if (previewResponse.data.success) {
            const { lesson, course: courseData } = previewResponse.data;
            
            if (lesson) {
              console.log(`✅ Found preview lesson: ${lesson.title} (ID: ${lesson.id})`);
              
              // Navigate to preview page with lesson data
              navigate(`/courses/${course.id}/preview`, {
                state: {
                  lesson,
                  course: courseData,
                  isTeacher: true,
                  fromCourseList: true,
                },
              });
              return;
            }
          }
        } catch (previewError) {
          console.warn("Could not fetch preview lesson:", previewError);
        }
        
        // If no preview or error, go to manage lessons
        console.log("📚 No preview found, navigating to manage lessons");
        navigate(`/teacher/courses/${course.id}/lessons`);
        return;
      } else {
        // Teacher viewing other teacher's course - show preview
        console.log("👨🏫 Teacher viewing other teacher's course - showing preview");
        navigate(`/courses/${course.id}/preview`);
        return;
      }
    }
    
    // For students and non-logged in users
    console.log("👤 Non-teacher user - showing preview");
    navigate(`/courses/${course.id}/preview`);
  };

  const handleCourseDetails = (course) => {
    navigate(`/courses/${course.slug || course.id}`);
  };

  const handleManageCourse = (course) => {
    if (user?.role === "teacher" && course.teacher_id === user.id) {
      navigate(`/teacher/courses/${course.id}`);
    } else {
      navigate(`/courses/${course.slug || course.id}`);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getCourseType = (course) => {
    if (user?.role === "teacher" && course.teacher_id === user.id) {
      return "teacher";
    }
    if (user?.role === "teacher") {
      return "other-teacher";
    }
    return "student";
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="courses-container">
        <Box className="loading-box">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading courses...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="courses-container">
        <Alert severity="error" className="error-alert">
          {error}
          <Button onClick={fetchCourses} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="courses-container">
      <Box className="courses-header">
        <Typography variant="h3" component="h1" className="page-title">
          Our Courses
        </Typography>
        
        {user?.role === "teacher" && (
          <Box className="teacher-banner">
            <Chip
              icon={<School />}
              label="Teacher View"
              color="primary"
              variant="outlined"
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
              You can preview any course. Manage your own courses from the teacher dashboard.
            </Typography>
          </Box>
        )}
        
        <Typography variant="subtitle1" className="page-subtitle">
          Browse our comprehensive math curriculum. Click "Free Preview" to see sample content.
        </Typography>
      </Box>

      <Grid container spacing={3} className="courses-grid">
        {courses.map((course) => {
          const courseType = getCourseType(course);
          const isOwnCourse = user?.role === "teacher" && course.teacher_id === user.id;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card className="course-card" elevation={2}>
                {/* Course Image */}
                <Box className="course-image-container">
                  {course.thumbnail ? (
                    <CardMedia
                      component="img"
                      height="160"
                      image={course.thumbnail}
                      alt={course.title}
                      className="course-image"
                    />
                  ) : (
                    <Box className="course-image-placeholder">
                      <Typography variant="h6" className="placeholder-text">
                        {course.title.substring(0, 20)}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Course Type Badge */}
                  {isOwnCourse && (
                    <Chip
                      label="Your Course"
                      color="primary"
                      size="small"
                      className="course-ownership-chip"
                    />
                  )}
                </Box>

                <CardContent className="course-content">
                  {/* Course Title */}
                  <Typography variant="h6" className="course-title" gutterBottom>
                    {course.title}
                  </Typography>

                  {/* Course Description */}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="course-description"
                    paragraph
                  >
                    {course.description || "Comprehensive math course with expert instruction"}
                  </Typography>

                  {/* Course Metadata */}
                  <Box className="course-meta">
                    <Box className="teacher-info">
                      <Person fontSize="small" className="meta-icon" />
                      <Typography variant="caption">
                        {course.teacher?.name || "Math Instructor"}
                      </Typography>
                    </Box>
                    
                    <Box className="price-info">
                      <AttachMoney fontSize="small" className="meta-icon" />
                      <Typography variant="h6" className="course-price">
                        {formatPrice(course.price)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box className="course-actions">
                    {/* Free Preview Button - ALWAYS SHOWS PREVIEW */}
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<PreviewIcon />}
                      onClick={() => handleFreePreview(course)}
                      className="preview-button"
                      fullWidth
                    >
                      Free Preview
                    </Button>

                    {/* Secondary Action */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCourseDetails(course)}
                      className="details-button"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      {isOwnCourse ? "Manage Course" : "View Details"}
                    </Button>

                    {/* Teacher Quick Actions */}
                    {isOwnCourse && (
                      <Box className="teacher-quick-actions" sx={{ mt: 2 }}>
                        <Tooltip title="Manage Lessons">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/teacher/courses/${course.id}/lessons`)}
                            className="quick-action-btn"
                          >
                            <Description fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Edit Course">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}
                            className="quick-action-btn"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Course Analytics">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/teacher/courses/${course.id}/analytics`)}
                            className="quick-action-btn"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  {/* Course Status */}
                  <Box className="course-status">
                    {isOwnCourse && (
                      <Chip
                        label="You teach this course"
                        color="success"
                        size="small"
                        variant="outlined"
                        icon={<School />}
                      />
                    )}
                    
                    {courseType === "other-teacher" && (
                      <Chip
                        label="Taught by colleague"
                        color="info"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Help Text */}
      {user?.role === "teacher" && (
        <Box className="teacher-help" sx={{ mt: 4, p: 2, bgcolor: "background.default", borderRadius: 2 }}>
          <Typography variant="body2" color="textSecondary">
            💡 <strong>Teacher Notes:</strong> As a teacher, you can preview any course. 
            For your own courses, you'll see additional management options. 
            The "Free Preview" button shows the preview lesson content to all users.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Courses;