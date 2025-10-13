// // src/Pages/AdminDashboard.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";
// import "./AdminDashboard.css";

// const AdminDashboard = () => {
//   const { user, isAuthenticated, logoutUser } = useAuth();
//   const navigate = useNavigate();

//   // Students
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [approvedUsers, setApprovedUsers] = useState([]);
//   const [rejectedUsers, setRejectedUsers] = useState([]);
//   const [errorUsers, setErrorUsers] = useState("");

//   // Enrollments
//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [rejectedEnrollments, setRejectedEnrollments] = useState([]);
//   const [errorEnrollments, setErrorEnrollments] = useState("");

//   // Tabs
//   const [activeUserTab, setActiveUserTab] = useState("pending");
//   const [activeEnrollTab, setActiveEnrollTab] = useState("pending");

//   // 🔒 Global error handler
//   const handleError = useCallback(
//     (err, setError) => {
//       const status = err.response?.status;
//       if (status === 401) {
//         logoutUser();
//         toast.error("Session expired. Please log in again.");
//         navigate("/login");
//       } else {
//         const errorMsg = err.response?.data?.error || "Something went wrong";
//         toast.error(errorMsg);
//         setError(errorMsg);
//       }
//     },
//     [navigate, logoutUser]
//   );

//   // 📌 Fetch students
//   const fetchUsersByStatus = useCallback(
//     async (status, setter) => {
//       try {
//         const res = await axiosInstance.get(`/admin/students?status=${status}`);
//         setter(res.data.students || []);
//       } catch (err) {
//         handleError(err, setErrorUsers);
//       }
//     },
//     [handleError]
//   );

//   // 📌 Fetch enrollments
//   const fetchEnrollmentsByStatus = useCallback(
//     async (status, setter) => {
//       try {
//         const res = await axiosInstance.get(`/admin/enrollments?status=${status}`);
//         setter(res.data.enrollments || []);
//       } catch (err) {
//         handleError(err, setErrorEnrollments);
//       }
//     },
//     [handleError]
//   );

//   // 📌 Approve / reject students
//   const handleApproveUser = async (userId) => {
//     try {
//       await axiosInstance.patch(`/admin/students/${userId}/approve`);
//       toast.success("Student approved");
//       fetchUsersByStatus("pending", setPendingUsers);
//       fetchUsersByStatus("approved", setApprovedUsers);
//     } catch (err) {
//       handleError(err, setErrorUsers);
//     }
//   };

//   const handleRejectUser = async (userId) => {
//     try {
//       await axiosInstance.patch(`/admin/students/${userId}/reject`);
//       toast.success("Student rejected");
//       fetchUsersByStatus("pending", setPendingUsers);
//       fetchUsersByStatus("rejected", setRejectedUsers);
//     } catch (err) {
//       handleError(err, setErrorUsers);
//     }
//   };

//   // 📌 Approve / reject enrollments
//   const handleApproveEnrollment = async (enrollmentId) => {
//     try {
//       await axiosInstance.patch(`/admin/enrollments/${enrollmentId}/approve`);
//       toast.success("Enrollment approved");
//       fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//       fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
//     } catch (err) {
//       handleError(err, setErrorEnrollments);
//     }
//   };

//   const handleRejectEnrollment = async (enrollmentId) => {
//     try {
//       await axiosInstance.patch(`/admin/enrollments/${enrollmentId}/reject`);
//       toast.success("Enrollment rejected");
//       fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//       fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
//     } catch (err) {
//       handleError(err, setErrorEnrollments);
//     }
//   };

//   // 🚀 Initial fetch
//   useEffect(() => {
//     if (isAuthenticated && user?.role === "admin") {
//       fetchUsersByStatus("pending", setPendingUsers);
//       fetchUsersByStatus("approved", setApprovedUsers);
//       fetchUsersByStatus("rejected", setRejectedUsers);

//       fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//       fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
//       fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
//     }
//   }, [isAuthenticated, user?.role, fetchUsersByStatus, fetchEnrollmentsByStatus]);

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h2>Admin Dashboard</h2>
//         <button onClick={logoutUser} className="btn-secondary logout-btn">
//           Logout
//         </button>
//       </div>

