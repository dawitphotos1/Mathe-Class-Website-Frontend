// // src/pages/courses/Courses.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";
// import axiosInstance from "../../utils/axiosInstance";
// import CourseCurriculum from "../../components/CourseCurriculum";
// import "./Courses.css";

// const CourseSkeleton = () => (
//   <div className="course-item skeleton">
//     <div className="skeleton-title"></div>
//     <div className="skeleton-text short"></div>
//     <div className="skeleton-text long"></div>
//     <div className="skeleton-btn"></div>
//   </div>
// );

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
  
//   // Check if user came from payment success page
//   const fromPayment = location.state?.fromPayment || searchParams.get('fromPayment') === 'true';

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axiosInstance.get("/courses");
//         const data = res.data.courses || res.data;
//         setCourses(data);
//       } catch (err) {
//         console.error("❌ Failed to load courses:", err);
//         toast.error("Failed to load courses");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handleViewCurriculum = (slug) => {
//     setSelectedCourseSlug(slug);
//   };

//   const handleEnrollNow = (id) => {
//     navigate(`/payment/${id}`);
//   };

//   const handleCourseClick = (slug) => {
//     navigate(`/courses/${slug}`);
//   };

//   if (loading) {
//     return (
//       <div className="courses">
//         {/* Payment Success Navigation Banner */}
//         {fromPayment && (
//           <div className="payment-success-navigation">
//             <div className="success-banner">
//               <h3>🎉 Payment Successful!</h3>
//               <p>Your enrollment is pending admin approval. You can browse more courses or check your enrolled courses.</p>
//             </div>
//             <div className="navigation-buttons">
//               <button 
//                 onClick={() => navigate('/')}
//                 className="nav-btn home-btn"
//               >
//                 ← Return to Home
//               </button>
//               <button 
//                 onClick={() => navigate('/my-courses')}
//                 className="nav-btn courses-btn"
//               >
//                 View My Courses
//               </button>
//             </div>
//           </div>
//         )}

//         <h1>Available Courses</h1>
//         <div className="course-list">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <CourseSkeleton key={i} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!courses.length)
//     return (
//       <div className="courses">
//         {fromPayment && (
//           <div className="payment-success-navigation">
//             <div className="success-banner">
//               <h3>🎉 Payment Successful!</h3>
//               <p>Your enrollment is pending admin approval. You can browse more courses or check your enrolled courses.</p>
//             </div>
//             <div className="navigation-buttons">
//               <button 
//                 onClick={() => navigate('/')}
//                 className="nav-btn home-btn"
//               >
//                 ← Return to Home
//               </button>
//               <button 
//                 onClick={() => navigate('/my-courses')}
//                 className="nav-btn courses-btn"
//               >
//                 View My Courses
//               </button>
//             </div>
//           </div>
//         )}
//         <div className="error">No courses available</div>
//       </div>
//     );

//   return (
//     <div className="courses">
//       {/* Payment Success Navigation Banner */}
//       {fromPayment && (
//         <div className="payment-success-navigation">
//           <div className="success-banner">
//             <h3>🎉 Payment Successful!</h3>
//             <p>Your enrollment is pending admin approval. You can browse more courses or check your enrolled courses.</p>
//           </div>
//           <div className="navigation-buttons">
//             <button 
//               onClick={() => navigate('/')}
//               className="nav-btn home-btn"
//             >
//               ← Return to Home
//             </button>
//             <button 
//               onClick={() => navigate('/my-courses')}
//               className="nav-btn courses-btn"
//             >
//               View My Courses
//             </button>
//           </div>
//         </div>
//       )}

//       <h1>Available Courses</h1>
//       <p className="courses-subtitle">Browse all available math courses and find the perfect one for you</p>
      
//       <div className="course-list">
//         {courses.map((course) => (
//           <div key={course.id || course._id} className="course-item">
//             <div className="course-header" onClick={() => handleCourseClick(course.slug)}>
//               <h2>{course.title}</h2>
//               <p className="course-description">{course.description}</p>
//             </div>
            
//             <div className="course-details">
//               <p className="course-price">
//                 Price: ${parseFloat(course.price || 0).toFixed(2)}
//               </p>
//               {course.teacher && (
//                 <p className="course-teacher">
//                   Instructor: {course.teacher.name}
//                 </p>
//               )}
//             </div>

