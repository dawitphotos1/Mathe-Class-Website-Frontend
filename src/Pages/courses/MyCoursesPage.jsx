
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import "./MyCoursesPage.css";

const MyCoursesPage = () => {
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("approved");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/enrollments/my-courses-full`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApprovedCourses(res.data.approved || []);
        setPendingCourses(res.data.pending || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError("Failed to load your courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const sortCourses = (courses) => {
    return [...courses].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.enrolledAt) - new Date(a.enrolledAt);
      }
    });
  };

  const renderCourseCard = (course, isApproved) => (
    <div key={course.id} className="course-card">
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="course-thumbnail"
        />
      )}
      <div className="course-content">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <p className="price">${course.price}</p>
        <p className="date">
          {isApproved
            ? `Enrolled: ${new Date(course.enrolledAt).toLocaleDateString()}`
            : `Status: Pending approval`}
        </p>
        {isApproved && (
          <>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${course.progress || 0}%` }}
              >
                {course.progress || 0}% Complete
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
              {course.progress > 0 ? "Continue" : "Start Course"}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="my-courses-page">
      <h2>🎓 My Courses</h2>

      <div className="tabs">
        <button
          className={activeTab === "approved" ? "active" : ""}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
      </div>

      {activeTab === "approved" && (
        <div className="sort-menu">
          <label htmlFor="sort">Sort by: </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="date">Enrollment Date</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="loader">Loading courses...</div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="courses-grid">
          {activeTab === "approved" && approvedCourses.length > 0 ? (
            sortCourses(approvedCourses).map((course) =>
              renderCourseCard(course, true)
            )
          ) : activeTab === "pending" && pendingCourses.length > 0 ? (
            sortCourses(pendingCourses).map((course) =>
              renderCourseCard(course, false)
            )
          ) : (
            <p>No courses in this tab.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;