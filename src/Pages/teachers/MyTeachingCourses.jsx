// ✅ Updated MyTeachingCourses.jsx (Teacher View)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./MyTeachingCourses.css";

const MyTeachingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = JSON.parse(localStorage.getItem("user"));
        const myCourses = res.data.courses.filter(
          (c) => c.teacherId === user.id
        );
        setCourses(myCourses);
      } catch (err) {
        toast.error("Failed to fetch teaching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="my-teaching-courses">
      <h2>📘 My Teaching Courses</h2>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-actions">
                <Link to={`/courses/${course.id}/manage-lessons`}>
                  <button className="btn-manage">🛠 Manage Lessons</button>
                </Link>
                <Link to={`/courses/${course.id}/lessons/new`}>
                  <button className="btn-create">➕ Create Lesson</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeachingCourses;