//       {/* Section 1: Students */}
//       <h3>Student Approvals</h3>
//       <div className="admin-tabs">
//         <button
//           className={activeUserTab === "pending" ? "tab-button tab-active" : "tab-button"}
//           onClick={() => setActiveUserTab("pending")}
//         >
//           Pending
//         </button>
//         <button
//           className={activeUserTab === "approved" ? "tab-button tab-active" : "tab-button"}
//           onClick={() => setActiveUserTab("approved")}
//         >
//           Approved
//         </button>
//         <button
//           className={activeUserTab === "rejected" ? "tab-button tab-active" : "tab-button"}
//           onClick={() => setActiveUserTab("rejected")}
//         >
//           Rejected
//         </button>
//       </div>

//       {errorUsers && <p className="error">{errorUsers}</p>}

//       {activeUserTab === "pending" &&
//         (pendingUsers.length === 0 ? (
//           <p>No pending students</p>
//         ) : (
//           <table className="user-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Subject</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pendingUsers.map((pu) => (
//                 <tr key={pu.id}>
//                   <td>{pu.name}</td>
//                   <td>{pu.email}</td>
//                   <td>{pu.subject || "N/A"}</td>
//                   <td>
//                     <button onClick={() => handleApproveUser(pu.id)} className="btn-primary">
//                       Approve
//                     </button>
//                     <button onClick={() => handleRejectUser(pu.id)} className="btn-danger">
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ))}

//       {activeUserTab === "approved" &&
//         (approvedUsers.length === 0 ? (
//           <p>No approved students</p>
//         ) : (
//           <table className="user-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Subject</th>
//               </tr>
//             </thead>
//             <tbody>
//               {approvedUsers.map((au) => (
//                 <tr key={au.id}>
//                   <td>{au.name}</td>
//                   <td>{au.email}</td>
//                   <td>{au.subject || "N/A"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ))}

//       {activeUserTab === "rejected" &&
//         (rejectedUsers.length === 0 ? (
//           <p>No rejected students</p>
//         ) : (
//           <table className="user-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Subject</th>
//                 <th>Rejected On</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rejectedUsers.map((ru) => (
//                 <tr key={ru.id}>
//                   <td>{ru.name}</td>
//                   <td>{ru.email}</td>
//                   <td>{ru.subject || "N/A"}</td>
//                   <td>{new Date(ru.updatedAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ))}

//       {/* Section 2: Enrollments */}
//       <h3>Course Enrollments</h3>
//       <div className="admin-tabs">
//         <button
//           className={activeEnrollTab === "pending" ? "tab-button tab-active" : "tab-button"}
//           onClick={() => setActiveEnrollTab("pending")}
//         >
//           Pending
//         </button>
//         <button
//           className={activeEnrollTab === "approved" ? "tab-button tab-active" : "tab-button"}
//           onClick={() => setActiveEnrollTab("approved")}
//         >
//           Approved
//         </button>
//         <button
//           className={activeEnrollTab === "rejected" ? "tab-button tab-active" : "tab-button"}
//           onClick={() => setActiveEnrollTab("rejected")}
//         >
//           Rejected
//         </button>
//       </div>

//       {activeEnrollTab === "pending" ? (
//         pendingEnrollments.length === 0 ? (
//           <p>No pending enrollments</p>
//         ) : (
//           <table className="enrollment-table">
//             <thead>
//               <tr>
//                 <th>Student</th>
//                 <th>Email</th>
//                 <th>Course</th>
//                 <th>Payment Status</th>
//                 <th>Approval Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pendingEnrollments.map((enroll) => (
//                 <tr key={enroll.id}>
//                   <td>{enroll.student?.name}</td>
//                   <td>{enroll.student?.email}</td>
//                   <td>{enroll.course?.title}</td>
//                   <td>{enroll.payment_status}</td>
//                   <td>{enroll.approval_status}</td>
//                   <td>
//                     <button
//                       onClick={() => handleApproveEnrollment(enroll.id)}
//                       className="btn-primary"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleRejectEnrollment(enroll.id)}
//                       className="btn-danger"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )
//       ) : activeEnrollTab === "approved" ? (
//         approvedEnrollments.length === 0 ? (
//           <p>No approved enrollments</p>
//         ) : (
//           <table className="enrollment-table">
//             <thead>
//               <tr>
//                 <th>Student</th>
//                 <th>Email</th>
//                 <th>Course</th>
//                 <th>Payment Status</th>
//                 <th>Approval Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {approvedEnrollments.map((enroll) => (
//                 <tr key={enroll.id}>
//                   <td>{enroll.student?.name}</td>
//                   <td>{enroll.student?.email}</td>
//                   <td>{enroll.course?.title}</td>
//                   <td>{enroll.payment_status}</td>
//                   <td>{enroll.approval_status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )
//       ) : (
//         rejectedEnrollments.length === 0 ? (
//           <p>No rejected enrollments</p>
//         ) : (
//           <table className="enrollment-table">
//             <thead>
//               <tr>
//                 <th>Student</th>
//                 <th>Email</th>
//                 <th>Course</th>
//                 <th>Payment Status</th>
//                 <th>Approval Status</th>
//                 <th>Rejected On</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rejectedEnrollments.map((enroll) => (
//                 <tr key={enroll.id}>
//                   <td>{enroll.student?.name}</td>
//                   <td>{enroll.student?.email}</td>
//                   <td>{enroll.course?.title}</td>
//                   <td>{enroll.payment_status}</td>
//                   <td>{enroll.approval_status}</td>
//                   <td>{new Date(enroll.updatedAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;





