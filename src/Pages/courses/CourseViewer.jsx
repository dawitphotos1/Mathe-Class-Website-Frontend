
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { loadStripe } from "@stripe/stripe-js";
// import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";

// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// const CourseViewer = () => {
//   const { slug: courseSlug } = useParams();
//   const navigate = useNavigate();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [enrolling, setEnrolling] = useState(false);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please log in to view courses");
//           navigate("/login");
//           return;
//         }

//         const res = await axios.get(
//           `${API_BASE_URL}/api/v1/courses/slug/${courseSlug}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!res.data?.success) {
//           throw new Error("Invalid course response format");
//         }

//         const data = res.data;

//         const formatted = {
//           id: data.id?.toString(),
//           title: data.title ?? "Untitled Course",
//           price: Number(data.price) || 0,
//           description: data.description || "No description available.",
//           studentCount: data.studentCount || 0,
//           introVideoUrl: data.introVideoUrl || null,
//           thumbnail: data.thumbnail || null,
//           teacher: {
//             name: data.teacher?.name || "Unknown Instructor",
//             profileImage: data.teacher?.profileImage || null,
//           },
//           units: Array.isArray(data.units) ? data.units : [],
//         };

//         console.log("✅ Loaded course:", formatted);
//         setCourse(formatted);
//       } catch (err) {
//         console.error(
//           "❌ Error loading course:",
//           err.response?.data || err.message
//         );
//         toast.error(err.response?.data?.error || "Failed to load course");
//         setCourse(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [courseSlug, navigate]);

//   const handleEnroll = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please log in to enroll");
//         navigate("/login");
//         return;
//       }

//       if (!course?.id || isNaN(course.price)) {
//         toast.error("Invalid course data for enrollment");
//         return;
//       }

//       setEnrolling(true);

//       const payload = {
//         courseId: course.id,
//         courseTitle: course.title,
//         coursePrice: course.price,
//       };

//       const res = await axios.post(
//         `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       const stripe = await stripePromise;
//       await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
//     } catch (err) {
//       console.error("❌ Enroll error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.error || "Enrollment failed");
//       setEnrolling(false);
//     }
//   };

//   if (loading) return <div>⏳ Loading course...</div>;
//   if (!course) return <div>❌ Course not found</div>;

//   return (
//     <div className="course-view-container">
//       <h1>{course.title}</h1>

//       {course.thumbnail && (
//         <img
//           src={course.thumbnail}
//           alt={course.title}
//           style={{ maxWidth: "300px", borderRadius: "8px" }}
//         />
//       )}

//       <p>
//         <strong>Price:</strong> ${course.price.toFixed(2)}
//       </p>
//       <p>
//         <strong>Students Enrolled:</strong> {course.studentCount}
//       </p>
//       <p>
//         <strong>Description:</strong> {course.description}
//       </p>

//       {course.introVideoUrl && (
//         <div style={{ margin: "1rem 0" }}>
//           <video controls width="100%" style={{ maxWidth: "640px" }}>
//             <source src={course.introVideoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}

//       <div
//         className="teacher-info"
//         style={{ display: "flex", alignItems: "center", gap: "1rem" }}
//       >
//         {course.teacher?.profileImage && (
//           <img
//             src={course.teacher.profileImage}
//             alt={course.teacher.name}
//             width={60}
//             height={60}
//             style={{ borderRadius: "50%" }}
//           />
//         )}
//         <p>
//           <strong>Instructor:</strong> {course.teacher.name}
//         </p>
//       </div>

//       <button onClick={handleEnroll} disabled={enrolling}>
//         {enrolling ? "⏳ Enrolling..." : "💳 Enroll Now"}
//       </button>

//       <hr />

//       <h2>📚 Course Content</h2>
//       {course.units.length === 0 ? (
//         <p>No content available yet.</p>
//       ) : (
//         course.units.map((unit, idx) => (
//           <div key={idx} style={{ marginBottom: "2rem" }}>
//             <h3>📘 {unit.unitName}</h3>
//             <ul>
//               {unit.lessons?.length ? (
//                 unit.lessons.map((lesson) => (
//                   <li key={lesson.id}>
//                     <strong>{lesson.title}</strong>: {lesson.description}
//                   </li>
//                 ))
//               ) : (
//                 <li>No lessons in this unit.</li>
//               )}
//             </ul>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default CourseViewer;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

const CourseViewer = () => {
  const { slug: courseSlug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view courses");
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `${API_BASE_URL}/api/v1/courses/slug/${courseSlug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data?.success) {
          throw new Error(res.data.error || "Invalid course response");
        }

        const data = res.data;
        const formatted = {
          id: data.id?.toString(),
          title: data.title ?? "Untitled Course",
          price: Number(data.price) || 0,
          description: data.description || "No description available",
          studentCount: Number(data.studentCount) || 0,
          introVideoUrl: data.introVideoUrl || null,
          thumbnail: data.thumbnail || null,
          teacher: {
            name: data.teacher?.name || "Unknown Instructor",
            profileImage: data.teacher?.profileImage || null,
          },
          units: Array.isArray(data.units) ? data.units : [],
        };

        setCourse(formatted);
      } catch (err) {
        console.error("Error loading course:", err);
        toast.error(err.response?.data?.error || "Failed to load course");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseSlug, navigate]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to enroll");
        navigate("/login");
        return;
      }

      if (!course?.id || isNaN(course.price)) {
        toast.error("Invalid course data for enrollment");
        return;
      }

      setEnrolling(true);

      const payload = {
        courseId: course.id,
        courseName: course.title,
        coursePrice: parseFloat(course.price),
      };

      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      if (!stripe) throw new Error("Stripe not loaded.");

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
    } catch (err) {
      console.error("Enroll error:", err);
      toast.error(err.response?.data?.error || "Enrollment failed");
      setEnrolling(false);
    }
  };

  if (loading) return <div className="loading">⏳ Loading course...</div>;
  if (!course) return <div className="error">❌ Course not found</div>;

  return (
    <div className="course-view-container">
      <h1>{course.title}</h1>

      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          style={{ maxWidth: "300px", borderRadius: "8px" }}
        />
      )}

      <p>
        <strong>Price:</strong> ${course.price.toFixed(2)}
      </p>
      <p>
        <strong>Students Enrolled:</strong> {course.studentCount}
      </p>
      <p>
        <strong>Description:</strong> {course.description}
      </p>

      {course.introVideoUrl && (
        <div style={{ margin: "1rem 0" }}>
          <video controls width="100%" style={{ maxWidth: "640px" }}>
            <source src={course.introVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div
        className="teacher-info"
        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
      >
        {course.teacher?.profileImage && (
          <img
            src={course.teacher.profileImage}
            alt={course.teacher.name}
            width={60}
            height={60}
            style={{ borderRadius: "50%" }}
          />
        )}
        <p>
          <strong>Instructor:</strong> {course.teacher.name}
        </p>
      </div>

      <button onClick={handleEnroll} disabled={enrolling}>
        {enrolling ? "⏳ Enrolling..." : "💳 Enroll Now"}
      </button>

      <hr />

      <h2>📚 Course Content</h2>
      {course.units.length === 0 ? (
        <p>No content available yet.</p>
      ) : (
        course.units.map((unit, idx) => (
          <div key={idx} style={{ marginBottom: "2rem" }}>
            <h3>📘 {unit.unitName}</h3>
            <ul>
              {unit.lessons?.length ? (
                unit.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <strong>{lesson.title}</strong>: {lesson.description}
                  </li>
                ))
              ) : (
                <li>No lessons in this unit.</li>
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseViewer;