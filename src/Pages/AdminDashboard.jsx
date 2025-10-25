// // src/pages/AdminDashboard.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";
// import "./AdminDashboard.css";

// const AdminDashboard = () => {
//   const { user, isAuthenticated, logoutUser } = useAuth();
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const isDark = theme === "dark";

//   const [pendingStudents, setPendingStudents] = useState([]);
//   const [approvedStudents, setApprovedStudents] = useState([]);
//   const [rejectedStudents, setRejectedStudents] = useState([]);

//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [rejectedEnrollments, setRejectedEnrollments] = useState([]);

//   const [activeStudentTab, setActiveStudentTab] = useState("pending");
//   const [activeEnrollTab, setActiveEnrollTab] = useState("pending");
//   const [errorStudents, setErrorStudents] = useState("");
//   const [errorEnrollments, setErrorEnrollments] = useState("");
//   const [loading, setLoading] = useState({ students: false, enrollments: false });
//   const [approvingId, setApprovingId] = useState(null);

//   // Summary counts
//   const studentStats = {
//     pending: pendingStudents.length,
//     approved: approvedStudents.length,
//     rejected: rejectedStudents.length,
//     total:
//       pendingStudents.length +
//       approvedStudents.length +
//       rejectedStudents.length,
//   };

//   const enrollmentStats = {
//     pending: pendingEnrollments.length,
//     approved: approvedEnrollments.length,
//     rejected: rejectedEnrollments.length,
//     total:
//       pendingEnrollments.length +
//       approvedEnrollments.length +
//       rejectedEnrollments.length,
//   };

//   /* ============================================================
//      ⚙️ Error Handler
//   ============================================================ */
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

//   /* ============================================================
//      👩‍🎓 Students Fetch
//   ============================================================ */
//   const fetchStudentsByStatus = useCallback(
//     async (status, setter) => {
//       try {
//         setLoading((prev) => ({ ...prev, students: true }));
//         const res = await axiosInstance.get(`/admin/students?status=${status}`);
//         setter(res.data.students || []);
//         setErrorStudents("");
//       } catch (err) {
//         handleError(err, setErrorStudents);
//       } finally {
//         setLoading((prev) => ({ ...prev, students: false }));
//       }
//     },
//     [handleError]
//   );

//   /* ============================================================
//      🎓 Enrollments Fetch
//   ============================================================ */
//   const fetchEnrollmentsByStatus = useCallback(
//     async (status, setter) => {
//       try {
//         setLoading((prev) => ({ ...prev, enrollments: true }));
//         const res = await axiosInstance.get(`/admin/enrollments?status=${status}`);
//         setter(res.data.enrollments || []);
//         setErrorEnrollments("");
//       } catch (err) {
//         handleError(err, setErrorEnrollments);
//       } finally {
//         setLoading((prev) => ({ ...prev, enrollments: false }));
//       }
//     },
//     [handleError]
//   );

//   /* ============================================================
//      ✅ Approve Student
//   ============================================================ */
//   const handleApproveStudent = async (id) => {
//     setApprovingId(id);
//     try {
//       toast.info("⚙️ Approving student... please wait", { autoClose: 1500 });

//       // 💤 Wake up Render backend first (avoids cold-start timeout)
//       await axiosInstance.get("/health").catch(() => {});

//       // ✅ Try approving with longer timeout
//       const res = await axiosInstance.patch(
//         `/admin/students/${id}/approve`,
//         null,
//         {
//           timeout: 30000, // 30s instead of default 15s
//         }
//       );

//       if (res.data?.success) {
//         toast.success(res.data.message || "✅ Student approved successfully!");
//         await Promise.all([
//           fetchStudentsByStatus("pending", setPendingStudents),
//           fetchStudentsByStatus("approved", setApprovedStudents),
//           fetchStudentsByStatus("rejected", setRejectedStudents),
//         ]);
//       } else {
//         toast.error(res.data?.error || "❌ Failed to approve student.");
//       }
//     } catch (err) {
//       if (err.code === "ECONNABORTED") {
//         toast.warn("⏰ Server is waking up. Retrying...");

