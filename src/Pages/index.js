// src/pages/index.js - CORRECT VERSION BASED ON YOUR FILES
// Export all page components that actually exist in your project

// ==================== PUBLIC PAGES ====================
export { default as Home } from './Home';
export { default as Register } from './auth/Register';
export { default as Login } from './auth/Login';
export { default as ForgotPassword } from './auth/ForgotPassword';  // ADD THIS
export { default as ResetPassword } from './auth/ResetPassword';    // AND THIS
export { default as ConfirmAccount } from './ConfirmAccount';
export { default as NotFound } from './NotFound';
export { default as Unauthorized } from './Unauthorized';

// ==================== COURSE PAGES ====================
export { default as Courses } from './courses/Courses';
export { default as CourseDetail } from './courses/CourseDetail'; // fix added
export { default as CourseViewer } from './courses/CourseViewer';
export { default as MyCoursesPage } from './courses/MyCourses';
export { default as CourseLessons } from './CourseLessons';
export { default as CoursePreviewPage } from './CoursePreviewPage';

// ==================== PAYMENT PAGES ====================
export { default as PaymentPage } from './PaymentPage';
export { default as PaymentSuccess } from './payments/PaymentSuccess';
export { default as PaymentCancel } from './payments/PaymentCancel';
export { default as Cancel } from './payments/Cancel'; // fix added

// ==================== ADMIN PAGES ====================
export { default as AdminDashboard } from './AdminDashboard';
export { default as ManageCourses } from './AdminManageCourses';
export { default as ManageUsers } from './AdminManageUsers';
export { default as AdminLessonLogs } from './AdminLessonLogs';
export { default as FileManager } from './FileManager';

// ==================== TEACHER PAGES ====================
// IMPORTANT: Your teacher dashboard is MyTeachingCourses.jsx, not TeacherDashboard.jsx
export { default as MyTeachingCourses } from './teachers/MyTeachingCourses';

// Teacher Course Management
export { default as TeacherCourseViewer } from './TeacherCourseViewer'; // In root, not teachers folder
export { default as CourseContent } from './teachers/CourseContent';
export { default as EditCourse } from './teachers/EditCourse';
export { default as EditLesson } from './teachers/EditLesson';
export { default as CreateLessonPage } from './teachers/CreateLessonPage';
export { default as TeacherManageLessons } from './teachers/ManageLessons'; // Renamed for clarity
export { default as LessonForm } from './teachers/LessonForm';
export { default as LessonList } from './teachers/LessonList';
export { default as UnitAccordion } from './teachers/UnitAccordion';

// Course Creation
export { default as CreateCourse } from './CreateCourse';
export { default as CreateCourseWithUnits } from './CreateCourseWithUnits';
export { default as CreateLesson } from './CreateLesson';

// Advanced course creation (if you have it)
export { default as CreateCourseAdvanced } from './teachers/CreateCourseAdvanced';
export { default as CreateCourseForm } from './teachers/CreateCourseForm';

// ==================== STUDENT PAGES ====================
export { default as StudentLessons } from './StudentLessons';
export { default as StudentDashboard } from './dashboard/StudentDashboard';

// ==================== USER PAGES ====================
export { default as Profile } from './users/Profile';

// ==================== OTHER PAGES ====================
export { default as ClassPage } from './ClassPage';
export { default as CourseLessonManager } from './CourseLessonManager';
export { default as CreateCourseWrapper } from './CreateCourseWrapper';
export { default as Dashboard } from './Dashboard';
export { default as PreviewLesson } from './PreviewLesson';
export { default as PreviewLessonPage } from './PreviewLessonPage';
export { default as StartCoursePage } from './StartCoursePage';

// ==================== ALIASES FOR BACKWARD COMPATIBILITY ====================
// If you want to use "TeacherDashboard" as an alias for MyTeachingCourses
// export { default as TeacherDashboard } from './teachers/MyTeachingCourses';