// src/Pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();

  // 👤 Students
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [errorUsers, setErrorUsers] = useState("");

  // 🎓 Enrollments
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [rejectedEnrollments, setRejectedEnrollments] = useState([]);
  const [errorEnrollments, setErrorEnrollments] = useState("");

  // Tabs
  const [activeUserTab, setActiveUserTab] = useState("pending");
  const [activeEnrollTab, setActiveEnrollTab] = useState("pending");

  // 🔒 Error handler
  const handleError = useCallback(
    (err, setError) => {
      const status = err.response?.status;
      if (status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        const errorMsg = err.response?.data?.error || "Something went wrong";
        toast.error(errorMsg);
        setError(errorMsg);
      }
    },
    [navigate, logoutUser]
  );

  // Fetch functions
  const fetchUsersByStatus = useCallback(
    async (status, setter) => {
      try {
        const res = await axiosInstance.get(`/admin/students?status=${status}`);
        setter(res.data.students || []);
      } catch (err) {
        handleError(err, setErrorUsers);
      }
    },
    [handleError]
  );

  const fetchEnrollmentsByStatus = useCallback(
    async (status, setter) => {
      try {
        const res = await axiosInstance.get(`/admin/enrollments?status=${status}`);
        setter(res.data.enrollments || []);
      } catch (err) {
        handleError(err, setErrorEnrollments);
      }
    },
    [handleError]
  );

  // Approvals
  const handleApproveEnrollment = async (id) => {
    try {
      await axiosInstance.patch(`/admin/enrollments/${id}/approve`);
      toast.success("Enrollment approved");
      fetchEnrollmentsByStatus("pending", setPendingEnrollments);
      fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  };

  const handleRejectEnrollment = async (id) => {
    try {
      await axiosInstance.patch(`/admin/enrollments/${id}/reject`);
      toast.success("Enrollment rejected");
      fetchEnrollmentsByStatus("pending", setPendingEnrollments);
      fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchUsersByStatus("pending", setPendingUsers);
      fetchUsersByStatus("approved", setApprovedUsers);
      fetchUsersByStatus("rejected", setRejectedUsers);

      fetchEnrollmentsByStatus("pending", setPendingEnrollments);
      fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
      fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
    }
  }, [isAuthenticated, user?.role, fetchUsersByStatus, fetchEnrollmentsByStatus]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
      </div>

      {/* Student Approvals */}
      <h3>Student Approvals</h3>
      {/* ... existing student table logic ... */}

      {/* Course Enrollments */}
      <h3>Course Enrollments</h3>
      {activeEnrollTab === "pending" && (
        pendingEnrollments.length === 0 ? (
          <p>No pending enrollments</p>
        ) : (
          <table className="enrollment-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingEnrollments.map((enroll) => (
                <tr key={enroll.id}>
                  <td>{enroll.student?.name}</td>
                  <td>{enroll.student?.email}</td>
                  <td>{enroll.course?.title}</td>
                  <td>{enroll.payment_status}</td>
                  <td>{enroll.approval_status}</td>
                  <td>
                    <button onClick={() => handleApproveEnrollment(enroll.id)} className="btn-primary">
                      Approve
                    </button>
                    <button onClick={() => handleRejectEnrollment(enroll.id)} className="btn-danger">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default AdminDashboard;