//         try {
//           const retry = await axiosInstance.patch(
//             `/admin/students/${id}/approve`,
//             null,
//             {
//               timeout: 30000,
//             }
//           );
//           if (retry.data?.success) {
//             toast.success("✅ Student approved after retry!");
//             await Promise.all([
//               fetchStudentsByStatus("pending", setPendingStudents),
//               fetchStudentsByStatus("approved", setApprovedStudents),
//               fetchStudentsByStatus("rejected", setRejectedStudents),
//             ]);
//             return;
//           }
//         } catch {
//           toast.error(
//             "❌ Failed again. Please try once more in a few seconds."
//           );
//         }
//       } else {
//         const msg =
//           err.response?.data?.error || "❌ Failed to approve student.";
//         toast.error(msg);
//         handleError(err, setErrorStudents);
//       }
//     } finally {
//       setApprovingId(null);
//     }
//   };


//   /* ============================================================
//      ❌ Reject Student
//   ============================================================ */
//   const handleRejectStudent = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/admin/students/${id}/reject`);
//       toast.info(res.data.message || "🚫 Student rejected successfully.");
//       fetchStudentsByStatus("pending", setPendingStudents);
//       fetchStudentsByStatus("approved", setApprovedStudents);
//       fetchStudentsByStatus("rejected", setRejectedStudents);
//     } catch (err) {
//       handleError(err, setErrorStudents);
//     }
//   };

//   /* ============================================================
//      ✅ Approve Enrollment
//   ============================================================ */
//   const handleApproveEnrollment = async (id) => {
//     setApprovingId(id);
//     try {
//       const res = await axiosInstance.patch(`/admin/enrollments/${id}/approve`);
//       if (res.data.success) {
//         toast.success(res.data.message || "✅ Enrollment approved successfully!");
//         await fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//         await fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
//         await fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
//       } else {
//         toast.error(res.data.error || "❌ Failed to approve enrollment.");
//       }
//     } catch (err) {
//       const msg =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         "❌ Failed to approve enrollment.";
//       toast.error(msg);
//       handleError(err, setErrorEnrollments);
//     } finally {
//       setApprovingId(null);
//     }
//   };

//   /* ============================================================
//      ❌ Reject Enrollment
//   ============================================================ */
//   const handleRejectEnrollment = async (id) => {
//     try {
//       const res = await axiosInstance.patch(`/admin/enrollments/${id}/reject`);
//       toast.info(res.data.message || "🚫 Enrollment rejected successfully.");
//       await fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//       await fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
//       await fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
//     } catch (err) {
//       handleError(err, setErrorEnrollments);
//     }
//   };

//   /* ============================================================
//      🚀 Load Data on Mount
//   ============================================================ */
//   useEffect(() => {
//     if (isAuthenticated && user?.role === "admin") {
//       fetchStudentsByStatus("pending", setPendingStudents);
//       fetchStudentsByStatus("approved", setApprovedStudents);
//       fetchStudentsByStatus("rejected", setRejectedStudents);

//       fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//       fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
//       fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
//     }
//   }, [isAuthenticated, user?.role, fetchStudentsByStatus, fetchEnrollmentsByStatus]);

//   useEffect(() => {
//     if (isAuthenticated && user?.role !== "admin") {
//       toast.error("Access denied. Admin privileges required.");
//       navigate("/");
//     }
//   }, [isAuthenticated, user?.role, navigate]);

//   const studentList =
//     activeStudentTab === "pending"
//       ? pendingStudents
//       : activeStudentTab === "approved"
//       ? approvedStudents
//       : rejectedStudents;

//   const enrollList =
//     activeEnrollTab === "pending"
//       ? pendingEnrollments
//       : activeEnrollTab === "approved"
//       ? approvedEnrollments
//       : rejectedEnrollments;

//   if (!isAuthenticated || user?.role !== "admin") {
//     return (
//       <div className="unauthorized">
//         <h2>Access Denied</h2>
//         <p>You need admin privileges to access this page.</p>
//       </div>
//     );
//   }

//   /* ============================================================
//      🧩 UI Rendering
//   ============================================================ */
//   return (
//     <div className={`dashboard-container ${isDark ? "dark-mode" : ""}`}>
//       <div className="dashboard-header">
//         <h2>Admin Dashboard</h2>
//         <div className="header-actions">
//           <span>Welcome, {user?.name}</span>
//           <button onClick={logoutUser} className="btn-logout">
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* SUMMARY CARDS */}
//       <div className="summary-cards">
//         <div className="summary-card">
//           <h3>Students</h3>
//           <div className="stats-grid">
//             <span className="stat pending">Pending: {studentStats.pending}</span>
//             <span className="stat approved">Approved: {studentStats.approved}</span>
//             <span className="stat rejected">Rejected: {studentStats.rejected}</span>
//             <span className="stat total">Total: {studentStats.total}</span>
//           </div>
//         </div>

