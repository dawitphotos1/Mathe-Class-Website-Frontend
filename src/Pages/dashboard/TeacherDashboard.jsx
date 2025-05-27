
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../config";
// import { toast } from "react-toastify";
// import "./TeacherDashboard.css";

// const TeacherDashboard = () => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchPendingStudents = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/v1/users/pending`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setStudents(res.data);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       toast.error("Failed to load pending students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (userId) => {
//     try {
//       await axios.post(
//         `${API_BASE_URL}/api/v1/users/approve/${userId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.success("Student approved");
//       fetchPendingStudents(); // Refresh list
//     } catch (err) {
//       console.error("Approve error:", err);
//       toast.error("Failed to approve student");
//     }
//   };

//   const handleReject = async (userId) => {
//     try {
//       await axios.post(
//         `${API_BASE_URL}/api/v1/users/reject/${userId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.warn("Student rejected");
//       fetchPendingStudents(); // Refresh list
//     } catch (err) {
//       console.error("Reject error:", err);
//       toast.error("Failed to reject student");
//     }
//   };

//   useEffect(() => {
//     fetchPendingStudents();
//   }, []);

//   return (
//     <div className="teacher-dashboard">
//       <h1>Welcome, Teacher 👩‍🏫</h1>

//       <div className="pending-students-section">
//         <h2>Pending Student Approvals</h2>
//         {loading ? (
//           <p>Loading...</p>
//         ) : students.length === 0 ? (
//           <p>No pending students</p>
//         ) : (
//           <div className="student-list">
//             {students.map((student) => (
//               <div key={student.id} className="student-card">
//                 <div className="student-info">
//                   <strong>{student.name}</strong> ({student.email})<br />
//                   Subject: {student.subject || "N/A"}
//                 </div>
//                 <div className="actions">
//                   <button
//                     className="btn-approve"
//                     onClick={() => handleApprove(student.id)}
//                   >
//                     ✅ Approve
//                   </button>
//                   <button
//                     className="btn-reject"
//                     onClick={() => handleReject(student.id)}
//                   >
//                     ❌ Reject
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;




// ✅ TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/enrollments/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrollments(res.data);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
      toast.error("Could not load course enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, courseId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/enrollments/approve`,
        { userId, courseId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Enrollment approved");
      fetchEnrollments();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (userId, courseId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/enrollments/reject`,
        { userId, courseId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.warn("Enrollment rejected");
      fetchEnrollments();
    } catch {
      toast.error("Failed to reject");
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="teacher-dashboard">
      <h1>Welcome, Teacher 👩‍🏫</h1>
      <section className="course-enrollments-section">
        <h2>📚 Pending Course Enrollments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : enrollments.length === 0 ? (
          <p>No pending enrollments</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={`${e.userId}-${e.courseId}`}>
                  <td>{e.user?.name}</td>
                  <td>{e.user?.email}</td>
                  <td>{e.course?.title}</td>
                  <td>{new Date(e.accessGrantedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(e.userId, e.courseId)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(e.userId, e.courseId)}
                    >
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default TeacherDashboard;
