
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

//   // Users
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [errorUsers, setErrorUsers] = useState("");

//   // Enrollments
//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [loadingEnrollments, setLoadingEnrollments] = useState(false);
//   const [loadingApproved, setLoadingApproved] = useState(false);
//   const [errorEnrollments, setErrorEnrollments] = useState("");
//   const [errorApproved, setErrorApproved] = useState("");
//   const [activeTab, setActiveTab] = useState("pending");

//   // 🔒 Handle errors globally
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

//   // 📌 Fetch pending users
//   const fetchPendingUsers = useCallback(async () => {
//     setLoadingUsers(true);
//     setErrorUsers("");
//     try {
//       const res = await axiosInstance.get("/admin/pending-users");
//       setPendingUsers(res.data.users || []);
//     } catch (err) {
//       handleError(err, setErrorUsers);
//     } finally {
//       setLoadingUsers(false);
//     }
//   }, [handleError]);

//   // 📌 Fetch enrollments
//   const fetchPendingEnrollments = useCallback(async () => {
//     setLoadingEnrollments(true);
//     setErrorEnrollments("");
//     try {
//       const res = await axiosInstance.get("/admin/enrollments?status=pending");
//       setPendingEnrollments(res.data.enrollments || []);
//     } catch (err) {
//       handleError(err, setErrorEnrollments);
//     } finally {
//       setLoadingEnrollments(false);
//     }
//   }, [handleError]);

//   const fetchApprovedEnrollments = useCallback(async () => {
//     setLoadingApproved(true);
//     setErrorApproved("");
//     try {
//       const res = await axiosInstance.get("/admin/enrollments?status=approved");
//       setApprovedEnrollments(res.data.enrollments || []);
//     } catch (err) {
//       handleError(err, setErrorApproved);
//     } finally {
//       setLoadingApproved(false);
//     }
//   }, [handleError]);

//   // 📌 Approve / reject users
//   const handleApproveUser = async (userId) => {
//     try {
//       await axiosInstance.patch(`/admin/users/${userId}/approval`, {
//         status: "approved",
//       });
//       toast.success("User approved");
//       fetchPendingUsers();
//     } catch (err) {
//       handleError(err, setErrorUsers);
//     }
//   };

//   const handleRejectUser = async (userId) => {
//     try {
//       await axiosInstance.patch(`/admin/users/${userId}/approval`, {
//         status: "rejected",
//       });
//       toast.success("User rejected");
//       fetchPendingUsers();
//     } catch (err) {
//       handleError(err, setErrorUsers);
//     }
//   };

//   // 📌 Approve enrollment
//   const handleApproveEnrollment = async (enrollmentId) => {
//     try {
//       await axiosInstance.put(`/admin/enrollments/${enrollmentId}/approve`);
//       toast.success("Enrollment approved");
//       fetchPendingEnrollments();
//       fetchApprovedEnrollments();
//     } catch (err) {
//       handleError(err, setErrorEnrollments);
//     }
//   };

//   // 🚀 Only fetch once when authenticated + admin
//   useEffect(() => {
//     if (isAuthenticated && user?.role === "admin") {
//       fetchPendingUsers();
//       fetchPendingEnrollments();
//       fetchApprovedEnrollments();
//     }
//   }, [isAuthenticated, user?.role, fetchPendingUsers, fetchPendingEnrollments, fetchApprovedEnrollments]);

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h2>Admin Dashboard</h2>
//         <button onClick={logoutUser} className="btn-secondary logout-btn">
//           Logout
//         </button>
//       </div>

//       {/* Section 1: Pending Users */}
//       <h3>Pending User Approvals</h3>
//       {errorUsers && <p className="error">{errorUsers}</p>}
//       {loadingUsers ? (
//         <p>Loading users...</p>
//       ) : pendingUsers.length === 0 ? (
//         <p>No pending users</p>
//       ) : (
//         <table className="user-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Subject</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingUsers.map((pu) => (
//               <tr key={pu.id}>
//                 <td>{pu.name}</td>
//                 <td>{pu.email}</td>
//                 <td>{pu.role}</td>
//                 <td>{pu.subject || "N/A"}</td>
//                 <td>
//                   <button
//                     onClick={() => handleApproveUser(pu.id)}
//                     className="btn-primary"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleRejectUser(pu.id)}
//                     className="btn-danger"
//                   >
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Section 2: Enrollments */}
//       <h3>Course Enrollments</h3>
//       <div className="admin-tabs">
//         <button
//           className={activeTab === "pending" ? "tab-button tab-active" : "tab-button"}
//           onClick={() => setActiveTab("pending")}
//         >
//           Pending
//         </button>
//         <button
//           className={activeTab === "approved" ? "tab-button tab-active" : "tab-button"}
//           onClick={() => setActiveTab("approved")}
//         >
//           Approved
//         </button>
//       </div>