//             <div className="course-actions">
//               <button
//                 className="btn-enroll"
//                 onClick={() => handleEnrollNow(course.id || course._id)}
//               >
//                 Enroll Now - ${parseFloat(course.price || 0).toFixed(2)}
//               </button>

//               <button
//                 className="btn-preview"
//                 onClick={() => handleViewCurriculum(course.slug)}
//               >
//                 Free Preview
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedCourseSlug && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Course Curriculum</h3>
//               <button
//                 className="close-btn"
//                 onClick={() => setSelectedCourseSlug(null)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <CourseCurriculum courseSlug={selectedCourseSlug} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Courses;





// src/pages/courses/Courses.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import "./Courses.css";

const CourseSkeleton = () => (
  <div className="course-item skeleton">
    <div className="skeleton-title"></div>
    <div className="skeleton-text short"></div>
    <div className="skeleton-text long"></div>
    <div className="skeleton-btn"></div>
  </div>
);

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const { user } = useAuth();
  
  const fromPayment = location.state?.fromPayment || searchParams.get('fromPayment') === 'true';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses");
      const data = res.data.courses || res.data;
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCurriculum = (slug) => {
    setSelectedCourseSlug(slug);
  };

  const handleEnrollNow = (id) => {
    if (!user) {
      navigate("/login", { state: { from: `/courses` } });
      return;
    }
    navigate(`/payment/${id}`);
  };

  const handleCourseClick = (slug) => {
    navigate(`/courses/${slug}`);
  };

  const handleFreePreview = (courseId) => {
    navigate(`/courses/${courseId}/preview`);
  };

  if (loading) {
    return (
      <div className="courses">
        {fromPayment && (
          <div className="payment-success-navigation">
            <div className="success-banner">
              <h3>🎉 Payment Successful!</h3>
              <p>Your enrollment is pending admin approval.</p>
            </div>
            <div className="navigation-buttons">
              <button onClick={() => navigate('/')} className="nav-btn home-btn">
                ← Return to Home
              </button>
              <button onClick={() => navigate('/my-courses')} className="nav-btn courses-btn">
                View My Courses
              </button>
            </div>
          </div>
        )}

        <h1>Available Courses</h1>
        <div className="course-list">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="courses">
        {fromPayment && (
          <div className="payment-success-navigation">
            <div className="success-banner">
              <h3>🎉 Payment Successful!</h3>
              <p>Your enrollment is pending admin approval.</p>
            </div>
            <div className="navigation-buttons">
              <button onClick={() => navigate('/')} className="nav-btn home-btn">
                ← Return to Home
              </button>
              <button onClick={() => navigate('/my-courses')} className="nav-btn courses-btn">
                View My Courses
              </button>
            </div>
          </div>
        )}
        <div className="error">No courses available</div>
      </div>
    );
  }

  return (
    <div className="courses">
      {fromPayment && (
        <div className="payment-success-navigation">
          <div className="success-banner">
            <h3>🎉 Payment Successful!</h3>
            <p>Your enrollment is pending admin approval.</p>
          </div>
          <div className="navigation-buttons">
            <button onClick={() => navigate('/')} className="nav-btn home-btn">
              ← Return to Home
            </button>
            <button onClick={() => navigate('/my-courses')} className="nav-btn courses-btn">
              View My Courses
            </button>
          </div>
        </div>
      )}

      <h1>Available Courses</h1>
      <p className="courses-subtitle">Browse all available math courses</p>
      
      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id || course._id} className="course-item">
            <div className="course-header" onClick={() => handleCourseClick(course.slug)}>
              <h2>{course.title}</h2>
              <p className="course-description">{course.description}</p>
            </div>
            
            <div className="course-details">
              <p className="course-price">
                Price: ${parseFloat(course.price || 0).toFixed(2)}
              </p>
              {course.teacher && (
                <p className="course-teacher">
                  Instructor: {course.teacher.name}
                </p>
              )}
            </div>

            <div className="course-actions">
              <button
                className="btn-enroll"
                onClick={() => handleEnrollNow(course.id || course._id)}
              >
                Enroll Now - ${parseFloat(course.price || 0).toFixed(2)}
              </button>

              <button
                className="btn-preview"
                onClick={() => handleFreePreview(course.id)}
              >
                Free Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;