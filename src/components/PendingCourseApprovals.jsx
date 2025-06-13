// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../config";

// const PendingCourseApprovals = () => {
//   const [enrollments, setEnrollments] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${API_BASE_URL}/api/v1/admin/pending-enrollments`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setEnrollments(res.data);
//       } catch (err) {
//         toast.error("Failed to load pending enrollments");
//       }
//     };
//     fetchData();
//   }, []);

//   const handleApprove = async (userId, courseId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         `${API_BASE_URL}/api/v1/enrollments/approve`,
//         { userId, courseId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Enrollment approved");
//       setEnrollments((prev) =>
//         prev.filter((e) => !(e.userId === userId && e.courseId === courseId))
//       );
//     } catch (err) {
//       console.error("❌ Approve failed:", err.response?.data || err.message);
//       toast.error("Approval failed");
//     }
//   };
  
//   return (
//     <div className="dashboard-card">
//       <h3>Pending Course Enrollments</h3>
//       {enrollments.length === 0 ? (
//         <p>No pending enrollments</p>
//       ) : (
//         <table className="user-table">
//           <thead>
//             <tr>
//               <th>Student</th>
//               <th>Email</th>
//               <th>Course</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {enrollments.map((e, i) => (
//               <tr key={i}>
//                 <td>{e.User?.name}</td>
//                 <td>{e.User?.email}</td>
//                 <td>{e.Course?.title}</td>
//                 <td>
//                   <button
//                     onClick={() => handleApprove(e.userId, e.courseId)}
//                     className="btn-primary"
//                   >
//                     Approve
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default PendingCourseApprovals;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const PendingCourseApprovals = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/enrollments/pending`, // Updated endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEnrollments(res.data);
      } catch (err) {
        toast.error("Failed to load pending enrollments");
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (userId, courseId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/enrollments/approve`,
        { userId, courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Enrollment approved");
      setEnrollments((prev) =>
        prev.filter((e) => !(e.userId === userId && e.courseId === courseId))
      );
    } catch (err) {
      console.error("❌ Approve failed:", err.response?.data || err.message);
      toast.error("Approval failed");
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Pending Course Enrollments</h3>
      {enrollments.length === 0 ? (
        <p>No pending enrollments</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e, i) => (
              <tr key={i}>
                <td>{e.user?.name}</td> {/* Changed from e.User?.name */}
                <td>{e.user?.email}</td> {/* Changed from e.User?.email */}
                <td>{e.course?.title}</td> {/* Changed from e.Course?.title */}
                <td>
                  <button
                    onClick={() => handleApprove(e.userId, e.courseId)}
                    className="btn-primary"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingCourseApprovals;
