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
import { useTheme } from "../context/ThemeContext";

const AdminDashboard = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  // State
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [rejectedEnrollments, setRejectedEnrollments] = useState([]);
  const [activeUserTab, setActiveUserTab] = useState("pending");
  const [activeEnrollTab, setActiveEnrollTab] = useState("pending");
  const [errorUsers, setErrorUsers] = useState("");
  const [errorEnrollments, setErrorEnrollments] = useState("");

  // Global error handler
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

  // Fetchers
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
  const handleApproveUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/students/${userId}/approve`);
      toast.success("✅ Student approved");
      fetchUsersByStatus("pending", setPendingUsers);
      fetchUsersByStatus("approved", setApprovedUsers);
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/students/${userId}/reject`);
      toast.info("🚫 Student rejected");
      fetchUsersByStatus("pending", setPendingUsers);
      fetchUsersByStatus("rejected", setRejectedUsers);
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  const handleApproveEnrollment = async (enrollId) => {
    try {
      await axiosInstance.patch(`/admin/enrollments/${enrollId}/approve`);
      toast.success("✅ Enrollment approved");
      fetchEnrollmentsByStatus("pending", setPendingEnrollments);
      fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  };

  const handleRejectEnrollment = async (enrollId) => {
    try {
      await axiosInstance.patch(`/admin/enrollments/${enrollId}/reject`);
      toast.info("🚫 Enrollment rejected");
      fetchEnrollmentsByStatus("pending", setPendingEnrollments);
      fetchEnrollmentsByStatus("rejected", setRejectedEnrollments);
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  };

  // Load data
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

  const sectionClass = `p-4 rounded-lg shadow-md ${
    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const tabClass = (active) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
      active
        ? isDark
          ? "bg-blue-600 text-white"
          : "bg-blue-500 text-white"
        : isDark
        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  const tableClass = `min-w-full border mt-4 text-sm ${
    isDark ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-800"
  }`;

  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={logoutUser}
          className={`px-4 py-2 rounded-md ${
            isDark
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Logout
        </button>
      </div>

      {/* Students Section */}
      <div className={`${sectionClass} mb-8`}>
        <h3 className="text-lg font-semibold mb-3">Student Approvals</h3>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveUserTab("pending")} className={tabClass(activeUserTab === "pending")}>Pending</button>
          <button onClick={() => setActiveUserTab("approved")} className={tabClass(activeUserTab === "approved")}>Approved</button>
          <button onClick={() => setActiveUserTab("rejected")} className={tabClass(activeUserTab === "rejected")}>Rejected</button>
        </div>

        {errorUsers && <p className="text-red-400">{errorUsers}</p>}

        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Subject</th>
                {activeUserTab === "pending" && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {(activeUserTab === "pending" ? pendingUsers : activeUserTab === "approved" ? approvedUsers : rejectedUsers).map((u) => (
                <tr key={u.id} className={isDark ? "border-gray-700" : "border-gray-300"}>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.subject || "N/A"}</td>
                  {activeUserTab === "pending" && (
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleApproveUser(u.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                        Approve
                      </button>
                      <button onClick={() => handleRejectUser(u.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollments Section */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold mb-3">Course Enrollments</h3>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveEnrollTab("pending")} className={tabClass(activeEnrollTab === "pending")}>Pending</button>
          <button onClick={() => setActiveEnrollTab("approved")} className={tabClass(activeEnrollTab === "approved")}>Approved</button>
          <button onClick={() => setActiveEnrollTab("rejected")} className={tabClass(activeEnrollTab === "rejected")}>Rejected</button>
        </div>

        {errorEnrollments && <p className="text-red-400">{errorEnrollments}</p>}

        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Status</th>
                {activeEnrollTab === "pending" && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {(activeEnrollTab === "pending" ? pendingEnrollments : activeEnrollTab === "approved" ? approvedEnrollments : rejectedEnrollments).map((en) => (
                <tr key={en.id} className={isDark ? "border-gray-700" : "border-gray-300"}>
                  <td className="px-4 py-2">{en.student?.name}</td>
                  <td className="px-4 py-2">{en.student?.email}</td>
                  <td className="px-4 py-2">{en.course?.title}</td>
                  <td className="px-4 py-2">{en.payment_status}</td>
                  <td className="px-4 py-2">{en.approval_status}</td>
                  {activeEnrollTab === "pending" && (
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleApproveEnrollment(en.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                        Approve
                      </button>
                      <button onClick={() => handleRejectEnrollment(en.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
