// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { FaSearch, FaSun, FaMoon, FaEye } from "react-icons/fa";
// import ReactPaginate from "react-paginate";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// // Image imports
// import algebra1Img from "../../assets/images/algebra1.jpg";
// import algebra2Img from "../../assets/images/algebra2.jpg";
// import calculusImg from "../../assets/images/calculus1.jpg";
// import preCalculusImg from "../../assets/images/precalculus.jpg";
// import geometryTrigonometryImg from "../../assets/images/geometry.jpg";
// import statisticsProbabilityImg from "../../assets/images/statistics.jpg";

// // Components
// import CourseDetailsModal from "../../components/CourseDetailsModal";
// import ConfirmModal from "../../components/ConfirmModal"; // 🔹 New import

// import "./MyCourses.css";

// const COURSES_PER_PAGE = 6;

// // Thumbnail selector
// const getThumbnail = (title) => {
//   if (!title) return "https://via.placeholder.com/300x200?text=No+Image";
//   const key = title.toLowerCase();
//   if (key.includes("algebra 1")) return algebra1Img;
//   if (key.includes("algebra 2")) return algebra2Img;
//   if (key.includes("pre-calculus") || key.includes("precalculus"))
//     return preCalculusImg;
//   if (key.includes("calculus")) return calculusImg;
//   if (key.includes("geometry") || key.includes("trigonometry"))
//     return geometryTrigonometryImg;
//   if (key.includes("statistics") || key.includes("probability"))
//     return statisticsProbabilityImg;
//   return "https://via.placeholder.com/300x200?text=No+Image";
// };

// const MyCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [sortKey, setSortKey] = useState("title");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [tab, setTab] = useState("approved");
//   const [darkMode, setDarkMode] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [confirmUnenroll, setConfirmUnenroll] = useState(null); // 🔹 New state

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("You must be logged in to view your courses.");
//           return;
//         }

//         const res = await axios.get("/api/v1/enrollments/my-courses", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.data?.success) {
//           toast.error("Unexpected server response.");
//           return;
//         }

//         const transformed = (res.data.courses || [])
//           .filter((course) => course?.id && course?.slug)
//           .map((course) => {
//             const progressSeed = (course.id * 17) % 100;
//             return {
//               ...course,
//               category: course.category || "Uncategorized",
//               difficulty: ["Beginner", "Intermediate", "Advanced"][
//                 course.id % 3
//               ],
//               progress: progressSeed < 20 ? progressSeed + 20 : progressSeed,
//               thumbnail: getThumbnail(course.title),
//               imageLoaded: false,
//             };
//           });

//         setCourses(transformed);
//       } catch (err) {
//         toast.error("Failed to load courses. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   useEffect(() => setCurrentPage(0), [searchQuery, categoryFilter, tab]);

//   const toggleDarkMode = () => setDarkMode((prev) => !prev);
//   const handleGoToClass = (slug) => navigate(`/course/${slug}`);

//   const filtered = courses
//     .filter((c) => c.status === tab)
//     .filter(
//       (c) =>
//         c.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         (categoryFilter === "all" || c.category === categoryFilter)
//     )
//     .sort((a, b) => {
//       if (sortKey === "title") return a.title.localeCompare(b.title);
//       if (sortKey === "date")
//         return new Date(b.enrolledAt) - new Date(a.enrolledAt);
//       return 0;
//     });

//   const offset = currentPage * COURSES_PER_PAGE;
//   const pagedCourses = filtered.slice(offset, offset + COURSES_PER_PAGE);
//   const pageCount = Math.ceil(filtered.length / COURSES_PER_PAGE);
//   const categories = [
//     "all",
//     ...new Set(courses.map((c) => c.category || "Uncategorized")),
//   ];

//   // 🔹 Actual unenroll function called after confirmation
//   const handleUnenrollConfirmed = async () => {
//     if (!confirmUnenroll) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`/api/v1/enrollments/${confirmUnenroll}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("You have been unenrolled.");
//       setCourses((prev) => prev.filter((c) => c.id !== confirmUnenroll));
//       setSelectedCourse(null);
//     } catch (err) {
//       toast.error("Unenrollment failed. Try again.");
//     } finally {
//       setConfirmUnenroll(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-screen">
//         <div className="spinner"></div>
//         <p>Loading your courses...</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`my-courses-container ${darkMode ? "dark" : ""}`}>
//       <div className="header-row">
//         <h2>🎓 My Courses</h2>
//         <button className="dark-toggle" onClick={toggleDarkMode}>
//           {darkMode ? <FaSun /> : <FaMoon />}
//         </button>
//       </div>

