
import React from "react";
import { useParams, Link } from "react-router-dom";
import "./CourseDetail.css";
import { courseData, slugToIdMap } from "./courseData";

const CourseDetail = () => {
  const { id } = useParams();
  const course = courseData[id];
  const user = JSON.parse(localStorage.getItem("user"));

  const isStudent = user?.role === "student";
  const courseNumericId = slugToIdMap[id];

  // ✅ Check enrollment from both user object and localStorage
  const localEnrolled =
    JSON.parse(localStorage.getItem("enrolledCourses")) || [];
  const isEnrolled =
    user?.enrolledCourses?.includes(courseNumericId) ||
    localEnrolled.includes(String(courseNumericId));

  if (!course) return <div className="error">❌ Course not found.</div>;

  return (
    <div className="course-detail">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
      </div>

      <div className="course-content">
        {course.contents.map((section, index) => (
          <div className="unit-card" key={index}>
            <h2 className="unit-title">{section.unit}</h2>
            <ul className="lesson-list">
              {section.lessons.map((lesson, idx) => (
                <li key={idx} className="lesson-item">
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="course-footer">
        {isStudent && (
          <>
            {!isEnrolled ? (
              <Link to={`/payment/${courseNumericId}`} className="btn-enroll">
                Enroll Now
              </Link>
            ) : (
              <Link to={`/course/${id}/viewer`} className="btn-start">
                Start Learning
              </Link>
            )}
          </>
        )}
        <Link to="/courses" className="btn-back">
          ← Back to Courses
        </Link>
      </div>
    </div>
  );
};

export default CourseDetail;