//         <div className="summary-card">
//           <h3>Enrollments</h3>
//           <div className="stats-grid">
//             <span className="stat pending">Pending: {enrollmentStats.pending}</span>
//             <span className="stat approved">Approved: {enrollmentStats.approved}</span>
//             <span className="stat rejected">Rejected: {enrollmentStats.rejected}</span>
//             <span className="stat total">Total: {enrollmentStats.total}</span>
//           </div>
//         </div>
//       </div>

//       {/* STUDENT TABLE */}
//       <div className="admin-section">
//         <h3>Student Account Approvals</h3>
//         <div className="admin-tabs">
//           {["pending", "approved", "rejected"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveStudentTab(tab)}
//               className={`tab-button ${
//                 activeStudentTab === tab ? "tab-active" : ""
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)} (
//               {tab === "pending"
//                 ? studentStats.pending
//                 : tab === "approved"
//                 ? studentStats.approved
//                 : studentStats.rejected}
//               )
//             </button>
//           ))}
//         </div>

//         {errorStudents && <div className="error-message">{errorStudents}</div>}

//         {loading.students ? (
//           <div className="loading">Loading students...</div>
//         ) : (
//           <div className="table-container">
//             <table className="admin-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Subject</th>
//                   <th>Status</th>
//                   <th>Registered</th>
//                   {activeStudentTab === "pending" && <th>Actions</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentList.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="no-data">
//                       No {activeStudentTab} students found
//                     </td>
//                   </tr>
//                 ) : (
//                   studentList.map((student) => (
//                     <tr key={student.id}>
//                       <td>{student.name}</td>
//                       <td>{student.email}</td>
//                       <td>{student.subject || "N/A"}</td>
//                       <td>
//                         <span
//                           className={`status-badge status-${student.approval_status}`}
//                         >
//                           {student.approval_status}
//                         </span>
//                       </td>
//                       <td>
//                         {new Date(
//                           student.updatedAt || student.createdAt
//                         ).toLocaleDateString()}
//                       </td>
//                       {activeStudentTab === "pending" && (
//                         <td className="action-buttons">
//                           <button
//                             className="btn-approve"
//                             onClick={() => handleApproveStudent(student.id)}
//                           >
//                             Approve
//                           </button>
//                           <button
//                             className="btn-reject"
//                             onClick={() => handleRejectStudent(student.id)}
//                           >
//                             Reject
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ENROLLMENT TABLE */}
//       <div className="admin-section">
//         <h3>Course Enrollment Approvals</h3>
//         <div className="admin-tabs">
//           {["pending", "approved", "rejected"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveEnrollTab(tab)}
//               className={`tab-button ${
//                 activeEnrollTab === tab ? "tab-active" : ""
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)} (
//               {tab === "pending"
//                 ? enrollmentStats.pending
//                 : tab === "approved"
//                 ? enrollmentStats.approved
//                 : enrollmentStats.rejected}
//               )
//             </button>
//           ))}
//         </div>

//         {errorEnrollments && (
//           <div className="error-message">{errorEnrollments}</div>
//         )}

//         {loading.enrollments ? (
//           <div className="loading">Loading enrollments...</div>
//         ) : (
//           <div className="table-container">
//             <table className="admin-table">
//               <thead>
//                 <tr>
//                   <th>Student</th>
//                   <th>Email</th>
//                   <th>Course</th>
//                   <th>Payment</th>
//                   <th>Status</th>
//                   <th>Requested</th>
//                   {activeEnrollTab === "pending" && <th>Actions</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {enrollList.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="no-data">
//                       No {activeEnrollTab} enrollments found
//                     </td>
//                   </tr>
//                 ) : (
//                   enrollList.map((enrollment) => (
//                     <tr key={enrollment.id}>
//                       <td>{enrollment.student?.name || "N/A"}</td>
//                       <td>{enrollment.student?.email || "N/A"}</td>
//                       <td>{enrollment.course?.title || "N/A"}</td>
//                       <td>
//                         <span
//                           className={`status-badge status-${enrollment.payment_status}`}
//                         >
//                           {enrollment.payment_status}
//                         </span>
//                       </td>
//                       <td>
//                         <span
//                           className={`status-badge status-${enrollment.approval_status}`}
//                         >
//                           {enrollment.approval_status}
//                         </span>
//                       </td>
//                       <td>
//                         {new Date(enrollment.createdAt).toLocaleDateString()}
//                       </td>
//                       {activeEnrollTab === "pending" && (
//                         <td className="action-buttons">
//                           <button
//                             className="btn-approve"
//                             onClick={() => handleApproveEnrollment(enrollment.id)}
//                             disabled={approvingId === enrollment.id}
//                           >
//                             {approvingId === enrollment.id
//                               ? "Approving..."
//                               : "Approve"}
//                           </button>
//                           <button
//                             className="btn-reject"
//                             onClick={() => handleRejectEnrollment(enrollment.id)}
//                             disabled={approvingId === enrollment.id}
//                           >
//                             Reject
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [rejectedStudents, setRejectedStudents] = useState([]);

  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [rejectedEnrollments, setRejectedEnrollments] = useState([]);

  const [activeStudentTab, setActiveStudentTab] = useState("pending");
  const [activeEnrollTab, setActiveEnrollTab] = useState("pending");
  const [errorStudents, setErrorStudents] = useState("");
  const [errorEnrollments, setErrorEnrollments] = useState("");
  const [loading, setLoading] = useState({ students: false, enrollments: false });
  const [approvingId, setApprovingId] = useState(null);

  // Summary counts
  const studentStats = {
    pending: pendingStudents.length,
    approved: approvedStudents.length,
    rejected: rejectedStudents.length,
    total:
      pendingStudents.length +
      approvedStudents.length +
      rejectedStudents.length,
  };

  const enrollmentStats = {
    pending: pendingEnrollments.length,
    approved: approvedEnrollments.length,
    rejected: rejectedEnrollments.length,
    total:
      pendingEnrollments.length +
      approvedEnrollments.length +
      rejectedEnrollments.length,
  };

  /* ============================================================
     ⚙️ Error Handler
  ============================================================ */
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

  /* ============================================================
     👩‍🎓 Students Fetch
  ============================================================ */
  const fetchStudentsByStatus = useCallback(
    async (status, setter) => {
      try {
        setLoading((prev) => ({ ...prev, students: true }));
        const res = await axiosInstance.get(`/admin/students?status=${status}`);
        setter(res.data.students || []);
        setErrorStudents("");
      } catch (err) {
        handleError(err, setErrorStudents);
      } finally {
        setLoading((prev) => ({ ...prev, students: false }));
      }
    },
    [handleError]
  );

  /* ============================================================
     🎓 Enrollments Fetch
  ============================================================ */
  const fetchEnrollmentsByStatus = useCallback(
    async (status, setter) => {
      try {
        setLoading((prev) => ({ ...prev, enrollments: true }));
        const res = await axiosInstance.get(`/admin/enrollments?status=${status}`);
        setter(res.data.enrollments || []);
        setErrorEnrollments("");
      } catch (err) {
        handleError(err, setErrorEnrollments);
      } finally {
        setLoading((prev) => ({ ...prev, enrollments: false }));
      }
    },
    [handleError]
  );

  /* ============================================================
     ✅ Approve Student (Final)
  ============================================================ */
  const handleApproveStudent = async (id) => {
    setApprovingId(id);
    try {
      toast.info("⚙️ Approving student... please wait", { autoClose: 1500 });
      await axiosInstance.get("/health").catch(() => {});

      const res = await axiosInstance.patch(`/admin/students/${id}/approve`, null, { timeout: 30000 });
      if (res.data?.success) {
        toast.success(res.data.message || "✅ Student approved successfully!");
        await Promise.all([
          fetchStudentsByStatus("pending", setPendingStudents),
          fetchStudentsByStatus("approved", setApprovedStudents),
          fetchStudentsByStatus("rejected", setRejectedStudents),
        ]);
      } else {
        toast.error(res.data?.error || "❌ Failed to approve student.");
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        toast.warn("⏰ Server is waking up... retrying");
        try {
          const retry = await axiosInstance.patch(`/admin/students/${id}/approve`, null, { timeout: 30000 });
          if (retry.data?.success) {
            toast.success("✅ Student approved after retry!");
            await Promise.all([
              fetchStudentsByStatus("pending", setPendingStudents),
              fetchStudentsByStatus("approved", setApprovedStudents),
              fetchStudentsByStatus("rejected", setRejectedStudents),
            ]);
            return;
          }
        } catch {
          toast.error("❌ Failed again. Please retry shortly.");
        }
      } else {
        const msg = err.response?.data?.error || "❌ Failed to approve student.";
        toast.error(msg);
        handleError(err, setErrorStudents);
      }
    } finally {
      setApprovingId(null);
    }
  };

  /* ============================================================
     ❌ Reject Student
  ============================================================ */
  const handleRejectStudent = async (id) => {
    try {
      const res = await axiosInstance.patch(`/admin/students/${id}/reject`);
      toast.info(res.data.message || "🚫 Student rejected successfully.");
      await Promise.all([
        fetchStudentsByStatus("pending", setPendingStudents),
        fetchStudentsByStatus("approved", setApprovedStudents),
        fetchStudentsByStatus("rejected", setRejectedStudents),
      ]);
    } catch (err) {
      handleError(err, setErrorStudents);
    }
  };

  /* ============================================================
     ✅ Approve Enrollment (Final)
  ============================================================ */
  const handleApproveEnrollment = async (id) => {
    setApprovingId(id);
    try {
      toast.info("⚙️ Approving enrollment... please wait", { autoClose: 1500 });
      await axiosInstance.get("/health").catch(() => {});

      const res = await axiosInstance.patch(`/admin/enrollments/${id}/approve`, null, { timeout: 30000 });
      if (res.data?.success) {
        toast.success(res.data.message || "✅ Enrollment approved successfully!");
        await Promise.all([
          fetchEnrollmentsByStatus("pending", setPendingEnrollments),
          fetchEnrollmentsByStatus("approved", setApprovedEnrollments),
          fetchEnrollmentsByStatus("rejected", setRejectedEnrollments),
        ]);
      } else {
        toast.error(res.data?.error || "❌ Failed to approve enrollment.");
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        toast.warn("⏰ Server waking up... retrying");
        try {
          const retry = await axiosInstance.patch(`/admin/enrollments/${id}/approve`, null, { timeout: 30000 });
          if (retry.data?.success) {
            toast.success("✅ Enrollment approved after retry!");
            await Promise.all([
              fetchEnrollmentsByStatus("pending", setPendingEnrollments),
              fetchEnrollmentsByStatus("approved", setApprovedEnrollments),
              fetchEnrollmentsByStatus("rejected", setRejectedEnrollments),
            ]);
            return;
          }
        } catch {
          toast.error("❌ Second attempt failed. Try again soon.");
        }
      } else {
        const msg = err.response?.data?.error || "❌ Failed to approve enrollment.";
        toast.error(msg);
        handleError(err, setErrorEnrollments);
      }
    } finally {
      setApprovingId(null);
    }
  };

  /* ============================================================
     ❌ Reject Enrollment
  ============================================================ */
  const handleRejectEnrollment = async (id) => {
    try {
      const res = await axiosInstance.patch(`/admin/enrollments/${id}/reject`);
      toast.info(res.data.message || "🚫 Enrollment rejected successfully.");
      await Promise.all([
        fetchEnrollmentsByStatus("pending", setPendingEnrollments),
        fetchEnrollmentsByStatus("approved", setApprovedEnrollments),
        fetchEnrollmentsByStatus("rejected", setRejectedEnrollments),
      ]);
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  };

  /* ============================================================
     🚀 Load Data on Mount
  ============================================================ */
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchStudentsByStatus("pending", setPendingStudents);
      fetchStudentsByStatus("approved", setApprovedStudents);
      fetchStudentsByStatus("rejected", setRejectedStudents);
      fetchEnrollmentsByStatus("pending", setPendingEnrollments);
      fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
      fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
    }
  }, [isAuthenticated, user?.role, fetchStudentsByStatus, fetchEnrollmentsByStatus]);

  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAuthenticated, user?.role, navigate]);

  const studentList =
    activeStudentTab === "pending"
      ? pendingStudents
      : activeStudentTab === "approved"
      ? approvedStudents
      : rejectedStudents;

  const enrollList =
    activeEnrollTab === "pending"
      ? pendingEnrollments
      : activeEnrollTab === "approved"
      ? approvedEnrollments
      : rejectedEnrollments;

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="unauthorized">
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  /* ============================================================
     🧩 UI Rendering
  ============================================================ */
  return (
    <div className={`dashboard-container ${isDark ? "dark-mode" : ""}`}>
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="header-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={logoutUser} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Students</h3>
          <div className="stats-grid">
            <span className="stat pending">Pending: {studentStats.pending}</span>
            <span className="stat approved">Approved: {studentStats.approved}</span>
            <span className="stat rejected">Rejected: {studentStats.rejected}</span>
            <span className="stat total">Total: {studentStats.total}</span>
          </div>
        </div>

        <div className="summary-card">
          <h3>Enrollments</h3>
          <div className="stats-grid">
            <span className="stat pending">Pending: {enrollmentStats.pending}</span>
            <span className="stat approved">Approved: {enrollmentStats.approved}</span>
            <span className="stat rejected">Rejected: {enrollmentStats.rejected}</span>
            <span className="stat total">Total: {enrollmentStats.total}</span>
          </div>
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="admin-section">
        <h3>Student Account Approvals</h3>
        <div className="admin-tabs">
          {["pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveStudentTab(tab)}
              className={`tab-button ${activeStudentTab === tab ? "tab-active" : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} (
              {tab === "pending"
                ? studentStats.pending
                : tab === "approved"
                ? studentStats.approved
                : studentStats.rejected}
              )
            </button>
          ))}
        </div>

        {errorStudents && <div className="error-message">{errorStudents}</div>}

        {loading.students ? (
          <div className="loading">Loading students...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Registered</th>
                  {activeStudentTab === "pending" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {studentList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-data">
                      No {activeStudentTab} students found
                    </td>
                  </tr>
                ) : (
                  studentList.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.subject || "N/A"}</td>
                      <td>
                        <span className={`status-badge status-${student.approval_status}`}>
                          {student.approval_status}
                        </span>
                      </td>
                      <td>
                        {new Date(student.updatedAt || student.createdAt).toLocaleDateString()}
                      </td>
                      {activeStudentTab === "pending" && (
                        <td className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleApproveStudent(student.id)}
                            disabled={approvingId === student.id}
                          >
                            {approvingId === student.id ? "Approving..." : "Approve"}
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleRejectStudent(student.id)}
                            disabled={approvingId === student.id}
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ENROLLMENT TABLE */}
      <div className="admin-section">
        <h3>Course Enrollment Approvals</h3>
        <div className="admin-tabs">
          {["pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveEnrollTab(tab)}
              className={`tab-button ${activeEnrollTab === tab ? "tab-active" : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} (
              {tab === "pending"
                ? enrollmentStats.pending
                : tab === "approved"
                ? enrollmentStats.approved
                : enrollmentStats.rejected}
              )
            </button>
          ))}
        </div>

        {errorEnrollments && <div className="error-message">{errorEnrollments}</div>}

        {loading.enrollments ? (
          <div className="loading">Loading enrollments...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Requested</th>
                  {activeEnrollTab === "pending" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {enrollList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="no-data">
                      No {activeEnrollTab} enrollments found
                    </td>
                  </tr>
                ) : (
                  enrollList.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td>{enrollment.student?.name || "N/A"}</td>
                      <td>{enrollment.student?.email || "N/A"}</td>
                      <td>{enrollment.course?.title || "N/A"}</td>
                      <td>
                        <span className={`status-badge status-${enrollment.payment_status}`}>
                          {enrollment.payment_status}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${enrollment.approval_status}`}>
                          {enrollment.approval_status}
                        </span>
                      </td>
                      <td>{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                      {activeEnrollTab === "pending" && (
                        <td className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleApproveEnrollment(enrollment.id)}
                            disabled={approvingId === enrollment.id}
                          >
                            {approvingId === enrollment.id ? "Approving..." : "Approve"}
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleRejectEnrollment(enrollment.id)}
                            disabled={approvingId === enrollment.id}
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
