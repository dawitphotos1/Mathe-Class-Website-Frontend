
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
//   const [loadingCourse, setLoadingCourse] = useState(true);
//   const [enrolling, setEnrolling] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please log in to view courses");
//           navigate("/login");
//           return;
//         }

//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/courses/slug/${courseSlug}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const courseData = response.data;
//         const formatted = {
//           id: courseData.id?.toString(),
//           name: courseData.title?.toString(),
//           price: parseFloat(courseData.price) || 0,
//           description: courseData.description || "No description available",
//           teacher: courseData.teacher?.name || "Unknown",
//           features: Array.isArray(courseData.features)
//             ? courseData.features
//             : [], // ✅ Add this line
//         };

//         if (!formatted.id || !formatted.name) {
//           throw new Error("Invalid course data");
//         }

//         setCourse(formatted);
//         setLoadingCourse(false);
//       } catch (err) {
//         console.error(
//           "❌ Fetch course error:",
//           err.response?.data || err.message
//         );
//         setError(err.response?.data?.error || "Failed to load course");
//         setLoadingCourse(false);
//       }
//     };

//     fetchCourse();
//   }, [courseSlug, navigate]);

//   const handleEnroll = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Please log in to enroll");
//       navigate("/login");
//       return;
//     }

//     if (!course || !course.id || !course.name || isNaN(course.price)) {
//       console.error("🚫 Invalid course object:", course);
//       toast.error("Course data not loaded properly");
//       return;
//     }

//     setEnrolling(true);

//     try {
//       const payload = {
//         courseId: course.id,
//         courseTitle: course.name,
//         coursePrice: course.price,
//       };

//       const response = await axios.post(
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
//       await stripe.redirectToCheckout({
//         sessionId: response.data.sessionId,
//       });
//     } catch (err) {
//       console.error("❌ Enroll error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.error || "Enrollment failed");
//       setEnrolling(false);
//     }
//   };

//   if (loadingCourse) return <div>Loading course...</div>;
//   if (error) return <div className="error">❌ {error}</div>;
//   if (!course) return <div>⚠️ Course not found</div>;

//   return (
//     <div className="course-view-container">
//       <h2>{course.name}</h2>
//       <p>{course.description}</p>
//       <p>Price: ${course.price.toFixed(2)}</p>
//       <p>Instructor: {course.teacher}</p>
//       <button
//         onClick={handleEnroll}
//         className="enroll-button"
//         disabled={enrolling}
//       >
//         {enrolling ? "⏳ Enrolling..." : "Enroll Now"}
//       </button>
//     </div>
//   );
// };

// export default CourseViewer;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL, STRIPE_PUBLIC_KEY } from "../../config";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

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
          throw new Error("Invalid course response format");
        }

        const data = res.data;

        const formatted = {
          id: data.id?.toString(),
          title: data.title ?? "Untitled Course",
          price: Number(data.price) || 0,
          description: data.description || "No description available.",
          studentCount: data.studentCount || 0,
          introVideoUrl: data.introVideoUrl || null,
          thumbnail: data.thumbnail || null,
          teacher: {
            name: data.teacher?.name || "Unknown Instructor",
            profileImage: data.teacher?.profileImage || null,
          },
          units: Array.isArray(data.units) ? data.units : [],
        };

        console.log("✅ Loaded course:", formatted);
        setCourse(formatted);
      } catch (err) {
        console.error(
          "❌ Error loading course:",
          err.response?.data || err.message
        );
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
        courseTitle: course.title,
        coursePrice: course.price,
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/payments/create-checkout-session`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
    } catch (err) {
      console.error("❌ Enroll error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Enrollment failed");
      setEnrolling(false);
    }
  };

  if (loading) return <div>⏳ Loading course...</div>;
  if (!course) return <div>❌ Course not found</div>;

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
