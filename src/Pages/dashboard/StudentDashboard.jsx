// pages/dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useLessons } from "../../hooks/useLessons";
import CourseCard from "../courses/CourseCard";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/users/my-courses");

        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          console.error("Failed to fetch enrolled courses.");
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="student-dashboard-container">
      <div className="student-dashboard-header">
        <h1>🎓 My Enrolled Courses</h1>
        <p>Continue learning your approved courses below.</p>
      </div>

      {loading ? (
        <p className="loading-text">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="no-courses">You're not enrolled in any courses yet.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <EnrolledCourseCard 
              key={course.id} 
              course={course} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// New component for enrolled courses with optimized lesson loading
const EnrolledCourseCard = ({ course }) => {
  const { lessons, loading, error } = useLessons(course.id);
  const navigate = useNavigate();

  const handleContinueLearning = () => {
    if (lessons.length > 0) {
      navigate(`/courses/${course.id}/view`);
    }
  };

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  return (
    <div className="enrolled-course-card">
      <div className="course-header">
        <h3>{course.title}</h3>
        <span className="progress-badge">{Math.round(progress)}% Complete</span>
      </div>
      
      <div className="course-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {completedLessons} of {lessons.length} lessons completed
        </span>
      </div>

      {loading ? (
        <div className="lessons-loading">Loading lessons...</div>
      ) : error ? (
        <div className="lessons-error">Error loading lessons</div>
      ) : (
        <div className="recent-lessons">
          <h4>Recent Lessons</h4>
          {lessons.slice(0, 3).map(lesson => (
            <div key={lesson.id} className="recent-lesson">
              <span className="lesson-title">{lesson.title}</span>
              <span className={`lesson-status ${lesson.completed ? 'completed' : 'pending'}`}>
                {lesson.completed ? '✓' : '◯'}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="course-actions">
        <button 
          onClick={handleContinueLearning}
          className="continue-btn"
          disabled={lessons.length === 0}
        >
          {lessons.length === 0 ? 'No Lessons Available' : 'Continue Learning'}
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;