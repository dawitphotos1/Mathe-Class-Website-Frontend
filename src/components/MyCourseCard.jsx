
// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { FaEye } from "react-icons/fa";
// import { AiFillStar, AiOutlineStar } from "react-icons/ai";
// import CourseModal from "./CourseModal";
// import "./MyCourseCard.css";

// const MyCourseCard = ({ course, tab, onGoToClass }) => {
//   const [imgLoaded, setImgLoaded] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(course.isFavorite || false);

//   const toggleFavorite = async () => {
//     try {
//       const updated = !isFavorite;
//       setIsFavorite(updated);
//       await axios.patch(`/api/v1/courses/${course.id}/favorite`, {
//         favorite: updated,
//       });
//     } catch (err) {
//       console.error("Failed to update favorite", err);
//       setIsFavorite(!isFavorite); // revert if failed
//     }
//   };

//   return (
//     <>
//       <motion.div
//         className={`course-card ${tab}`}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//       >
//         <div
//           className="thumbnail-wrapper"
//           onClick={() => setShowModal(true)}
//           title="Click to view details"
//         >
//           {!imgLoaded && <div className="shimmer-box" />}
//           <img
//             src={course.thumbnail}
//             alt={course.title}
//             className={`course-thumbnail ${imgLoaded ? "" : "hidden"}`}
//             onLoad={() => setImgLoaded(true)}
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = "/images/default.jpg";
//               setImgLoaded(true);
//             }}
//           />
//         </div>

//         <div className="course-details">
//           <h4>{course.title}</h4>
//           <p>{course.description}</p>

//           <span className="category-badge">{course.category}</span>

//           <span
//             className={`difficulty-badge ${
//               course.difficulty?.toLowerCase() || "unknown"
//             }`}
//           >
//             {course.difficulty || "N/A"}
//           </span>

//           {tab === "approved" ? (
//             <div className="progress-wrapper">
//               <span className="favorite-icon" onClick={toggleFavorite}>
//                 {isFavorite ? (
//                   <AiFillStar color="#f1c40f" />
//                 ) : (
//                   <AiOutlineStar />
//                 )}
//               </span>
//               <div className="linear-progress">
//                 <div
//                   className="linear-fill"
//                   style={{ width: `${course.progress}%` }}
//                   title={`${course.progress}%`}
//                 ></div>
//               </div>
//               <button
//                 className="go-to-class"
//                 onClick={() => onGoToClass(course.id)}
//               >
//                 Go to Class
//               </button>
//             </div>
//           ) : (
//             <span className="badge">⏳ Awaiting Approval</span>
//           )}

//           <button className="go-to-class" onClick={() => setShowModal(true)}>
//             <FaEye style={{ marginRight: 6 }} /> View Details
//           </button>
//         </div>
//       </motion.div>

//       {showModal && (
//         <CourseModal course={course} onClose={() => setShowModal(false)} />
//       )}
//     </>
//   );
// };

// export default MyCourseCard;




// ✅ MyCourseCard.jsx (Integrated Components)
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import CourseModal from "./CourseModal";
import CourseProgressBar from "./CourseProgressBar";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";

const MyCourseCard = ({ course, tab, onGoToClass }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(course.isFavorite || false);

  const toggleFavorite = async () => {
    try {
      const updated = !isFavorite;
      setIsFavorite(updated);
      await axios.patch(`/api/v1/courses/${course.id}/favorite`, {
        favorite: updated,
      });
    } catch (err) {
      console.error("Failed to update favorite", err);
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <motion.div
      className="rounded-xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden hover:shadow-2xl transition duration-300 relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="cursor-pointer h-48 overflow-hidden relative"
        onClick={() => setShowModal(true)}
      >
        {!imgLoaded && <div className="bg-gray-200 animate-pulse h-full w-full" />}
        <img
          src={course.thumbnail}
          alt={course.title}
          className={`object-cover w-full h-full ${imgLoaded ? "" : "hidden"}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default.jpg";
            setImgLoaded(true);
          }}
        />
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          {isFavorite ? <AiFillStar className="text-yellow-400" /> : <AiOutlineStar />}
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg truncate">{course.title}</h3>
          <StatusBadge status={course.status} />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{course.description}</p>

        <div className="text-sm flex items-center justify-between">
          <CategoryBadge category={course.category} />
          <span
            className={`text-xs px-2 py-1 rounded-full text-white ${
              course.difficulty === "Beginner"
                ? "bg-green-500"
                : course.difficulty === "Intermediate"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {course.difficulty}
          </span>
        </div>

        {tab === "approved" && (
          <>
            <div className="mt-2">
              <CourseProgressBar progress={course.progress} />
            </div>

            <div className="flex justify-between items-center mt-3">
              <button
                onClick={() => onGoToClass(course.slug)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Start Course
              </button>

              <button
                className="flex items-center text-gray-600 text-sm hover:underline"
                onClick={() => setShowModal(true)}
              >
                <FaEye className="mr-1" /> Details
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <CourseModal course={course} onClose={() => setShowModal(false)} />
      )}
    </motion.div>
  );
};

export default MyCourseCard;
