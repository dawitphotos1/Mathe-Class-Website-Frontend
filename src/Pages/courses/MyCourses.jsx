import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaSun, FaMoon } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MyCourses.css";

const COURSES_PER_PAGE = 6;

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sortKey, setSortKey] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tab, setTab] = useState("approved");
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view your courses.");
          return;
        }

        const res = await axios.get("/api/v1/enrollments/my-courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.data || !res.data.success) {
          console.error("Invalid response format:", res.data);
          toast.error("Unexpected server response.");
          return;
        }

        const transformed = (res.data.courses || [])
          .map((course) => {
            if (!course?.id || !course?.slug) return null;

            return {
              ...course,
              progress: course.progress ?? Math.floor(Math.random() * 60 + 20), // Simulated
              category:
                course.category ||
                ["Math", "Science", "English"][Math.floor(Math.random() * 3)],
            };
          })
          .filter(Boolean);

        console.log("✅ Courses loaded:", transformed);
        setCourses(transformed);
      } catch (err) {
        console.error(
          "❌ Failed to fetch courses:",
          err.response || err.message || err
        );
        toast.error("Failed to load courses. Please try again later.");
      }
    };

    fetchCourses();
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleGoToClass = (slug) => {
    if (!slug) {
      toast.error("Missing course link");
      return;
    }
    navigate(`/course/${slug}`);
  };

  const filtered = courses
    .filter((c) => c.status === tab)
    .filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryFilter === "all" || c.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortKey === "title") return a.title.localeCompare(b.title);
      if (sortKey === "date")
        return new Date(b.enrolledAt) - new Date(a.enrolledAt);
      return 0;
    });

  const offset = currentPage * COURSES_PER_PAGE;
  const pagedCourses = filtered.slice(offset, offset + COURSES_PER_PAGE);
  const pageCount = Math.ceil(filtered.length / COURSES_PER_PAGE);
  const categories = ["all", ...new Set(courses.map((c) => c.category))];

  return (
    <div className={`my-courses-container ${darkMode ? "dark" : ""}`}>
      <div className="header-row">
        <h2>🎓 My Courses</h2>
        <button className="dark-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="tabs">
        {["approved", "pending"].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setTab(tabName)}
            className={tab === tabName ? "active" : ""}
          >
            {tabName === "approved" ? "Approved" : "Pending"}
          </button>
        ))}
      </div>

      <div className="controls">
        <div className="search-bar">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="title">Sort by Title</option>
          <option value="date">Sort by Date</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="course-grid">
        {pagedCourses.map((course) => (
          <motion.div
            key={course.id}
            className={`course-card ${tab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={course.thumbnail || "/default-thumbnail.jpg"}
              alt={course.title}
              className="course-thumbnail"
            />
            <div className="course-details">
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <p>
                <strong>Price:</strong> ${course.price}
              </p>
              {tab === "approved" ? (
                <>
                  <p>
                    Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                  </p>
                  <div className="progress-wrapper">
                    <div
                      className="progress-circle"
                      data-tooltip={`${course.progress}% complete`}
                    >
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path
                          className="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="2"
                        />
                        <path
                          className="circle"
                          strokeDasharray={`${course.progress}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#2ecc71"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <button
                      className="go-to-class"
                      onClick={() => handleGoToClass(course.slug)}
                    >
                      Go to Class
                    </button>
                  </div>
                </>
              ) : (
                <span className="badge">⏳ Awaiting Approval</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && <p className="no-courses">No courses found.</p>}

      {pageCount > 1 && (
        <div className="pagination-container">
          <ReactPaginate
            previousLabel="←"
            nextLabel="→"
            pageCount={pageCount}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName="pagination"
            activeClassName="selected"
          />
        </div>
      )}
    </div>
  );
};

export default MyCourses;