//       <div className="tabs">
//         {["approved", "pending"].map((tabName) => (
//           <button
//             key={tabName}
//             onClick={() => setTab(tabName)}
//             className={tab === tabName ? "active" : ""}
//           >
//             {tabName === "approved" ? "Approved" : "Pending"}
//           </button>
//         ))}
//       </div>

//       <div className="controls">
//         <div className="search-bar">
//           <FaSearch className="icon" />
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
//           <option value="title">Sort by Title</option>
//           <option value="date">Sort by Date</option>
//         </select>

//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//         >
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="course-grid">
//         {pagedCourses.map((course) => (
//           <motion.div
//             key={course.id}
//             className={`course-card ${tab}`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <div style={{ position: "relative" }}>
//               {!course.imageLoaded && <div className="shimmer-box" />}
//               <img
//                 src={course.thumbnail}
//                 alt={course.title}
//                 className={`course-thumbnail ${
//                   course.imageLoaded ? "" : "hidden"
//                 }`}
//                 onLoad={() => {
//                   course.imageLoaded = true;
//                   setCourses((prev) => [...prev]);
//                 }}
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src =
//                     "https://via.placeholder.com/300x200?text=Image+Unavailable";
//                   e.target.classList.remove("hidden");
//                 }}
//               />
//             </div>

//             <div className="course-details">
//               <h4>{course.title}</h4>
//               <p>{course.description}</p>
//               <p>
//                 <strong>Category:</strong> {course.category}
//               </p>
//               <span
//                 className={`difficulty-badge ${course.difficulty.toLowerCase()}`}
//               >
//                 {course.difficulty}
//               </span>

//               {tab === "approved" ? (
//                 <div className="progress-wrapper">
//                   <div
//                     className="progress-circle"
//                     data-tooltip={`${course.progress}% complete`}
//                   >
//                     <svg viewBox="0 0 36 36" className="circular-chart">
//                       <path
//                         className="circle-bg"
//                         d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
//                       />
//                       <path
//                         className="circle"
//                         strokeDasharray={`${course.progress}, 100`}
//                         d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
//                       />
//                     </svg>
//                   </div>
//                   <button
//                     className="go-to-class"
//                     onClick={() => handleGoToClass(course.slug)}
//                   >
//                     Go to Class
//                   </button>
//                 </div>
//               ) : (
//                 <span className="badge">⏳ Awaiting Approval</span>
//               )}

//               <button
//                 className="go-to-class"
//                 onClick={() => setSelectedCourse(course)}
//               >
//                 <FaEye style={{ marginRight: 6 }} /> View Details
//               </button>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {filtered.length === 0 && <p className="no-courses">No courses found.</p>}

//       {pageCount > 1 && (
//         <div className="pagination-container">
//           <ReactPaginate
//             previousLabel="←"
//             nextLabel="→"
//             pageCount={pageCount}
//             onPageChange={({ selected }) => setCurrentPage(selected)}
//             containerClassName="pagination"
//             activeClassName="selected"
//           />
//         </div>
//       )}

//       {/* 🔹 Course Details Modal */}
//       {selectedCourse && (
//         <CourseDetailsModal
//           course={selectedCourse}
//           onClose={() => setSelectedCourse(null)}
//           onUnenroll={(id) => setConfirmUnenroll(id)} // 🔹 updated
//         />
//       )}

//       {/* 🔹 Confirmation Modal */}
//       {confirmUnenroll && (
//         <ConfirmModal
//           message="Are you sure you want to unenroll from this course?"
//           onConfirm={handleUnenrollConfirmed}
//           onCancel={() => setConfirmUnenroll(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default MyCourses;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaSun, FaMoon, FaEye } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CourseDetailsModal from "../../components/CourseDetailsModal";
import ConfirmModal from "../../components/ConfirmModal";
import "./MyCourses.css";

const COURSES_PER_PAGE = 6;

