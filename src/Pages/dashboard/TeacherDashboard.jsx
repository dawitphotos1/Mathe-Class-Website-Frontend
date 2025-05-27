
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import CourseEnrollments from "../courses/CourseEnrollmentList";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      setUserRole(user.role);
    }
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/users/pending`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/users/approved`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/users/rejected`, { headers }),
      ]);

      setPending(pendingRes.data);
      setApproved(approvedRes.data);
      setRejected(rejectedRes.data);
    } catch (err) {
      console.error("Error fetching student data:", err);
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/users/approve/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Student approved");
      fetchAllStudents();
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve student");
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/users/reject/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.warn("Student rejected");
      fetchAllStudents();
    } catch (err) {
      console.error("Reject error:", err);
      toast.error("Failed to reject student");
    }
  };

  const renderStudentList = (students, showActions = false) => {
    if (students.length === 0) return <p>No students</p>;

    return students.map((student) => (
      <div key={student.id} className="student-card">
        <div className="student-info">
          <strong>{student.name}</strong> ({student.email})<br />
          Subject: {student.subject || "N/A"}
        </div>
        {showActions && (
          <div className="actions">
            <button
              className="btn-approve"
              onClick={() => handleApprove(student.id)}
            >
              ✅ Approve
            </button>
            <button
              className="btn-reject"
              onClick={() => handleReject(student.id)}
            >
              ❌ Reject
            </button>
            {/* 🚫 NO DELETE BUTTON even if accidentally left in earlier */}
            {userRole === "admin" && (
              <button className="btn-delete" disabled>
                🗑️ Delete (Admin Only)
              </button>
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="teacher-dashboard">
      <h1>Welcome, {userRole === "admin" ? "Admin" : "Teacher"} 👩‍🏫</h1>

      <section className="pending-students-section">
        <h2>⏳ Pending Student Approvals</h2>
        {loading ? <p>Loading...</p> : renderStudentList(pending, true)}
      </section>

      <section className="approved-students-section">
        <h2>✅ Approved Students</h2>
        {renderStudentList(approved)}
      </section>

      <section className="rejected-students-section">
        <h2>❌ Rejected Students</h2>
        {renderStudentList(rejected)}
      </section>

      <hr />

      <section className="course-enrollments-section">
        <h2>📚 Course Enrollment Requests</h2>
        <CourseEnrollments />
      </section>
    </div>
  );
};

export default TeacherDashboard;
