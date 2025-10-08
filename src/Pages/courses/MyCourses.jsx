
// // src/pages/MyCourses.jsx
// import React, { useEffect, useState } from "react";
// import { FaSearch, FaSun, FaMoon } from "react-icons/fa";
// import ReactPaginate from "react-paginate";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import CourseDetailsModal from "../../components/CourseDetailsModal";
// import ConfirmModal from "../../components/ConfirmModal";
// import MyCourseCard from "../../components/MyCourseCard";
// import axiosInstance from "../../utils/axiosInstance"; // ✅ already has baseURL
// import "./MyCourses.css";

// const COURSES_PER_PAGE = 6;

// const getThumbnail = (title = "") => {
//   const key = title.toLowerCase();
//   if (key.includes("algebra 1")) return "/images/algebra1.jpg";
//   if (key.includes("algebra 2")) return "/images/algebra2.jpg";
//   if (key.includes("pre-calculus") || key.includes("precalculus"))
//     return "/images/precalculus.jpg";
//   if (key.includes("calculus")) return "/images/calculus.jpg";
//   if (key.includes("geometry") || key.includes("trigonometry"))
//     return "/images/geometry.jpg";
//   if (key.includes("statistics") || key.includes("probability"))
//     return "/images/statistics.jpg";
//   return "/images/default.jpg";
// };

// const getCategoryFromTitle = (title = "") => {
//   const key = title.toLowerCase();
//   if (key.includes("algebra")) return "📘 Algebra";
//   if (key.includes("geometry")) return "📐 Geometry";
//   if (key.includes("pre-calculus") || key.includes("precalculus"))
//     return "📏 Pre-Calculus";
//   if (key.includes("calculus")) return "📊 Calculus";
//   if (key.includes("statistics") || key.includes("probability"))
//     return "📈 Statistics";
//   return "🔢 General Math";
// };

// const getCategorySlug = (title = "") => {
//   const key = title.toLowerCase();
//   if (key.includes("algebra")) return "algebra";
//   if (key.includes("geometry")) return "geometry";
//   if (key.includes("pre-calculus") || key.includes("precalculus"))
//     return "precalculus";
//   if (key.includes("calculus")) return "calculus";
//   if (key.includes("statistics") || key.includes("probability"))
//     return "statistics";
//   return "general";
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
//   const [confirmUnenroll, setConfirmUnenroll] = useState(null);

//   const [courseLessons, setCourseLessons] = useState([]);
//   const [loadingLessons, setLoadingLessons] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const preloadImages = [
//       "algebra1.jpg",
//       "algebra2.jpg",
//       "calculus.jpg",
//       "precalculus.jpg",
//       "geometry.jpg",
//       "statistics.jpg",
//       "default.jpg",
//     ];
//     preloadImages.forEach((img) => {
//       const i = new Image();
//       i.src = `/images/${img}`;
//     });
//   }, []);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         // ✅ FIX: removed duplicate /api/v1
//         const res = await axiosInstance.get("/enrollments/my-courses");

//         if (!res.data?.success) {
//           toast.error("Unexpected server response.");
//           return;
//         }

//         const transformed = (res.data.courses || [])
//           .filter((course) => course?.id && course?.slug)
//           .map((course) => {
//             const progressSeed = (course.id * 17) % 100;
//             const title = course.title || "";
//             return {
//               ...course,
//               category:
//                 course.category && course.category !== "Uncategorized"
//                   ? course.category
//                   : getCategoryFromTitle(title),
//               categorySlug: getCategorySlug(title),
//               difficulty: ["Beginner", "Intermediate", "Advanced"][course.id % 3],
//               progress: progressSeed < 20 ? progressSeed + 20 : progressSeed,
//               thumbnail: getThumbnail(title),
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

//   // Fetch lessons for a course
//   const fetchCourseLessons = async (courseId) => {
//     setLoadingLessons(true);
//     try {
//       // ✅ FIX: removed duplicate /api/v1
//       const res = await axiosInstance.get(`/courses/${courseId}/lessons`);
//       if (res.data?.lessons) {
//         setCourseLessons(res.data.lessons);
//       } else {
//         setCourseLessons([]);
//         toast.info("No lessons found for this course.");
//       }
//     } catch (error) {
//       console.error("Failed to fetch lessons:", error);
//       toast.error("Failed to load lessons.");
//       setCourseLessons([]);
//     } finally {
//       setLoadingLessons(false);
//     }
//   };

//   const toggleDarkMode = () => setDarkMode((prev) => !prev);
//   const handleGoToClass = (slug) => navigate(`/class/${slug}`);

//   const handleViewDetails = (course) => {
//     setSelectedCourse(course);
//     fetchCourseLessons(course.id);
//   };

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
//     ...Array.from(new Set(courses.map((c) => c.category))),
//   ];

//   const handleUnenrollConfirmed = async () => {
//     if (confirmUnenroll === null) return;
//     try {
//       // ✅ FIX: removed duplicate /api/v1
//       await axiosInstance.delete(`/enrollments/${confirmUnenroll}`);

//       toast.success("You have been unenrolled.");
//       setCourses((prev) => prev.filter((c) => c.id !== confirmUnenroll));
//       setSelectedCourse(null);
//       setCourseLessons([]);
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
//           <MyCourseCard
//             key={course.id}
//             course={course}
//             tab={tab}
//             onGoToClass={() => handleGoToClass(course.slug)}
//             onViewDetails={() => handleViewDetails(course)}
//           />
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

