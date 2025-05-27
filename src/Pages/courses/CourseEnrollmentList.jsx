// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../config";
// import { toast } from "react-toastify";

// const CourseEnrollments = () => {
//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchEnrollments = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const headers = { Authorization: `Bearer ${token}` };

//       const [pendingRes, approvedRes] = await Promise.all([
//         axios.get(`${API_BASE_URL}/admin/enrollments/pending`, { headers }),
//         axios.get(`${API_BASE_URL}/admin/enrollments/approved`, { headers }),
//       ]);

//       setPendingEnrollments(pendingRes.data);
//       setApprovedEnrollments(approvedRes.data);
//     } catch (err) {
//       console.error("Failed to load enrollments:", err);
//       toast.error("Failed to fetch course enrollments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveEnrollment = async (userId, courseId) => {
//     try {
//       await axios.post(
//         `${API_BASE_URL}/admin/enrollments/approve`,
//         { userId, courseId },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.success("Enrollment approved");
//       fetchEnrollments();
//     } catch (err) {
//       console.error("Enrollment approval failed:", err);
//       toast.error("Failed to approve enrollment");
//     }
//   };

//   useEffect(() => {
//     fetchEnrollments();
//   }, []);

//   return (
//     <div>
//       <h2>⏳ Pending Course Enrollments</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : pendingEnrollments.length === 0 ? (
//         <p>No pending enrollments</p>
//       ) : (
//         pendingEnrollments.map((e, idx) => (
//           <div key={idx} className="enrollment-card">
//             <p>
//               <strong>{e.user.name}</strong> ({e.user.email}) wants to enroll in{" "}
//               <strong>{e.course.title}</strong>
//             </p>
//             <button
//               onClick={() => handleApproveEnrollment(e.userId, e.courseId)}
//             >
//               ✅ Approve Enrollment
//             </button>
//           </div>
//         ))
//       )}

//       <h2>✅ Approved Enrollments</h2>
//       {approvedEnrollments.length === 0 ? (
//         <p>No approved enrollments</p>
//       ) : (
//         approvedEnrollments.map((e, idx) => (
//           <div key={idx} className="enrollment-card">
//             <p>
//               <strong>{e.user.name}</strong> ({e.user.email}) enrolled in{" "}
//               <strong>{e.course.title}</strong>
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default CourseEnrollments;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./CourseEnrollmentList.css"; // Optional CSS file

const CourseEnrollmentList = () => {
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [pendingRes, approvedRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/enrollments/pending`, { headers }),
        axios.get(`${API_BASE_URL}/admin/enrollments/approved`, { headers }),
      ]);

      setPendingEnrollments(pendingRes.data);
      setApprovedEnrollments(approvedRes.data);
    } catch (err) {
      console.error("Failed to load enrollments:", err);
      toast.error("Failed to fetch course enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEnrollment = async (userId, courseId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/admin/enrollments/approve`,
        { userId, courseId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Enrollment approved");
      fetchEnrollments();
    } catch (err) {
      console.error("Enrollment approval failed:", err);
      toast.error("Failed to approve enrollment");
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="course-enrollment-list">
      {loading ? (
        <p>Loading enrollments...</p>
      ) : (
        <>
          <h3>⏳ Pending Course Enrollments</h3>
          {pendingEnrollments.length === 0 ? (
            <p>No pending enrollments</p>
          ) : (
            pendingEnrollments.map((e, idx) => (
              <div key={idx} className="enrollment-card">
                <p>
                  <strong>{e.user.name}</strong> ({e.user.email}) wants to
                  enroll in <strong>{e.course.title}</strong>
                </p>
                <button
                  className="btn-approve"
                  onClick={() => handleApproveEnrollment(e.userId, e.courseId)}
                >
                  ✅ Approve Enrollment
                </button>
              </div>
            ))
          )}

          <h3>✅ Approved Enrollments</h3>
          {approvedEnrollments.length === 0 ? (
            <p>No approved enrollments</p>
          ) : (
            approvedEnrollments.map((e, idx) => (
              <div key={idx} className="enrollment-card approved">
                <p>
                  <strong>{e.user.name}</strong> ({e.user.email}) enrolled in{" "}
                  <strong>{e.course.title}</strong>
                </p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default CourseEnrollmentList;

