
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`${API_BASE_URL}/courses`, { headers });
        const fetchedCourses = res.data.courses || res.data;

        if (!Array.isArray(fetchedCourses)) {
          throw new Error("Invalid courses data received");
        }

        // Validate that each course has a slug
        const validCourses = fetchedCourses.filter(
          (course) => course.slug && course.slug !== "undefined"
        );

        if (validCourses.length === 0) {
          setError("No valid courses found");
          toast.error("No valid courses available");
        } else {
          setCourses(validCourses);
          setError(null);
        }
      } catch (err) {
        console.error("Fetch courses error:", err.message, err.stack);
        const msg =
          err.response?.data?.error || err.message || "Failed to load courses";
        setError(`❌ Error: ${msg}`);
        toast.error(`❌ ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (courses.length === 0)
    return <div className="error">No courses available</div>;

  return (
    <div className="courses">
      <h1>Available Courses</h1>
      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <h2>{course.title || "Untitled Course"}</h2>
            <p>{course.description || "No description available"}</p>
            <p>Price: ${parseFloat(course.price || 0).toFixed(2)}</p>
            <Link
              to={`/course/${course.slug}`} // Use /course/ to match URL in console
              className="btn-view-course"
              onClick={() => {
                if (!course.slug) {
                  console.error("Invalid slug for course:", course);
                  toast.error("Cannot view course: Invalid course URL");
                }
              }}
            >
              View Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;