//       {selectedCourse && (
//         <CourseDetailsModal
//           course={selectedCourse}
//           lessons={courseLessons}
//           loadingLessons={loadingLessons}
//           onClose={() => {
//             setSelectedCourse(null);
//             setCourseLessons([]);
//           }}
//           onUnenroll={(id) => setConfirmUnenroll(id)}
//         />
//       )}

//       {confirmUnenroll !== null && (
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
import { FaSearch, FaSun, FaMoon } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CourseDetailsModal from "../../components/CourseDetailsModal";
import ConfirmModal from "../../components/ConfirmModal";
import MyCourseCard from "../../components/MyCourseCard";
import axiosInstance from "../../utils/axiosInstance";
import "./MyCourses.css";

const COURSES_PER_PAGE = 6;

// Utility: choose thumbnail based on title
const getThumbnail = (title = "") => {
  const key = title.toLowerCase();
  if (key.includes("algebra 1")) return "/images/algebra1.jpg";
  if (key.includes("algebra 2")) return "/images/algebra2.jpg";
  if (key.includes("pre-calculus") || key.includes("precalculus"))
    return "/images/precalculus.jpg";
  if (key.includes("calculus")) return "/images/calculus.jpg";
  if (key.includes("geometry") || key.includes("trigonometry"))
    return "/images/geometry.jpg";
  if (key.includes("statistics") || key.includes("probability"))
    return "/images/statistics.jpg";
  return "/images/default.jpg";
};

// Utility: derive category and slug
const getCategoryFromTitle = (title = "") => {
  const key = title.toLowerCase();
  if (key.includes("algebra")) return "📘 Algebra";
  if (key.includes("geometry")) return "📐 Geometry";
  if (key.includes("pre-calculus") || key.includes("precalculus"))
    return "📏 Pre-Calculus";
  if (key.includes("calculus")) return "📊 Calculus";
  if (key.includes("statistics") || key.includes("probability"))
    return "📈 Statistics";
  return "🔢 General Math";
};

const getCategorySlug = (title = "") => {
  const key = title.toLowerCase();
  if (key.includes("algebra")) return "algebra";
  if (key.includes("geometry")) return "geometry";
  if (key.includes("pre-calculus") || key.includes("precalculus"))
    return "precalculus";
  if (key.includes("calculus")) return "calculus";
  if (key.includes("statistics") || key.includes("probability"))
    return "statistics";
  return "general";
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
  const [courseLessons, setCourseLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const navigate = useNavigate();

  // Preload images
  useEffect(() => {
    const images = [
      "algebra1.jpg",
      "algebra2.jpg",
      "calculus.jpg",
      "precalculus.jpg",
      "geometry.jpg",
      "statistics.jpg",
      "default.jpg",
    ];
    images.forEach((img) => {
      const i = new Image();
      i.src = `/images/${img}`;
    });
  }, []);

  // Fetch courses by tab (approved or pending)
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/enrollments/my-courses?status=${tab}`
        );
        const { courses = [] } = res.data || {};

        if (!Array.isArray(courses)) {
          toast.error("Unexpected server response.");
          return;
        }

        const transformed = courses
          .filter((c) => c?.id && c?.slug)
          .map((course) => {
            const progressSeed = (course.id * 17) % 100;
            const title = course.title || "";
            return {
              ...course,
              category:
                course.category && course.category !== "Uncategorized"
                  ? course.category
                  : getCategoryFromTitle(title),
              categorySlug: getCategorySlug(title),
              difficulty: ["Beginner", "Intermediate", "Advanced"][
                course.id % 3
              ],
              progress: progressSeed < 20 ? progressSeed + 20 : progressSeed,
              thumbnail: getThumbnail(title),
            };
          });

        setCourses(transformed);

        if (transformed.length === 0) {
          toast.info(
            tab === "approved"
              ? "No approved courses yet. Please wait for admin approval."
              : "No pending enrollments found."
          );
        }
      } catch (err) {
        console.error("❌ fetchCourses error:", err);
        toast.error("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [tab]);

  useEffect(() => setCurrentPage(0), [searchQuery, categoryFilter, tab]);

  // Fetch lessons for a specific course
  const fetchCourseLessons = async (courseId) => {
    setLoadingLessons(true);
    try {
      const res = await axiosInstance.get(`/courses/${courseId}/lessons`);
      setCourseLessons(res.data?.lessons || []);
      if (!res.data?.lessons) toast.info("No lessons found for this course.");
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      toast.error("Failed to load lessons.");
      setCourseLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const handleGoToClass = (slug) => navigate(`/class/${slug}`);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    fetchCourseLessons(course.id);
  };

  // Filters
  const filtered = courses
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
    ...Array.from(new Set(courses.map((c) => c.category))),
  ];

  const handleUnenrollConfirmed = async () => {
    if (confirmUnenroll === null) return;
    try {
      await axiosInstance.delete(`/enrollments/${confirmUnenroll}`);
      toast.success("You have been unenrolled.");
      setCourses((prev) => prev.filter((c) => c.id !== confirmUnenroll));
      setSelectedCourse(null);
      setCourseLessons([]);
    } catch {
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
          <MyCourseCard
            key={course.id}
            course={course}
            tab={tab}
            onGoToClass={() => handleGoToClass(course.slug)}
            onViewDetails={() => handleViewDetails(course)}
          />
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

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          lessons={courseLessons}
          loadingLessons={loadingLessons}
          onClose={() => {
            setSelectedCourse(null);
            setCourseLessons([]);
          }}
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