//       {activeTab === "pending" ? (
//         <>
//           {errorEnrollments && <p className="error">{errorEnrollments}</p>}
//           {loadingEnrollments ? (
//             <p>Loading pending enrollments...</p>
//           ) : pendingEnrollments.length === 0 ? (
//             <p>No pending enrollments</p>
//           ) : (
//             <table className="enrollment-table">
//               <thead>
//                 <tr>
//                   <th>Student</th>
//                   <th>Email</th>
//                   <th>Course</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingEnrollments.map((enroll) => (
//                   <tr key={enroll.id}>
//                     <td>{enroll.student?.name}</td>
//                     <td>{enroll.student?.email}</td>
//                     <td>{enroll.course?.title}</td>
//                     <td>
//                       <button
//                         onClick={() => handleApproveEnrollment(enroll.id)}
//                         className="btn-primary"
//                       >
//                         Approve
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </>
//       ) : (
//         <>
//           {errorApproved && <p className="error">{errorApproved}</p>}
//           {loadingApproved ? (
//             <p>Loading approved enrollments...</p>
//           ) : approvedEnrollments.length === 0 ? (
//             <p>No approved enrollments</p>
//           ) : (
//             <table className="enrollment-table">
//               <thead>
//                 <tr>
//                   <th>Student</th>
//                   <th>Email</th>
//                   <th>Course</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {approvedEnrollments.map((enroll) => (
//                   <tr key={enroll.id}>
//                     <td>{enroll.student?.name}</td>
//                     <td>{enroll.student?.email}</td>
//                     <td>{enroll.course?.title}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </>
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

  // Students
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState("");

  // Enrollments
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);
  const [errorEnrollments, setErrorEnrollments] = useState("");
  const [errorApproved, setErrorApproved] = useState("");

  // Tabs
  const [activeUserTab, setActiveUserTab] = useState("pending");
  const [activeEnrollTab, setActiveEnrollTab] = useState("pending");

  // 🔒 Handle errors globally
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

  // 📌 Fetch pending students
  const fetchPendingUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/pending-students");
      setPendingUsers(res.data || []);
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  }, [handleError]);

  // 📌 Fetch approved students
  const fetchApprovedUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/approved-students");
      setApprovedUsers(res.data || []);
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  }, [handleError]);

  // 📌 Fetch rejected students
  const fetchRejectedUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/rejected-students");
      setRejectedUsers(res.data || []);
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  }, [handleError]);

  // 📌 Fetch enrollments
  const fetchPendingEnrollments = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/enrollments?status=pending");
      setPendingEnrollments(res.data.enrollments || []);
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  }, [handleError]);

  const fetchApprovedEnrollments = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/enrollments?status=approved");
      setApprovedEnrollments(res.data.enrollments || []);
    } catch (err) {
      handleError(err, setErrorApproved);
    }
  }, [handleError]);

  // 📌 Approve / reject students
  const handleApproveUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/approve/${userId}`);
      toast.success("Student approved");
      fetchPendingUsers();
      fetchApprovedUsers();
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/reject/${userId}`);
      toast.success("Student rejected");
      fetchPendingUsers();
      fetchRejectedUsers();
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  // 📌 Approve enrollment
  const handleApproveEnrollment = async (enrollmentId) => {
    try {
      await axiosInstance.patch(`/enrollments/${enrollmentId}/approve`);
      toast.success("Enrollment approved");
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  };

  // 🚀 Initial data fetch
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchPendingUsers();
      fetchApprovedUsers();
      fetchRejectedUsers();
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    }
  }, [
    isAuthenticated,
    user?.role,
    fetchPendingUsers,
    fetchApprovedUsers,
    fetchRejectedUsers,
    fetchPendingEnrollments,
    fetchApprovedEnrollments,
  ]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={logoutUser} className="btn-secondary logout-btn">
          Logout
        </button>
      </div>

      {/* Section 1: Students */}
      <h3>Student Approvals</h3>
      <div className="admin-tabs">
        <button
          className={activeUserTab === "pending" ? "tab-button tab-active" : "tab-button"}
          onClick={() => setActiveUserTab("pending")}
        >
          Pending
        </button>
        <button
          className={activeUserTab === "approved" ? "tab-button tab-active" : "tab-button"}
          onClick={() => setActiveUserTab("approved")}
        >
          Approved
        </button>
        <button
          className={activeUserTab === "rejected" ? "tab-button tab-active" : "tab-button"}
          onClick={() => setActiveUserTab("rejected")}
        >
          Rejected
        </button>
      </div>

      {errorUsers && <p className="error">{errorUsers}</p>}

      {/* Pending Students */}
      {activeUserTab === "pending" &&
        (loadingUsers ? (
          <p>Loading pending students...</p>
        ) : pendingUsers.length === 0 ? (
          <p>No pending students</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((pu) => (
                <tr key={pu.id}>
                  <td>{pu.name}</td>
                  <td>{pu.email}</td>
                  <td>{pu.subject || "N/A"}</td>
                  <td>
                    <button onClick={() => handleApproveUser(pu.id)} className="btn-primary">
                      Approve
                    </button>
                    <button onClick={() => handleRejectUser(pu.id)} className="btn-danger">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}

      {/* Approved Students */}
      {activeUserTab === "approved" &&
        (loadingUsers ? (
          <p>Loading approved students...</p>
        ) : approvedUsers.length === 0 ? (
          <p>No approved students</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {approvedUsers.map((au) => (
                <tr key={au.id}>
                  <td>{au.name}</td>
                  <td>{au.email}</td>
                  <td>{au.subject || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}

      {/* Rejected Students */}
      {activeUserTab === "rejected" &&
        (loadingUsers ? (
          <p>Loading rejected students...</p>
        ) : rejectedUsers.length === 0 ? (
          <p>No rejected students</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Rejected On</th>
              </tr>
            </thead>
            <tbody>
              {rejectedUsers.map((ru) => (
                <tr key={ru.id}>
                  <td>{ru.name}</td>
                  <td>{ru.email}</td>
                  <td>{ru.subject || "N/A"}</td>
                  <td>{new Date(ru.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}

      {/* Section 2: Enrollments */}
      <h3>Course Enrollments</h3>
      <div className="admin-tabs">
        <button
          className={activeEnrollTab === "pending" ? "tab-button tab-active" : "tab-button"}
          onClick={() => setActiveEnrollTab("pending")}
        >
          Pending
        </button>
        <button
          className={activeEnrollTab === "approved" ? "tab-button tab-active" : "tab-button"}
          onClick={() => setActiveEnrollTab("approved")}
        >
          Approved
        </button>
      </div>

      {activeEnrollTab === "pending" ? (
        <>
          {errorEnrollments && <p className="error">{errorEnrollments}</p>}
          {loadingEnrollments ? (
            <p>Loading pending enrollments...</p>
          ) : pendingEnrollments.length === 0 ? (
            <p>No pending enrollments</p>
          ) : (
            <table className="enrollment-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingEnrollments.map((enroll) => (
                  <tr key={enroll.id}>
                    <td>{enroll.student?.name}</td>
                    <td>{enroll.student?.email}</td>
                    <td>{enroll.course?.title}</td>
                    <td>
                      <button
                        onClick={() => handleApproveEnrollment(enroll.id)}
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
        </>
      ) : (
        <>
          {errorApproved && <p className="error">{errorApproved}</p>}
          {loadingApproved ? (
            <p>Loading approved enrollments...</p>
          ) : approvedEnrollments.length === 0 ? (
            <p>No approved enrollments</p>
          ) : (
            <table className="enrollment-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {approvedEnrollments.map((enroll) => (
                  <tr key={enroll.id}>
                    <td>{enroll.student?.name}</td>
                    <td>{enroll.student?.email}</td>
                    <td>{enroll.course?.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