// ✅ Thumbnail selector with default fallback
const getThumbnail = (title = "") => {
  const key = title.toLowerCase();
  if (key.includes("algebra 1")) return "/images/algebra1.jpg";
  if (key.includes("algebra 2")) return "/images/algebra2.jpg";
  if (key.includes("pre-calculus") || key.includes("precalculus"))
    return "/images/precalculus.jpg";
  if (key.includes("calculus")) return "/images/calculus1.jpg";
  if (key.includes("geometry") || key.includes("trigonometry"))
    return "/images/geometry.jpg";
  if (key.includes("statistics") || key.includes("probability"))
    return "/images/statistics.jpg";
  return "/images/default.jpg"; // fallback image
};

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sortKey, setSortKey] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tab, setTab] = useState("approved");
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmUnenroll, setConfirmUnenroll] = useState(null);

  const navigate = useNavigate();

  // ✅ Optional: Preload images
  useEffect(() => {
    const preloadImages = [
      "algebra1.jpg",
      "algebra2.jpg",
      "calculus1.jpg",
      "precalculus.jpg",
      "geometry.jpg",
      "statistics.jpg",
      "default.jpg",
    ];

    preloadImages.forEach((img) => {
      const i = new Image();
      i.src = `/images/${img}`;
    });
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view your courses.");
          return;
        }

        const res = await axios.get("/api/v1/enrollments/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data?.success) {
          toast.error("Unexpected server response.");
          return;
        }

        const transformed = (res.data.courses || [])
          .filter((course) => course?.id && course?.slug)
          .map((course) => {
            const progressSeed = (course.id * 17) % 100;
            return {
              ...course,
              category: course.category || "Uncategorized",
              difficulty: ["Beginner", "Intermediate", "Advanced"][
                course.id % 3
              ],
              progress: progressSeed < 20 ? progressSeed + 20 : progressSeed,
              thumbnail: getThumbnail(course.title),
              imageLoaded: false,
            };
          });

        setCourses(transformed);
      } catch (err) {
        toast.error("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => setCurrentPage(0), [searchQuery, categoryFilter, tab]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const handleGoToClass = (slug) => navigate(`/course/${slug}`);

  const filtered = courses
    .filter((c) => c.status === tab)
    .filter(
      (c) =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
  const categories = [
    "all",
    ...new Set(courses.map((c) => c.category || "Uncategorized")),
  ];

  const handleUnenrollConfirmed = async () => {
    if (confirmUnenroll === null) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/v1/enrollments/${confirmUnenroll}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("You have been unenrolled.");
      setCourses((prev) => prev.filter((c) => c.id !== confirmUnenroll));
      setSelectedCourse(null);
    } catch (err) {
      toast.error("Unenrollment failed. Try again.");
    } finally {
      setConfirmUnenroll(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your courses...</p>
      </div>
    );
  }

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
            <div style={{ position: "relative" }}>
              {!course.imageLoaded && <div className="shimmer-box" />}
              <img
                src={course.thumbnail}
                alt={course.title}
                className={`course-thumbnail ${
                  course.imageLoaded ? "" : "hidden"
                }`}
                onLoad={() => {
                  setCourses((prev) =>
                    prev.map((c) =>
                      c.id === course.id ? { ...c, imageLoaded: true } : c
                    )
                  );
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default.jpg";
                  setCourses((prev) =>
                    prev.map((c) =>
                      c.id === course.id ? { ...c, imageLoaded: true } : c
                    )
                  );
                }}
              />
            </div>

            <div className="course-details">
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <span
                className={`difficulty-badge ${course.difficulty.toLowerCase()}`}
              >
                {course.difficulty}
              </span>

              {tab === "approved" ? (
                <div className="progress-wrapper">
                  <div
                    className="progress-circle"
                    data-tooltip={`${course.progress}% complete`}
                  >
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path
                        className="circle-bg"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="circle"
                        strokeDasharray={`${course.progress}, 100`}
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
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
              ) : (
                <span className="badge">⏳ Awaiting Approval</span>
              )}

              <button
                className="go-to-class"
                onClick={() => setSelectedCourse(course)}
              >
                <FaEye style={{ marginRight: 6 }} /> View Details
              </button>
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

      {/* Modals */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onUnenroll={(id) => setConfirmUnenroll(id)}
        />
      )}

      {confirmUnenroll !== null && (
        <ConfirmModal
          message="Are you sure you want to unenroll from this course?"
          onConfirm={handleUnenrollConfirmed}
          onCancel={() => setConfirmUnenroll(null)}
        />
      )}
    </div>
  );
};

export default MyCourses;
